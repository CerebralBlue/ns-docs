/**
 * The pages a route must agree with — input to the consistency pass.
 *
 *   bun scripts/agentic/neighbours.ts <route> [--night <night-id>] [--json]
 *
 * Up to 6 neighbours, ranked: routes sharing a console area (map `console`) > pages linked
 * to/from this one in public/graph.json (`link` edges, both directions) > tree siblings (same
 * parent directory). Only routes that have a page on disk count. With --night the list is
 * also written to _private/agentic-v2/night/<id>/consistency/<route folder>/neighbours.json.
 *
 * Why not links alone: public/graph.json has 54 link edges for 168 pages — most pages link to
 * nothing yet, so shared screens and siblings carry the relationship.
 */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	DOCS_DIR,
	loadMap,
	parseArgs,
	readJson,
	ROOT,
	routeFolder,
	V2_DIR,
	writeJson,
} from './lib';

const args = parseArgs(process.argv.slice(2));
const route = args.positional[0];
if (!route) {
	console.error('Usage: bun scripts/agentic/neighbours.ts <route> [--night <id>] [--json]');
	process.exit(1);
}
const { map } = loadMap();
const hasPage = (r: string) => existsSync(join(DOCS_DIR, `${r}.md`));
const score = new Map<string, { score: number; why: string[] }>();
const bump = (r: string, n: number, why: string) => {
	if (r === route || !map.routes[r] || !hasPage(r)) return;
	const e = score.get(r) ?? { score: 0, why: [] };
	e.score += n;
	e.why.push(why);
	score.set(r, e);
};

// 1. shared console areas
const mine = new Set(map.routes[route]?.console ?? []);
for (const [r, info] of Object.entries(map.routes)) {
	const shared = (info.console ?? []).filter((a) => mine.has(a));
	if (shared.length) bump(r, 10 * shared.length, `shares ${shared.join(', ')}`);
}
// 2. graph link edges
const graph = readJson(join(ROOT, 'public/graph.json'));
for (const e of graph?.edges ?? []) {
	if (e.kind !== 'link') continue;
	if (e.source === route) bump(e.target, 5, 'linked from this page');
	if (e.target === route) bump(e.source, 5, 'links to this page');
}
// 3. tree siblings
const parent = route.includes('/') ? route.slice(0, route.lastIndexOf('/')) : '';
for (const r of Object.keys(map.routes)) {
	const p = r.includes('/') ? r.slice(0, r.lastIndexOf('/')) : '';
	if (p === parent) bump(r, 1, 'sibling');
}

const neighbours = [...score.entries()]
	.sort((a, b) => b[1].score - a[1].score || a[0].localeCompare(b[0]))
	.slice(0, 6)
	.map(([r, e]) => ({
		route: r,
		page: relative(ROOT, join(DOCS_DIR, `${r}.md`)),
		score: e.score,
		why: e.why,
	}));

const out = { route, page: relative(ROOT, join(DOCS_DIR, `${route}.md`)), neighbours };
const night = args.get('night');
if (night)
	writeJson(
		join(V2_DIR, 'night', night, 'consistency', routeFolder(route), 'neighbours.json'),
		out
	);
if (args.flags.has('json')) console.log(JSON.stringify(out));
else
	for (const n of neighbours)
		console.log(`  ${String(n.score).padStart(3)}  ${n.route.padEnd(52)} ${n.why.join(' · ')}`);
