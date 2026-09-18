/**
 * The overnight driver's state — one file, four verbs. The /docs-night skill calls these
 * between Workflow launches so nothing about the night lives in the model's memory.
 *
 *   bun scripts/agentic/night.ts plan [--sections a/,b/,…] [--json]     open a night
 *   bun scripts/agentic/night.ts next --json                            what to launch now
 *   bun scripts/agentic/night.ts record <section|consistency> --status done|halted|failed
 *        [--workflow <id>] [--ledger <run-id>] [--tokens <n>] [--result <json>]
 *   bun scripts/agentic/night.ts report                                 REPORT.md
 *
 * State: _private/agentic-v2/night/<night-id>/state.json (+ `current-night` pointer).
 * Scope: every route with sources, except maistro/ntl/* (the NTL generator owns those), in
 * dependency order — evidence flows from Neural Config and KnowledgeBase screens into the
 * sections that cite them. `refreshMap` is set on the first section that touches each area.
 * `next` is idempotent: a section already `running` is returned again, never a second one.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	loadMap,
	parseArgs,
	readJson,
	ROOT,
	routeDir,
	routeFolder,
	V2_DIR,
	writeJson,
} from './lib';

const ORDER = [
	'configuration/',
	'knowledge/',
	'seek/',
	'governance/',
	'integrations/',
	'maistro/',
	'getting-started/',
	'reference/',
];
const args = parseArgs(process.argv.slice(2));
const verb = args.positional[0];
const NIGHT_DIR = join(V2_DIR, 'night');
const POINTER = join(NIGHT_DIR, 'current-night');
const nightId = () => (existsSync(POINTER) ? readFileSync(POINTER, 'utf8').trim() : '');
const statePath = (id: string) => join(NIGHT_DIR, id, 'state.json');
const asJson = args.flags.has('json');

type Section = {
	prefix: string;
	routes: string[];
	areas: string[];
	refreshMap: boolean;
	status: 'pending' | 'running' | 'done' | 'halted' | 'failed';
	ledgerRunId?: string;
	workflowRunId?: string;
	tokens?: number;
	result?: any;
	startedAt?: string;
	finishedAt?: string;
};
type State = {
	nightId: string;
	createdAt: string;
	sections: Section[];
	consistency: {
		status: 'pending' | 'running' | 'done' | 'failed';
		workflowRunId?: string;
		tokens?: number;
		result?: any;
	};
};

if (verb === 'plan') {
	const { map } = loadMap();
	const wanted =
		args
			.get('sections')
			?.split(',')
			.map((s) => s.trim())
			.filter(Boolean) ?? ORDER;
	const seen = new Set<string>();
	const sections: Section[] = [];
	for (const prefix of wanted) {
		const routes = Object.entries(map.routes)
			.filter(
				([r, v]) => r.startsWith(prefix) && v.sources?.length && !r.startsWith('maistro/ntl/')
			)
			.map(([r]) => r);
		if (!routes.length) continue;
		const areas = [...new Set(routes.flatMap((r) => map.routes[r].console ?? []))];
		const refreshMap = areas.some((a) => !seen.has(a));
		for (const a of areas) seen.add(a);
		sections.push({ prefix, routes, areas, refreshMap, status: 'pending' });
	}
	const id = `${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}-night`;
	const state: State = {
		nightId: id,
		createdAt: new Date().toISOString(),
		sections,
		consistency: { status: 'pending' },
	};
	writeJson(statePath(id), state);
	writeFileSync(POINTER, id + '\n');
	if (asJson)
		console.log(
			JSON.stringify({
				nightId: id,
				sections: sections.map((s) => ({
					prefix: s.prefix,
					routes: s.routes.length,
					refreshMap: s.refreshMap,
				})),
				routes: sections.reduce((n, s) => n + s.routes.length, 0),
			})
		);
	else {
		console.log(
			`night ${id} — ${sections.reduce((n, s) => n + s.routes.length, 0)} routes in ${sections.length} sections`
		);
		for (const s of sections)
			console.log(
				`  ${s.prefix.padEnd(18)} ${String(s.routes.length).padStart(2)} routes  areas: ${s.areas.join(', ')}${s.refreshMap ? '  (refresh map)' : ''}`
			);
	}
	process.exit(0);
}

const id = args.get('night') ?? nightId();
const state: State | null = id ? readJson(statePath(id)) : null;
if (!state) {
	console.error(
		verb
			? `no night in progress — run: bun scripts/agentic/night.ts plan`
			: 'Usage: night.ts plan | next | record | report'
	);
	process.exit(1);
}
const save = () => writeJson(statePath(state.nightId), state);

if (verb === 'next') {
	const running = state.sections.find((s) => s.status === 'running');
	const pending = running ?? state.sections.find((s) => s.status === 'pending');
	if (pending) {
		if (pending.status === 'pending') {
			pending.status = 'running';
			pending.startedAt = new Date().toISOString();
			save();
		}
		console.log(
			JSON.stringify({
				nightId: state.nightId,
				section: pending.prefix,
				routes: pending.routes,
				areas: pending.areas,
				refreshMap: pending.refreshMap,
				alreadyRunning: !!running,
				ledgerRunId: pending.ledgerRunId ?? null,
				workflowRunId: pending.workflowRunId ?? null,
			})
		);
	} else if (state.consistency.status === 'pending' || state.consistency.status === 'running') {
		const index = readJson(join(V2_DIR, 'index.json')) ?? {};
		const routes = state.sections
			.filter((s) => s.status === 'done' || s.status === 'halted')
			.flatMap((s) => s.routes)
			.filter((r) => index[r]);
		if (state.consistency.status === 'pending') {
			state.consistency.status = 'running';
			save();
		}
		console.log(
			JSON.stringify({
				nightId: state.nightId,
				consistency: true,
				routes,
				runIds: Object.fromEntries(routes.map((r) => [r, index[r].runId])),
				alreadyRunning: state.consistency.status === 'running' && !!state.consistency.workflowRunId,
			})
		);
	} else console.log(JSON.stringify({ nightId: state.nightId, done: true }));
	process.exit(0);
}

if (verb === 'record') {
	const what = args.positional[1];
	const status = args.get('status') as any;
	const tokens = Number(args.get('tokens') ?? 0) || undefined;
	let result: any = undefined;
	if (args.get('result')) {
		try {
			result = JSON.parse(args.get('result')!);
		} catch {
			result = { raw: args.get('result') };
		}
	}
	if (what === 'consistency') {
		Object.assign(state.consistency, {
			status: status ?? 'done',
			workflowRunId: args.get('workflow') ?? state.consistency.workflowRunId,
			tokens,
			result,
		});
	} else {
		const s = state.sections.find((x) => x.prefix === what);
		if (!s) {
			console.error(`unknown section ${what}`);
			process.exit(1);
		}
		if (args.get('workflow')) s.workflowRunId = args.get('workflow');
		if (args.get('ledger')) s.ledgerRunId = args.get('ledger');
		if (status) {
			s.status = status;
			s.finishedAt = new Date().toISOString();
		}
		if (tokens) s.tokens = tokens;
		if (result) s.result = result;
	}
	save();
	console.log(JSON.stringify({ nightId: state.nightId, recorded: what, status: status ?? null }));
	process.exit(0);
}

if (verb === 'report') {
	const lines: string[] = [
		`# Night ${state.nightId}`,
		'',
		`Started ${state.createdAt}. Sections in order; every change is an uncommitted diff.`,
		'',
	];
	let totalTokens = 0;
	const diffs: string[] = [];
	const questions: string[] = [];
	const leftovers: string[] = [];
	lines.push(
		'| section | routes | ready | parked | halted/other | tokens | build | status |',
		'|---|---|---|---|---|---|---|---|'
	);
	for (const s of state.sections) {
		const rep = s.ledgerRunId
			? readJson(join(V2_DIR, 'runs', s.ledgerRunId, 'section/report.json'))
			: null;
		const outcomes: string[] = rep?.routes?.map((r: any) => r.outcome) ?? [];
		const ready = outcomes.filter((o) => o === 'ready').length;
		const parked = outcomes.filter((o) => o.startsWith('parked')).length;
		const other = outcomes.length - ready - parked;
		totalTokens += s.tokens ?? 0;
		for (const r of rep?.routes ?? []) if (r.diff) diffs.push(r.diff);
		for (const p of rep?.structuralChanges ?? []) diffs.push(`git diff -- ${p}`);
		for (const l of rep?.playground?.leftovers ?? []) leftovers.push(`${s.prefix}: ${l}`);
		const ia = s.ledgerRunId
			? readJson(join(V2_DIR, 'runs', s.ledgerRunId, 'section/ia.json'))
			: null;
		for (const q of ia?.questions ?? []) questions.push(`${s.prefix} ${q}`);
		lines.push(
			`| ${s.prefix} | ${s.routes.length} | ${ready} | ${parked} | ${other} | ${s.tokens ? Math.round(s.tokens / 1000) + 'k' : ''} | ${s.result?.buildOk === undefined ? '' : s.result.buildOk ? 'green' : 'red'} | ${s.status}${s.status === 'halted' ? ` — resume: /docs-verify ${s.prefix} --resume ${s.workflowRunId} --run ${s.ledgerRunId}` : ''} |`
		);
	}
	lines.push(
		'',
		`Tokens (sections): ~${Math.round(totalTokens / 1000)}k${state.consistency.tokens ? ` · consistency ~${Math.round(state.consistency.tokens / 1000)}k` : ''}.`,
		''
	);
	// consistency findings
	lines.push(`## Consistency pass — ${state.consistency.status}`, '');
	const cdir = join(NIGHT_DIR, state.nightId, 'consistency');
	let found = 0;
	for (const s of state.sections)
		for (const r of s.routes) {
			const c = readJson(join(cdir, routeFolder(r), 'consistency.json'));
			if (!c) continue;
			const n =
				(c.contradictions?.length ?? 0) +
				(c.duplicates?.length ?? 0) +
				(c.missing_links?.length ?? 0);
			if (!n) continue;
			found++;
			lines.push(
				`- **${r}** — ${c.verdict}: ${c.contradictions?.length ?? 0} contradiction(s), ${c.duplicates?.length ?? 0} duplicate(s), ${c.missing_links?.length ?? 0} missing link(s)`
			);
			for (const x of c.contradictions ?? [])
				lines.push(
					`  - vs ${x.with} (${x.evidence_side}): "${String(x.ours).slice(0, 120)}" ↔ "${String(x.theirs).slice(0, 120)}"`
				);
		}
	if (!found) lines.push(state.consistency.status === 'done' ? '- nothing found' : '- not run yet');
	lines.push(
		'',
		'## Playground',
		'',
		leftovers.length
			? `**Leftovers:** ${leftovers.join(', ')}`
			: 'No leftovers reported by any section.',
		''
	);
	if (questions.length)
		lines.push('## Questions the IA agent raised', '', ...questions.map((q) => `- ${q}`), '');
	lines.push(
		'## Review the diff',
		'',
		...[...new Set(diffs)].map((d) => `- \`${d}\``),
		'',
		'Nothing was committed. `status` is `auto` on written routes; `adopted` is yours.',
		''
	);
	const out = join(NIGHT_DIR, state.nightId, 'REPORT.md');
	writeFileSync(out, lines.join('\n'));
	if (asJson)
		console.log(
			JSON.stringify({
				report: relative(ROOT, out),
				tokens: totalTokens,
				leftovers,
				questions: questions.length,
			})
		);
	else console.log(lines.join('\n'));
	process.exit(0);
}
console.error('Usage: night.ts plan | next | record | report');
process.exit(1);
