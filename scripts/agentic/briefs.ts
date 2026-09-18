/**
 * Which routes still need a brief in a run's capture, in batches — and the merge of the
 * partial coverage plans the batched understand agents write (agentic v3.1).
 *
 *   bun scripts/agentic/briefs.ts <run> [--batch <n>] [--json]
 *       { captureRun, needed[], existing[], batches[[…]] } — routes of the run with no
 *       C/briefs/<route folder>/brief.md, split into batches of ≤ n (default 8) in area.json order
 *   bun scripts/agentic/briefs.ts merge <run> [--json]
 *       C/coverage-plan.<i>.json (one per batch) + the existing C/coverage-plan.json →
 *       C/coverage-plan.json. First assignment wins; a label assigned twice is kept on its first
 *       route and listed under `conflicts[]` so the IA step and the report can see it. `unowned`
 *       is the union minus everything owned; `shared` is merged by key; `notInCapture` and
 *       `emptyRoutes` are unions. Partial files are kept (renamed *.merged) for the audit.
 *
 * Briefs live with the CAPTURE (runs/<captureRun>/briefs/), not with the write run, so a later
 * write run of the same area reuses them and only briefs what is missing.
 */
import { existsSync, readdirSync, renameSync } from 'node:fs';
import { join, relative } from 'node:path';
import { captureDir, parseArgs, readJson, ROOT, routeFolder, runDir, writeJson } from './lib';

const args = parseArgs(process.argv.slice(2));
const isMerge = args.positional[0] === 'merge';
const runId = isMerge ? args.positional[1] : args.positional[0];
if (!runId) {
	console.error('Usage: briefs.ts <run> [--batch n] [--json] | briefs.ts merge <run> [--json]');
	process.exit(1);
}
const area = readJson<any>(join(runDir(runId), 'area.json'));
if (!area) {
	console.error(`no run ${runId}`);
	process.exit(2);
}
const C = captureDir(runId);
const asJson = args.flags.has('json');

if (!isMerge) {
	const size = Math.max(1, Number(args.get('batch') ?? 8) || 8);
	const routes: string[] = area.routes.map((r: any) => r.route);
	const existing = routes.filter((r) => existsSync(join(C, 'briefs', routeFolder(r), 'brief.md')));
	const needed = routes.filter((r) => !existing.includes(r));
	const batches: string[][] = [];
	for (let i = 0; i < needed.length; i += size) batches.push(needed.slice(i, i + size));
	const out = { runId, captureRun: relative(ROOT, C).split('/').pop(), needed, existing, batches };
	if (asJson) console.log(JSON.stringify(out));
	else {
		console.log(
			`${needed.length} route(s) need a brief (${existing.length} have one) → ${batches.length} batch(es) of ≤ ${size}`
		);
		batches.forEach((b, i) => console.log(`  batch ${i + 1}: ${b.join(', ')}`));
	}
	process.exit(0);
}

// ── merge ───────────────────────────────────────────────────────────────────
const planPath = join(C, 'coverage-plan.json');
const base = readJson<Record<string, any>>(planPath) ?? {};
const partials = readdirSync(C)
	.filter((f) => /^coverage-plan\.\d+\.json$/.test(f))
	.sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));
const merged: Record<string, any> = {
	unowned: [],
	shared: {},
	notInCapture: [],
	emptyRoutes: [],
	conflicts: [],
};
const ownerOf = new Map<string, string>();
const RESERVED = new Set(['unowned', 'shared', 'notInCapture', 'emptyRoutes', 'conflicts']);
const take = (plan: Record<string, any>, source: string) => {
	for (const [route, labels] of Object.entries(plan)) {
		if (RESERVED.has(route) || !Array.isArray(labels)) continue;
		merged[route] ??= [];
		for (const label of labels as string[]) {
			const owner = ownerOf.get(label.toLowerCase());
			if (owner && owner !== route) {
				merged.conflicts.push({ label, kept: owner, dropped: route, from: source });
				continue;
			}
			if (!owner) ownerOf.set(label.toLowerCase(), route);
			if (!merged[route].includes(label)) merged[route].push(label);
		}
	}
	for (const k of ['notInCapture', 'emptyRoutes'])
		for (const x of plan[k] ?? []) if (!merged[k].includes(x)) merged[k].push(x);
	for (const x of plan.unowned ?? []) if (!merged.unowned.includes(x)) merged.unowned.push(x);
	for (const [label, routes] of Object.entries(plan.shared ?? {}))
		merged.shared[label] = [...new Set([...(merged.shared[label] ?? []), ...(routes as string[])])];
};
take(base, 'coverage-plan.json');
for (const f of partials) take(readJson(join(C, f)) ?? {}, f);
merged.unowned = merged.unowned.filter((l: string) => !ownerOf.has(l.toLowerCase()));
writeJson(planPath, merged);
for (const f of partials) renameSync(join(C, f), join(C, f.replace(/\.json$/, '.merged.json')));
const summary = {
	runId,
	captureRun: relative(ROOT, C).split('/').pop(),
	partials: partials.length,
	routes: Object.keys(merged).filter((k) => !RESERVED.has(k)).length,
	owned: ownerOf.size,
	unowned: merged.unowned.length,
	shared: Object.keys(merged.shared).length,
	conflicts: merged.conflicts.length,
	notInCapture: merged.notInCapture,
	emptyRoutes: merged.emptyRoutes,
};
if (asJson) console.log(JSON.stringify(summary));
else {
	console.log(
		`merged ${partials.length} partial plan(s) → ${relative(ROOT, planPath)}: ${summary.owned} owned, ${summary.unowned} unowned, ${summary.conflicts} conflict(s)`
	);
	for (const c of merged.conflicts)
		console.log(
			`  conflict: "${c.label}" kept on ${c.kept}, dropped from ${c.dropped} (${c.from})`
		);
}
