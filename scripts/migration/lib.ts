/**
 * Shared helpers for the verbatim MkDocs → Starlight migration scripts
 * (audit.ts, convert.ts, check.ts, close-dependency.ts).
 *
 * Two rules every script here obeys:
 *   - The map (scripts/migration-map.json) is hand-formatted. It is NEVER re-serialised;
 *     every edit is string surgery scoped to one route's block (`patchRouteBlock`).
 *   - The old-docs clone is read-only. `resolveSourceDir` finds it (`--source <dir>`,
 *     then $NS_OLD_DOCS_DIR, then the map's `sourceRoot` if that is a local directory, then
 *     the sibling `../knowledge/` checkout) and exits with the GitHub location when none exist.
 *
 * Fast exact searches used for spot-checks (the same patterns `scanDialect` counts):
 *   rg -c '^\s*!!!'            $DOCS   # admonitions
 *   rg -c '^\s*\?\?\?'         $DOCS   # collapsibles
 *   rg -n '^# '                $DOCS   # in-body H1s
 *   rg -n ':material-[a-z-]+:' $DOCS   # icon shortcodes
 *   rg -n '\]\([^)]*\.md[)#]'  $DOCS   # relative .md links
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const MAP_PATH = join(ROOT, 'scripts/migration-map.json');
export const DOCS_DIR = join(ROOT, 'src/content/docs');
export const OUT_DIR = join(ROOT, '_private/migration');
export const OLD_DOCS_REPO = 'https://github.com/CerebralBlue/knowledge';
export const OLD_DOCS_SUBDIR = 'neuralseek/documentation/docs';

export const IMG = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);

export type Route = {
	title: string;
	sources: string[];
	action: 'new' | 'keep' | 'rewrite' | 'merge' | 'distill';
	status: 'stub' | 'auto' | 'adopted';
	description?: string;
	gaps?: string[];
	note?: string;
};
export type MigrationMap = {
	$comment?: string;
	sourceRoot: string;
	sourceCommit?: string;
	routes: Record<string, Route>;
	kill?: Record<string, string>;
	renamed?: Record<string, string>;
};

/** The map as parsed data AND as text — the text is what gets patched. */
export function loadMap(): { text: string; map: MigrationMap } {
	const text = readFileSync(MAP_PATH, 'utf8');
	return { text, map: JSON.parse(text) };
}

export function resolveSourceDir(args: string[], map: MigrationMap): string {
	const i = args.indexOf('--source');
	const candidates = [
		i !== -1 ? args[i + 1] : undefined,
		process.env.NS_OLD_DOCS_DIR,
		map.sourceRoot.startsWith('/') ? map.sourceRoot : undefined,
		// The sibling checkout this repo has always lived next to.
		join(ROOT, '..', 'knowledge', OLD_DOCS_SUBDIR),
	].filter((c): c is string => !!c);
	for (const c of candidates) if (existsSync(c) && statSync(c).isDirectory()) return c;
	console.error(
		`Old docs not found. Tried: ${candidates.join(', ') || '(nothing)'}\n` +
			`Clone ${OLD_DOCS_REPO}${map.sourceCommit ? ` at ${map.sourceCommit}` : ''} and pass\n` +
			`  --source <clone>/${OLD_DOCS_SUBDIR}   (or export NS_OLD_DOCS_DIR)`
	);
	process.exit(2);
}

/** Positional args = route prefixes; `--all` = every route. */
export function routeFilter(args: string[]): (route: string) => boolean {
	const all = args.includes('--all');
	const prefixes: string[] = [];
	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--source') {
			i++;
			continue;
		}
		if (!args[i].startsWith('--')) prefixes.push(args[i]);
	}
	if (!all && prefixes.length === 0) return () => false;
	return (route) => all || prefixes.some((p) => route === p || route.startsWith(p));
}

export function walk(dir: string, keep: (abs: string) => boolean): string[] {
	const out: string[] = [];
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const abs = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(abs, keep));
		else if (keep(abs)) out.push(abs);
	}
	return out.sort();
}
export const walkMd = (dir: string) => walk(dir, (p) => p.endsWith('.md'));
export const walkImages = (dir: string) => walk(dir, (p) => IMG.has(extname(p).toLowerCase()));

export function sha1(path: string): string {
	return createHash('sha1').update(readFileSync(path)).digest('hex');
}

/**
 * Old public URL path -> new route(s). `features/pii_detect/index.md` was served at
 * documentation.neuralseek.com/features/pii_detect/, so drop the /index.md or .md tail and
 * the rest is the old URL. One source (`more_about_NS/plans.md`) feeds three routes, so the
 * value is a list in map order — callers take the first and flag the ambiguity.
 */
export function buildUrlToRoutes(map: MigrationMap): Map<string, string[]> {
	const m = new Map<string, string[]>();
	for (const [route, info] of Object.entries(map.routes)) {
		for (const src of info.sources ?? []) {
			const key = sourceToUrlPath(src);
			m.set(key, [...(m.get(key) ?? []), route]);
		}
	}
	return m;
}
export const sourceToUrlPath = (src: string) =>
	src.replace(/\/index\.md$/, '').replace(/\.md$/, '');

/**
 * Old-site links that were already 404s in the old docs (paths that never existed at the
 * clone's commit), mapped to the route they plainly meant. Verified 2026-09-17 by the audit's
 * sitemap reconciliation: none of these paths is published. Anything not listed here is left
 * as written and reported LINK-UNRESOLVED.
 */
export const DEAD_LINK_FIXES: Record<string, string> = {
	'guides/data/replay': 'governance/replay',
	'ui/integrate/integrations/knowledgebases': 'knowledge/supported-knowledgebases',
	'main_features/advanced_features/advanced_features': 'governance/replay',
};

export function sourceToRoutes(map: MigrationMap): Map<string, string[]> {
	const m = new Map<string, string[]>();
	for (const [route, info] of Object.entries(map.routes)) {
		for (const src of info.sources ?? []) m.set(src, [...(m.get(src) ?? []), route]);
	}
	return m;
}

/** Frontmatter as the old site wrote it: `title`, `description`, `tags` (dropped downstream). */
export function splitFrontmatter(raw: string): {
	fm: { title?: string; description?: string; tags?: string };
	hasFrontmatter: boolean;
	body: string;
} {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!m) return { fm: {}, hasFrontmatter: false, body: raw };
	const fm: Record<string, string> = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^(title|description|tags):\s*(.*)$/);
		if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
	}
	return { fm, hasFrontmatter: true, body: raw.slice(m[0].length) };
}

// ── Map surgery ────────────────────────────────────────────────────────────────

/** The text span of one route's `"route": { … }` block, or null. */
export function routeBlock(mapText: string, route: string): { start: number; end: number } | null {
	const key = `"${route}": {`;
	const start = mapText.indexOf(key);
	if (start === -1) return null;
	const end = mapText.indexOf('\n    }', start);
	return end === -1 ? null : { start, end };
}

export function patchRouteBlock(
	mapText: string,
	route: string,
	fn: (block: string) => string
): string {
	const span = routeBlock(mapText, route);
	if (!span) return mapText;
	const block = mapText.slice(span.start, span.end);
	return mapText.slice(0, span.start) + fn(block) + mapText.slice(span.end);
}

// ── Text utilities ─────────────────────────────────────────────────────────────

export const isFenceLine = (line: string) => /^\s*(`{3,}|~{3,})/.test(line);

/** Apply `fn` to every line outside fenced code blocks. */
export function mapOutsideFences(src: string, fn: (line: string, i: number) => string): string {
	let inFence = false;
	return src
		.split('\n')
		.map((line, i) => {
			if (isFenceLine(line)) {
				inFence = !inFence;
				return line;
			}
			return inFence ? line : fn(line, i);
		})
		.join('\n');
}

/** Character ranges [start, end) of fenced code blocks, so multi-line regexes can skip them. */
export function fenceRanges(src: string): [number, number][] {
	const ranges: [number, number][] = [];
	let pos = 0;
	let open = -1;
	for (const line of src.split('\n')) {
		if (isFenceLine(line)) {
			if (open === -1) open = pos;
			else {
				ranges.push([open, pos + line.length]);
				open = -1;
			}
		}
		pos += line.length + 1;
	}
	if (open !== -1) ranges.push([open, src.length]);
	return ranges;
}

/** `src.replace(re, fn)` that leaves matches inside fenced code blocks untouched. */
export function replaceOutsideFences(
	src: string,
	re: RegExp,
	fn: (...m: string[]) => string
): string {
	const ranges = fenceRanges(src);
	return src.replace(re, (...m: unknown[]) => {
		const offset = m[m.length - 2] as number;
		const inFence = ranges.some(([a, b]) => offset >= a && offset < b);
		return inFence ? (m[0] as string) : fn(...(m.slice(0, -2) as string[]));
	});
}

export function stripFences(src: string): string {
	let inFence = false;
	return src
		.split('\n')
		.filter((line) => {
			if (isFenceLine(line)) {
				inFence = !inFence;
				return false;
			}
			return !inFence;
		})
		.join('\n');
}

const STOP = new Set(
	(
		'a an the and or of to in on for with by from as at is are be was were it its this that ' +
		'these those you your we our they their can will may not no if then than into out up down ' +
		'over under about how what when where which who use used using also any all each more most ' +
		'such via per set get new one two only same other some there here has have had do does ' +
		'neuralseek page pages'
	).split(' ')
);

export function tokenize(text: string): string[] {
	// Light stemming: `llms` → `llm`, `agents` → `agent`, so a plural in one text still
	// meets its singular in the other. Enough for a signal; this is not a search engine.
	return (text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
		.filter((w) => w.length > 2 && !STOP.has(w))
		.map((w) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w));
}

/** Every MkDocs-specific construct the converter must handle, counted per file. */
export function scanDialect(text: string) {
	const body = stripFences(text);
	const lines = body.split('\n');
	const count = (re: RegExp, s = body) => (s.match(re) ?? []).length;
	let nestedAdmonitions = 0;
	let fencesInAdmonitions = 0;
	let tablesInAdmonitions = 0;
	{
		// Body lines of an admonition are indented ≥4; a marker at that depth is nested.
		let inBlock = false;
		let inFence = false;
		for (const line of text.split('\n')) {
			if (/^\s*(!!!|\?\?\?)/.test(line)) {
				if (/^\s{4,}(!!!|\?\?\?)/.test(line)) nestedAdmonitions++;
				inBlock = true;
				continue;
			}
			if (!inBlock) continue;
			if (line.trim() !== '' && !/^(\t| {2,})/.test(line)) {
				inBlock = false;
				continue;
			}
			if (/^\s+(`{3,}|~{3,})/.test(line)) {
				if (!inFence) fencesInAdmonitions++;
				inFence = !inFence;
			}
			if (!inFence && /^\s+\|.*\|\s*$/.test(line)) tablesInAdmonitions++;
		}
	}
	const h1Lines = lines.map((l, i) => (/^#\s+\S/.test(l) ? i : -1)).filter((i) => i >= 0);
	return {
		admonitions: count(/^\s*!!!/gm),
		collapsibles: count(/^\s*\?\?\?/gm),
		nestedAdmonitions,
		fencesInAdmonitions,
		tableRowsInAdmonitions: tablesInAdmonitions,
		h1Count: h1Lines.length,
		lateH1: h1Lines.some((i) => lines.slice(0, i).some((l) => l.trim() !== '')),
		absoluteOldLinks: count(/\]\(\s*https?:\/\/documentation\.neuralseek\.com\/[^)]*\)/g),
		anchoredOldLinks: count(/\]\(\s*https?:\/\/documentation\.neuralseek\.com\/[^)]*#[^)]*\)/g),
		relativeMdLinks: count(/\]\((?!https?:)[^)\s]*\.md(?:#[^)]*)?\)/g),
		ntlFences: count(/^\s*```ntl\b/gm, text),
		materialIcons: count(/:material-[a-z0-9-]+:/g),
		attrList: count(/\{\s*\.[\w-]+[^}]*\}/g),
		rawAnchors: count(/<a\s[^>]*href=/g),
		images: count(/!\[[^\]]*\]\([^)]+\)/g) + count(/<img\s[^>]*src=/g),
	};
}
export type Dialect = ReturnType<typeof scanDialect>;

// ── MkDocs admonition blocks (shared by convert.ts and check.ts) ───────────────

/**
 * Split `!!! warning "Heads up"` into its type and title. Two old blocks are malformed —
 * `??? example 1. Click…` (unquoted title) and `??? abstract "Title" 1. **Body**…` (body on
 * the marker line). Python-Markdown rendered both as literal text; here the trailing text
 * becomes the title (unquoted) or the first body line (after a quoted title), and the
 * block is reported so a human can look.
 */
export function parseMarker(rest: string): {
	type: string;
	title: string;
	trailing: string;
	malformed: boolean;
} {
	const strict = rest.match(/^\s*([A-Za-z]+)?\s*(?:"([^"]*)"|'([^']*)')?\s*$/);
	if (strict) {
		return {
			type: (strict[1] ?? 'note').toLowerCase(),
			title: strict[2] ?? strict[3] ?? '',
			trailing: '',
			malformed: false,
		};
	}
	const quoted = rest.match(/^\s*([A-Za-z]+)?\s*"([^"]*)"\s*(.*)$/);
	if (quoted) {
		return {
			type: (quoted[1] ?? 'note').toLowerCase(),
			title: quoted[2],
			trailing: quoted[3].trim(),
			malformed: true,
		};
	}
	const loose = rest.match(/^\s*([A-Za-z]+)\s+(.*)$/);
	if (loose)
		return { type: loose[1].toLowerCase(), title: loose[2].trim(), trailing: '', malformed: true };
	return { type: 'note', title: rest.trim(), trailing: '', malformed: true };
}

/**
 * MkDocs marks the body of an admonition by indenting it four spaces, so the block ends at
 * the first non-blank line that is NOT indented; blank lines in the middle belong to the
 * block. One level of indentation is removed (Python-Markdown's detab) — unless the whole
 * body is over-indented (two old blocks: 6 and 8 spaces), in which case the common indent
 * goes, so the body does not turn into an indented code block. A malformed marker with its
 * body on the same line continues with 1-space-indented lines; callers pass 1 for those.
 */
export function takeIndentedBody(
	lines: string[],
	start: number,
	minIndentToBelong = 2
): { body: string[]; next: number; overIndented: number } {
	let i = start;
	let minIndent = Infinity;
	const belongs = new RegExp(`^(\\t| {${minIndentToBelong},})`);
	for (; i < lines.length; i++) {
		const line = lines[i];
		if (line.trim() === '') continue;
		if (!belongs.test(line)) break;
		minIndent = Math.min(minIndent, line.startsWith('\t') ? 4 : line.match(/^ +/)![0].length);
	}
	const strip = minIndent > 4 && minIndent !== Infinity ? minIndent : 4;
	const body = lines.slice(start, i).map((line) => {
		if (line.trim() === '') return '';
		if (line.startsWith('\t')) return line.slice(1);
		return line.slice(Math.min(strip, line.match(/^ */)![0].length));
	});
	while (body.length && body[body.length - 1] === '') body.pop();
	return { body, next: i, overIndented: strip > 4 ? strip : 0 };
}

/**
 * The body of an admonition, with one repair: eight old blocks put the first paragraph
 * directly under the marker WITHOUT indentation (`??? example⏎Display a chart…⏎⏎    ![img]`).
 * Python-Markdown rendered those as an empty box, a stray paragraph and a literal code block.
 * Here that paragraph (up to the first blank line) and the indented lines after it become
 * the body, and the caller is told so it can flag the block. A marker followed by a blank
 * line keeps its (possibly empty) indented body — `!!! success "No Returns"` is meant to be
 * empty.
 */
export function takeAdmonitionBody(
	lines: string[],
	start: number,
	minIndentToBelong = 2
): { body: string[]; next: number; overIndented: number; repaired: boolean } {
	const first = lines[start];
	const belongs = new RegExp(`^(\\t| {${minIndentToBelong},})`);
	if (first !== undefined && first.trim() !== '' && !belongs.test(first)) {
		const lazy: string[] = [];
		let i = start;
		for (; i < lines.length && lines[i].trim() !== ''; i++)
			lazy.push(lines[i].replace(/^ {1,3}/, ''));
		const rest = takeIndentedBody(lines, i, minIndentToBelong);
		const body = rest.body.length ? [...lazy, '', ...rest.body] : lazy;
		return {
			body,
			next: rest.body.length ? rest.next : i,
			overIndented: rest.overIndented,
			repaired: true,
		};
	}
	return { ...takeIndentedBody(lines, start, minIndentToBelong), repaired: false };
}

// ── TF-IDF cosine (no dependency) ──────────────────────────────────────────────

export type Vec = Map<string, number>;

export class TfIdf {
	private df = new Map<string, number>();
	private docs: string[][] = [];
	private n = 0;
	add(tokens: string[]) {
		this.docs.push(tokens);
		this.n++;
		for (const w of new Set(tokens)) this.df.set(w, (this.df.get(w) ?? 0) + 1);
	}
	vector(tokens: string[]): Vec {
		const tf = new Map<string, number>();
		for (const w of tokens) tf.set(w, (tf.get(w) ?? 0) + 1);
		const v: Vec = new Map();
		let norm = 0;
		for (const [w, c] of tf) {
			const idf = Math.log((this.n + 1) / ((this.df.get(w) ?? 0) + 1)) + 1;
			const x = (c / tokens.length) * idf;
			v.set(w, x);
			norm += x * x;
		}
		norm = Math.sqrt(norm) || 1;
		for (const [w, x] of v) v.set(w, x / norm);
		return v;
	}
}

export function cosine(a: Vec, b: Vec): number {
	let s = 0;
	const [small, big] = a.size < b.size ? [a, b] : [b, a];
	for (const [w, x] of small) s += x * (big.get(w) ?? 0);
	return s;
}

export const rel = (abs: string, base: string) => relative(base, abs);
