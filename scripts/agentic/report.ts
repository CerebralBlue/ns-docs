/**
 * Stage 9 of /docs-verify: what happened to each route, and what Fabio should look at.
 *
 *   bun scripts/agentic/report.ts <run-id> [--json]
 *
 * Reads only the run ledger, run.log and denials.log. Prints one row per route (verdict
 * counts, gates, review, outcome), the browser audit (navigations, hosts, denials by agent),
 * the IA decisions, and the exact `git diff` command per changed page. Also written to
 * runs/<id>/section/report.md so the run is readable after the session is gone.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseArgs, readJson, ROOT, routeDir, runDir, writeJson } from './lib';

const args = parseArgs(process.argv.slice(2));
const runId = args.positional[0];
if (!runId) {
	console.error('Usage: bun scripts/agentic/report.ts <run-id> [--json]');
	process.exit(1);
}
const dir = runDir(runId);
const queue = readJson(join(dir, 'section/queue.json'));
if (!queue) {
	console.error(`no run ${runId}`);
	process.exit(1);
}
const routesFinal = readJson(join(dir, 'section/routes-final.json'));
const routes: string[] = routesFinal
	? routesFinal.routes.map((r: any) => (typeof r === 'string' ? r : r.route))
	: queue.routes.map((r: any) => r.route);
const ia = readJson(join(dir, 'section/ia.json'));
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
	const ver = readJson(join(rd, 'verdicts.json'));
	const gates = readJson(join(rd, 'gates.json'));
	const review = readJson(join(rd, 'review.json'));
	const write = readJson(join(rd, 'write.json'));
	const counts = { confirmed: 0, contradicted: 0, missing: 0, unverifiable: 0 };
	for (const v of ver?.verdicts ?? []) counts[v.verdict as keyof typeof counts]++;
	const failedGates = gates
		? Object.entries(gates.gates)
				.filter(([, g]: any) => g.status !== 'PASS')
				.map(([k, g]: any) => `${k}:${g.status}`)
		: [];
	let outcome = 'not verified';
	if (ver?.halt) outcome = `halted (${ver.halt})`;
	else if (ver && !write && !gates) outcome = 'verified';
	else if (write && !gates) outcome = 'written, not gated';
	else if (gates && !gates.ok) outcome = `parked: ${failedGates.join(' ')}`;
	else if (gates?.ok && review) outcome = review.verdict === 'ready' ? 'ready' : 'parked: review';
	else if (gates?.ok) outcome = 'gated, not reviewed';
	const page = `src/content/docs/${route}.md`;
	return {
		route,
		counts,
		navigations: ver?.navigations ?? null,
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
const cleanup = readJson(join(dir, 'section/cleanup.json'));
const created = routes.flatMap(
	(r) => readJson(join(routeDir(runId, r), 'runner.json'))?.created ?? []
);
const configChanged = routes.flatMap(
	(r) => readJson(join(routeDir(runId, r), 'runner.json'))?.configChanged ?? []
);
const denialsByAgent: Record<string, number> = {};
for (const d of denials)
	denialsByAgent[d.split('\t')[1]] = (denialsByAgent[d.split('\t')[1]] ?? 0) + 1;

const summary = {
	runId,
	prefix: queue.prefix,
	halted,
	routes: rows,
	browser: {
		navigations: navs.length,
		clicks: logLines.length - navs.length,
		hosts,
		denials: denialsByAgent,
	},
	ia: ia ? { decisions: ia.decisions ?? ia } : null,
	playground: {
		probes: spendByTool,
		agentsCreated: created,
		agentsDeleted: cleanup?.deleted ?? [],
		leftovers: cleanup?.leftovers ?? created.filter((n) => !(cleanup?.deleted ?? []).includes(n)),
		configChanged,
		configRestored: cleanup?.configRestored ?? [],
	},
	structuralChanges: [...changed].filter((p) => !p.startsWith('src/content/docs/')),
};
writeJson(join(dir, 'section/report.json'), summary);

const md = [
	`# Run ${runId} — ${queue.prefix}`,
	'',
	halted ? `**HALTED:** ${halted}\n` : '',
	'| route | ✓ | ✗ | + | ? | nav | gates | review | outcome |',
	'|---|---|---|---|---|---|---|---|---|',
	...rows.map(
		(r) =>
			`| ${r.route} | ${r.counts.confirmed} | ${r.counts.contradicted} | ${r.counts.missing} | ${r.counts.unverifiable} | ${r.navigations ?? ''} | ${r.gates.length ? r.gates.join(' ') : r.outcome.startsWith('parked') || r.outcome === 'ready' ? 'PASS' : ''} | ${r.review ?? ''}${r.findings != null ? ` (${r.findings})` : ''} | ${r.outcome} |`
	),
	'',
	`Browser: ${navs.length} navigations, ${logLines.length - navs.length} clicks/hovers, hosts: ${hosts.join(', ') || 'none'}. Denials: ${
		denials.length
			? Object.entries(denialsByAgent)
					.map(([a, n]) => `${a} ${n}`)
					.join(', ')
			: 'none'
	}.`,
	'',
	ia
		? `IA decisions: ${JSON.stringify(ia.decisions ?? ia).slice(0, 400)}`
		: 'IA: no decisions recorded.',
	'',
	`Playground: ${
		Object.entries(spendByTool)
			.map(([t, n]) => `${t} ×${n}`)
			.join(', ') || 'no probes'
	}. Agents created: ${created.length ? created.join(', ') : 'none'}; deleted: ${(cleanup?.deleted ?? []).length}; **leftovers: ${summary.playground.leftovers.length ? summary.playground.leftovers.join(', ') : 'none'}**. Config branches changed: ${configChanged.length ? configChanged.join(', ') : 'none'}${configChanged.length ? `; restored: ${(cleanup?.configRestored ?? []).join(', ') || 'NOT CONFIRMED'}` : ''}.`,
	'',
	'## Review the diff',
	'',
	...rows.filter((r) => r.diff).map((r) => `- \`${r.diff}\``),
	...summary.structuralChanges.map((p) => `- \`git diff -- ${p}\`  (structural)`),
	'',
	'Nothing was committed. `status` was set to `auto` on written routes; `adopted` is yours to set. The playground should be as it was found — check the leftovers line.',
	'',
].join('\n');
require('node:fs').writeFileSync(join(dir, 'section/report.md'), md);

if (args.flags.has('json')) console.log(JSON.stringify(summary));
else {
	console.log(md);
	console.log(`(also at ${relative(ROOT, join(dir, 'section/report.md'))})`);
}
