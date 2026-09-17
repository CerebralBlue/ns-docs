/**
 * Stage 0 of /docs-verify: open a run and write what every later stage keys on.
 *
 *   bun scripts/agentic/queue.ts <route-prefix> [--only <route>] [--run <id>] [--json]
 *
 * Writes, under _private/agentic-v2/runs/<run-id>/section/:
 *   queue.json     the routes in scope (map order) with title, status, sources, gaps, page +
 *                  previous-copy paths, and the sidebar group block from astro.config.mjs
 *   console.json   route → console areas, from each route's `console` field in the map;
 *                  routes without one get `console-proposals.json` entries for Fabio — an
 *                  agent never writes the field into the map
 * …and _private/agentic-v2/current-run = <run-id>, which the hooks read for their logs.
 *
 * The run id is the Workflow tool's run id when passed with --run (so the ledger and the
 * Workflow's own state share one name); otherwise a timestamp + prefix.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	CURRENT_RUN_FILE,
	DOCS_DIR,
	loadMap,
	parseArgs,
	ROOT,
	routeFolder,
	runDir,
	writeJson,
} from './lib';

const args = parseArgs(process.argv.slice(2));
const prefix = args.positional[0];
if (!prefix) {
	console.error(
		'Usage: bun scripts/agentic/queue.ts <route-prefix> [--only <route>] [--run <id>] [--json]'
	);
	process.exit(1);
}
const only = args.values.only ?? [];
const { map } = loadMap();

const routes = Object.entries(map.routes)
	.filter(([r]) => (prefix === '--all' ? true : r === prefix || r.startsWith(prefix)))
	.filter(([r]) => !only.length || only.includes(r))
	.map(([route, info]) => {
		const page = join(DOCS_DIR, `${route}.md`);
		const previous = join(ROOT, '_private/archive/verbatim-migration/previous', `${route}.md`);
		return {
			route,
			folder: routeFolder(route),
			title: info.title,
			status: info.status,
			action: info.action,
			sources: info.sources ?? [],
			gaps: info.gaps ?? [],
			console: info.console ?? [],
			page: existsSync(page) ? relative(ROOT, page) : null,
			previous: existsSync(previous) ? relative(ROOT, previous) : null,
		};
	});
if (!routes.length) {
	console.error(`no routes match ${prefix}${only.length ? ` --only ${only.join(',')}` : ''}`);
	process.exit(1);
}

// The sidebar group that holds these routes, quoted from astro.config.mjs as text.
const config = readFileSync(join(ROOT, 'astro.config.mjs'), 'utf8');
const slugs = new Set(routes.map((r) => r.route));
let sidebar: {
	label: string;
	startLine: number;
	endLine: number;
	items: { label: string; slug: string }[];
	text: string;
} | null = null;
{
	const lines = config.split('\n');
	// Find the innermost `{ label: '…', items: [` block whose items include one of our slugs.
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
		const items = [...block.matchAll(/\{\s*label:\s*'([^']*)',\s*slug:\s*'([^']*)'\s*\}/g)].map(
			(x) => ({ label: x[1], slug: x[2] })
		);
		if (
			items.some((it) => slugs.has(it.slug)) &&
			(!sidebar || items.length < sidebar.items.length)
		) {
			sidebar = { label: m[1], startLine: i, endLine: end + 2, items, text: block };
		}
	}
}

const runId =
	args.get('run') ??
	`${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}-${prefix.replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '')}`;
const dir = runDir(runId);
mkdirSync(join(dir, 'section'), { recursive: true });
for (const r of routes) mkdirSync(join(dir, r.folder, 'evidence'), { recursive: true });

const questionsFile = join(
	ROOT,
	'_private/archive',
	`${prefix.replace(/\/$/, '')}-migration-questions.md`
);
const queue = {
	runId,
	prefix,
	createdAt: new Date().toISOString(),
	routes,
	sidebar: sidebar
		? { label: sidebar.label, lines: [sidebar.startLine, sidebar.endLine], items: sidebar.items }
		: null,
	sidebarBlock: sidebar?.text ?? null,
	openQuestions: existsSync(questionsFile) ? relative(ROOT, questionsFile) : null,
	auditHints: existsSync(join(ROOT, '_private/archive/verbatim-migration/audit-review.md'))
		? '_private/archive/verbatim-migration/audit-review.md'
		: null,
	notInSidebar: routes
		.filter((r) => !sidebar?.items.some((it) => it.slug === r.route))
		.map((r) => r.route),
};
writeJson(join(dir, 'section/queue.json'), queue);

const consoleMap: Record<string, string[]> = {};
const proposals: Record<string, string[]> = {};
for (const r of routes) {
	if (r.console.length) consoleMap[r.route] = r.console;
	else {
		// Best guess for Fabio to confirm: the section's own console area. Never written to the map here.
		consoleMap[r.route] = [];
		proposals[r.route] = [prefix.replace(/\/$/, '').split('/').pop() ?? prefix];
	}
}
writeJson(join(dir, 'section/console.json'), {
	areas: [...new Set(Object.values(consoleMap).flat())],
	byRoute: consoleMap,
});
if (Object.keys(proposals).length)
	writeJson(join(dir, 'section/console-proposals.json'), proposals);
writeFileSync(CURRENT_RUN_FILE, runId + '\n');

if (args.flags.has('json'))
	console.log(
		JSON.stringify({
			runId,
			dir: relative(ROOT, dir),
			routes: routes.map((r) => r.route),
			areas: [...new Set(Object.values(consoleMap).flat())],
			proposals: Object.keys(proposals),
			sidebar: sidebar?.label ?? null,
			notInSidebar: queue.notInSidebar,
		})
	);
else {
	console.log(`run ${runId} → ${relative(ROOT, dir)}`);
	console.log(`routes (${routes.length}):`);
	for (const r of routes)
		console.log(
			`  ${r.status.padEnd(7)} ${r.route.padEnd(36)} console: ${r.console.join(', ') || '— (proposal written)'}${r.previous ? '  previous ✓' : ''}`
		);
	console.log(
		`sidebar group: ${sidebar ? `"${sidebar.label}" (${sidebar.items.length} items)` : 'NOT FOUND'}${queue.notInSidebar.length ? ` · not in sidebar: ${queue.notInSidebar.join(', ')}` : ''}`
	);
	if (queue.openQuestions) console.log(`open questions: ${queue.openQuestions}`);
}
