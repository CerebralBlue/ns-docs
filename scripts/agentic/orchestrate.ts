/**
 * The orchestrator's decisions, bounded by code (agentic v3.3).
 *
 *   bun scripts/agentic/orchestrate.ts decide <run> <stage> --decision '<json>' [--json]
 *       validates a checkpoint decision {verdict, decision, agent?, routes?, hint?, reason?,
 *       backlog?} against the vocabulary and the retry budget, appends it to R/decisions.jsonl
 *       (as taken, or as overridden with the reason), and prints what the script must do:
 *       { do: continue|retry|skip|halt, agent, routes, hint, attempt, overridden? }
 *   bun scripts/agentic/orchestrate.ts subtasks <run> --validate [--json]
 *       R/subtasks.json → normalised: ≤ LIMITS.subtasksPerRun, kinds in SUBTASK_KINDS, routes
 *       queued or briefed in the capture, a page never fixed twice, probes within limits
 *   bun scripts/agentic/orchestrate.ts budget <run> [--json]
 *       retries used per (agent, stage) and per run, subtasks used
 *
 * Budget (LIMITS): 1 retry per agent per stage, 3 per run, the explorer once and only in
 * explore mode; 5 subtasks per run; 1 extra fix pass per page beyond the loop. A decision
 * the budget refuses is recorded as `overridden` and executed as `continue` (or `skip` for a
 * failed writer) — the run never stalls on the orchestrator.
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	captureDir,
	DECISIONS,
	LIMITS,
	parseArgs,
	readJson,
	routeDir,
	routeFolder,
	runDir,
	SUBTASK_KINDS,
	writeJson,
} from './lib';

type Decision = {
	stage: string;
	verdict?: 'ok' | 'degraded' | 'failed';
	decision: (typeof DECISIONS)[number];
	agent?: string;
	routes?: string[];
	hint?: string;
	reason?: string;
	backlog?: { target: string; what: string }[];
};

export function readDecisions(
	runId: string
): (Decision & { at: string; taken: string; overridden?: string; attempt?: number })[] {
	const p = join(runDir(runId), 'decisions.jsonl');
	if (!existsSync(p)) return [];
	return readFileSync(p, 'utf8')
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((l) => JSON.parse(l));
}

export function budget(runId: string) {
	const taken = readDecisions(runId).filter((d) => d.taken === 'retry');
	const perAgentStage: Record<string, number> = {};
	for (const d of taken)
		perAgentStage[`${d.agent}@${d.stage}`] = (perAgentStage[`${d.agent}@${d.stage}`] ?? 0) + 1;
	const explorer = taken.filter((d) => d.agent === 'explorer').length;
	const subtasks = (readJson<any>(join(runDir(runId), 'subtasks.normalised.json'))?.subtasks ?? [])
		.length;
	return {
		retriesUsed: taken.length,
		perAgentStage,
		explorerRetries: explorer,
		subtasks,
		limits: LIMITS,
	};
}

export function decide(runId: string, stage: string, d: Decision) {
	const area = readJson<any>(join(runDir(runId), 'area.json'));
	const b = budget(runId);
	const out: any = {
		stage,
		verdict: d.verdict ?? 'ok',
		decision: d.decision,
		agent: d.agent,
		routes: d.routes ?? [],
		hint: d.hint ?? '',
		reason: d.reason ?? '',
		backlog: d.backlog ?? [],
	};
	let taken: string = d.decision;
	let overridden: string | undefined;
	if (!DECISIONS.includes(d.decision as any)) {
		overridden = `unknown decision '${d.decision}' → continue`;
		taken = 'continue';
	}
	if (taken === 'retry') {
		const agent = d.agent ?? '';
		const key = `${agent}@${stage}`;
		if (!agent) {
			overridden = 'retry without an agent → continue';
			taken = 'continue';
		} else if (agent === 'explorer' && area?.mode === 'write-only') {
			overridden = 'the explorer never runs in write-only mode → continue';
			taken = 'continue';
		} else if (agent === 'explorer' && b.explorerRetries >= LIMITS.explorerRetries) {
			overridden = `explorer retry budget (${LIMITS.explorerRetries}) spent → continue`;
			taken = 'continue';
		} else if ((b.perAgentStage[key] ?? 0) >= LIMITS.retriesPerAgentStage) {
			overridden = `retry budget for ${key} (${LIMITS.retriesPerAgentStage}) spent → ${stage === 'write' ? 'skip' : 'continue'}`;
			taken = stage === 'write' ? 'skip' : 'continue';
		} else if (b.retriesUsed >= LIMITS.retriesPerRun) {
			overridden = `run retry budget (${LIMITS.retriesPerRun}) spent → ${stage === 'write' ? 'skip' : 'continue'}`;
			taken = stage === 'write' ? 'skip' : 'continue';
		}
	}
	if (taken === 'halt' && !d.reason) {
		overridden = 'halt needs a reason → continue (degraded)';
		taken = 'continue';
		out.verdict = 'degraded';
	}
	const attempt = taken === 'retry' ? (b.perAgentStage[`${d.agent}@${stage}`] ?? 0) + 2 : undefined;
	const line = { ...out, at: new Date().toISOString(), taken, overridden, attempt };
	appendFileSync(join(runDir(runId), 'decisions.jsonl'), JSON.stringify(line) + '\n');
	return {
		do: taken,
		agent: d.agent,
		routes: d.routes ?? [],
		hint: d.hint ?? '',
		attempt,
		overridden,
		verdict: out.verdict,
	};
}

export function validateSubtasks(runId: string) {
	const R = runDir(runId);
	const area = readJson<any>(join(R, 'area.json'));
	const C = captureDir(runId);
	const raw = readJson<any>(join(R, 'subtasks.json'));
	const list: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.subtasks) ? raw.subtasks : [];
	const queued = new Set<string>((area?.routes ?? []).map((r: any) => r.route));
	const briefed = (r: string) => existsSync(join(C, 'briefs', routeFolder(r), 'brief.md'));
	const dropped: string[] = [];
	const fixed = new Set<string>();
	// pages already fixed by the loop this run cannot be fixed again
	for (const r of queued) {
		const rev = readJson<any>(join(routeDir(runId, r), 'review.json'));
		const wr = readJson<any>(join(routeDir(runId, r), 'write.json'));
		if (rev?.resolved || (wr?.fixed ?? 0) > 0) fixed.add(r);
	}
	const seenKey = new Set<string>();
	const subtasks: any[] = [];
	for (const s of list) {
		if (subtasks.length >= LIMITS.subtasksPerRun) {
			dropped.push(
				`${s?.kind ?? '?'} ${s?.route ?? ''}: over the ${LIMITS.subtasksPerRun}-subtask limit`
			);
			continue;
		}
		if (!SUBTASK_KINDS.includes(s?.kind)) {
			dropped.push(`${s?.kind ?? '?'}: not a subtask kind (${SUBTASK_KINDS.join('|')})`);
			continue;
		}
		if (s.kind === 'fix-page' || s.kind === 'rebrief') {
			if (seenKey.has(`${s.kind}|${s.route}`)) {
				dropped.push(`${s.kind} ${s.route}: duplicate`);
				continue;
			}
			seenKey.add(`${s.kind}|${s.route}`);
			if (!s.route || (!queued.has(s.route) && !briefed(s.route))) {
				dropped.push(`${s.kind} ${s.route ?? '?'}: not queued and not briefed in this capture`);
				continue;
			}
			if (s.kind === 'fix-page' && fixed.has(s.route)) {
				dropped.push(`fix-page ${s.route}: already fixed once this run`);
				continue;
			}
			if (s.kind === 'fix-page') fixed.add(s.route);
			subtasks.push({
				kind: s.kind,
				route: s.route,
				backlog: (s.backlog ?? []).map(String),
				instructions: String(s.instructions ?? '').slice(0, 1500),
			});
		} else {
			const probes = (Array.isArray(s.probes) ? s.probes : [])
				.filter((p: any) => p && p.id && p.tool && typeof p.input === 'string')
				.map((p: any) => ({ ...p, input: String(p.input).slice(0, LIMITS.probeInputChars) }))
				.slice(0, LIMITS.probesPerArea);
			if (!probes.length) {
				dropped.push('probe subtask without valid probes');
				continue;
			}
			subtasks.push({ kind: 'probe', backlog: (s.backlog ?? []).map(String), probes });
		}
	}
	const out = { run: runId, subtasks, dropped };
	writeJson(join(R, 'subtasks.normalised.json'), out);
	return out;
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const verb = args.positional[0];
	const runId = args.positional[1];
	if (!verb || !runId) {
		console.error(
			'Usage: orchestrate.ts decide <run> <stage> --decision <json> | subtasks <run> --validate | budget <run>'
		);
		process.exit(1);
	}
	if (verb === 'decide') {
		const stage = args.positional[2];
		let d: Decision;
		try {
			d = JSON.parse(args.get('decision') ?? '');
		} catch {
			console.error('decide needs --decision <json>');
			process.exit(1);
		}
		const r = decide(runId, stage, d!);
		console.log(
			args.flags.has('json')
				? JSON.stringify(r)
				: `${stage}: ${r.do}${r.agent ? ` ${r.agent}` : ''}${r.overridden ? `  (overridden: ${r.overridden})` : ''}`
		);
		process.exit(0);
	}
	if (verb === 'subtasks') {
		const r = validateSubtasks(runId);
		console.log(
			args.flags.has('json')
				? JSON.stringify(r)
				: `${r.subtasks.length} subtask(s) kept, ${r.dropped.length} dropped${r.dropped.length ? ':\n  ' + r.dropped.join('\n  ') : ''}`
		);
		process.exit(0);
	}
	if (verb === 'budget') {
		console.log(JSON.stringify(budget(runId)));
		process.exit(0);
	}
	console.error('unknown verb');
	process.exit(1);
}
