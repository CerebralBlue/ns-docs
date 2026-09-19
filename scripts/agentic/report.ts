/**
 * Last stage of /docs-explore (agentic v3): what happened to each route of one area run, and
 * what Fabio should look at.
 *
 *   bun scripts/agentic/report.ts <run-id> [--json]
 *
 * Reads only the run ledger, run.log and denials.log. Prints one row per route (coverage,
 * unconfirmed facts, images, FAQ, gates, review, outcome), the explore audit (states, images,
 * navigations, denials), the probes, the IA decisions, the reviewer's findings and the exact
 * `git diff` command per changed page. Also written to runs/<id>/report.md so the run is
 * readable after the session is gone.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { readdirSync } from 'node:fs';
import { captureDir, parseArgs, readJson, ROOT, routeDir, runDir, V2_DIR, writeJson } from './lib';

const args = parseArgs(process.argv.slice(2));
const runId = args.positional[0];
if (!runId) {
	console.error('Usage: bun scripts/agentic/report.ts <run-id> [--json]');
	process.exit(1);
}
const dir = runDir(runId);
const area = readJson(join(dir, 'area.json'));
if (!area) {
	console.error(`no run ${runId}`);
	process.exit(1);
}
const routesFinal = readJson(join(dir, 'routes-final.json'));
const routes: string[] = routesFinal
	? routesFinal.routes.map((r: any) => (typeof r === 'string' ? r : r.route))
	: area.routes.map((r: any) => r.route);
const RESERVED = new Set(['unowned', 'shared', 'notInCapture', 'emptyRoutes', 'conflicts']);
const C = captureDir(runId);
const captureRun = area.captureRun ?? runId;
const ia = readJson(join(dir, 'ia.json'));
const explore = readJson(join(C, 'explore-summary.json'));
const understand = readJson(join(dir, 'understand.json'));
const runner = readJson(join(dir, 'runner.json'));
const cleanup = readJson(join(dir, 'cleanup.json'));
const plan = readJson(join(C, 'coverage-plan.json'));
const states = readJson<Record<string, any>>(join(C, 'states.json')) ?? {};
const todos = readJson<any[]>(join(C, 'states-todo.json')) ?? [];
const imgDir = join(ROOT, 'public/img', area.area);
const imagesOnDisk = existsSync(imgDir)
	? readdirSync(imgDir).filter((f) => f.endsWith('.png')).length
	: 0;
const runStart = area.createdAt ? new Date(area.createdAt).getTime() : 0;
const halted = existsSync(join(dir, 'HALTED.md'))
	? readFileSync(join(dir, 'HALTED.md'), 'utf8').split('\n')[0]
	: null;

const changed = new Set(
	(
		spawnSync(
			'git',
			[
				'status',
				'--porcelain',
				'--',
				'src/content/docs',
				'public/img',
				'astro.config.mjs',
				'scripts/migration-map.json',
			],
			{ cwd: ROOT, encoding: 'utf8' }
		).stdout || ''
	)
		.split('\n')
		.filter(Boolean)
		.map((l) => l.slice(3))
);

const rows = routes.map((route) => {
	const rd = routeDir(runId, route);
	const brief = existsSync(join(C, 'briefs', route.replace(/\//g, '-'), 'brief.md'));
	const info = area.routes.find((r: any) => r.route === route);
	const gates = readJson(join(rd, 'gates.json'));
	const review = readJson(join(rd, 'review.json'));
	const write = readJson(join(rd, 'write.json'));
	const cov = gates?.gates?.coverage;
	const covText = cov?.detail?.[0]?.match(/(\d+)\/(\d+) controls named \((\d+)%\)/);
	const failedGates = gates
		? Object.entries(gates.gates)
				.filter(([, g]: any) => g.status !== 'PASS')
				.map(([k, g]: any) => `${k}:${g.status}`)
		: [];
	const page = `src/content/docs/${route}.md`;
	const pageChanged = changed.has(page);
	let outcome = 'no brief';
	if (halted) outcome = `halted (${halted})`;
	else if ((plan?.notInCapture ?? []).includes(route)) outcome = 'not in capture';
	else if (brief && !write && !gates)
		outcome = pageChanged ? 'written, not gated (no write.json)' : 'briefed, not written';
	else if (write && !gates) outcome = 'written, not gated';
	else if (gates && !gates.ok) outcome = `parked: ${failedGates.join(' ')}`;
	else if (gates?.ok && review) outcome = review.verdict === 'ready' ? 'ready' : 'ready, findings';
	else if (gates?.ok) outcome = 'gated, not reviewed';
	// images on the page, by kind
	const pageText = existsSync(join(ROOT, page)) ? readFileSync(join(ROOT, page), 'utf8') : '';
	const imgs = [...pageText.matchAll(/!\[[^\]]*\]\((\/img\/[^)\s]+)\)/g)].map((m) => m[1]);
	const imageKinds = {
		sections: imgs.filter((i) => /--(?!options-)[^/]+\.png$/.test(i)).length,
		options: imgs.filter((i) => /--options-[^/]+\.png$/.test(i)).length,
		panel: imgs.filter((i) => /-panel\.png$/.test(i)).length,
		viewport: imgs.filter((i) => /\/[^/]+\.png$/.test(i) && !/--|-panel/.test(i)).length,
		placeholders: imgs.filter((i) => i.endsWith('_placeholder.svg')).length,
	};
	const valuesGate = gates?.gates?.values;
	const unbacked = valuesGate?.detail?.[0]?.match(/^(\d+) unbacked/)?.[1];
	const sectionMiss = (gates?.gates?.['section-image']?.detail ?? []).filter((d: string) =>
		/no real image/.test(d)
	).length;
	const passes = review?.resolved ? 2 : 1;
	const fixed =
		write?.fixed ?? (review?.resolved ? review.resolved.filter((x: any) => x.resolved).length : 0);
	return {
		route,
		controls: Array.isArray(plan?.[route]) ? plan[route].length : null,
		coverage: covText ? `${covText[1]}/${covText[2]} (${covText[3]}%)` : (cov?.status ?? null),
		unconfirmed:
			write?.unconfirmed ??
			(gates?.gates?.facts?.detail?.[0]?.match(/^(\d+)/)?.[1]
				? Number(gates.gates.facts.detail[0].match(/^(\d+)/)[1])
				: null),
		images: imgs.length - imageKinds.placeholders,
		imageKinds,
		placeholders: imageKinds.placeholders,
		sectionsWithoutImage: sectionMiss,
		unbacked: unbacked != null ? Number(unbacked) : null,
		passes,
		fixed,
		faq: write?.faq ?? null,
		gates: failedGates,
		linkWarnings: (gates?.gates?.links?.detail ?? []).filter((d: string) =>
			d.includes('unwritten content')
		).length,
		review: review?.verdict ?? null,
		findings: review?.findings?.length ?? null,
		crossArea: !!info?.crossArea,
		outcome,
		changed: changed.has(page),
		diff: changed.has(page) ? `git diff -- ${page}` : null,
	};
});

const logLines = existsSync(join(dir, 'run.log'))
	? readFileSync(join(dir, 'run.log'), 'utf8').trim().split('\n').filter(Boolean)
	: [];
const byTool: Record<string, number> = {};
for (const l of logLines) {
	const t = (l.split('\t')[2] ?? '').replace(/^mcp__neuralseek-ui__browser_/, '');
	byTool[t] = (byTool[t] ?? 0) + 1;
}
const navs = logLines.filter((l) => l.includes('\tbrowser_navigate\t'));
const hosts = [
	...new Set(navs.map((l) => (l.split('\t')[3] ?? '').replace(/^[a-z]+:\/\//, '').split('/')[0])),
];
const denials = existsSync(join(dir, 'denials.log'))
	? readFileSync(join(dir, 'denials.log'), 'utf8').trim().split('\n').filter(Boolean)
	: [];
const spend = existsSync(join(dir, 'spend.log'))
	? readFileSync(join(dir, 'spend.log'), 'utf8').trim().split('\n').filter(Boolean)
	: [];
const spendByTool: Record<string, number> = {};
for (const l of spend) spendByTool[l.split('\t')[2]] = (spendByTool[l.split('\t')[2]] ?? 0) + 1;
const created: string[] = runner?.created ?? [];
const denialsByAgent: Record<string, number> = {};
for (const d of denials)
	denialsByAgent[d.split('\t')[1]] = (denialsByAgent[d.split('\t')[1]] ?? 0) + 1;
const findings = routes.flatMap((r) => {
	const rev = readJson(join(routeDir(runId, r), 'review.json'));
	return (rev?.findings ?? []).map((f: any) => ({
		route: r,
		...(typeof f === 'string' ? { what: f } : f),
	}));
});

// Changed pages, split: written by this run / stubs regenerated after the IA's gap edits /
// anything else already dirty in the tree (not this run's doing).
const writtenPages = new Set(
	rows.filter((r) => r.changed).map((r) => `src/content/docs/${r.route}.md`)
);
const changedPages = [...changed].filter((p) => p.startsWith('src/content/docs/'));
const { map: mapNow } = { map: readJson<any>(join(ROOT, 'scripts/migration-map.json')) };
const stubRoutes = new Set(
	Object.entries(mapNow?.routes ?? {})
		.filter(([, v]: any) => v.status === 'stub')
		.map(([k]) => k)
);
const regeneratedStubs = changedPages.filter(
	(p) =>
		!writtenPages.has(p) &&
		stubRoutes.has(p.replace(/^src\/content\/docs\//, '').replace(/\.md$/, ''))
);
const otherPages = changedPages.filter(
	(p) => !writtenPages.has(p) && !regeneratedStubs.includes(p)
);
const structural = [...changed].filter(
	(p) =>
		p === 'astro.config.mjs' ||
		p === 'scripts/migration-map.json' ||
		p.startsWith(`public/img/${area.area}/`)
);

const summary = {
	runId,
	captureRun,
	mode: area.mode ?? 'explore',
	area: area.area,
	kind: area.kind,
	halted,
	routes: rows,
	explore: {
		states: Object.keys(states).length,
		sections: Object.values(states).reduce(
			(n: number, st: any) => n + Object.keys(st.sections ?? {}).length,
			0
		),
		optionLists: Object.values(states).reduce(
			(n: number, st: any) => n + Object.keys(st.options ?? {}).length,
			0
		),
		optionListsWithValues: Object.values(states).reduce(
			(n: number, st: any) =>
				n + Object.values(st.options ?? {}).filter((o: any) => (o.values ?? []).length).length,
			0
		),
		images: imagesOnDisk,
		notOpened: [...todos.filter((t) => !t.done).map((t) => t.id), ...(explore?.excluded ?? [])],
		noChange: Object.values(states)
			.filter((s: any) => s.noChange)
			.map((s: any) => s.id),
		map: explore?.map?.status ?? null,
		navigations: navs.length,
		clicks: byTool.click ?? 0,
		keys: byTool.press_key ?? 0,
		hosts,
		denials: denialsByAgent,
	},
	coverage: plan
		? {
				routes: Object.keys(plan).filter((k) => Array.isArray(plan[k]) && !RESERVED.has(k)).length,
				owned: Object.entries(plan)
					.filter(([k, v]) => Array.isArray(v) && !RESERVED.has(k))
					.reduce((n: number, [, a]: any) => n + a.length, 0),
				unowned: plan.unowned ?? [],
				shared: Object.keys(plan.shared ?? {}).length,
				conflicts: plan.conflicts ?? [],
				notInCapture: plan.notInCapture ?? [],
				emptyRoutes: plan.emptyRoutes ?? [],
			}
		: null,
	proposed: (ia?.decisions ?? []).filter((d: any) => d.kind === 'propose'),
	changed: { written: [...writtenPages], regeneratedStubs, other: otherPages },
	understand: understand
		? {
				controls: understand.controls,
				emptyRoutes: understand.emptyRoutes ?? [],
				questions: understand.questions ?? [],
			}
		: null,
	unowned: plan?.unowned ?? [],
	probes: {
		planned: (readJson(join(dir, 'probes.json')) ?? []).length,
		run: runner?.probes ?? 0,
		byTool: spendByTool,
		results: runner?.results ?? [],
	},
	ia: ia ? { decisions: ia.decisions ?? ia, questions: ia.questions ?? [] } : null,
	playground: {
		agentsCreated: created,
		agentsDeleted: cleanup?.deleted ?? [],
		leftovers: cleanup?.leftovers ?? created.filter((n) => !(cleanup?.deleted ?? []).includes(n)),
		configRestored: cleanup?.configRestored ?? [],
		configNotRestored: cleanup?.configNotRestored ?? [],
	},
	findings,
	structuralChanges: structural,
};
writeJson(join(dir, 'report.json'), summary);
// index.json: route → the run that last wrote it (and the capture it was written from).
{
	const idx = readJson<Record<string, any>>(join(V2_DIR, 'index.json')) ?? {};
	for (const r of rows)
		if (existsSync(join(routeDir(runId, r.route), 'write.json')))
			idx[r.route] = { runId, captureRun, writtenAt: new Date().toISOString() };
	writeJson(join(V2_DIR, 'index.json'), idx);
}

const md = [
	`# Run ${runId} — area ${area.area}${area.kind === 'reference' ? ' (reference kind, no screen)' : ''}${captureRun !== runId ? ` · write-only from capture ${captureRun}` : ''}`,
	'',
	halted ? `**HALTED:** ${halted}\n` : '',
	'| route | controls | coverage | images (sect/opt/panel/view) | no-image sections | unbacked | unconfirmed | FAQ | gates | review | loop | outcome |',
	'|---|---|---|---|---|---|---|---|---|---|---|---|',
	...rows.map(
		(r) =>
			`| ${r.route}${r.crossArea ? ' (cross-area)' : ''} | ${r.controls ?? ''} | ${r.coverage ?? ''} | ${r.images}${r.placeholders ? ` (+${r.placeholders} pending)` : ''} (${r.imageKinds.sections}/${r.imageKinds.options}/${r.imageKinds.panel}/${r.imageKinds.viewport}) | ${r.sectionsWithoutImage} | ${r.unbacked ?? ''} | ${r.unconfirmed ?? ''} | ${r.faq ?? ''} | ${r.gates.length ? r.gates.join(' ') : r.outcome.startsWith('ready') ? 'PASS' : ''}${r.linkWarnings ? ` (${r.linkWarnings} link warn)` : ''} | ${r.review ?? ''}${r.findings != null ? ` (${r.findings})` : ''} | ${r.passes}${r.fixed ? ` (fixed ${r.fixed})` : ''} | ${r.outcome} |`
	),
	'',
	`Explore${captureRun !== runId ? ` (capture ${captureRun})` : ''}: ${summary.explore.states} states (${summary.explore.noChange.length} with no visible change), ${summary.explore.sections} section crops, ${summary.explore.optionLists} option lists (${summary.explore.optionListsWithValues} with a11y values), ${summary.explore.images} images on disk, map ${summary.explore.map ?? 'not rebuilt'}; ${navs.length} navigations, ${summary.explore.clicks} clicks, ${summary.explore.keys} key presses; hosts: ${hosts.join(', ') || 'none'}. Not opened: ${summary.explore.notOpened.length ? summary.explore.notOpened.join(', ') : 'none'}. Denials: ${
		denials.length
			? Object.entries(denialsByAgent)
					.map(([a, n]) => `${a} ${n}`)
					.join(', ')
			: 'none'
	}.`,
	'',
	`Coverage plan (after IA): ${summary.coverage ? `${summary.coverage.owned} controls on ${summary.coverage.routes} routes, ${summary.coverage.shared} shared, ${summary.coverage.unowned.length} unowned${summary.coverage.unowned.length ? ` (${summary.coverage.unowned.join(', ')})` : ''}, ${summary.coverage.conflicts.length} conflict(s); not in capture: ${summary.coverage.notInCapture.join(', ') || 'none'}; empty routes: ${summary.coverage.emptyRoutes.join(', ') || 'none'}` : 'no coverage-plan.json'}.`,
	'',
	`Probes: ${summary.probes.run}/${summary.probes.planned} run (${
		Object.entries(spendByTool)
			.map(([t, n]) => `${t} ×${n}`)
			.join(', ') || 'none'
	}). Agents created: ${created.length ? created.join(', ') : 'none'}; deleted: ${(cleanup?.deleted ?? []).length}; **leftovers: ${summary.playground.leftovers.length ? summary.playground.leftovers.join(', ') : 'none'}**.${summary.playground.configNotRestored.length ? ` **Config NOT restored: ${summary.playground.configNotRestored.join(', ')}**` : ''}`,
	'',
	ia
		? `IA decisions: ${JSON.stringify(ia.decisions ?? ia).slice(0, 600)}`
		: 'IA: not needed (nothing unowned).',
	...(understand?.questions?.length || ia?.questions?.length
		? [
				'',
				'## Questions',
				'',
				...[...(understand?.questions ?? []), ...(ia?.questions ?? [])].map(
					(q: string) => `- ${q}`
				),
			]
		: []),
	...(findings.length
		? [
				'',
				'## Reviewer findings',
				'',
				...findings.map(
					(f: any) =>
						`- **${f.route}**${f.line ? `:${f.line}` : ''} [${f.kind ?? 'finding'}] ${f.what ?? ''}${f.evidence ? ` — ${f.evidence}` : ''}`
				),
			]
		: []),
	'',
	'## Review the diff',
	'',
	...rows.filter((r) => r.diff).map((r) => `- \`${r.diff}\``),
	...(regeneratedStubs.length
		? [
				'',
				`Stubs regenerated by \`bun run stubs\` after the IA's gap edits (${regeneratedStubs.length}):`,
				...regeneratedStubs.map((p) => `- \`git diff -- ${p}\``),
			]
		: []),
	...(otherPages.length
		? [
				'',
				`Already dirty before this run, not its doing (${otherPages.length}):`,
				...otherPages.map((p) => `- \`${p}\``),
			]
		: []),
	'',
	...summary.structuralChanges.map((p) => `- \`git diff -- ${p}\`  (structural)`),
	'',
	'Nothing was committed. `status` was set to `auto` on written routes; `adopted` is yours to set. The playground should be as it was found — check the leftovers line.',
	'',
].join('\n');
writeFileSync(join(dir, 'report.md'), md);

if (args.flags.has('json')) console.log(JSON.stringify(summary));
else {
	console.log(md);
	console.log(`(also at ${relative(ROOT, join(dir, 'report.md'))})`);
}
