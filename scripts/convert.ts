/**
 * Convert old MkDocs pages into Starlight pages, one module at a time.
 *
 * Reads scripts/migration-map.json, converts every matching route that has a
 * `sources` entry, writes src/content/docs/<route>.md, copies the images that
 * page actually references, and flips the route's status stub -> auto so
 * `bun run stubs` can never overwrite the result.
 *
 * Usage:
 *   bun scripts/convert.ts seek/                     # one module
 *   bun scripts/convert.ts maistro/ntl/integrations/ # one module
 *   bun scripts/convert.ts governance/ --dry         # preview, write nothing
 *   bun scripts/convert.ts --all                     # everything convertible
 *
 * A route whose status is already "adopted" is NEVER touched: that is the flag
 * meaning "a human has edited this page". Set it the moment you start editing.
 *
 * What it converts (see _private/migration-notes.md for the full list):
 *   !!! type "Title"  -> :::note[Title] ... :::        (MkDocs admonition -> Starlight aside)
 *   ??? type "Title"  -> <details><summary>            (MkDocs collapsible)
 *   in-body H1        -> removed (Starlight renders the frontmatter title)
 *   heading levels    -> promoted so the shallowest heading on the page is h2
 *   documentation.neuralseek.com/x/ -> /new-route/     (resolved through the map)
 *   images/foo.png    -> /img/<route>/foo.png + the file copied into public/
 *   ```ntl            -> ```text                       (no Shiki grammar yet)
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MAP_PATH = join(ROOT, 'scripts/migration-map.json');

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const all = args.includes('--all');
const prefixes = args.filter((a) => !a.startsWith('--'));

if (!all && prefixes.length === 0) {
	console.error(
		'Usage: bun scripts/convert.ts <route-prefix> [...] [--dry]\n' +
			'       bun scripts/convert.ts --all [--dry]\n\n' +
			'Examples:\n' +
			'  bun scripts/convert.ts seek/\n' +
			'  bun scripts/convert.ts maistro/ntl/integrations/ --dry'
	);
	process.exit(1);
}

const mapText = readFileSync(MAP_PATH, 'utf8');
const map: { sourceRoot: string; routes: Record<string, any> } = JSON.parse(mapText);

/**
 * Old public URL path -> new route. `features/pii_detect/index.md` was served at
 * documentation.neuralseek.com/features/pii_detect/, so drop the /index.md or .md
 * tail and the rest of the path is the old URL.
 */
const urlToRoute = new Map<string, string>();
for (const [route, info] of Object.entries<any>(map.routes)) {
	for (const src of info.sources ?? []) {
		urlToRoute.set(src.replace(/\/index\.md$/, '').replace(/\.md$/, ''), route);
	}
}

/** MkDocs admonition types -> the four asides Starlight actually has. */
const ASIDE: Record<string, string> = {
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

/** Split `!!! warning "Heads up"` into its type and title. */
function parseMarker(rest: string): { type: string; title: string } {
	const m = rest.match(/^\s*([A-Za-z]+)?\s*(?:"([^"]*)"|'([^']*)')?\s*$/);
	const type = (m?.[1] ?? 'note').toLowerCase();
	return { type, title: m?.[2] ?? m?.[3] ?? '' };
}

/**
 * MkDocs marks the body of an admonition by indenting it four spaces, so the
 * block ends at the first non-blank line that is NOT indented. Blank lines in
 * the middle belong to the block.
 */
function takeIndentedBody(lines: string[], start: number): { body: string[]; next: number } {
	const body: string[] = [];
	let i = start;
	for (; i < lines.length; i++) {
		const line = lines[i];
		if (line.trim() === '') {
			body.push('');
			continue;
		}
		if (!/^(\t| {2,})/.test(line)) break;
		body.push(line.replace(/^(\t| {1,4})/, ''));
	}
	while (body.length && body[body.length - 1] === '') body.pop();
	return { body, next: i };
}

function convertAdmonitions(src: string): string {
	const lines = src.split('\n');
	const out: string[] = [];
	for (let i = 0; i < lines.length; i++) {
		const aside = lines[i].match(/^!!!(.*)$/);
		const details = lines[i].match(/^\?\?\?\+?(.*)$/);
		if (!aside && !details) {
			out.push(lines[i]);
			continue;
		}
		const { type, title } = parseMarker((aside ?? details)![1]);
		const { body, next } = takeIndentedBody(lines, i + 1);
		// Each block is followed by a blank line. MkDocs did not need one; markdown
		// tolerates its absence, but these pages get hand-edited by three people and a
		// heading glued to a closing ::: is easy to break by accident.
		if (aside) {
			const kind = ASIDE[type] ?? 'note';
			// Starlight titles an aside with [Title]; without one it uses the type's default.
			out.push(`:::${kind}${title ? `[${title}]` : ''}`, ...body, ':::', '');
		} else {
			// `??? note "Formatting"` had no title on 2 of 132 blocks — fall back to the type.
			const summary = title || type.charAt(0).toUpperCase() + type.slice(1) || 'Details';
			out.push('<details>', `<summary>${summary}</summary>`, '', ...body, '', '</details>', '');
		}
		i = next - 1;
	}
	return out.join('\n');
}

/** Strip the in-body H1 — Starlight already renders the frontmatter title. */
function stripH1(src: string): string {
	const lines = src.split('\n');
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		if (/^\s*```/.test(lines[i])) inFence = !inFence;
		if (inFence) continue;
		if (/^#\s+/.test(lines[i])) {
			lines.splice(i, 1);
			while (lines[i] === '') lines.splice(i, 1);
			break;
		}
		if (lines[i].trim() !== '' && !/^(#|<|!\[)/.test(lines[i])) break;
	}
	return lines.join('\n');
}

/**
 * Several old pages start at h4 (they sat under an in-body h1). Left alone the
 * TOC would be empty, since Starlight builds it from h2/h3.
 */
function promoteHeadings(src: string): string {
	const lines = src.split('\n');
	let inFence = false;
	let min = 7;
	for (const line of lines) {
		if (/^\s*```/.test(line)) inFence = !inFence;
		if (inFence) continue;
		const m = line.match(/^(#{1,6})\s+\S/);
		if (m) min = Math.min(min, m[1].length);
	}
	if (min >= 7 || min <= 2) return src;
	const shift = min - 2;
	inFence = false;
	return lines
		.map((line) => {
			if (/^\s*```/.test(line)) inFence = !inFence;
			if (inFence) return line;
			const m = line.match(/^(#{1,6})(\s+\S.*)$/);
			return m ? '#'.repeat(Math.max(2, m[1].length - shift)) + m[2] : line;
		})
		.join('\n');
}

/**
 * Absolute old-site links become root-relative new routes; remark-base-path adds /ns-docs.
 *
 * Only `](url)` markdown links are touched. Some pages quote the docs URL as example
 * CONTENT — inside backticks, or as the `url:` of an NTL `{{ web }}` node — and those
 * must survive untouched.
 */
function rewriteLinks(src: string, unresolved: Set<string>): string {
	return src.replace(
		/\]\(\s*https?:\/\/documentation\.neuralseek\.com\/([^)\s]*)\s*\)/g,
		(whole, path: string) => {
			const clean = path.replace(/#.*$/, '').replace(/^\/+|\/+$/g, '');
			const route = urlToRoute.get(clean);
			if (!route) {
				unresolved.add(clean || '(site root)');
				return whole;
			}
			return `](/${route}/)`;
		}
	);
}

/** Copy only the images a page actually uses, into public/img/<route>/. */
function rewriteImages(src: string, route: string, srcDir: string, missing: string[]): string {
	const rewriteOne = (rel: string) => {
		if (/^(https?:|\/|data:|#)/.test(rel)) return rel;
		const from = resolve(srcDir, rel.split('#')[0].split('?')[0]);
		const file = from.split('/').pop()!;
		if (!existsSync(from)) {
			missing.push(rel);
			return rel;
		}
		const to = join(ROOT, 'public/img', route, file);
		if (!dry) {
			mkdirSync(dirname(to), { recursive: true });
			copyFileSync(from, to);
		}
		return `/img/${route}/${file}`;
	};
	return src
		.replace(/!\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g, (_w, alt, rel, tail) => {
			return `![${alt}](${rewriteOne(rel)}${tail})`;
		})
		.replace(/(<img[^>]*\ssrc=")([^"]+)(")/g, (_w, a, rel, c) => `${a}${rewriteOne(rel)}${c}`);
}

function splitFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
	const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) return { fm: {}, body: raw };
	const fm: Record<string, string> = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^(title|description):\s*(.*)$/);
		if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
	}
	return { fm, body: raw.slice(m[0].length) };
}

let converted = 0;
let skipped = 0;
const report: string[] = [];
let mapOut = mapText;

for (const [route, info] of Object.entries<any>(map.routes)) {
	if (!all && !prefixes.some((p) => route === p || route.startsWith(p))) continue;
	if (!info.sources?.length) continue;
	if (info.status === 'adopted') {
		report.push(`  SKIP  ${route} — status "adopted" (hand-edited)`);
		skipped++;
		continue;
	}

	const unresolved = new Set<string>();
	const missingImages: string[] = [];
	const parts: string[] = [];
	let srcDescription = '';

	for (const [n, rel] of info.sources.entries()) {
		const abs = join(map.sourceRoot, rel);
		if (!existsSync(abs)) {
			report.push(`  FAIL  ${route} — source not found: ${rel}`);
			continue;
		}
		const { fm, body } = splitFrontmatter(readFileSync(abs, 'utf8'));
		if (n === 0) srcDescription = fm.description ?? '';
		let text = body;
		text = stripH1(text);
		text = convertAdmonitions(text);
		text = promoteHeadings(text);
		text = rewriteLinks(text, unresolved);
		text = rewriteImages(text, route, dirname(abs), missingImages);
		text = text.replace(/```ntl\b/g, '```text');
		if (n > 0) {
			parts.push(
				`\n<!-- MERGE: everything below came from ${rel}. Fold it into the sections above, then delete this comment. -->\n`
			);
		}
		parts.push(text.trim());
	}
	if (!parts.length) continue;

	const title = info.title ?? route.split('/').pop();
	const description = info.description ?? srcDescription ?? `${title} — NeuralSeek documentation.`;
	// The gap audit rides along as an HTML comment: visible to whoever edits the
	// page, invisible on the published site (unlike the stub's visible worklist).
	const todo = info.gaps?.length
		? `\n\n<!-- STILL TO DOCUMENT ON THIS PAGE:\n${info.gaps.map((g: string) => `  - ${g}`).join('\n')}\n-->`
		: '';

	const page = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
---

${parts.join('\n\n')}${todo}
`;

	const outPath = join(ROOT, 'src/content/docs', `${route}.md`);
	if (!dry) {
		mkdirSync(dirname(outPath), { recursive: true });
		writeFileSync(outPath, page);
		// Flip stub -> auto inside this route's block only, by string surgery, so the
		// map keeps its hand-maintained grouping and blank lines.
		const key = `"${route}": {`;
		const at = mapOut.indexOf(key);
		if (at !== -1) {
			const end = mapOut.indexOf('\n    }', at);
			const block = mapOut.slice(at, end);
			mapOut =
				mapOut.slice(0, at) +
				block.replace('"status": "stub"', '"status": "auto"') +
				mapOut.slice(end);
		}
	}

	const flags = [
		info.action === 'merge' ? `MERGE of ${info.sources.length} sources — needs a human pass` : '',
		unresolved.size ? `${unresolved.size} unresolved link(s): ${[...unresolved].join(', ')}` : '',
		missingImages.length
			? `${missingImages.length} missing image(s): ${missingImages.join(', ')}`
			: '',
	].filter(Boolean);
	report.push(
		`  OK    ${route}${flags.length ? `\n          ! ${flags.join('\n          ! ')}` : ''}`
	);
	converted++;
}

if (!dry && converted) writeFileSync(MAP_PATH, mapOut);

console.log(report.join('\n'));
console.log(
	`\n${dry ? '[dry run] ' : ''}converted: ${converted}, skipped (adopted): ${skipped}` +
		(dry
			? '\nNothing was written. Drop --dry to apply.'
			: '\nStatus flipped to "auto" — bun run stubs will no longer overwrite these.')
);
