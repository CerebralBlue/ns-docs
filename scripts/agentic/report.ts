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
import { parseArgs, readJson, ROOT, routeDir, runDir, writeJson } from './lib';

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
const ia = readJson(join(dir, 'ia.json'));
const explore = readJson(join(dir, 'explore-summary.json'));
const understand = readJson(join(dir, 'understand.json'));
const runner = readJson(join(dir, 'runner.json'));
const cleanup = readJson(join(dir, 'cleanup.json'));
const plan = readJson(join(dir, 'coverage-plan.json'));
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
	const brief = existsSync(join(rd, 'brief.md'));
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
	let outcome = 'no brief';
	if (halted) outcome = `halted (${halted})`;
	else if (brief && !write && !gates) outcome = 'briefed, not written';
	else if (write && !gates) outcome = 'written, not gated';
	else if (gates && !gates.ok) outcome = `parked: ${failedGates.join(' ')}`;
	else if (gates?.ok && review) outcome = review.verdict === 'ready' ? 'ready' : 'ready, findings';
	else if (gates?.ok) outcome = 'gated, not reviewed';
	const page = `src/content/docs/${route}.md`;
	return {
		route,
		controls: Array.isArray(plan?.[route]) ? plan[route].length : null,
		coverage: covText ? `${covText[1]}/${covText[2]} (${covText[3]}%)` : (cov?.status ?? null),
		unconfirmed:
			write?.unconfirmed ??
			(gates?.gates?.facts?.detail?.[0]?.match(/^(\d+)/)?.[1]
				? Number(gates.gates.facts.detail[0].match(/^(\d+)/)[1])
				: null),
		images: write?.images?.length ?? null,
		placeholders: write?.placeholders ?? null,
		faq: write?.faq ?? null,
		gates: failedGates,
		review: review?.verdict ?? null,
		findings: review?.findings?.length ?? null,
		outcome,
		changed: changed.has(page),
		diff: changed.has(page) ? `git diff -- ${page}` : null,
	};
});

const logLines = existsSync(join(dir, 'run.log'))
	? readFileSync(join(dir, 'run.log'), 'utf8').trim().split('\n').filter(Boolean)
	: [];
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

const summary = {
	runId,
	area: area.area,
	kind: area.kind,
	halted,
	routes: rows,
	explore: {
		states: explore?.states ?? Object.keys(readJson(join(dir, 'states.json')) ?? {}).length,
		images: explore?.images ?? null,
		notOpened: explore?.pendingTodos ?? [],
		map: explore?.map?.status ?? null,
		navigations: navs.length,
		clicks: logLines.length - navs.length,
		hosts,
		denials: denialsByAgent,
	},
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
	structuralChanges: [...changed].filter((p) => !p.startsWith('src/content/docs/')),
};
writeJson(join(dir, 'report.json'), summary);

const md = [
	`# Run ${runId} — area ${area.area}${area.kind === 'reference' ? ' (reference kind, no screen)' : ''}`,
	'',
	halted ? `**HALTED:** ${halted}\n` : '',
	'| route | controls | coverage | unconfirmed | images | FAQ | gates | review | outcome |',
	'|---|---|---|---|---|---|---|---|---|',
	...rows.map(
		(r) =>
			`| ${r.route} | ${r.controls ?? ''} | ${r.coverage ?? ''} | ${r.unconfirmed ?? ''} | ${r.images ?? ''}${r.placeholders ? ` (+${r.placeholders} pending)` : ''} | ${r.faq ?? ''} | ${r.gates.length ? r.gates.join(' ') : r.outcome.startsWith('ready') ? 'PASS' : ''} | ${r.review ?? ''}${r.findings != null ? ` (${r.findings})` : ''} | ${r.outcome} |`
	),
	'',
	`Explore: ${summary.explore.states} states, ${summary.explore.images ?? '?'} images, map ${summary.explore.map ?? 'not rebuilt'}; ${navs.length} navigations, ${logLines.length - navs.length} clicks; hosts: ${hosts.join(', ') || 'none'}. Not opened: ${summary.explore.notOpened.length ? summary.explore.notOpened.join(', ') : 'none'}. Denials: ${
		denials.length
			? Object.entries(denialsByAgent)
					.map(([a, n]) => `${a} ${n}`)
					.join(', ')
			: 'none'
	}.`,
	'',
	`Understand: ${understand ? `${understand.controls?.owned ?? '?'} controls owned, ${understand.controls?.unowned ?? '?'} unowned, ${understand.controls?.shared ?? '?'} shared; empty routes: ${(understand.emptyRoutes ?? []).join(', ') || 'none'}` : 'no understand.json'}. Unowned after IA: ${summary.unowned.length ? summary.unowned.join(', ') : 'none'}.`,
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
