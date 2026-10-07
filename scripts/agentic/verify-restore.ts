/**
 * verify-restore.ts — did the playground come back the way the run found it? (agentic v3.4)
 *
 *   bun scripts/agentic/verify-restore.ts reference --area <area> --snapshot <abs.yml>
 *       --changelog <abs.yml> --reach "<step>"… --changelog-reach "<step>"… [--version <name>]
 *       Write the reference: _private/agentic-v2/reference/<area>.json. Taken by the MAIN session
 *       while the playground is on playground-versions.json `current` (after a rollback or a named
 *       save). --snapshot = Edit Configuration with the accordions the variants touch opened;
 *       --changelog = the Change Log dialog.
 *   bun scripts/agentic/verify-restore.ts check <run> --snapshot <abs.yml> --changelog <abs.yml>
 *       [--when start|gather|finish] [--json]
 *       Compare fresh snapshots with the reference → R/restore-check.json (appends one entry per
 *       --when). Exit 1 on FAIL.
 *
 *   bun scripts/agentic/verify-restore.ts gate <run> [--stage gather|experiment|finish]
 *       One JSON line for the workflow: {status: PASS|FAIL|NONE, why}. Runner and writers start
 *       only on PASS or NONE.
 *
 * What counts: (1) the Change Log, row by row ({savedAt, version}). Every reference row must still be
 * there; every other row must be an experiment version recorded in playground-versions.json
 * (`docs-exp-*`, written by experiments.ts saved). Any other new row = something was SAVED that
 * nobody declared → FAIL. (Spike 2026-09-26: an unsaved pick is gone after a reload, a Save adds a
 * row, a Rollback adds none.) (2) Every dropdown value, checkbox state and textbox text present in
 * BOTH snapshots must match the reference; `--must-compare <label>` makes one control mandatory
 * (the experimented one). (3) The snapshots must be this run's and fresh: under runs/<run>/ and
 * newer than the run start / the pending experiment. Nothing compared is a FAIL, never a silent PASS.
 * While playground-versions.json `pending` is set, `gate` FAILs for every area.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	accordionOf,
	labelBeside,
	parseArgs,
	parseSnapshot,
	readJson,
	ROOT,
	runDir,
	V2_DIR,
	VERSIONS_FILE,
	walkSnapshot,
	writeJson,
	type SnapNode,
	type Versions,
} from './lib';

const args = parseArgs(process.argv.slice(2));
const verb = args.positional[0];
const asJson = args.flags.has('json');
const REF_DIR = join(V2_DIR, 'reference');

type Values = Record<string, string>;
type Row = { savedAt: string; version: string };
type ChangeLog = { rows: number; newest: string | null; list: Row[] };

/** Every setting the snapshot shows, keyed "<accordion> › <label>". */
export function valuesOf(yaml: string): Values {
	const out: Values = {};
	const put = (k: string, v: string) => {
		let key = k;
		for (let i = 2; key in out; i++) key = `${k} #${i}`;
		out[key] = v;
	};
	walkSnapshot(parseSnapshot(yaml), (n) => {
		const where = accordionOf(n);
		if (n.role === 'listbox' && n.parent) {
			const btn = n.children.find((c) => c.role === 'button');
			const label = labelBeside(n);
			if (btn && label) put(`${where} › ${label}`, btn.name || '(empty)');
		} else if (n.role === 'checkbox' || n.role === 'switch') {
			if (n.name) put(`${where} › ${n.name}`, n.attrs.includes('checked') ? 'on' : 'off');
		} else if (n.role === 'textbox') {
			const label = n.name || labelBeside(n) || labelBeside(n.parent ?? n);
			if (label) put(`${where} › ${label}`, (n.text ?? '').replace(/^"|"$/g, ''));
		} else if (n.role === 'slider' || n.role === 'spinbutton') {
			const label = n.name || labelBeside(n);
			if (label && n.text) put(`${where} › ${label}`, n.text);
		}
	});
	return out;
}

const ISO = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/;
/** The Change Log's rows: the ISO date cell and the Version cell (the cell two after the date). */
export function changeLogOf(yaml: string): ChangeLog {
	const list: Row[] = [];
	walkSnapshot(parseSnapshot(yaml), (n) => {
		if (n.role !== 'row') return;
		// row > generic > cell (Carbon wraps the cells); stop at a nested row (the expanded details)
		const cells: SnapNode[] = [];
		const collect = (x: SnapNode) => {
			for (const c of x.children) {
				if (c.role === 'row') continue;
				if (c.role === 'cell') cells.push(c);
				else collect(c);
			}
		};
		collect(n);
		const i = cells.findIndex((c) => ISO.test(c.name));
		if (i >= 0) list.push({ savedAt: cells[i].name, version: cells[i + 2]?.name ?? '' });
	});
	return { rows: list.length, newest: list[0]?.savedAt ?? null, list };
}

/** Read-outs that move on their own (statistics of the KB, not settings) — never compared. */
const VOLATILE = /› (Max Raw Score)$/;

const latestPerWhen = <T extends { when: string }>(checks: T[]) =>
	Object.fromEntries(checks.map((c) => [c.when, c])) as Record<string, T>;

const read = (flag: string) => {
	const f = args.get(flag);
	if (!f || !existsSync(f)) {
		console.error(`--${flag} <abs.yml> is required and must exist (got ${f ?? 'nothing'})`);
		process.exit(2);
	}
	return readFileSync(f, 'utf8');
};

if (verb === 'reference') {
	const area = args.get('area');
	if (!area) {
		console.error('reference needs --area <area>');
		process.exit(2);
	}
	const versions = readJson<{ current: string }>(join(V2_DIR, 'playground-versions.json'));
	const ref = {
		area,
		version: args.get('version') ?? versions?.current ?? null,
		takenAt: new Date().toISOString(),
		snapshot: relative(ROOT, args.get('snapshot')!),
		// How to get back to the screens the reference shows — the cleanup agent follows these
		// (from the area URL) to take the after-snapshots.
		reach: args.values.reach ?? [],
		changelogReach: args.values['changelog-reach'] ?? [],
		values: valuesOf(read('snapshot')),
		changelog: changeLogOf(read('changelog')),
	};
	const n = Object.keys(ref.values).length;
	if (!n || !ref.changelog.newest) {
		console.error(
			`refusing to write a reference with ${n} values and changelog ${JSON.stringify(ref.changelog)} — wrong snapshot?`
		);
		process.exit(1);
	}
	writeJson(join(REF_DIR, `${area}.json`), ref);
	console.log(
		`reference ${area} @ ${ref.version}: ${n} values, Change Log ${ref.changelog.rows} rows, newest ${ref.changelog.newest}`
	);
	process.exit(0);
}

if (verb === 'check') {
	const run = args.positional[1];
	const dir = run ? runDir(run) : '';
	const areaJson = run ? readJson<{ area: string }>(join(dir, 'area.json')) : null;
	if (!areaJson) {
		console.error('check needs <run> with an area.json');
		process.exit(2);
	}
	const ref = readJson<{
		version: string | null;
		values: Values;
		changelog: ChangeLog;
	}>(join(REF_DIR, `${areaJson.area}.json`));
	if (!ref) {
		console.error(
			`no reference for ${areaJson.area} — the main session writes it first (verify-restore.ts reference)`
		);
		process.exit(1);
	}
	const versions = readJson<Versions>(VERSIONS_FILE);
	// (3) fresh evidence: this run's folder, newer than the run start or the pending experiment
	const notBefore = Math.max(
		Date.parse((areaJson as any).createdAt ?? '') || 0,
		versions?.pending?.run === run ? Date.parse(versions.pending.since) : 0
	);
	const stale: string[] = [];
	for (const flag of ['snapshot', 'changelog']) {
		const f = args.get(flag) ?? '';
		if (!f.startsWith(dir + '/')) stale.push(`--${flag} is not under ${relative(ROOT, dir)}/`);
		else if (existsSync(f) && statSync(f).mtimeMs < notBefore)
			stale.push(`--${flag} is older than ${new Date(notBefore).toISOString()}`);
	}
	const now = valuesOf(read('snapshot'));
	const log = changeLogOf(read('changelog'));
	const compared = Object.keys(now).filter((k) => k in ref.values && !VOLATILE.test(k));
	const differs = compared
		.filter((k) => now[k] !== ref.values[k])
		.map((k) => ({ control: k, reference: ref.values[k], now: now[k] }));
	const must = args.get('must-compare');
	const mustMissing = must && !compared.some((k) => k.endsWith(`› ${must}`)) ? [must] : [];
	// (1) row by row: reference rows kept, extra rows only declared experiment versions
	// An experiment writes TWO rows, both carrying its version name: the Save, and the Rollback that
	// undoes it (run 202609270050: a rollback that changes something adds a row — one onto the
	// version already live, 2026-09-26, did not). So declared = by recorded experiment name.
	const expNames = new Set(
		(versions?.versions ?? []).filter((v) => v.name.startsWith('docs-exp-')).map((v) => v.name)
	);
	const declared = new Set(log.list.filter((r) => expNames.has(r.version)).map((r) => r.savedAt));
	const have = new Set(log.list.map((r) => r.savedAt));
	const refRows: Row[] = (ref.changelog as ChangeLog).list ?? [];
	const lost = refRows.filter((r) => !have.has(r.savedAt));
	const known = new Set(refRows.map((r) => r.savedAt));
	const unexpected = log.list.filter((r) => !known.has(r.savedAt) && !declared.has(r.savedAt));
	const logChanged = !refRows.length || lost.length > 0 || unexpected.length > 0;
	const status =
		!compared.length || differs.length || logChanged || mustMissing.length || stale.length
			? 'FAIL'
			: 'PASS';
	const entry = {
		when: args.get('when') ?? 'check',
		at: new Date().toISOString(),
		status,
		version: ref.version,
		compared: compared.length,
		differs,
		changelog: {
			reference: { rows: refRows.length, newest: ref.changelog.newest },
			now: { rows: log.rows, newest: log.newest },
			unexpected,
			lost,
		},
		why:
			status === 'PASS'
				? null
				: stale.length
					? `stale evidence: ${stale.join('; ')}`
					: !compared.length
						? 'no control of the reference is in this snapshot — wrong screen'
						: mustMissing.length
							? `"${must}" was not compared — open its accordion before the snapshot`
							: !refRows.length
								? 'the reference has no Change Log rows — re-take it'
								: unexpected.length
									? `undeclared save(s) in the Change Log: ${unexpected.map((r) => `${r.savedAt} ${r.version}`).join(', ')}`
									: lost.length
										? `${lost.length} reference row(s) missing from the Change Log`
										: `${differs.length} setting(s) differ from the reference`,
	};
	const file = join(dir, 'restore-check.json');
	const all = readJson<{ checks: (typeof entry)[] }>(file) ?? { checks: [] };
	all.checks.push(entry);
	writeJson(file, {
		// The latest check per `when` counts: a wrong-screen FAIL corrected by a re-check is a PASS.
		...all,
		status: Object.values(latestPerWhen(all.checks)).some((c) => c.status === 'FAIL')
			? 'FAIL'
			: 'PASS',
	});
	if (asJson) console.log(JSON.stringify(entry));
	else {
		console.log(
			`restore ${entry.when}: ${status} — ${compared.length} controls compared, ${differs.length} differ; Change Log ${log.rows}/${ref.changelog.rows} rows, newest ${log.newest === ref.changelog.newest ? 'unchanged' : `${ref.changelog.newest} → ${log.newest}`} (reference ${ref.version})`
		);
		for (const d of differs) console.log(`  ${d.control}: ${d.reference} → ${d.now}`);
		if (status === 'FAIL')
			console.log(
				`  HALT: CONFIG NOT RESTORED — roll back to "${ref.version}" (_private/agentic-v2/playground-versions.md), then re-run this check`
			);
	}
	process.exit(status === 'PASS' ? 0 : 1);
}

if (verb === 'gate') {
	// The workflow's go/no-go before the runner and at the end. NONE = this area has neither a
	// reference nor variants (nothing to verify); a missing check where one was due is a FAIL.
	const run = args.positional[1];
	const dir = run ? runDir(run) : '';
	const areaJson = run
		? readJson<{ area: string; variants?: unknown[]; mode?: string }>(join(dir, 'area.json'))
		: null;
	if (!areaJson) {
		console.log(JSON.stringify({ status: 'FAIL', why: `no area.json for run ${run}` }));
		process.exit(0);
	}
	const hasRef = existsSync(join(REF_DIR, `${areaJson.area}.json`));
	// An experiment that was never verified back blocks EVERY area, reference or not.
	const pending = readJson<Versions>(VERSIONS_FILE)?.pending;
	if (pending) {
		console.log(
			JSON.stringify({
				status: 'FAIL',
				why: `experiment ${pending.run} ${pending.id} (${pending.control} = ${pending.value}) is still pending — roll back to "${pending.baselineVersion}" and verify`,
			})
		);
		process.exit(0);
	}
	// A write-only run never opens the browser, so it cannot change the playground's settings.
	const due = areaJson.mode !== 'write-only' && (hasRef || (areaJson.variants ?? []).length > 0);
	// Which check this gate needs: gather → the explorer's `gather`; experiment → every `exp-*`
	// (and nothing pending, above); finish → cleanup's `finish`. No stage: all of them.
	const stage = args.get('stage') ?? '';
	const checks = readJson<{
		checks: { when: string; status: string; why: string | null; at: string }[];
	}>(join(dir, 'restore-check.json'));
	const latest = Object.values(latestPerWhen(checks?.checks ?? []));
	const needed = latest.filter((c) =>
		stage === 'experiment' ? c.when.startsWith('exp-') : stage ? c.when === stage : true
	);
	const out = !due
		? { status: 'NONE', why: 'no reference and no variants for this area' }
		: !hasRef
			? {
					status: 'FAIL',
					why: `variants declared but no reference — the main session writes _private/agentic-v2/reference/${areaJson.area}.json first`,
				}
			: stage === 'experiment' && !needed.length
				? { status: 'PASS', why: 'no experiment ran' }
				: !needed.length
					? { status: 'FAIL', why: `no restore check "${stage || 'any'}" was recorded in this run` }
					: {
							status: needed.some((c) => c.status === 'FAIL') ? 'FAIL' : 'PASS',
							why:
								needed
									.filter((c) => c.status === 'FAIL')
									.map((c) => `${c.when}: ${c.why}`)
									.join('; ') || null,
							checks: needed.map((c) => `${c.when} ${c.status}`),
						};
	console.log(JSON.stringify(out));
	process.exit(0);
}

console.error('Usage: verify-restore.ts reference|check|gate …');
process.exit(2);
