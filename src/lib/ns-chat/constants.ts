/**
 * Shared constants for the NeuralSeek Assistant chat widget.
 *
 * This module exists so the values below have exactly ONE definition. Before
 * it, the greeting was written twice (markup + reset handler, which silently
 * desynced the "new session" and "after restart" states) and the custom event
 * name was a bare string in two different components.
 *
 * Imported by BOTH `ChatWidget.astro`'s frontmatter (for the markup) and its
 * client `<script>`, plus `Hero.astro` for the event name.
 */

/** localStorage keys. Versioned: bump `-v1` if the message shape changes. */
export const STORAGE_KEY = 'ns-chat-v1';
export const SESSION_KEY = 'ns-session-id';
export const USER_KEY = 'ns-user-id';

/**
 * The `/seek` endpoint for the `neuralseek-documentation-website` instance.
 *
 * STAGING ON PURPOSE — the docs instance lives on staging while the site is
 * pre-launch. This is the one line to change at the production cutover.
 */
export const SEEK_URL =
	'https://stagingapi.neuralseek.com/v1/neuralseek-documentation-website/seek';

/**
 * An embedCode, NOT the admin API key. embedCodes are scoped to only the
 * seek/mAIstro endpoints, so unlike the admin key they are meant to ship in
 * public frontend code and need no server-side proxy.
 */
export const EMBED_CODE = '2041675160';

/** Abort a `/seek` call that has not answered in this many ms. */
export const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Public entry point for in-page triggers — see the listener in
 * ChatWidget.astro and the dispatch in Hero.astro.
 *
 *     document.dispatchEvent(
 *       new CustomEvent(NS_CHAT_ASK_EVENT, { detail: { question: '…' } })
 *     );
 *
 * Omit `question` to just open the panel.
 */
export const NS_CHAT_ASK_EVENT = 'ns-chat:ask';

/** Shown on a brand-new session and after a restart. */
export const GREETING = 'Hi! Ask me anything about the documentation.';

/** Shown when `/seek` answers but has nothing useful. */
export const NO_ANSWER = "Sorry, I couldn't find an answer for that.";

/** Shown when the request fails outright. */
export const ERROR_MESSAGE =
	'Something went wrong reaching NeuralSeek. Please try again in a moment.';

export type ChatRole = 'user' | 'bot';

export interface ChatMessage {
	who: ChatRole;
	text: string;
}
