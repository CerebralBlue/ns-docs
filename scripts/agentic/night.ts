/**
 * The overnight driver's state — one file, four verbs. The /docs-night skill calls these
 * between Workflow launches so nothing about the night lives in the model's memory.
 *
 *   bun scripts/agentic/night.ts plan [--areas a,b,…] [--json]          open a night
 *   bun scripts/agentic/night.ts next --json                            what to launch now
 *   bun scripts/agentic/night.ts record <area|consistency> --status done|halted|failed
 *        [--workflow <id>] [--ledger <run-id>] [--tokens <n>] [--result <json>]
 *   bun scripts/agentic/night.ts report                                 REPORT.md
 *
 * State: _private/agentic-v2/night/<night-id>/state.json (+ `current-night` pointer).
 * v3: one /docs-explore run per console AREA (areas.json), each writing the routes the area
 * owns (first `console` entry in the map), in ORDER — screens whose settings other pages cite
 * come first. `reference` (routes with no screen) runs last. `maistro/ntl/*` is excluded (the
 * NTL generator owns it). `next` is idempotent: an area already `running` is returned again.
 * The `sections` field name is kept in state.json so REPORT.md and the skill stay simple —
 * a "section" is an area.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadAreas, resolveArea } from './areas';
import { loadMap, parseArgs, readJson, ROOT, routeFolder, V2_DIR, writeJson } from './lib';

const ORDER = [
	'neural-config',
	'knowledge',
	'data-loader',
	'seek',
	'curate',
	'chat',
	'governance',
	'admin-tools',
	'extract',
	'maistro',
	'runagent',
	'home',
	'reference',
];
const args = parseArgs(process.argv.slice(2));
const verb = args.positional[0];
const NIGHT_DIR = join(V2_DIR, 'night');
const POINTER = join(NIGHT_DIR, 'current-night');
const nightId = () => (existsSync(POINTER) ? readFileSync(POINTER, 'utf8').trim() : '');
const statePath = (id: string) => join(NIGHT_DIR, id, 'state.json');
const asJson = args.flags.has('json');

type Section = {
	prefix: string; // the area name (field name kept from v2)
	routes: string[];
	kind: 'console' | 'reference';
	/** explore = capture + write the owned routes; write-only = the leftovers sweep from existing captures */
	mode?: 'explore' | 'write-only';
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
	const areas = loadAreas();
	const wanted =
		args
			.get('areas')
			?.split(',')
			.map((s) => s.trim())
			.filter(Boolean) ?? ORDER;
	const sections: Section[] = [];
	for (const area of wanted) {
		if (!areas[area] || areas[area].alias) continue;
		const routes = Object.entries(map.routes)
			.filter(([r]) => !r.startsWith('maistro/ntl/'))
			.filter(([, v]) => resolveArea(areas, (v.console ?? [])[0] ?? 'reference') === area)
			.map(([r]) => r);
		if (!routes.length) continue;
		sections.push({
			prefix: area,
			routes,
			kind: areas[area].kind,
			mode: 'explore',
			status: 'pending',
		});
	}
	// After every area is captured, one write-only sweep writes whatever still has no page: routes
	// another area's capture briefed (cross-area) or routes a run skipped. Its route list is
	// resolved when it is reached (`next`), from captures.json + index.json.
	sections.push({
		prefix: 'leftovers',
		routes: [],
		kind: 'console',
		mode: 'write-only',
		status: 'pending',
	});
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
				sections: sections.map((s) => ({ area: s.prefix, routes: s.routes.length, kind: s.kind })),
				routes: sections.reduce((n, s) => n + s.routes.length, 0),
			})
		);
	else {
		console.log(
			`night ${id} — ${sections.reduce((n, s) => n + s.routes.length, 0)} routes in ${sections.length} areas`
		);
		for (const s of sections)
			console.log(
				`  ${s.prefix.padEnd(16)} ${String(s.routes.length).padStart(3)} routes  ${s.kind}`
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
			if (pending.mode === 'write-only' && pending.prefix === 'leftovers') {
				// Resolve now: every briefed route in any capture with no v3-written page, one
				// write-only section per capture area (one Workflow each), replacing this placeholder.
				const index = readJson(join(V2_DIR, 'index.json')) ?? {};
				const { map } = loadMap();
				const captures = readJson<Record<string, any>>(join(V2_DIR, 'captures.json')) ?? {};
				const subs: Section[] = [];
				for (const [area, cap] of Object.entries(captures)) {
					const briefsDir = join(V2_DIR, 'runs', cap.runId, 'briefs');
					if (!existsSync(briefsDir)) continue;
					const routes = Object.keys(map.routes).filter(
						(r) => !index[r] && existsSync(join(briefsDir, routeFolder(r), 'brief.md'))
					);
					if (routes.length)
						subs.push({
							prefix: `leftovers:${area}`,
							routes,
							kind: 'console',
							mode: 'write-only',
							status: 'pending',
						});
				}
				const at = state.sections.indexOf(pending);
				if (!subs.length) {
					pending.status = 'done';
					pending.result = { note: 'nothing left to write from the captures' };
					pending.finishedAt = new Date().toISOString();
					save();
					// fall through to the consistency pass on the next call
					console.log(
						JSON.stringify({
							nightId: state.nightId,
							skipped: 'leftovers',
							reason: 'nothing left',
							callNextAgain: true,
						})
					);
					process.exit(0);
				}
				state.sections.splice(at, 1, ...subs);
				const first = subs[0];
				first.status = 'running';
				first.startedAt = new Date().toISOString();
				save();
				console.log(
					JSON.stringify({
						nightId: state.nightId,
						area: first.prefix.replace(/^leftovers:/, ''),
						section: first.prefix,
						mode: 'write-only',
						kind: first.kind,
						routes: first.routes,
						alreadyRunning: false,
						ledgerRunId: null,
						workflowRunId: null,
					})
				);
				process.exit(0);
			}
			save();
		}
		console.log(
			JSON.stringify({
				nightId: state.nightId,
				area: pending.prefix.replace(/^leftovers:/, ''),
				section: pending.prefix,
				mode: pending.mode ?? 'explore',
				kind: pending.kind,
				routes: pending.routes,
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
				captureRuns: Object.fromEntries(
					routes.map((r) => [r, index[r].captureRun ?? index[r].runId])
				),
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
			console.error(`unknown area ${what}`);
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
		`Started ${state.createdAt}. One /docs-explore run per area, in order; every change is an uncommitted diff.`,
		'',
	];
	let totalTokens = 0;
	const diffs: string[] = [];
	const questions: string[] = [];
	const findings: string[] = [];
	const proposed: string[] = [];
	const notInCapture: string[] = [];
	const leftovers: string[] = [];
	lines.push(
		'| area (mode) | routes | ready | parked | other | tokens | build | status |',
		'|---|---|---|---|---|---|---|---|'
	);
	for (const s of state.sections) {
		const rep = s.ledgerRunId ? readJson(join(V2_DIR, 'runs', s.ledgerRunId, 'report.json')) : null;
		const outcomes: string[] = rep?.routes?.map((r: any) => r.outcome) ?? [];
		const ready = outcomes.filter((o) => o.startsWith('ready')).length;
		const parked = outcomes.filter((o) => o.startsWith('parked')).length;
		const other = outcomes.length - ready - parked;
		totalTokens += s.tokens ?? 0;
		for (const r of rep?.routes ?? []) if (r.diff) diffs.push(r.diff);
		for (const p of rep?.structuralChanges ?? []) diffs.push(`git diff -- ${p}`);
		for (const l of rep?.playground?.leftovers ?? []) leftovers.push(`${s.prefix}: ${l}`);
		const ia = s.ledgerRunId ? readJson(join(V2_DIR, 'runs', s.ledgerRunId, 'ia.json')) : null;
		for (const q of ia?.questions ?? []) questions.push(`${s.prefix}: ${q}`);
		for (const q of rep?.understand?.questions ?? []) questions.push(`${s.prefix}: ${q}`);
		for (const p of rep?.proposed ?? [])
			proposed.push(
				`${s.prefix}: **${p.route}** — ${p.title ?? ''} (${(p.controls ?? []).join(', ')})`
			);
		for (const r of rep?.coverage?.notInCapture ?? []) notInCapture.push(`${s.prefix}: ${r}`);
		for (const f of rep?.findings ?? [])
			findings.push(
				`${f.route}${f.line ? `:${f.line}` : ''} [${f.kind ?? 'finding'}] ${f.what ?? ''}`
			);
		lines.push(
			`| ${s.prefix}${s.mode === 'write-only' ? ' (write-only)' : ''} | ${s.routes.length} | ${ready} | ${parked} | ${other} | ${s.tokens ? Math.round(s.tokens / 1000) + 'k' : ''} | ${s.result?.buildOk === undefined ? '' : s.result.buildOk ? 'green' : 'red'} | ${s.status}${s.status === 'halted' ? ` — resume: /docs-explore ${s.prefix} --resume ${s.workflowRunId} --run ${s.ledgerRunId}` : ''} |`
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
		lines.push('## Questions the agents raised', '', ...questions.map((q) => `- ${q}`), '');
	if (findings.length) lines.push('## Reviewer findings', '', ...findings.map((f) => `- ${f}`), '');
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
