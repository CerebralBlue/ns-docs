/**
 * The ledger digest a checkpoint reviews (agentic v3.3) — deterministic, no model.
 *
 *   bun scripts/agentic/digest.ts <run> <stage> [--route <r>] [--json]
 *
 * What is on disk after a stage, in numbers the orchestrator can judge without reading the
 * transcripts: files present / missing / empty, counts, the tail of denials.log, the agents
 * that failed (from the Workflow's agent-failed.log, written by A()). Stages: gather,
 * understand, probe, ia, write (per route with --route), report.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
	captureDir,
	DOCS_DIR,
	parseArgs,
	readJson,
	ROOT,
	routeDir,
	routeFolder,
	runDir,
} from './lib';

const size = (p: string) => (existsSync(p) ? statSync(p).size : -1);
const tail = (p: string, n: number) =>
	existsSync(p) ? readFileSync(p, 'utf8').trim().split('\n').filter(Boolean).slice(-n) : [];

export function digest(runId: string, stage: string, route?: string) {
	const R = runDir(runId);
	const C = captureDir(runId);
	const area = readJson<any>(join(R, 'area.json'));
	const base = {
		run: runId,
		stage,
		mode: area?.mode,
		captureRun: area?.captureRun,
		denials: tail(join(R, 'denials.log'), 6).map((l) =>
			l.split('\t').slice(1).join(' ').slice(0, 160)
		),
		agentFailures: tail(join(R, 'agent-failed.log'), 10),
	};
	if (stage === 'gather') {
		const states = readJson<Record<string, any>>(join(C, 'states.json')) ?? {};
		const todos = readJson<any[]>(join(C, 'states-todo.json')) ?? [];
		const imgDir = join(ROOT, 'public/img', area?.area ?? '');
		return {
			...base,
			states: Object.keys(states).length,
			pending: todos.filter((t) => !t.done).map((t) => t.id),
			sections: Object.values(states).reduce(
				(n: number, s: any) => n + Object.keys(s.sections ?? {}).length,
				0
			),
			optionLists: Object.values(states).reduce(
				(n: number, s: any) => n + Object.keys(s.options ?? {}).length,
				0
			),
			imagesOnDisk: existsSync(imgDir)
				? readdirSync(imgDir).filter((f) => f.endsWith('.png')).length
				: 0,
			exploreSummary: size(join(C, 'explore-summary.json')) > 0,
			exploreJson: size(join(R, 'explore.json')) > 0,
			config: size(join(R, 'section/config.json')) > 0,
			mapUpdated: size(join(ROOT, '_private/component-map', `${area?.area}.json`)) > 0,
		};
	}
	if (stage === 'understand') {
		const routes: string[] = (area?.routes ?? []).map((r: any) => r.route);
		const briefs = routes.filter((r) => size(join(C, 'briefs', routeFolder(r), 'brief.md')) > 200);
		const plan = readJson<any>(join(C, 'coverage-plan.json'));
		const partials = existsSync(C)
			? readdirSync(C).filter((f) => /^coverage-plan\.\d+\.json$/.test(f))
			: [];
		return {
			...base,
			routes: routes.length,
			briefs: briefs.length,
			missingBriefs: routes.filter((r) => !briefs.includes(r)),
			coveragePlan: !!plan,
			unmergedPartials: partials,
			owned: plan
				? Object.entries(plan)
						.filter(
							([k, v]) =>
								Array.isArray(v) &&
								!['unowned', 'notInCapture', 'emptyRoutes', 'conflicts'].includes(k)
						)
						.reduce((n: number, [, v]: any) => n + v.length, 0)
				: 0,
			unowned: plan?.unowned?.length ?? 0,
			conflicts: plan?.conflicts?.length ?? 0,
			notInCapture: plan?.notInCapture ?? [],
			probesPlanned: (
				readJson<any[]>(join(R, 'probes.json')) ??
				readJson<any[]>(join(C, 'probes.json')) ??
				[]
			).length,
			understandJson: size(join(R, 'understand.json')) > 0,
		};
	}
	if (stage === 'probe') {
		const runner = readJson<any>(join(R, 'runner.json'));
		const probeDir = join(R, 'probes');
		return {
			...base,
			runnerJson: !!runner,
			probesRun: runner?.probes ?? 0,
			results: (runner?.results ?? []).map((x: any) => `${x.id}:${x.result}`),
			rawFiles: existsSync(probeDir) ? readdirSync(probeDir).length : 0,
			answersMd: size(join(R, 'answers.md')) > 0,
			created: runner?.created ?? [],
		};
	}
	if (stage === 'ia') {
		const ia = readJson<any>(join(R, 'ia.json'));
		return {
			...base,
			iaJson: !!ia,
			decisions: (ia?.decisions ?? []).map((d: any) => d.kind),
			routesFinal: readJson<any>(join(R, 'routes-final.json'))?.routes?.length ?? null,
			mapParses: (() => {
				try {
					JSON.parse(readFileSync(join(ROOT, 'scripts/migration-map.json'), 'utf8'));
					return true;
				} catch {
					return false;
				}
			})(),
		};
	}
	if (stage === 'write') {
		const routes: string[] = route ? [route] : (area?.routes ?? []).map((r: any) => r.route);
		return {
			...base,
			routes: routes.map((r) => {
				const rd = routeDir(runId, r);
				const page = join(DOCS_DIR, `${r}.md`);
				const before = join(rd, 'before.md');
				const gates = readJson<any>(join(rd, 'gates.json'));
				const review = readJson<any>(join(rd, 'review.json'));
				const pageText = existsSync(page) ? readFileSync(page, 'utf8') : '';
				return {
					route: r,
					outline: size(join(rd, 'outline.md')) > 0,
					writeJson: size(join(rd, 'write.json')) > 0,
					pageChanged:
						existsSync(before) && existsSync(page)
							? readFileSync(before, 'utf8') !== pageText
							: null,
					pageLines: pageText ? pageText.split('\n').length : 0,
					h2: (pageText.match(/^## /gm) ?? []).length,
					images: (pageText.match(/!\[[^\]]*\]\(\/img\/(?!_placeholder)/g) ?? []).length,
					gates: gates
						? Object.fromEntries(Object.entries(gates.gates).map(([k, v]: any) => [k, v.status]))
						: null,
					gatesOk: gates?.ok ?? null,
					review: review?.verdict ?? null,
					findings: review?.findings?.length ?? null,
					fixable: (review?.findings ?? []).filter((f: any) => f?.fixable).length,
				};
			}),
		};
	}
	if (stage === 'report') {
		return {
			...base,
			report: size(join(R, 'report.json')) > 0,
			cleanup: readJson<any>(join(R, 'cleanup.json')),
			buildLog: size(join(R, 'build.log')),
		};
	}
	return { ...base, error: `unknown stage ${stage}` };
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const [runId, stage] = args.positional;
	if (!runId || !stage) {
		console.error(
			'Usage: digest.ts <run> <gather|understand|probe|ia|write|report> [--route r] [--json]'
		);
		process.exit(1);
	}
	const d = digest(runId, stage, args.get('route'));
	console.log(args.flags.has('json') ? JSON.stringify(d) : JSON.stringify(d, null, 2));
	process.exit(0);
}
