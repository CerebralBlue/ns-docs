/**
 * Phase 2 of the verbatim migration: convert old MkDocs pages into Starlight pages.
 *
 * Resurrected from scripts/convert.ts (retired 2026-09-04, `git show 685b397^:scripts/convert.ts`)
 * and extended for a byte-faithful port. The old prose is never rewritten; only syntax the
 * Starlight build cannot take is converted. Line-based on purpose: MkDocs admonitions are
 * indentation blocks that no markdown AST represents, and re-serialising through remark
 * would touch every untouched paragraph. The AST is used to *validate* (check.ts), not to
 * transform.
 *
 *   bun scripts/migration/convert.ts seek/                 # one module
 *   bun scripts/migration/convert.ts --all [--dry]         # everything with a source
 *   bun scripts/migration/convert.ts --all --source <dir>  # explicit old-docs dir
 *
 * Every route with `sources` is converted and overwritten — `adopted` and `auto` included
 * (decision 2026-09-17; the previous page is kept under _private/migration/previous/ the first
 * time it is overwritten). Converted routes are flipped to `"status": "auto"` in the map and,
 * when the block has no `description`, one is inserted — both by block-scoped string surgery,
 * never by re-serialising the map.
 *
 * What it converts:
 *   !!! type "Title"  -> :::note[Title] … :::   nested blocks get one more colon per level
 *   ??? type "Title"  -> <details><summary>…      ???+ -> <details open>
 *   first-line H1     -> removed when it is the page title; any other H1 -> ## (H1-DEMOTED)
 *   heading levels    -> promoted so the shallowest heading is h2
 *   :material-check:  -> ✓   :material-close: -> ✗   (others reported ICON-UNKNOWN)
 *   { .md-button }    -> stripped (ATTR-STRIPPED)
 *   documentation.neuralseek.com/x/#a -> /new-route/#a ; relative x.md links -> /new-route/
 *   images/foo.png    -> /img/<route>/foo.png + copied, never over a differing local file
 *   <a href="x.json"> -> ::ns-button / [text](/files/<route>/x.json) + copied
 *   ```ntl            -> ```text ;  ```JSON -> ```json
 *
 * Idempotent: a second run rewrites byte-identical files and patches nothing.
 * Report: stdout + _private/migration/convert.json. Exit 1 on IMAGE-COLLISION.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import {
	buildUrlToRoutes,
	DEAD_LINK_FIXES,
	DOCS_DIR,
	isFenceLine,
	loadMap,
	mapOutsideFences,
	MAP_PATH,
	OUT_DIR,
	parseMarker,
	patchRouteBlock,
	rel,
	replaceOutsideFences,
	resolveSourceDir,
	routeFilter,
	ROOT,
	sha1,
	sourceToUrlPath,
	splitFrontmatter,
	takeAdmonitionBody,
} from './lib';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const wanted = routeFilter(args);
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--source');
if (!args.includes('--all') && !positional.length) {
	console.error(
		'Usage: bun scripts/migration/convert.ts <route-prefix> [...] [--dry] [--source <dir>]\n' +
			'       bun scripts/migration/convert.ts --all [--dry] [--source <dir>]'
	);
	process.exit(1);
}

const { text: mapText, map } = loadMap();
const SRC = resolveSourceDir(args, map);
const urlToRoutes = buildUrlToRoutes(map);
const killed = new Set(Object.keys(map.kill ?? {}));

// ── Flags ─────────────────────────────────────────────────────────────────────

type Flag = { code: string; detail: string };
type Ctx = { route: string; srcRel: string; flags: Flag[] };
const flag = (ctx: Ctx, code: string, detail: string) => ctx.flags.push({ code, detail });

// ── Admonitions ───────────────────────────────────────────────────────────────

/** MkDocs admonition types -> the four asides Starlight actually has. */
const ASIDE: Record<string, 'note' | 'tip' | 'caution' | 'danger'> = {
	note: 'note',
	info: 'note',
	abstract: 'note',
	quote: 'note',
	example: 'note',
	examples: 'note',
	question: 'note',
	important: 'note',
	tip: 'tip',
	success: 'tip',
	hint: 'tip',
	warning: 'caution',
	attention: 'caution',
	caution: 'caution',
	danger: 'danger',
	error: 'danger',
	failure: 'danger',
	bug: 'danger',
};
/** Starlight's own default label per aside kind — when the MkDocs type would read the same, no label. */
const DEFAULT_LABEL: Record<string, string> = {
	note: 'Note',
	tip: 'Tip',
	caution: 'Caution',
	danger: 'Danger',
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Label for an aside: the MkDocs title, else the type when Starlight's default would differ. */
function asideLabel(type: string, title: string, kind: string): string {
	if (title) return title;
	const t = capitalize(type);
	return t === DEFAULT_LABEL[kind] ? '' : t;
}

/** `<summary>` is raw HTML: backticks become <code>, and < & are escaped. */
function summaryHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/`([^`]+)`/g, '<code>$1</code>');
}

/**
 * Recursive: the body of a block is converted first, so a nested `!!! tip` inside a
 * `!!! warning` becomes `:::tip` inside `::::caution` — the OUTER container needs more
 * colons (micromark closes a container on the first matching run length).
 */
function convertAdmonitions(src: string, ctx: Ctx, depth = 0): string {
	const lines = src.split('\n');
	const out: string[] = [];
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		if (isFenceLine(lines[i])) inFence = !inFence;
		const aside = inFence ? null : lines[i].match(/^!!!(.*)$/);
		const details = inFence ? null : lines[i].match(/^\?\?\?(\+?)(.*)$/);
		if (!aside && !details) {
			out.push(lines[i]);
			continue;
		}
		const { type, title, trailing, malformed } = parseMarker(aside ? aside[1] : details![2]);
		const { body, next, overIndented, repaired } = takeAdmonitionBody(
			lines,
			i + 1,
			trailing ? 1 : 2
		);
		if (malformed) flag(ctx, 'MARKER-MALFORMED', lines[i].slice(0, 80));
		if (repaired)
			flag(ctx, 'EMPTY-BODY-REPAIRED', `${lines[i].slice(0, 40)} ← ${lines[i + 1].slice(0, 40)}`);
		if (overIndented)
			flag(ctx, 'BODY-OVERINDENTED', `${overIndented} spaces: ${lines[i].slice(0, 60)}`);
		if (trailing) body.unshift(trailing, '');
		const inner = convertAdmonitions(body.join('\n'), ctx, depth + 1);
		if (depth > 0 || /^:{3,}/m.test(inner)) flag(ctx, 'NESTED-ASIDE', `${type} at depth ${depth}`);
		// Each block is followed by a blank line. MkDocs did not need one; markdown tolerates
		// its absence, but a heading glued to a closing ::: is easy to break by accident.
		if (aside) {
			const kind = ASIDE[type] ?? 'note';
			const innerRun = Math.max(0, ...[...inner.matchAll(/^(:{3,})/gm)].map((m) => m[1].length));
			const colons = ':'.repeat(Math.max(3, innerRun + 1));
			const label = asideLabel(type, title, kind);
			out.push(`${colons}${kind}${label ? `[${label}]` : ''}`, ...inner.split('\n'), colons, '');
		} else {
			// `??? note "Formatting"` had no title on some blocks — fall back to the type.
			const summary = summaryHtml(title || capitalize(type) || 'Details');
			out.push(
				`<details${details![1] ? ' open' : ''}>`,
				`<summary>${summary}</summary>`,
				'',
				...inner.split('\n'),
				'',
				'</details>',
				''
			);
		}
		i = next - 1;
	}
	return out.join('\n');
}

// ── Headings ──────────────────────────────────────────────────────────────────

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Starlight renders the frontmatter title, so an H1 that IS the title is dropped: the first
 * content line when the source has no frontmatter title (the NTL pages) or when it reads the
 * same. Every other H1 is a section heading and becomes an H2 (pinecone's `# Overview`,
 * mAIstro's mid-page `# AI Agent Marketplace`) — reported, since the depth changed.
 */
function demoteOrStripH1(
	src: string,
	fmTitle: string | undefined,
	ctx: Ctx
): { text: string; h1Title?: string } {
	const lines = src.split('\n');
	let inFence = false;
	let seenContent = false;
	let h1Title: string | undefined;
	for (let i = 0; i < lines.length; i++) {
		if (isFenceLine(lines[i])) inFence = !inFence;
		if (inFence) continue;
		const m = lines[i].match(/^#\s+(.+?)\s*#*\s*$/);
		if (!m) {
			if (lines[i].trim() !== '') seenContent = true;
			continue;
		}
		const isTitle = !seenContent && (!fmTitle || norm(m[1]) === norm(fmTitle));
		if (isTitle) {
			h1Title = m[1];
			lines.splice(i, 1);
			while (lines[i] === '') lines.splice(i, 1);
			i--;
			seenContent = true;
			continue;
		}
		lines[i] = `## ${m[1]}`;
		flag(ctx, 'H1-DEMOTED', m[1]);
		seenContent = true;
	}
	return { text: lines.join('\n'), h1Title };
}

/**
 * Several old pages start at h4 (they sat under an in-body h1). Left alone the TOC would be
 * empty, since Starlight builds it from h2/h3.
 */
function promoteHeadings(src: string): string {
	const lines = src.split('\n');
	let inFence = false;
	let min = 7;
	for (const line of lines) {
		if (isFenceLine(line)) inFence = !inFence;
		if (inFence) continue;
		const m = line.match(/^(#{1,6})\s+\S/);
		if (m) min = Math.min(min, m[1].length);
	}
	if (min >= 7 || min <= 2) return src;
	const shift = min - 2;
	return mapOutsideFences(src, (line) => {
		const m = line.match(/^(#{1,6})(\s+\S.*)$/);
		return m ? '#'.repeat(Math.max(2, m[1].length - shift)) + m[2] : line;
	});
}

// ── Inline syntax ─────────────────────────────────────────────────────────────

const ICONS: Record<string, string> = { 'material-check': '✓', 'material-close': '✗' };

/** `:material-check:` would parse as a remark text directive and vanish; make it a glyph. */
function convertIcons(src: string, ctx: Ctx): string {
	return mapOutsideFences(src, (line) =>
		line.replace(/:(material-[a-z0-9-]+):/g, (whole, name) => {
			if (ICONS[name]) return ICONS[name];
			flag(ctx, 'ICON-UNKNOWN', name);
			return whole;
		})
	);
}

/** Python-Markdown attr_list — `{ .md-button .md-button--primary }` — has no equivalent. */
function stripAttrList(src: string, ctx: Ctx): string {
	return mapOutsideFences(src, (line) =>
		line.replace(/\{\s*(\.[\w-]+\s*)+\}/g, (whole) => {
			flag(ctx, 'ATTR-STRIPPED', whole);
			return '';
		})
	);
}

/**
 * remark-directive (which Starlight runs) reads `:word` anywhere in prose as a text
 * directive and drops it — `user:pass@host` renders as `user@host`. Escape the colon.
 * Inline code and link targets are left alone; `:::`/`::` markers start their line.
 */
function escapeTextDirectives(src: string, ctx: Ctx): string {
	return mapOutsideFences(src, (line) =>
		line
			.split(/(`[^`]*`|\]\([^)]*\)|https?:\/\/\S+)/)
			.map((seg, k) =>
				k % 2 === 1
					? seg
					: seg.replace(/(?<=[^\s:\\]):(?=[A-Za-z])/g, () => {
							flag(ctx, 'COLON-ESCAPED', line.trim().slice(0, 80));
							return '\\:';
						})
			)
			.join('')
	);
}

// ── Links ─────────────────────────────────────────────────────────────────────

/** Old URL path (`ui/seek`, from either link form) -> `/new-route/`, or null with a flag. */
function routeFor(urlPath: string, ctx: Ctx, original: string): string | null {
	const clean = urlPath.replace(/^\/+|\/+$/g, '');
	const srcMd = clean.endsWith('.md') ? clean : null;
	if (srcMd && killed.has(srcMd)) {
		flag(ctx, 'LINK-TO-KILLED', original);
		return null;
	}
	if (killed.has(`${clean}/index.md`) || killed.has(`${clean}.md`)) {
		flag(ctx, 'LINK-TO-KILLED', original);
		return null;
	}
	const routes = urlToRoutes.get(srcMd ? sourceToUrlPath(srcMd) : clean);
	if (!routes) {
		if (DEAD_LINK_FIXES[clean]) {
			flag(ctx, 'LINK-FIXED', `${original} → /${DEAD_LINK_FIXES[clean]}/ (404 on the old site)`);
			return `/${DEAD_LINK_FIXES[clean]}/`;
		}
		flag(ctx, 'LINK-UNRESOLVED', original);
		return null;
	}
	if (routes.length > 1) flag(ctx, 'LINK-AMBIGUOUS', `${original} → ${routes.join(' | ')}`);
	return `/${routes[0]}/`;
}

/**
 * Absolute old-site links become root-relative new routes (remark-base-path adds /ns-docs);
 * anchors survive. Relative `.md` links are resolved against the source file first. Only
 * `](url)` markdown links are touched, and only outside fences — some pages quote the docs
 * URL as CONTENT (inside backticks, or as the `url:` of an NTL `{{ web }}` node).
 */
function rewriteLinks(src: string, srcAbs: string, ctx: Ctx): string {
	return mapOutsideFences(src, (line) =>
		line
			.replace(
				/\]\(\s*https?:\/\/documentation\.neuralseek\.com\/([^)\s#]*)(#[^)\s]*)?\s*\)/g,
				(whole, path: string, anchor = '') => {
					const route = routeFor(path, ctx, whole);
					return route ? `](${route}${anchor})` : whole;
				}
			)
			.replace(
				/\]\(\s*((?!https?:|\/|#|mailto:)[^)\s]+\.md)(#[^)\s]*)?\s*\)/g,
				(whole, target: string, anchor = '') => {
					const abs = resolve(dirname(srcAbs), target);
					const route = routeFor(rel(abs, SRC), ctx, whole);
					return route ? `](${route}${anchor})` : whole;
				}
			)
	);
}

// ── Assets ────────────────────────────────────────────────────────────────────

const claimed = new Map<string, Map<string, string>>(); // route -> basename -> source abs

/** Copy one referenced file into public/<kind>/<route>/; never over a differing local file. */
function copyAsset(relRef: string, srcAbs: string, kind: 'img' | 'files', ctx: Ctx): string | null {
	const from = resolve(dirname(srcAbs), relRef.split('#')[0].split('?')[0]);
	if (!existsSync(from)) {
		flag(ctx, kind === 'img' ? 'IMAGE-MISSING' : 'ASSET-MISSING', relRef);
		return null;
	}
	const file = basename(from);
	const owners = claimed.get(ctx.route) ?? new Map<string, string>();
	claimed.set(ctx.route, owners);
	const prior = owners.get(file);
	if (prior && prior !== from) {
		flag(ctx, 'IMAGE-COLLISION', `${file}: ${rel(prior, SRC)} vs ${rel(from, SRC)}`);
		return null;
	}
	owners.set(file, from);
	const to = join(ROOT, 'public', kind, ctx.route, file);
	if (existsSync(to) && sha1(to) !== sha1(from)) {
		flag(
			ctx,
			'IMAGE-KEPT-LOCAL',
			`${file} differs from the old file — recaptured, not overwritten`
		);
	} else if (!dry && !existsSync(to)) {
		mkdirSync(dirname(to), { recursive: true });
		copyFileSync(from, to);
	}
	return `/${kind}/${ctx.route}/${file}`;
}

function rewriteAssets(src: string, srcAbs: string, ctx: Ctx): string {
	const local = (r: string) => !/^(https?:|\/|data:|#|mailto:)/.test(r);
	let text = mapOutsideFences(src, (line) =>
		line
			.replace(/!\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g, (whole, alt, ref, tail) => {
				if (!local(ref)) return whole;
				const to = copyAsset(ref, srcAbs, 'img', ctx);
				return to ? `![${alt}](${to}${tail})` : whole;
			})
			.replace(/(<img[^>]*\ssrc=")([^"]+)(")/g, (whole, a, ref, c) => {
				if (!local(ref)) return whole;
				const to = copyAsset(ref, srcAbs, 'img', ctx);
				return to ? `${a}${to}${c}` : whole;
			})
	);
	// A raw <a href> the base-path plugin cannot reach. The md-button variant becomes an
	// ::ns-button (whose href the plugin DOES rewrite); anything else a plain markdown link.
	text = replaceOutsideFences(
		text,
		/<a\s+([^>]*?)href="([^"]+)"([^>]*)>\s*([\s\S]*?)\s*<\/a>/g,
		(whole, before, ref, after, label) => {
			if (!local(ref) || /\.md$/.test(ref)) return whole;
			const to = copyAsset(ref, srcAbs, 'files', ctx);
			if (!to) return whole;
			const attrs = before + after;
			flag(
				ctx,
				'ASSET-COPIED',
				`${ref} → ${to}${/download=/.test(attrs) ? ' (download attribute dropped)' : ''}`
			);
			const text = label.replace(/\s+/g, ' ').trim();
			return /md-button/.test(attrs)
				? `::ns-button[${text}]{href="${to}" variant=primary}`
				: `[${text}](${to})`;
		}
	);
	return text;
}

// ── Description fallback ──────────────────────────────────────────────────────

function firstSentence(body: string, max = 160): string {
	const para = body
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.find((p) => p && !/^(#|:::|<|!\[|\||```|-|\*|\d+\.)/.test(p));
	if (!para) return '';
	const flat = para
		.replace(/\s+/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_`]/g, '');
	const s = flat.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? flat;
	return s.length > max ? s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : s;
}

// ── Main ──────────────────────────────────────────────────────────────────────

type RouteReport = {
	sources: string[];
	statusBefore: string;
	outcome: 'new' | 'changed' | 'unchanged' | 'failed';
	flags: Flag[];
};
const report: Record<string, RouteReport> = {};
let mapOut = mapText;
let collisions = 0;

for (const [route, info] of Object.entries(map.routes)) {
	if (!wanted(route) || !info.sources?.length) continue;
	const flags: Flag[] = [];
	const parts: string[] = [];
	let fmDescription = '';
	let fmTitle = '';
	let bodyForDescription = '';

	for (const [n, srcRel] of info.sources.entries()) {
		const ctx: Ctx = { route, srcRel, flags };
		const abs = join(SRC, srcRel);
		if (!existsSync(abs)) {
			flag(ctx, 'SOURCE-MISSING', srcRel);
			continue;
		}
		const { fm, body } = splitFrontmatter(readFileSync(abs, 'utf8'));
		const h1 = demoteOrStripH1(body, fm.title, ctx);
		if (n === 0) {
			fmDescription = fm.description ?? '';
			fmTitle = fm.title ?? h1.h1Title ?? '';
		}
		let text = h1.text;
		text = convertAdmonitions(text, ctx);
		text = promoteHeadings(text);
		text = convertIcons(text, ctx);
		text = stripAttrList(text, ctx);
		text = escapeTextDirectives(text, ctx);
		text = rewriteLinks(text, abs, ctx);
		text = rewriteAssets(text, abs, ctx);
		// The opening line of a fence is the only place the language appears. Shiki has no NTL
		// grammar, and its language ids are lowercase (```JSON falls back to plain text with a
		// build warning).
		text = text.replace(/^(\s*)```ntl\b/gm, '$1```text');
		text = text.replace(/^(\s*```)([A-Za-z]+)\b/gm, (_w, open, lang) => open + lang.toLowerCase());
		if (n === 0) bodyForDescription = text;
		if (n > 0) {
			parts.push(
				`\n<!-- MERGE: everything below came from ${srcRel}. Fold it into the sections above, then delete this comment. -->\n`
			);
		}
		parts.push(text.trim());
	}
	if (info.action === 'merge')
		flags.push({ code: 'MERGE', detail: `${info.sources.length} sources` });
	if (info.sources.some((s) => (urlToRoutes.get(sourceToUrlPath(s)) ?? []).length > 1)) {
		flags.push({ code: 'SHARED-SOURCE', detail: info.sources.join(', ') });
	}
	if (flags.some((f) => f.code === 'IMAGE-COLLISION')) collisions++;
	if (!parts.length || flags.some((f) => f.code === 'IMAGE-COLLISION')) {
		report[route] = { sources: info.sources, statusBefore: info.status, outcome: 'failed', flags };
		continue;
	}

	const title = info.title ?? fmTitle ?? route.split('/').pop();
	const description =
		info.description ||
		fmDescription ||
		firstSentence(bodyForDescription) ||
		`${title} — NeuralSeek documentation.`;
	// The gap audit rides along as an HTML comment: visible to whoever edits the page,
	// invisible on the published site.
	const todo = info.gaps?.length
		? `\n\n<!-- STILL TO DOCUMENT ON THIS PAGE:\n${info.gaps.map((g) => `  - ${g}`).join('\n')}\n-->`
		: '';
	const page = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
---

${parts.join('\n\n')}${todo}
`;

	const outPath = join(DOCS_DIR, `${route}.md`);
	const existing = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null;
	const outcome = existing === null ? 'new' : existing === page ? 'unchanged' : 'changed';
	if (!dry) {
		// Keep the true pre-migration page once, for the cherry-pick review of adopted/auto routes.
		if (existing !== null && info.status !== 'stub') {
			const prev = join(OUT_DIR, 'previous', `${route}.md`);
			if (!existsSync(prev)) {
				mkdirSync(dirname(prev), { recursive: true });
				writeFileSync(prev, existing);
			}
		}
		mkdirSync(dirname(outPath), { recursive: true });
		if (outcome !== 'unchanged') writeFileSync(outPath, page);
		mapOut = patchRouteBlock(mapOut, route, (block) => {
			let b = block.replace(/"status": "(stub|adopted|auto)"/, '"status": "auto"');
			if (!/"description":/.test(b)) {
				b = b.replace(
					/("title": .*,\n)/,
					`$1      "description": ${JSON.stringify(description)},\n`
				);
			}
			return b;
		});
	}
	report[route] = { sources: info.sources, statusBefore: info.status, outcome, flags };
}

if (!dry && mapOut !== mapText) writeFileSync(MAP_PATH, mapOut);
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
	join(OUT_DIR, 'convert.json'),
	JSON.stringify({ dry, generatedAt: new Date().toISOString(), routes: report }, null, 2) + '\n'
);

// ── Report ────────────────────────────────────────────────────────────────────
const tally: Record<string, number> = {};
for (const [route, r] of Object.entries(report)) {
	tally[r.outcome] = (tally[r.outcome] ?? 0) + 1;
	const line = `  ${r.outcome.padEnd(9)} ${r.statusBefore.padEnd(7)} ${route}`;
	const notes = r.flags.map((f) => `\n            ! ${f.code}  ${f.detail}`).join('');
	console.log(line + notes);
}
const codes: Record<string, number> = {};
for (const r of Object.values(report))
	for (const f of r.flags) codes[f.code] = (codes[f.code] ?? 0) + 1;
console.log(
	`\n${dry ? '[dry run] ' : ''}routes: ${Object.keys(report).length}  ` +
		Object.entries(tally)
			.map(([k, v]) => `${k} ${v}`)
			.join(' · ')
);
console.log(
	`flags:  ` +
		(Object.entries(codes)
			.sort()
			.map(([k, v]) => `${k} ${v}`)
			.join(' · ') || 'none')
);
console.log(
	dry
		? 'Nothing was written. Drop --dry to apply.'
		: 'Pages written; status flipped to "auto" — bun run stubs will not touch them. Report: _private/migration/convert.json'
);
process.exit(collisions ? 1 : 0);
