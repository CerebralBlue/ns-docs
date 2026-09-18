/**
 * Stage 0 of /docs-explore (agentic v3): open a run for ONE console area and write what every
 * later stage keys on.
 *
 *   bun scripts/agentic/queue.ts <area> [--only <route>]… [--run <id>] [--json]
 *       explore the area (new capture) and write the routes it OWNS (or --only)
 *   bun scripts/agentic/queue.ts <area> --write-only [--only <route>]… [--all-briefed]
 *       [--from <capture-run-id>] [--run <id>] [--json]
 *   bun scripts/agentic/queue.ts <area> --capture-only [--only <route>]… [--json]
 *       explore + brief the owned routes, write no pages (a capture for later --write-only runs)
 *   … --dry-run     print what would be queued; write nothing, touch current-run never
 *       no browser: write from the area's latest capture (captures.json) or --from. --only may
 *       name ANY non-NTL route — the capture decides, ownership only sets the night's default;
 *       such routes are marked crossArea. --all-briefed = every route with a brief in the
 *       capture and no write.json in any v3 run yet.
 *
 * The area comes from _private/agentic-v2/areas.json (url, navPath, entry). Owned routes are
 * map routes whose first `console` entry resolves to the area; the other areas a route names
 * are extra screens its writer may read (`alsoReads`). `reference` is the pseudo-area for
 * routes with `console: []`.
 *
 * Writes _private/agentic-v2/runs/<run-id>/area.json:
 *   { runId, captureRun, mode: explore|write-only, area, url, navPath, kind, entry, menu,
 *     routes[{route, folder, title, status, gaps, console, alsoReads, crossArea, page,
 *     previous}], sidebar, notInSidebar }
 * plus one folder per route, and _private/agentic-v2/current-run = <run-id> (the hooks log to it).
 * Refuses to run unless .neuralseekrc.json points the MCP at the playground.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadAreas, resolveArea } from './areas';
import {
	CURRENT_RUN_FILE,
	DOCS_DIR,
	loadCaptures,
	loadInstances,
	loadMap,
	parseArgs,
	rcInstance,
	readJson,
	ROOT,
	routeFolder,
	runDir,
	RUNS_DIR,
	writeJson,
} from './lib';
import { readdirSync } from 'node:fs';

const args = parseArgs(process.argv.slice(2));
const areaName = args.positional[0];
if (!areaName) {
	console.error(
		'Usage: bun scripts/agentic/queue.ts <area> [--only <route>]… [--run <id>] [--json]'
	);
	process.exit(1);
}
const areas = loadAreas();
const area = areas[areaName];
if (!area || area.alias) {
	console.error(
		`unknown area '${areaName}' — one of: ${Object.keys(areas)
			.filter((a) => !areas[a].alias)
			.join(', ')}`
	);
	process.exit(1);
}
const only = args.values.only ?? [];
const writeOnly = args.flags.has('write-only');
const captureOnly = args.flags.has('capture-only');
const dryRun = args.flags.has('dry-run');
const allBriefed = args.flags.has('all-briefed');
// The pipeline runs against the playground and nothing else — fail before any agent starts.
const inst = loadInstances();
const rc = rcInstance();
if (rc !== inst.playground) {
	console.error(
		`.neuralseekrc.json points the MCP at ${rc ?? 'nothing'}, not the playground ${inst.playground} — fix it before running`
	);
	process.exit(2);
}
const { map } = loadMap();

// Which capture a write-only run reads from: --from, else the area's latest in captures.json.
let captureRun: string | null = null;
if (writeOnly) {
	captureRun = args.get('from') ?? loadCaptures()[areaName]?.runId ?? null;
	if (!captureRun || !existsSync(join(RUNS_DIR, captureRun, 'states.json'))) {
		console.error(
			`no capture for ${areaName}${captureRun ? ` (${captureRun} has no states.json)` : ''} — run an explore first, or pass --from <run-id>`
		);
		process.exit(2);
	}
}
const captureBriefs = captureRun ? join(RUNS_DIR, captureRun, 'briefs') : null;
const hasBrief = (r: string) =>
	!!captureBriefs && existsSync(join(captureBriefs, routeFolder(r), 'brief.md'));
// Routes already written by a v3 run (a write.json in a run that has area.json).
const writtenByV3 = new Set<string>();
if (allBriefed && existsSync(RUNS_DIR))
	for (const id of readdirSync(RUNS_DIR)) {
		const a = readJson<any>(join(RUNS_DIR, id, 'area.json'));
		if (!a) continue;
		for (const r of a.routes ?? [])
			if (existsSync(join(RUNS_DIR, id, r.folder, 'write.json'))) writtenByV3.add(r.route);
	}

const routes = Object.entries(map.routes)
	.filter(([r]) => !r.startsWith('maistro/ntl/'))
	.map(([route, info]) => ({
		route,
		info,
		owners: (info.console ?? []).map((c) => resolveArea(areas, c)),
	}))
	.filter(({ route, owners }) => {
		const owned = (owners[0] ?? 'reference') === areaName;
		if (only.length) return only.includes(route) && (owned || writeOnly);
		if (allBriefed) return hasBrief(route) && !writtenByV3.has(route);
		return owned;
	})
	.map(({ route, info, owners }) => {
		const page = join(DOCS_DIR, `${route}.md`);
		const previous = join(ROOT, '_private/archive/verbatim-migration/previous', `${route}.md`);
		return {
			route,
			folder: routeFolder(route),
			title: info.title,
			status: info.status,
			description: info.description ?? '',
			gaps: info.gaps ?? [],
			console: info.console ?? [],
			alsoReads: [...new Set(owners.filter((o) => o !== areaName))],
			crossArea: (owners[0] ?? 'reference') !== areaName,
			briefed: hasBrief(route),
			page: existsSync(page) ? relative(ROOT, page) : null,
			previous: existsSync(previous) ? relative(ROOT, previous) : null,
		};
	});
if (!routes.length) {
	console.error(
		`no routes ${allBriefed ? 'briefed and unwritten in the capture' : `owned by ${areaName}`}${only.length ? ` --only ${only.join(',')}` : ''}${only.length && !writeOnly ? ' (a route another area owns needs --write-only)' : ''}`
	);
	process.exit(1);
}
const unknown = only.filter((r) => !map.routes[r]);
if (unknown.length) {
	console.error(`not in the map: ${unknown.join(', ')}`);
	process.exit(1);
}

// The sidebar groups that hold these routes, quoted from astro.config.mjs as text (the IA
// step edits them; the report attributes changes to this run).
const config = readFileSync(join(ROOT, 'astro.config.mjs'), 'utf8');
const slugs = new Set(routes.map((r) => r.route));
const sidebar: {
	label: string;
	lines: [number, number];
	items: { label: string; slug: string }[];
}[] = [];
{
	const lines = config.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const m = lines[i].match(/^\s*label:\s*'([^']*)',\s*$/);
		if (!m || !/^\s*items:\s*\[/.test(lines[i + 1] ?? '')) continue;
		let depth = 0;
		let end = -1;
		for (let j = i + 1; j < lines.length; j++) {
			depth += (lines[j].match(/\[/g) ?? []).length - (lines[j].match(/\]/g) ?? []).length;
			if (depth <= 0) {
				end = j;
				break;
			}
		}
		if (end < 0) continue;
		const block = lines.slice(i - 1, end + 2).join('\n');
		const items = [...block.matchAll(/\{\s*label:\s*'([^']*)',\s*slug:\s*'([^']*)',?\s*\}/g)].map(
			(x) => ({ label: x[1], slug: x[2] })
		);
		// innermost group only: skip a group that contains another matching group
		if (
			items.some((it) => slugs.has(it.slug)) &&
			!sidebar.some((s) => s.lines[0] > i && s.lines[1] < end)
		)
			sidebar.push({ label: m[1], lines: [i, end + 2], items });
	}
}
// Starlight's slug for `<dir>/index.md` is `<dir>`; the map keys it `<dir>/index`.
const inSidebar = new Set(
	sidebar.flatMap((s) => s.items.flatMap((it) => [it.slug, `${it.slug}/index`]))
);

const runId =
	args.get('run') ??
	`${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}-${areaName.replace(/[^a-z0-9]+/gi, '-')}`;
const dir = runDir(runId);
if (!dryRun && !writeOnly) mkdirSync(join(dir, 'states'), { recursive: true });
if (!dryRun) for (const r of routes) mkdirSync(join(dir, r.folder), { recursive: true });
const areaJson = {
	runId,
	captureRun: captureRun ?? runId,
	mode: writeOnly ? 'write-only' : captureOnly ? 'capture-only' : 'explore',
	area: areaName,
	url: area.url,
	navPath: area.navPath,
	kind: area.kind,
	entry: area.entry ?? null,
	menu: (area as any).menu ?? null,
	note: area.note ?? null,
	instance: { host: inst.host, id: inst.playground },
	createdAt: new Date().toISOString(),
	routes,
	sidebar,
	notInSidebar: routes.filter((r) => !inSidebar.has(r.route)).map((r) => r.route),
	imageDir: `public/img/${areaName}`,
};
if (!dryRun) {
	writeJson(join(dir, 'area.json'), areaJson);
	writeFileSync(CURRENT_RUN_FILE, runId + '\n');
}

if (args.flags.has('json'))
	console.log(
		JSON.stringify({
			runId,
			dryRun,
			dir: relative(ROOT, dir),
			captureRun: areaJson.captureRun,
			mode: areaJson.mode,
			area: areaName,
			kind: area.kind,
			url: area.url,
			routes: routes.map((r) => r.route),
			crossArea: routes.filter((r) => r.crossArea).map((r) => r.route),
			briefed: routes.filter((r) => r.briefed).map((r) => r.route),
			alsoReads: [...new Set(routes.flatMap((r) => r.alsoReads))],
			sidebar: sidebar.map((s) => s.label),
			notInSidebar: areaJson.notInSidebar,
		})
	);
else {
	console.log(
		`run ${runId} → ${relative(ROOT, dir)}  (${areaName} ${area.url ?? 'reference'}, ${routes.length} routes, ${areaJson.mode}${captureRun ? ` from ${captureRun}` : ''})`
	);
	for (const r of routes)
		console.log(
			`  ${r.status.padEnd(7)} ${r.route.padEnd(52)} ${r.crossArea ? 'cross-area ' : ''}${r.briefed ? 'briefed ' : ''}${r.alsoReads.length ? `also reads: ${r.alsoReads.join(', ')}` : ''}`
		);
	console.log(
		`sidebar groups: ${sidebar.map((s) => `"${s.label}"`).join(', ') || 'NONE'}${areaJson.notInSidebar.length ? ` · not in sidebar: ${areaJson.notInSidebar.join(', ')}` : ''}`
	);
}
