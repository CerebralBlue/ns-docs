/**
 * The one network call the chat widget makes: NeuralSeek `/seek`.
 *
 * Kept separate from the component so the request contract — endpoint, auth
 * header, body shape, timeout, and which response field holds the answer — is
 * readable in one place and independently testable.
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
	/** Caller-owned signal, e.g. to cancel when the panel closes. */
	signal?: AbortSignal;
}

/**
 * Ask NeuralSeek a question.
 *
 * Resolves to the answer text (empty string if the response carries none) and
 * throws {@link SeekError} on any failure. A request that has not answered
 * within {@link REQUEST_TIMEOUT_MS} is aborted, so a hung call can no longer
 * leave "Thinking…" on screen forever.
 *
 * NOTE the response field is `answer`. There is no `confidence` or `sources`
 * field on `/seek` — the score fields are `KBscore` and `semanticScore`,
 * capitalised exactly like that.
 */
export async function askSeek({
	question,
	sessionId,
	userId,
	signal,
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
				headers: { 'Content-Type': 'application/json', embedcode: EMBED_CODE },
				body: JSON.stringify({ question, sessionId, userId }),
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

		// Auth and rate-limit failures come back as a plain-text body, not JSON,
		// so status must be checked before attempting to parse.
		if (!res.ok) {
			throw new SeekError('http', `Seek request failed (${res.status})`, res.status);
		}

		let data: { answer?: unknown };
		try {
			data = await res.json();
		} catch (err) {
			throw new SeekError('parse', `Seek returned a non-JSON body: ${String(err)}`);
		}

		return typeof data.answer === 'string' ? data.answer : '';
	} finally {
		clearTimeout(timer);
		signal?.removeEventListener('abort', onCallerAbort);
	}
}
