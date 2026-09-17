/**
 * Compare a candidate component map with the cached one and, on --apply, promote it.
 *
 *   bun scripts/agentic/map-diff.ts <area> [--apply] [--json]
 *
 * `unchanged` = same structural hash (controls by region/role/name; counts, dates and refs are
 * ignored on purpose). `changed` lists added and removed controls so the map-agent — and the
 * report — can say what moved in the console since the last run. `new` = no cache yet.
 * The cache is only replaced with --apply; without it this is a read-only report.
 *
 * Exit 0 always (a diff is information, not a failure); the JSON carries `status`.
 */
import { existsSync, renameSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { COMPONENT_MAP_DIR, parseArgs, readJson, ROOT, writeJson } from './lib';

const args = parseArgs(process.argv.slice(2));
const area = args.positional[0];
if (!area) {
	console.error('Usage: bun scripts/agentic/map-diff.ts <area> [--apply] [--json]');
	process.exit(1);
}
const candPath = join(COMPONENT_MAP_DIR, '.candidates', `${area}.json`);
const cachePath = join(COMPONENT_MAP_DIR, `${area}.json`);
const cand = readJson(candPath);
if (!cand) {
	console.error(`no candidate for ${area} — run map-build.ts first (${relative(ROOT, candPath)})`);
	process.exit(1);
}
const cache = readJson(cachePath);

const keys = (m: any) =>
	new Set<string>(
		(m?.regions ?? []).flatMap((r: any) =>
			r.controls.map(
				(c: any) =>
					`${r.name} · ${c.role} "${c.name}"${c.columns ? ` [${c.columns.join(', ')}]` : ''}`
			)
		)
	);
const a = keys(cache);
const b = keys(cand);
const added = [...b].filter((k) => !a.has(k)).sort();
const removed = [...a].filter((k) => !b.has(k)).sort();
const status = !cache
	? 'new'
	: cache.structuralHash === cand.structuralHash
		? 'unchanged'
		: 'changed';

const result = {
	area,
	status,
	cachedAt: cache?.capturedAt ?? null,
	candidateAt: cand.capturedAt,
	hash: { cached: cache?.structuralHash ?? null, candidate: cand.structuralHash },
	added,
	removed,
	applied: false,
};

if (args.flags.has('apply') && status !== 'unchanged') {
	mkdirSync(join(COMPONENT_MAP_DIR, '.history'), { recursive: true });
	if (existsSync(cachePath)) {
		copyFileSync(
			cachePath,
			join(
				COMPONENT_MAP_DIR,
				'.history',
				`${area}.${(cache.capturedAt as string).replace(/[:.]/g, '-')}.json`
			)
		);
	}
	renameSync(candPath, cachePath);
	result.applied = true;
}
writeJson(join(COMPONENT_MAP_DIR, '.candidates', `${area}.diff.json`), result);

if (args.flags.has('json')) console.log(JSON.stringify(result));
else {
	console.log(
		`${area}: ${status}${result.applied ? ' → applied' : ''}  (cached ${result.hash.cached?.slice(0, 12) ?? '—'}, candidate ${result.hash.candidate.slice(0, 12)})`
	);
	if (added.length)
		console.log(
			`  + ${added.length} added\n    ${added.slice(0, 20).join('\n    ')}${added.length > 20 ? '\n    …' : ''}`
		);
	if (removed.length)
		console.log(
			`  − ${removed.length} removed\n    ${removed.slice(0, 20).join('\n    ')}${removed.length > 20 ? '\n    …' : ''}`
		);
}
