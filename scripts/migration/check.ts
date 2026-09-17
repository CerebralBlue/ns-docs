/**
 * Phase 3 of the verbatim migration: prove that convert.ts lost nothing.
 *
 *   bun scripts/migration/check.ts seek/                  # one module
 *   bun scripts/migration/check.ts --all [--idempotency] [--source <dir>] [--json]
 *
 * For every route with sources, the old page(s) and the new page are parsed into mdast
 * (remark-parse + remark-gfm; + remark-directive on the new side) and compared:
 *   headings    same texts (minus the stripped title H1), same depth histogram once both
 *               sides are normalised so the shallowest heading is h2
 *   asides      old !!!/??? markers == new container directives + <details>
 *   images      same basenames, and every /img/<route>/… exists on disk
 *   links       same targets after the old side goes through the same URL→route map
 *   code        same fence count, every old fence body present byte-for-byte (lang ntl→text)
 *   tables      same count and total row count;  lists  same item count
 *   words       bag of words on the plain text; |Δ| ≤ 2 % and no dropped word outside the
 *               allow-list (icons, the title, MkDocs marker words)
 * Then the new body is scanned for leftover MkDocs syntax, and doc-lint runs for the route
 * (structural rules must be clean; merge-marker / gap-list / page-contract / stale-image are
 * expected on a verbatim port and ignored). `--idempotency` runs convert.ts --dry and fails
 * if it would change anything.
 *
 * Output: _private/migration/check.json + summary. Exit 1 on any loss.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { toString } from 'mdast-util-to-string';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import {
	buildUrlToRoutes,
	DEAD_LINK_FIXES,
	DOCS_DIR,
	isFenceLine,
	loadMap,
	OUT_DIR,
	parseMarker,
	rel,
	resolveSourceDir,
	routeFilter,
	ROOT,
	sourceToUrlPath,
	splitFrontmatter,
	stripFences,
	takeAdmonitionBody,
	tokenize,
} from './lib';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const idempotency = args.includes('--idempotency');
const wanted = routeFilter(args);
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--source');
if (!args.includes('--all') && !positional.length) {
	console.error(
		'Usage: bun scripts/migration/check.ts <route-prefix> [...] | --all [--idempotency] [--source <dir>] [--json]'
	);
	process.exit(1);
}

const { map } = loadMap();
const SRC = resolveSourceDir(args, map);
const urlToRoutes = buildUrlToRoutes(map);

// ── Old side: flatten admonitions the same way convert.ts does, without converting ────────

/** Marker line -> its label as a paragraph; body dedented like convert.ts; recursive. Counts markers. */
function flattenAdmonitions(src: string, counter: { n: number }): string {
	const lines = src.split('\n');
	const out: string[] = [];
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		if (isFenceLine(lines[i])) inFence = !inFence;
		const m = !inFence && lines[i].match(/^(?:!!!|\?\?\?\+?)(.*)$/);
		if (!m) {
			out.push(lines[i]);
			continue;
		}
		counter.n++;
		const { type, title, trailing } = parseMarker(m[1]);
		const { body, next } = takeAdmonitionBody(lines, i + 1, trailing ? 1 : 2);
		if (trailing) body.unshift(trailing, '');
		const label = title || type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
		// Bold so a label like `1. Click…` (one malformed old block) cannot parse as a list item.
		out.push('', `**${label}**`, '', flattenAdmonitions(body.join('\n'), counter), '');
		i = next - 1;
	}
	return out.join('\n');
}

// ── Feature extraction ────────────────────────────────────────────────────────

type Features = {
	headings: string[];
	depths: number[];
	asides: number;
	images: string[];
	links: string[];
	code: { lang: string | null; value: string }[];
	tables: number;
	tableRows: number;
	listItems: number;
	listItemTexts: string[];
	paragraphs: number;
	html: number;
	text: string;
};

const oldParser = unified().use(remarkParse).use(remarkGfm);
const newParser = unified().use(remarkParse).use(remarkGfm).use(remarkDirective);

function extract(tree: Root, side: 'old' | 'new'): Features {
	const f: Features = {
		headings: [],
		depths: [],
		asides: 0,
		images: [],
		links: [],
		code: [],
		tables: 0,
		tableRows: 0,
		listItems: 0,
		listItemTexts: [],
		paragraphs: 0,
		html: 0,
		text: '',
	};
	const words: string[] = [];
	visit(tree, (node: any) => {
		switch (node.type) {
			case 'text':
			case 'inlineCode':
				words.push(node.value);
				break;
			case 'heading':
				f.headings.push(toString(node).trim());
				f.depths.push(node.depth);
				break;
			case 'image':
				f.images.push(basename(node.url.split('#')[0].split('?')[0]));
				break;
			case 'link':
				f.links.push(node.url);
				break;
			case 'code':
				f.code.push({ lang: node.lang ?? null, value: node.value });
				break;
			case 'table':
				f.tables++;
				f.tableRows += node.children.length;
				break;
			case 'listItem':
				f.listItems++;
				f.listItemTexts.push(toString(node).trim().slice(0, 60));
				break;
			case 'paragraph':
				f.paragraphs++;
				break;
			case 'containerDirective':
				if (side === 'new') f.asides++;
				break;
			case 'html': {
				f.html++;
				if (side === 'new' && /^<details/.test(node.value)) f.asides++;
				for (const m of node.value.matchAll(/<img[^>]*\ssrc="([^"]+)"/g))
					f.images.push(basename(m[1]));
				// Tag markup is syntax; only the text between tags is content.
				if (!/^<!--/.test(node.value)) words.push(node.value.replace(/<[^>]+>/g, ' '));
				break;
			}
		}
	});
	f.text = words.join(' ');
	return f;
}

/** Old link target -> what convert.ts would have written, or the original when it would not. */
function normaliseOldLink(url: string, srcAbs: string): string {
	const abs = url.match(/^https?:\/\/documentation\.neuralseek\.com\/([^#]*)(#.*)?$/);
	if (abs) {
		const clean = abs[1].replace(/^\/+|\/+$/g, '');
		const routes = urlToRoutes.get(clean);
		if (routes) return `/${routes[0]}/${abs[2] ?? ''}`;
		return DEAD_LINK_FIXES[clean] ? `/${DEAD_LINK_FIXES[clean]}/${abs[2] ?? ''}` : url;
	}
	const relMd = url.match(/^((?!https?:|\/|#|mailto:)[^#]+\.md)(#.*)?$/);
	if (relMd) {
		const target = rel(resolve(dirname(srcAbs), relMd[1]), SRC);
		const routes = urlToRoutes.get(sourceToUrlPath(target));
		return routes ? `/${routes[0]}/${relMd[2] ?? ''}` : url;
	}
	return url;
}

const multisetDiff = (a: string[], b: string[]) => {
	const count = (xs: string[]) =>
		xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map<string, number>());
	const ca = count(a);
	const cb = count(b);
	const dropped: string[] = [];
	const added: string[] = [];
	for (const [k, v] of ca) for (let i = 0; i < v - (cb.get(k) ?? 0); i++) dropped.push(k);
	for (const [k, v] of cb) for (let i = 0; i < v - (ca.get(k) ?? 0); i++) added.push(k);
	return { dropped, added };
};

/** Mirrors convert.ts: every H1 becomes H2, then the page is promoted so the shallowest is h2. */
const normaliseDepths = (depths: number[]) => {
	const demoted = depths.map((d) => Math.max(2, d));
	const min = Math.min(...demoted, 7);
	const shift = min > 2 && min < 7 ? min - 2 : 0;
	return demoted.map((d) => Math.max(2, d - shift));
};
const histogram = (xs: number[]) => {
	const h: Record<number, number> = {};
	for (const x of xs) h[x] = (h[x] ?? 0) + 1;
	return Object.fromEntries(Object.entries(h).sort());
};

const LEFTOVERS: [string, RegExp][] = [
	['admonition', /^!!!/m],
	['collapsible', /^\?\?\?/m],
	['material-icon', /:material-[a-z0-9-]+:/],
	['relative-md-link', /\]\((?!https?:)[^)\s]*\.md[)#]/],
	['attr-list', /\{\s*\.[\w-]+/],
	['relative-image', /\]\((?:\.\.?\/|images\/)/],
	['ntl-fence', /^\s*```ntl\b/m],
	['old-domain-link', /\]\(\s*https?:\/\/documentation\.neuralseek\.com\//],
];
const LINT_FAIL = new Set([
	'in-body-h1',
	'heading-depth',
	'base-prefix',
	'old-domain',
	'image-path',
	'mkdocs-link',
	'missing-image',
	'ntl-fence',
	'colon-nesting',
	'unclosed-directive',
	'unquoted-href',
	'frontmatter',
	'missing-page',
]);
const WORD_ALLOW = new Set([
	'material',
	'check',
	'close',
	'note',
	'tip',
	'warning',
	'example',
	'md',
	'button',
	'primary',
	'ext',
	'download',
	'file',
]);

// ── Main ──────────────────────────────────────────────────────────────────────

type RouteResult = {
	ok: boolean;
	problems: string[];
	counts: { old: Record<string, number>; new: Record<string, number> };
	words: { old: number; new: number; dropped: string[]; added: string[] };
	leftovers: string[];
	lint: string[];
};
const results: Record<string, RouteResult> = {};

for (const [route, info] of Object.entries(map.routes)) {
	if (!wanted(route) || !info.sources?.length) continue;
	const problems: string[] = [];
	const newPath = join(DOCS_DIR, `${route}.md`);
	if (!existsSync(newPath)) {
		results[route] = {
			ok: false,
			problems: ['page missing'],
			counts: { old: {}, new: {} },
			words: { old: 0, new: 0, dropped: [], added: [] },
			leftovers: [],
			lint: [],
		};
		continue;
	}

	// old
	const oldF: Features = {
		headings: [],
		depths: [],
		asides: 0,
		images: [],
		links: [],
		code: [],
		tables: 0,
		tableRows: 0,
		listItems: 0,
		listItemTexts: [],
		paragraphs: 0,
		html: 0,
		text: '',
	};
	let titleH1: string | null = null;
	const oldTitles: string[] = [];
	for (const [n, srcRel] of info.sources.entries()) {
		const abs = join(SRC, srcRel);
		if (!existsSync(abs)) {
			problems.push(`source missing: ${srcRel}`);
			continue;
		}
		const { fm, body } = splitFrontmatter(readFileSync(abs, 'utf8'));
		const counter = { n: 0 };
		const flat = flattenAdmonitions(body, counter);
		const f = extract(oldParser.parse(flat) as Root, 'old');
		f.asides = counter.n;
		// The first-line H1 that IS the title was stripped by convert.ts; drop it here too.
		const first = body.split('\n').find((l) => l.trim() !== '');
		const h1 = first?.match(/^#\s+(.+?)\s*#*\s*$/)?.[1];
		const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
		if (h1 && (!fm.title || norm(h1) === norm(fm.title))) {
			const idx = f.headings.indexOf(h1.trim());
			if (idx !== -1) {
				f.headings.splice(idx, 1);
				f.depths.splice(idx, 1);
			}
			if (n === 0) titleH1 = h1;
			oldTitles.push(h1);
		}
		f.links = f.links.map((u) => normaliseOldLink(u, abs));
		oldF.headings.push(...f.headings);
		oldF.depths.push(...normaliseDepths(f.depths));
		oldF.asides += f.asides;
		oldF.images.push(...f.images);
		oldF.links.push(...f.links);
		oldF.code.push(...f.code);
		oldF.tables += f.tables;
		oldF.tableRows += f.tableRows;
		oldF.listItems += f.listItems;
		oldF.listItemTexts.push(...f.listItemTexts);
		oldF.paragraphs += f.paragraphs;
		oldF.html += f.html;
		oldF.text += '\n' + f.text;
	}

	// new
	const raw = readFileSync(newPath, 'utf8');
	const { body: newBodyRaw } = splitFrontmatter(raw);
	const newBody = newBodyRaw
		.replace(/^<!-- MERGE:.*-->$/gm, '')
		.replace(/<!-- STILL TO DOCUMENT ON THIS PAGE:[\s\S]*?-->/g, '');
	const newF = extract(newParser.parse(newBody) as Root, 'new');
	// The ns-button that replaced the download anchor is a leaf directive, not a link node.
	for (const m of newBody.matchAll(/::ns-button\[[^\]]*\]\{href="([^"]+)"/g)) newF.links.push(m[1]);

	// compare
	const h = multisetDiff(oldF.headings, newF.headings);
	if (h.dropped.length || h.added.length)
		problems.push(`headings: dropped [${h.dropped.join(' | ')}] added [${h.added.join(' | ')}]`);
	// The new page was promoted per source (a merge concatenates already-promoted parts).
	const od = histogram(oldF.depths);
	const nd = histogram(newF.depths);
	if (JSON.stringify(od) !== JSON.stringify(nd))
		problems.push(`heading depths: old ${JSON.stringify(od)} new ${JSON.stringify(nd)}`);
	if (oldF.asides !== newF.asides) problems.push(`asides: old ${oldF.asides} new ${newF.asides}`);
	const im = multisetDiff(oldF.images, newF.images);
	if (im.dropped.length || im.added.length)
		problems.push(`images: dropped [${im.dropped.join(', ')}] added [${im.added.join(', ')}]`);
	for (const m of newBody.matchAll(/\]\((\/img\/[^)\s]+)/g)) {
		if (!existsSync(join(ROOT, 'public', m[1]))) problems.push(`image not on disk: ${m[1]}`);
	}
	const oldLinks = oldF.links.filter((u) => !/^\/files\//.test(u));
	const newLinks = newF.links.filter((u) => !/^\/files\//.test(u));
	const lk = multisetDiff(oldLinks, newLinks);
	if (lk.dropped.length || lk.added.length)
		problems.push(`links: dropped [${lk.dropped.join(', ')}] added [${lk.added.join(', ')}]`);
	if (oldF.code.length !== newF.code.length)
		problems.push(`code fences: old ${oldF.code.length} new ${newF.code.length}`);
	const newBodies = new Set(newF.code.map((c) => c.value));
	for (const c of oldF.code) {
		if (!newBodies.has(c.value))
			problems.push(
				`code body lost (${c.lang ?? 'no lang'}): ${c.value.slice(0, 60).replace(/\n/g, '⏎')}…`
			);
	}
	const langs = multisetDiff(
		oldF.code.map((c) => (c.lang === 'ntl' ? 'text' : (c.lang ?? '').toLowerCase())),
		newF.code.map((c) => c.lang ?? '')
	);
	if (langs.dropped.length || langs.added.length)
		problems.push(
			`code langs: dropped [${langs.dropped.join(', ')}] added [${langs.added.join(', ')}]`
		);
	if (oldF.tables !== newF.tables || oldF.tableRows !== newF.tableRows)
		problems.push(
			`tables: old ${oldF.tables}/${oldF.tableRows} rows, new ${newF.tables}/${newF.tableRows}`
		);
	if (oldF.listItems !== newF.listItems) {
		const li = multisetDiff(oldF.listItemTexts, newF.listItemTexts);
		problems.push(
			`list items: old ${oldF.listItems} new ${newF.listItems} — dropped [${li.dropped.join(' | ')}] added [${li.added.join(' | ')}]`
		);
	}
	// Each `:::` aside on the new side loses the label paragraph the flattened old side had;
	// <details> keeps it as html. Allow that many.
	const detailsCount = (newBody.match(/^<details/gm) ?? []).length;
	const asideDirectives = newF.asides - detailsCount;
	// Paragraph counts move with html blocks and tight/loose lists — informational only;
	// the word bag below is what proves prose survived.
	void asideDirectives;

	const oldWords = tokenize(
		oldF.text.replace(/:material-(check|close):/g, ' ').replace(/\{\s*(\.[\w-]+\s*)+\}/g, ' ')
	);
	const newWords = tokenize(newF.text + ' ' + newBody.match(/::ns-button\[([^\]]*)\]/g)?.join(' '));
	const w = multisetDiff(oldWords, newWords);
	const titleWords = new Set(tokenize(oldTitles.join(' ')));
	const droppedReal = w.dropped.filter((x) => !WORD_ALLOW.has(x) && !titleWords.has(x));
	const addedReal = w.added.filter((x) => !WORD_ALLOW.has(x));
	const delta = oldWords.length ? Math.abs(newWords.length - oldWords.length) / oldWords.length : 0;
	if (delta > 0.02)
		problems.push(
			`word count Δ ${(delta * 100).toFixed(1)}% (old ${oldWords.length}, new ${newWords.length})`
		);
	if (droppedReal.length)
		problems.push(`words dropped: ${[...new Set(droppedReal)].slice(0, 20).join(', ')}`);

	// leftovers (fence-aware)
	const bodyNoFences = stripFences(newBody);
	const leftovers = LEFTOVERS.filter(([, re]) => re.test(bodyNoFences)).map(([name]) => name);
	if (leftovers.length) problems.push(`leftover MkDocs syntax: ${leftovers.join(', ')}`);

	// doc-lint
	const lintRun = spawnSync('bun', [join(ROOT, 'scripts/doc-lint.ts'), route], {
		encoding: 'utf8',
	});
	const lint = (lintRun.stdout + lintRun.stderr)
		.split('\n')
		.filter((l) => /\b(error|warn)\b/.test(l) && [...LINT_FAIL].some((r) => l.includes(r)))
		.map((l) => l.trim());
	if (lint.length) problems.push(`doc-lint: ${lint.length} structural finding(s)`);

	results[route] = {
		ok: problems.length === 0,
		problems,
		counts: {
			old: {
				headings: oldF.headings.length,
				asides: oldF.asides,
				images: oldF.images.length,
				links: oldLinks.length,
				code: oldF.code.length,
				tables: oldF.tables,
				listItems: oldF.listItems,
				paragraphs: oldF.paragraphs,
			},
			new: {
				headings: newF.headings.length,
				asides: newF.asides,
				images: newF.images.length,
				links: newLinks.length,
				code: newF.code.length,
				tables: newF.tables,
				listItems: newF.listItems,
				paragraphs: newF.paragraphs,
			},
		},
		words: {
			old: oldWords.length,
			new: newWords.length,
			dropped: [...new Set(droppedReal)],
			added: [...new Set(addedReal)].slice(0, 20),
		},
		leftovers,
		lint,
	};
	void titleH1;
	void detailsCount;
}

let idem: { ok: boolean; changed: string[] } | null = null;
if (idempotency) {
	const r = spawnSync(
		'bun',
		[
			join(ROOT, 'scripts/migration/convert.ts'),
			...args.filter((a) => a !== '--idempotency' && a !== '--json'),
			'--dry',
		],
		{ encoding: 'utf8' }
	);
	const changed = r.stdout
		.split('\n')
		.filter((l) => /^\s+(changed|new)\s/.test(l))
		.map((l) => l.trim());
	idem = { ok: r.status === 0 && changed.length === 0, changed };
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
	join(OUT_DIR, 'check.json'),
	JSON.stringify(
		{ generatedAt: new Date().toISOString(), idempotency: idem, routes: results },
		null,
		2
	) + '\n'
);

const failed = Object.entries(results).filter(([, r]) => !r.ok);
if (asJson) {
	console.log(JSON.stringify({ idempotency: idem, failed: Object.fromEntries(failed) }, null, 2));
} else {
	for (const [route, r] of Object.entries(results)) {
		console.log(`  ${r.ok ? 'ok  ' : 'LOSS'}  ${route}`);
		for (const p of r.problems) console.log(`          ! ${p}`);
	}
	if (idem)
		console.log(
			`\nidempotency: ${idem.ok ? 'ok' : `FAIL — convert --dry would change: ${idem.changed.join('; ')}`}`
		);
	console.log(
		`\nroutes: ${Object.keys(results).length}  ok ${Object.keys(results).length - failed.length}  loss ${failed.length}`
	);
	console.log('Report: _private/migration/check.json');
}
process.exit(failed.length || (idem && !idem.ok) ? 1 : 0);
