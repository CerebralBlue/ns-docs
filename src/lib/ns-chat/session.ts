/**
 * Identity and history persistence for the chat widget.
 *
 * All localStorage access lives here, so the component never touches storage
 * directly. Every function is defensive: localStorage throws in private-mode
 * Safari, when quota is exceeded, and when a browser blocks storage entirely.
 * Chat history is a nice-to-have, so a storage failure must degrade to an
 * in-memory session rather than take the widget down with it.
 */

import { SESSION_KEY, STORAGE_KEY, USER_KEY, type ChatMessage } from './constants';

/** Random id, with a fallback for browsers without `crypto.randomUUID`. */
export function uid(): string {
	return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function read(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function write(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Storage unavailable or full. The session still works, it just will
		// not survive a reload — which beats throwing out of a click handler.
	}
}

function remove(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {
		/* see write() */
	}
}

/** Get-or-create an id under `key`, persisting it for next time. */
function stableId(key: string): string {
	const existing = read(key);
	if (existing) return existing;
	const created = uid();
	write(key, created);
	return created;
}

/** Identifies this browser. Survives a restart. */
export function getUserId(): string {
	return stableId(USER_KEY);
}

/** Identifies the current conversation. Rotated by `rotateSession()`. */
export function getSessionId(): string {
	return stableId(SESSION_KEY);
}

/** Start a new conversation, keeping the same user. Returns the new id. */
export function rotateSession(): string {
	const next = uid();
	write(SESSION_KEY, next);
	return next;
}

/**
 * Load persisted history.
 *
 * Every entry is shape-checked, not just the array: `who` ends up in a class
 * name and `text` in a text node, so a corrupt or hand-edited entry would
 * otherwise render as `[object Object]` or inject a stray class. Anything that
 * fails validation is dropped silently — this is a cache, not a source of
 * truth.
 */
export function loadHistory(): ChatMessage[] {
	const saved = read(STORAGE_KEY);
	if (!saved) return [];
	let parsed: unknown;
	try {
		parsed = JSON.parse(saved);
	} catch {
		return [];
	}
	if (!Array.isArray(parsed)) return [];
	return parsed.filter(
		(m): m is ChatMessage =>
			!!m &&
			typeof m === 'object' &&
			typeof (m as ChatMessage).text === 'string' &&
			((m as ChatMessage).who === 'user' || (m as ChatMessage).who === 'bot')
	);
}

export function saveHistory(messages: ChatMessage[]): void {
	write(STORAGE_KEY, JSON.stringify(messages));
}

export function clearHistory(): void {
	remove(STORAGE_KEY);
}
