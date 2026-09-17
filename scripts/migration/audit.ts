/**
 * Phase 1 of the verbatim migration: prove scripts/migration-map.json is sound before a
 * single page is converted. Read-only; no model.
 *
 *   bun scripts/migration/audit.ts [--source <old-docs dir>] [--offline] [--json]
 *
 * Checks, in order:
 *   coverage     every old .md is either a route source or on the kill list; every source exists
 *   shared       sources claimed by more than one route (expected: plans.md × 3)
 *   killed       what each killed page contained (words, headings, images, links) — for a human
 *   dialect      per-source counts of every MkDocs construct convert.ts must handle
 *   images       referenced vs orphan, missing targets, fullsize-images twins, bytes per route
 *   freshness    the live sitemap vs the map, via scripts/url-inventory.ts (skip with --offline)
 *   similarity   TF-IDF cosine between old pages and route descriptors:
 *                  (a) sourced routes whose best-matching old page is not one of their sources
 *                  (b) top-3 old pages for every route that claims to have no source
 *
 * Writes _private/migration/audit.json and audit-review.md (only the rows a human or a
 * read-only model pass must judge). Exit 1 on unmapped, missing, sourced∧killed or missing
 * image targets — never on similarity, which is a signal, not a verdict.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import {
	cosine,
	loadMap,
	OUT_DIR,
	rel,
	resolveSourceDir,
	ROOT,
	scanDialect,
	sourceToRoutes,
	splitFrontmatter,
	stripFences,
	TfIdf,
	tokenize,
	walkImages,
	walkMd,
	type Dialect,
	type Vec,
} from './lib';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const offline = args.includes('--offline');

const { map } = loadMap();
const SRC = resolveSourceDir(args, map);
const gitHead = spawnSync('git', ['-C', SRC, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
const sourceCommit = gitHead.status === 0 ? gitHead.stdout.trim() : null;

const oldFiles = walkMd(SRC).map((p) => rel(p, SRC));
const bySource = sourceToRoutes(map);
const killed = map.kill ?? {};

// ── coverage ──────────────────────────────────────────────────────────────────
const sourced = new Set(bySource.keys());
const coverage = {
	oldFiles: oldFiles.length,
	sourced: sourced.size,
	killed: Object.keys(killed).length,
	unmapped: oldFiles.filter((f) => !sourced.has(f) && !(f in killed)),
	missingOnDisk: [...sourced].filter((s) => !existsSync(join(SRC, s))),
	sourcedAndKilled: [...sourced].filter((s) => s in killed),
	killedNotOnDisk: Object.keys(killed).filter((k) => !existsSync(join(SRC, k))),
	// A sourced page with no body converts to nothing — the map should not claim it.
	emptySources: [...sourced].filter(
		(s) =>
			existsSync(join(SRC, s)) &&
			splitFrontmatter(readFileSync(join(SRC, s), 'utf8')).body.trim() === ''
	),
};

const sharedSources = Object.fromEntries([...bySource].filter(([, routes]) => routes.length > 1));

// ── killed pages: what dies ───────────────────────────────────────────────────
const killedDetail: Record<string, unknown> = {};
for (const [src, reason] of Object.entries(killed)) {
	const abs = join(SRC, src);
	if (!existsSync(abs)) continue;
	const { body } = splitFrontmatter(readFileSync(abs, 'utf8'));
	const prose = stripFences(body);
	killedDetail[src] = {
		reason,
		words: (prose.match(/\S+/g) ?? []).length,
		headings: (prose.match(/^#{1,6}\s+.*$/gm) ?? []).map((h) => h.trim()),
		images: (body.match(/!\[[^\]]*\]\([^)]+\)/g) ?? []).length,
		links: (body.match(/\]\((?!#)[^)]+\)/g) ?? []).length,
	};
}

// ── dialect + frontmatter, per source ─────────────────────────────────────────
type SourceInfo = Dialect & {
	routes: string[];
	hasFrontmatter: boolean;
	fmTitle: string | null;
	fmDescription: boolean;
	tags: boolean;
	words: number;
};
const dialect: Record<string, SourceInfo> = {};
const oldText: Record<string, { title: string; body: string; headings: string[] }> = {};
for (const f of oldFiles) {
	const raw = readFileSync(join(SRC, f), 'utf8');
	const { fm, hasFrontmatter, body } = splitFrontmatter(raw);
	const d = scanDialect(body);
	const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
	dialect[f] = {
		...d,
		routes: bySource.get(f) ?? [],
		hasFrontmatter,
		fmTitle: fm.title ?? null,
		fmDescription: !!fm.description,
		tags: !!fm.tags,
		words: (stripFences(body).match(/\S+/g) ?? []).length,
	};
	oldText[f] = {
		title: fm.title ?? h1 ?? basename(dirname(f)),
		body,
		headings: (stripFences(body).match(/^#{1,6}\s+.*$/gm) ?? []).map((h) => h.trim()),
	};
}
const dialectTotals = Object.values(dialect).reduce(
	(acc, d) => {
		for (const [k, v] of Object.entries(d)) if (typeof v === 'number') acc[k] = (acc[k] ?? 0) + v;
		return acc;
	},
	{} as Record<string, number>
);

// ── images ────────────────────────────────────────────────────────────────────
const allImages = walkImages(SRC).map((p) => rel(p, SRC));
const referenced = new Map<string, Set<string>>(); // image rel path -> sources referencing it
const missingTargets: { source: string; ref: string }[] = [];
const perRoute: Record<string, { count: number; bytes: number }> = {};
for (const f of oldFiles) {
	const body = oldText[f].body;
	const refs = [
		...[...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)].map((m) => m[1]),
		...[...body.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]),
	].filter((r) => !/^(https?:|\/|data:|#)/.test(r));
	for (const r of refs) {
		const abs = resolve(dirname(join(SRC, f)), r.split('#')[0].split('?')[0]);
		if (!existsSync(abs)) {
			missingTargets.push({ source: f, ref: r });
			continue;
		}
		const key = rel(abs, SRC);
		referenced.set(key, (referenced.get(key) ?? new Set()).add(f));
		for (const route of bySource.get(f) ?? []) {
			const pr = (perRoute[route] ??= { count: 0, bytes: 0 });
			pr.count++;
			pr.bytes += statSync(abs).size;
		}
	}
}
const fullsizeTwins: Record<string, unknown> = {};
for (const img of allImages) {
	if (!img.includes('fullsize-images/')) continue;
	const twin = img.replace('fullsize-images/', 'images/');
	if (allImages.includes(twin)) {
		const a = referenced.has(twin);
		const b = referenced.has(img);
		fullsizeTwins[basename(img)] = {
			images: twin,
			fullsize: img,
			referencedWhich: a && b ? 'both' : a ? 'images' : b ? 'fullsize' : 'none',
		};
	}
}
const images = {
	total: allImages.length,
	referenced: referenced.size,
	orphans: allImages.filter((i) => !referenced.has(i)),
	missingTargets,
	fullsizeTwins,
	perRoute,
};

// ── freshness: live sitemap vs map ────────────────────────────────────────────
let freshness: unknown = { skipped: true };
if (!offline) {
	const r = spawnSync('bun', [join(ROOT, 'scripts/url-inventory.ts'), '--json'], {
		encoding: 'utf8',
	});
	try {
		freshness = { ...JSON.parse(r.stdout), exit: r.status };
	} catch {
		freshness = { error: (r.stderr || r.stdout).trim(), exit: r.status };
	}
}

// ── similarity ────────────────────────────────────────────────────────────────
// An empty page's vector is just its title, which matches every route sharing that word
// (governance.md, 0 bytes, scored 0.6 against eight routes) — leave those out of the corpus.
const corpus = oldFiles.filter((f) => oldText[f].body.trim() !== '');
const tfidf = new TfIdf();
const docTokens: Record<string, string[]> = {};
for (const f of corpus) {
	docTokens[f] = tokenize(oldText[f].title + ' ' + stripFences(oldText[f].body));
	tfidf.add(docTokens[f]);
}
const docVec: Record<string, Vec> = {};
for (const f of corpus) docVec[f] = tfidf.vector(docTokens[f]);

const routeVec = (route: string) => {
	const r = map.routes[route];
	const text = [r.title, r.description ?? '', ...(r.gaps ?? []), route.replace(/[/-]/g, ' ')].join(
		' '
	);
	return tfidf.vector(tokenize(text));
};
const rank = (v: Vec) =>
	corpus
		.map((f) => ({ source: f, score: +cosine(v, docVec[f]).toFixed(3) }))
		.sort((a, b) => b.score - a.score);

const misassigned: {
	route: string;
	primary: string;
	ownScore: number;
	bestOther: { source: string; score: number };
}[] = [];
const noSourceCandidates: Record<string, { source: string; score: number; strong: boolean }[]> = {};
for (const [route, info] of Object.entries(map.routes)) {
	const ranked = rank(routeVec(route));
	if (info.sources.length) {
		const own = ranked.find((x) => x.source === info.sources[0]) ?? {
			source: info.sources[0],
			score: 0,
		};
		const bestOther = ranked.find((x) => !info.sources.includes(x.source) && !(x.source in killed));
		if (bestOther && bestOther.score - own.score > 0.05) {
			misassigned.push({ route, primary: info.sources[0], ownScore: own.score, bestOther });
		}
	} else {
		noSourceCandidates[route] = ranked
			.filter((x) => !(x.source in killed))
			.slice(0, 3)
			.map((x) => ({ ...x, strong: x.score >= 0.2 }));
	}
}

// ── write ─────────────────────────────────────────────────────────────────────
const audit = {
	generatedAt: new Date().toISOString(),
	sourceDir: SRC,
	sourceCommit,
	coverage,
	sharedSources,
	killed: killedDetail,
	dialectTotals,
	dialect,
	images,
	freshness,
	similarity: { misassigned, noSourceCandidates },
};
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'audit.json'), JSON.stringify(audit, null, 2) + '\n');

// audit-review.md: only what needs judgement.
const review: string[] = [
	'# Migration audit — rows that need a decision',
	'',
	`Generated ${audit.generatedAt} from ${relative(ROOT, SRC) || SRC}${sourceCommit ? ` @ ${sourceCommit.slice(0, 7)}` : ''}.`,
	'For each row answer `reassign | secondary | ignore` with one line of reasoning. Map edits are applied by hand.',
	'',
];
if (misassigned.length) {
	review.push('## (a) Sourced routes whose best-matching old page is a different one', '');
	for (const m of misassigned) {
		const r = map.routes[m.route];
		review.push(
			`### ${m.route}  (${r.action}, ${r.status})`,
			`- title: ${r.title}${r.description ? `\n- description: ${r.description}` : ''}`,
			r.gaps?.length ? `- gaps: ${r.gaps.join(' · ')}` : '',
			`- primary source: \`${m.primary}\` — score ${m.ownScore} — "${oldText[m.primary].title}"`,
			`- better match: \`${m.bestOther.source}\` — score ${m.bestOther.score} — "${oldText[m.bestOther.source].title}" (routes: ${(bySource.get(m.bestOther.source) ?? []).join(', ') || 'none'})`,
			`  headings: ${oldText[m.bestOther.source].headings.slice(0, 6).join(' | ')}`,
			''
		);
	}
}
const strong = Object.entries(noSourceCandidates).filter(([, c]) => c.some((x) => x.strong));
if (strong.length) {
	review.push('## (b) Routes with no source that strongly match an old page', '');
	for (const [route, cands] of strong) {
		const r = map.routes[route];
		review.push(
			`### ${route}  (${r.action}, ${r.status})`,
			`- title: ${r.title}${r.description ? `\n- description: ${r.description}` : ''}`,
			r.gaps?.length ? `- gaps: ${r.gaps.join(' · ')}` : ''
		);
		for (const c of cands.filter((x) => x.strong)) {
			review.push(
				`- \`${c.source}\` — score ${c.score} — "${oldText[c.source].title}" (already feeds: ${(bySource.get(c.source) ?? []).join(', ') || 'nothing'})`,
				`  headings: ${oldText[c.source].headings.slice(0, 6).join(' | ')}`
			);
		}
		review.push('');
	}
}
if (!misassigned.length && !strong.length)
	review.push('Nothing to judge — the map assignments look right.');
writeFileSync(
	join(OUT_DIR, 'audit-review.md'),
	review.filter((l) => l !== undefined).join('\n') + '\n'
);

// ── report ────────────────────────────────────────────────────────────────────
const blockers =
	coverage.unmapped.length +
	coverage.missingOnDisk.length +
	coverage.sourcedAndKilled.length +
	coverage.killedNotOnDisk.length +
	missingTargets.length;

if (asJson) {
	console.log(JSON.stringify({ ...audit, dialect: undefined }, null, 2));
} else {
	const f = freshness as {
		published?: number;
		broken?: unknown[];
		unclaimed?: unknown[];
		error?: string;
		skipped?: boolean;
	};
	console.log(`old docs        ${SRC}${sourceCommit ? ` @ ${sourceCommit.slice(0, 7)}` : ''}`);
	console.log(
		`coverage        ${coverage.oldFiles} files = ${coverage.sourced} sourced + ${coverage.killed} killed` +
			(coverage.unmapped.length
				? `  UNMAPPED ${coverage.unmapped.length}: ${coverage.unmapped.join(', ')}`
				: '') +
			(coverage.missingOnDisk.length ? `  MISSING ${coverage.missingOnDisk.join(', ')}` : '') +
			(coverage.sourcedAndKilled.length
				? `  SOURCED∧KILLED ${coverage.sourcedAndKilled.join(', ')}`
				: '') +
			(coverage.emptySources.length ? `  EMPTY ${coverage.emptySources.join(', ')}` : '')
	);
	console.log(
		`shared sources  ${Object.keys(sharedSources).length}` +
			Object.entries(sharedSources)
				.map(([s, r]) => `\n                  ${s} → ${r.join(', ')}`)
				.join('')
	);
	console.log(
		`killed          ${Object.keys(killedDetail).length}` +
			Object.entries(killedDetail)
				.map(
					([s, d]: [string, any]) =>
						`\n                  ${s}  ${d.words} words, ${d.headings.length} headings, ${d.images} images — ${d.reason}`
				)
				.join('')
	);
	console.log(
		`dialect         ` +
			Object.entries(dialectTotals)
				.filter(([, v]) => v)
				.map(([k, v]) => `${k} ${v}`)
				.join(' · ')
	);
	console.log(
		`images          ${images.total} on disk, ${images.referenced} referenced, ${images.orphans.length} orphans, ${missingTargets.length} missing targets, ${Object.keys(fullsizeTwins).length} fullsize twins`
	);
	console.log(
		`freshness       ` +
			(f.skipped
				? 'skipped (--offline)'
				: f.error
					? `ERROR ${f.error}`
					: `${f.published} live pages, ${f.broken?.length ?? 0} broken, ${f.unclaimed?.length ?? 0} unclaimed`)
	);
	console.log(
		`similarity      (a) ${misassigned.length} sourced routes match another page better · (b) ${strong.length}/${Object.keys(noSourceCandidates).length} no-source routes have a strong old-page match`
	);
	console.log(`\nwritten: _private/migration/audit.json, _private/migration/audit-review.md`);
	console.log(
		blockers
			? `\nBLOCKED — ${blockers} coverage/image problem(s) above.`
			: `\nMap is structurally sound.`
	);
}
process.exit(blockers ? 1 : 0);
