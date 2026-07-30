/**
 * The one network call the chat widget makes: NeuralSeek `/seek`, in
 * streaming mode.
 *
 * Kept separate from the component so the request contract — endpoint, auth
 * header, body shape, timeout, SSE framing, and which fields hold the answer
 * — is readable in one place and independently testable.
 */

import { EMBED_CODE, REQUEST_TIMEOUT_MS, SEEK_URL } from './constants';

/** Why a `/seek` call failed. Lets the caller decide what to tell the user. */
export type SeekFailure = 'http' | 'timeout' | 'network' | 'parse';

export class SeekError extends Error {
	readonly kind: SeekFailure;
	readonly status?: number;

	constructor(kind: SeekFailure, message: string, status?: number) {
		super(message);
		this.name = 'SeekError';
		this.kind = kind;
		this.status = status;
	}
}

export interface AskSeekOptions {
	question: string;
	sessionId: string;
	userId: string;
	/** Caller-owned signal, e.g. to cancel when the panel closes or restarts. */
	signal?: AbortSignal;
	/** Called with each text fragment as NeuralSeek streams the answer in. */
	onChunk?: (text: string) => void;
}

/** One decoded `data: {...}` line from the `text/event-stream` body. */
interface SeekStreamEvent {
	chunk?: unknown;
	answer?: unknown;
}

/**
 * Yield to the browser's paint cycle.
 *
 * A single `reader.read()` can return MANY SSE frames concatenated into one
 * `value` (TCP/TLS coalesces small writes in transit — confirmed: the same
 * fetch from Node sees ~45 individually-timed reads over ~1s, but a browser
 * can receive that as far fewer, larger reads). Without this, the frame loop
 * below calls `onChunk` dozens of times synchronously with no `await`
 * between them; the DOM mutates every time, but the browser only paints
 * once the current task finishes, so the UI looks like it jumped straight
 * from "Thinking…" to the full answer. Awaiting a frame after each chunk
 * forces a paint in between regardless of how bunched the network reads are.
 */
function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Ask NeuralSeek a question, reporting each fragment to `onChunk` as it
 * arrives and resolving to the final answer text once the stream ends.
 *
 * `options.streaming: true` (nested — NOT a top-level `streaming` field) is
 * what switches `/seek` from a single JSON response into an SSE stream of
 * `data: {"chunk": "..."}` lines; the `Accept: text/event-stream` header is
 * required too, or it silently falls back to the non-streaming response.
 * This still uses the public embedCode — streaming does not require the
 * sensitive admin `apikey`.
 *
 * The stream's last event carries a fully-assembled `answer` field alongside
 * scoring metadata (`KBscore`, `semanticScore`, etc.). That field, not a
 * concatenation of the chunks, is what this resolves to: NeuralSeek can
 * edit/finalize the answer server-side (see `editedAnswer` in the raw
 * response), so the chunk stream is a preview, not always the exact final
 * text. A cached/instant answer can also skip straight to this terminal
 * event with no `chunk` events at all — concatenated chunks are used only as
 * a fallback if the connection drops before the terminal event arrives.
 *
 * Throws {@link SeekError} on any failure. A request that has not finished
 * within {@link REQUEST_TIMEOUT_MS} is aborted, so a hung stream can no
 * longer leave "Thinking…" on screen forever.
 */
export async function askSeek({
	question,
	sessionId,
	userId,
	signal,
	onChunk,
}: AskSeekOptions): Promise<string> {
	const timeout = new AbortController();
	const timer = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT_MS);

	// Abort if EITHER the caller cancels or the timeout fires.
	const onCallerAbort = () => timeout.abort();
	signal?.addEventListener('abort', onCallerAbort, { once: true });

	try {
		let res: Response;
		try {
			res = await fetch(SEEK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'text/event-stream',
					embedcode: EMBED_CODE,
				},
				body: JSON.stringify({
					question,
					sessionId,
					userId,
					options: { streaming: true },
				}),
				signal: timeout.signal,
			});
		} catch (err) {
			if (timeout.signal.aborted) {
				const causedByCaller = signal?.aborted === true;
				throw new SeekError(
					causedByCaller ? 'network' : 'timeout',
					causedByCaller
						? 'Seek request cancelled'
						: `Seek request timed out after ${REQUEST_TIMEOUT_MS}ms`
				);
			}
			throw new SeekError('network', `Seek request failed to send: ${String(err)}`);
		}

		// Auth/rate-limit failures come back as a plain-text body, not SSE, so
		// status must be checked before attempting to read it as a stream.
		if (!res.ok) {
			throw new SeekError('http', `Seek request failed (${res.status})`, res.status);
		}
		if (!res.body) {
			throw new SeekError('parse', 'Seek response has no body');
		}

		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';
		let concatenated = '';
		let finalAnswer: string | null = null;

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });

				// SSE frames are separated by a blank line; a frame can itself
				// span multiple `\n`-joined lines, so only the one starting
				// `data:` is the payload we care about.
				let sep: number;
				while ((sep = buffer.indexOf('\n\n')) !== -1) {
					const rawEvent = buffer.slice(0, sep);
					buffer = buffer.slice(sep + 2);
					const dataLine = rawEvent.split('\n').find((line) => line.startsWith('data:'));
					if (!dataLine) continue;
					const jsonStr = dataLine.slice(5).trim();
					if (!jsonStr) continue;

					let parsed: SeekStreamEvent;
					try {
						parsed = JSON.parse(jsonStr);
					} catch {
						continue; // one malformed frame shouldn't kill the whole stream
					}

					if (typeof parsed.chunk === 'string') {
						concatenated += parsed.chunk;
						onChunk?.(parsed.chunk);
						await nextFrame();
					} else if (typeof parsed.answer === 'string') {
						finalAnswer = parsed.answer;
					}
				}
			}
		} catch (err) {
			if (timeout.signal.aborted) {
				const causedByCaller = signal?.aborted === true;
				throw new SeekError(
					causedByCaller ? 'network' : 'timeout',
					causedByCaller
						? 'Seek request cancelled'
						: `Seek request timed out after ${REQUEST_TIMEOUT_MS}ms`
				);
			}
			throw new SeekError('parse', `Seek stream ended unexpectedly: ${String(err)}`);
		}

		return finalAnswer ?? concatenated;
	} finally {
		clearTimeout(timer);
		signal?.removeEventListener('abort', onCallerAbort);
	}
}
