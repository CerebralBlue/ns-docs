/**
 * The planner's plan, validated against what the run may actually do (agentic v3.3).
 *
 *   bun scripts/agentic/plan.ts validate <run> [--json]
 *       R/plan.json (as the planner wrote it) → R/plan.normalised.json + fallbacks[]: every
 *       route outside area.json.routes ∪ routes briefed in the capture is dropped, an `added`
 *       route without a brief is dropped, a skip without a reason becomes a write, probes over
 *       the limits are trimmed, stage flags outside the vocabulary fall back to the default.
 *       Nothing invalid stops the run — the script uses the normalised plan and the report
 *       lists the fallbacks. No plan.json at all → { defaults: true }, v3.2 behaviour.
 *   bun scripts/agentic/plan.ts routes <run> [--json]
 *       the ordered route list the Write stage uses: plan order, minus skips, plus added
 */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	captureDir,
	LIMITS,
	parseArgs,
	readJson,
	ROOT,
	routeFolder,
	runDir,
	writeJson,
} from './lib';

export type PlanRoute = {
	route: string;
	order: number;
	action: 'write' | 'rewrite' | 'skip';
	reason?: string;
	mustCover?: string[];
	expectedImages?: string[];
};
export type Plan = {
	run: string;
	mode?: string;
	reasoning?: string;
	routes: PlanRoute[];
	added?: string[];
	capture?: { priorityStates?: string[]; requests?: string[] };
	probes?: { priority?: string[]; add?: any[] };
	stages?: Record<string, string>;
	checkpoints?: Record<string, string>;
	defaults?: boolean;
	fallbacks?: string[];
};

const STAGE_FLAGS: Record<string, string[]> = {
	explore: ['run', 'skip'],
	understand: ['run', 'skip'],
	probe: ['run', 'skip'],
	ia: ['auto', 'run', 'skip'],
};

export function validatePlan(runId: string): Plan {
	const dir = runDir(runId);
	const area = readJson<any>(join(dir, 'area.json'));
	if (!area) throw new Error(`no run ${runId}`);
	const raw = readJson<any>(join(dir, 'plan.json'));
	const queued: string[] = area.routes.map((r: any) => r.route);
	const C = captureDir(runId);
	const briefed = (r: string) => existsSync(join(C, 'briefs', routeFolder(r), 'brief.md'));
	const allowed = new Set(queued);
	const fallbacks: string[] = [];
	if (!raw) {
		const plan: Plan = {
			run: runId,
			mode: area.mode,
			routes: queued.map((route, i) => ({ route, order: i + 1, action: 'write' })),
			defaults: true,
			fallbacks: ['no plan.json — v3.2 defaults'],
		};
		writeJson(join(dir, 'plan.normalised.json'), plan);
		return plan;
	}
	// added routes: only ones briefed in this capture, only in write-only / explore modes
	const added: string[] = [];
	for (const r of raw.added ?? []) {
		if (typeof r !== 'string') continue;
		if (allowed.has(r)) continue;
		if (!briefed(r)) {
			fallbacks.push(`added ${r} dropped: no brief in capture ${relative(ROOT, C)}`);
			continue;
		}
		if (area.mode === 'capture-only') {
			fallbacks.push(`added ${r} dropped: capture-only run writes nothing`);
			continue;
		}
		added.push(r);
		allowed.add(r);
	}
	// routes: keep known ones, normalise action/order
	const seen = new Set<string>();
	const routes: PlanRoute[] = [];
	for (const pr of Array.isArray(raw.routes) ? raw.routes : []) {
		const route = typeof pr === 'string' ? pr : pr?.route;
		if (!route || !allowed.has(route)) {
			if (route)
				fallbacks.push(`route ${route} dropped: not queued and not briefed in this capture`);
			continue;
		}
		if (seen.has(route)) continue;
		seen.add(route);
		let action: PlanRoute['action'] = ['write', 'rewrite', 'skip'].includes(pr.action)
			? pr.action
			: 'write';
		if (action === 'skip' && !pr.reason) {
			fallbacks.push(`skip ${route} without a reason → write`);
			action = 'write';
		}
		routes.push({
			route,
			order: Number(pr.order) || routes.length + 1,
			action,
			reason: pr.reason,
			mustCover: Array.isArray(pr.mustCover) ? pr.mustCover.map(String).slice(0, 12) : [],
			expectedImages: Array.isArray(pr.expectedImages)
				? pr.expectedImages.map(String).slice(0, 12)
				: [],
		});
	}
	// queued routes the plan forgot are written last, in queue order
	for (const r of [...queued, ...added])
		if (!seen.has(r)) {
			routes.push({
				route: r,
				order: routes.length + 1,
				action: 'write',
				mustCover: [],
				expectedImages: [],
			});
			fallbacks.push(`route ${r} missing from the plan → written last`);
		}
	routes.sort((a, b) => a.order - b.order);
	routes.forEach((r, i) => (r.order = i + 1));
	// stages
	const stages: Record<string, string> = {};
	for (const [k, opts] of Object.entries(STAGE_FLAGS)) {
		const v = raw.stages?.[k];
		if (v && opts.includes(v)) stages[k] = v;
		else {
			if (v) fallbacks.push(`stages.${k}=${v} not in [${opts.join('|')}] → default`);
			stages[k] = k === 'ia' ? 'auto' : 'run';
		}
	}
	if (stages.explore === 'skip' && area.mode === 'explore') {
		fallbacks.push('stages.explore=skip is only valid in write-only mode → run');
		stages.explore = 'run';
	}
	// probes
	const probeAdd = (Array.isArray(raw.probes?.add) ? raw.probes.add : [])
		.filter((p: any) => p && p.id && p.tool && typeof p.input === 'string')
		.map((p: any) => ({ ...p, input: String(p.input).slice(0, LIMITS.probeInputChars) }))
		.slice(0, LIMITS.probesPerArea);
	if ((raw.probes?.add ?? []).length > probeAdd.length)
		fallbacks.push(`probes.add trimmed to ${probeAdd.length}`);
	const plan: Plan = {
		run: runId,
		mode: area.mode,
		reasoning: String(raw.reasoning ?? '').slice(0, 2000),
		routes,
		added,
		capture: {
			priorityStates: (raw.capture?.priorityStates ?? []).map(String).slice(0, LIMITS.states),
			requests: (raw.capture?.requests ?? []).map(String).slice(0, 20),
		},
		probes: { priority: (raw.probes?.priority ?? []).map(String), add: probeAdd },
		stages,
		checkpoints: typeof raw.checkpoints === 'object' && raw.checkpoints ? raw.checkpoints : {},
		defaults: false,
		fallbacks,
	};
	writeJson(join(dir, 'plan.normalised.json'), plan);
	return plan;
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const [verb, runId] = args.positional;
	if (!verb || !runId) {
		console.error('Usage: plan.ts validate <run> | routes <run> [--json]');
		process.exit(1);
	}
	const plan = validatePlan(runId);
	if (verb === 'routes') {
		const list = plan.routes.filter((r) => r.action !== 'skip').map((r) => r.route);
		console.log(
			args.flags.has('json')
				? JSON.stringify({
						routes: list,
						skipped: plan.routes
							.filter((r) => r.action === 'skip')
							.map((r) => ({ route: r.route, reason: r.reason })),
						added: plan.added ?? [],
						defaults: !!plan.defaults,
					})
				: list.join('\n')
		);
		process.exit(0);
	}
	if (args.flags.has('json'))
		console.log(
			JSON.stringify({
				run: runId,
				defaults: !!plan.defaults,
				routes: plan.routes.length,
				skipped: plan.routes.filter((r) => r.action === 'skip').length,
				added: plan.added,
				stages: plan.stages,
				fallbacks: plan.fallbacks,
			})
		);
	else {
		console.log(
			`${plan.defaults ? 'defaults' : 'plan'}: ${plan.routes.length} route(s), ${plan.routes.filter((r) => r.action === 'skip').length} skipped, ${(plan.added ?? []).length} added; stages ${JSON.stringify(plan.stages ?? {})}`
		);
		for (const r of plan.routes)
			console.log(
				`  ${String(r.order).padStart(2)}. ${r.action.padEnd(7)} ${r.route}${r.reason ? `  — ${r.reason}` : ''}`
			);
		for (const f of plan.fallbacks ?? []) console.log(`  fallback: ${f}`);
	}
	process.exit(0);
}
