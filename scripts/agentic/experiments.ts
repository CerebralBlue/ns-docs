/**
 * experiments.ts — what a setting DOES, shown by changing it (agentic v3.4).
 *
 *   bun scripts/agentic/experiments.ts validate <run> [--json]
 *       R/experiments.json (understand's proposals) → R/experiments.normalised.json: only a
 *       dropdown (by exact label) whose captured option list holds `value`, inside an
 *       EXPERIMENT_SECTIONS accordion, with a different current value; ≤ LIMITS.experimentsPerArea.
 *   bun scripts/agentic/experiments.ts on <run> <id>
 *       arm ONE experiment: R/experiment-allowlist.json (what the hook lets the experimenter
 *       pick, type and save) + playground-versions.json `pending` (no run starts while it is set).
 *   bun scripts/agentic/experiments.ts saved <run> <id> --saved-at <ISO from the Change Log row>
 *       record the experiment's version in playground-versions.json.
 *   bun scripts/agentic/experiments.ts off <run> <id>
 *       disarm — only after verify-restore.ts check --when exp-<id> PASSED after `on`. Otherwise it
 *       refuses and `pending` stays: the run halts and the main session rolls back by hand.
 *
 * The agent never writes these files (agent-paths.sh fences experiment-*.json); the values come
 * from understand's proposals as validated here, never from the command line.
 */
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import {
	accordionOf,
	CURRENT_RUN_FILE,
	EXPERIMENT_SECTIONS,
	labelBeside,
	LIMITS,
	parseArgs,
	parseSnapshot,
	readJson,
	ROOT,
	runDir,
	VERSIONS_FILE,
	walkSnapshot,
	writeJson,
	type Versions,
} from './lib';

type Proposal = {
	id: string;
	control: string;
	value: string;
	question: string;
	routes: string[];
	why?: string;
};
type Experiment = Proposal & { baseline: string; state: string; reach: string[]; section: string };

const args = parseArgs(process.argv.slice(2));
const [verb, run, id] = args.positional;
if (!verb || !run) {
	console.error('Usage: experiments.ts validate|on|saved|off <run> [<id>]');
	process.exit(2);
}
const dir = runDir(run);
const ALLOW = join(dir, 'experiment-allowlist.json');
const NORMALISED = join(dir, 'experiments.normalised.json');
const TTL_MS = 45 * 60 * 1000;
const versionName = (e: { id: string }) => `docs-exp-${run}-${e.id}`.slice(0, 60);
const fail = (msg: string): never => {
	console.error(msg);
	process.exit(1);
};

if (verb === 'validate') {
	const proposals = readJson<Proposal[]>(join(dir, 'experiments.json')) ?? [];
	const states = readJson<Record<string, any>>(join(dir, 'states.json')) ?? {};
	const kept: Experiment[] = [];
	const dropped: { id: string; why: string }[] = [];
	for (const p of proposals) {
		if (kept.length >= LIMITS.experimentsPerArea) {
			dropped.push({ id: p.id, why: `over the ${LIMITS.experimentsPerArea}-experiment budget` });
			continue;
		}
		if (!p.id || !p.control || !p.value || !p.question) {
			dropped.push({ id: p.id ?? '?', why: 'needs id, control, value and question' });
			continue;
		}
		// Find the control on a captured DEFAULT state (not a variant): a dropdown with that label.
		let found: Experiment | null = null;
		for (const st of Object.values(states)) {
			if (found || st.variant || !st.snapshot || !existsSync(join(ROOT, st.snapshot))) continue;
			walkSnapshot(parseSnapshot(readFileSync(join(ROOT, st.snapshot), 'utf8')), (n) => {
				if (found || n.role !== 'listbox' || labelBeside(n) !== p.control) return;
				const current = n.children.find((c) => c.role === 'button')?.name ?? '';
				const opts = Object.values(st.options ?? {}).find((o: any) => o.label === p.control) as
					{ values: string[] } | undefined;
				found = {
					...p,
					baseline: current,
					state: st.id,
					reach: st.reach,
					section: accordionOf(n),
					...(opts ? {} : { why: `${p.why ?? ''} [no captured option list]` }),
				};
				if (!opts?.values.includes(p.value)) found = { ...found, section: '__no-option__' };
			});
		}
		const f = found as Experiment | null;
		if (!f)
			dropped.push({ id: p.id, why: `no dropdown labelled "${p.control}" on a captured state` });
		else if (f.section === '__no-option__')
			dropped.push({
				id: p.id,
				why: `"${p.value}" is not in the captured options of "${p.control}"`,
			});
		else if (!(EXPERIMENT_SECTIONS as readonly string[]).includes(f.section))
			dropped.push({
				id: p.id,
				why: `"${p.control}" is in "${f.section || '?'}", not an experiment section`,
			});
		else if (f.baseline === p.value)
			dropped.push({ id: p.id, why: `"${p.control}" is already "${p.value}"` });
		else kept.push(f);
	}
	writeJson(NORMALISED, kept);
	const out = { kept: kept.map((e) => e.id), dropped };
	if (args.flags.has('json')) console.log(JSON.stringify(out));
	else {
		console.log(`${kept.length} experiment(s) kept, ${dropped.length} dropped`);
		for (const e of kept)
			console.log(`  ${e.id}  ${e.section} › ${e.control}: ${e.baseline} → ${e.value}`);
		for (const d of dropped) console.log(`  dropped ${d.id}: ${d.why}`);
	}
	process.exit(0);
}

const versions = readJson<Versions>(VERSIONS_FILE) ?? fail(`no ${VERSIONS_FILE}`);
const exps = readJson<Experiment[]>(NORMALISED) ?? [];
const exp =
	exps.find((e) => e.id === id) ?? fail(`experiment '${id}' is not in experiments.normalised.json`);

if (verb === 'on') {
	const current = existsSync(CURRENT_RUN_FILE) ? readFileSync(CURRENT_RUN_FILE, 'utf8').trim() : '';
	if (current !== run) fail(`current-run is '${current}', not ${run}`);
	if (versions.pending)
		fail(
			`an experiment is still pending (${versions.pending.run} ${versions.pending.id}) — nothing new starts until it is rolled back and verified`
		);
	const base = versions.versions.find((v) => v.name === versions.current);
	if (!base) fail(`current version '${versions.current}' is not in the registry`);
	const since = new Date().toISOString();
	writeJson(ALLOW, {
		runId: run,
		id: exp.id,
		controls: { [exp.control]: [exp.value, exp.baseline] },
		section: exp.section,
		versionName: versionName(exp),
		expires: new Date(Date.now() + TTL_MS).toISOString(),
	});
	versions.pending = {
		run,
		id: exp.id,
		versionName: versionName(exp),
		control: exp.control,
		value: exp.value,
		baseline: exp.baseline,
		since,
		baselineVersion: base!.name,
		baselineSavedAt: base!.savedAt,
	};
	writeJson(VERSIONS_FILE, versions);
	console.log(
		`experiment ${exp.id} armed: ${exp.section} › ${exp.control} ${exp.baseline} → ${exp.value}; version name "${versionName(exp)}"; roll back to "${base!.name}" (row ${base!.savedAt}). Ask first: ${exp.question}`
	);
	process.exit(0);
}

if (verb === 'saved') {
	const at = args.get('saved-at');
	if (!versions.pending || versions.pending.id !== id)
		fail(`experiment ${id} is not the pending one`);
	if (!at || !/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(at))
		fail('--saved-at <ISO timestamp from the Change Log row>');
	if (Date.parse(at!) < Date.parse(versions.pending!.since) - 60_000)
		fail(`${at} is older than the experiment (${versions.pending!.since}) — that is not its row`);
	versions.versions.push({
		name: versions.pending!.versionName,
		savedAt: at!,
		purpose: `experiment ${run} ${id}: ${exp.control} = ${exp.value} (rolled back to ${versions.pending!.baselineVersion})`,
	});
	writeJson(VERSIONS_FILE, versions);
	console.log(`recorded ${versions.pending!.versionName} @ ${at}`);
	process.exit(0);
}

if (verb === 'off') {
	const p = versions.pending;
	if (!p || p.id !== id || p.run !== run) fail(`experiment ${id} of ${run} is not pending`);
	const checks = readJson<{ checks: { when: string; status: string; at: string }[] }>(
		join(dir, 'restore-check.json')
	);
	const ok = (checks?.checks ?? []).some(
		(c) => c.when === `exp-${id}` && c.status === 'PASS' && Date.parse(c.at) > Date.parse(p!.since)
	);
	if (!ok)
		fail(
			`no PASS restore check "exp-${id}" after ${p!.since} — the experiment stays pending; roll back to "${p!.baselineVersion}" and run verify-restore.ts check --when exp-${id}`
		);
	const base = versions.versions.find((v) => v.name === p!.baselineVersion);
	if (base) base.rolledBackTo = [...(base.rolledBackTo ?? []), new Date().toISOString()];
	versions.pending = null;
	writeJson(VERSIONS_FILE, versions);
	rmSync(ALLOW, { force: true });
	console.log(`experiment ${id} closed — playground verified back on "${p!.baselineVersion}"`);
	process.exit(0);
}

fail('Usage: experiments.ts validate|on|saved|off <run> [<id>]');
