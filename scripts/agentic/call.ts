/**
 * The one executor the /docs-explore workflow uses for every script call (2026-10-01).
 *
 * Why: the workflow cannot read files, so a Haiku "wrapper" agent runs each command and hands the
 * result back. When that result was the script's whole JSON, the wrapper had to RETYPE it — and on
 * 2026-10-01 it retyped a 37 KB plan as 4 routes instead of 29 (25 pages silently never written).
 * The rule now: code moves data, LLMs move pointers.
 *
 *   bun scripts/agentic/call.ts <run> <label> --as <kind> [--attempt n] -- <command …>
 *   bun scripts/agentic/call.ts <run> <label> --as <kind> -- </absolute/path>   (reads the file)
 *   bun scripts/agentic/call.ts <run> <label> --as exists -- <path>
 *   bun scripts/agentic/call.ts <run> <label> --as same -- <a> <b>
 *   bun scripts/agentic/call.ts <run> <label> --as prev-review -- <route>
 *
 * - Runs the command WITHOUT a shell (argv as given), captures stdout, and writes the full output
 *   to R/io/<label>.json (or .txt when it is not JSON) — the data stays on disk, by reference.
 * - Prints only a RECEIPT: {ok, exit, ref, bytes, sha, summary, summarySha}. `summary` holds the
 *   few control-flow fields the workflow needs, chosen by the projection for `--as <kind>`
 *   (PROJECT below). `sha` = FNV-1a of the full output, `summarySha` = FNV-1a of the canonical
 *   (key-sorted) summary. The workflow recomputes summarySha and halts the run on a mismatch, so a
 *   wrapper that abridges, re-nests or invents fields is caught instead of trusted.
 * - Agents that need the data read R/io/<label>.json themselves (the workflow passes the path).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { readJson, ROOT, RUNS_DIR, V2_DIR } from './lib';

/** FNV-1a 32-bit over a string, as 8 hex chars. Mirrored in the workflow script (SKILL.md). */
export function fnv1a(s: string): string {
	let h = 0x811c9dc5;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h.toString(16).padStart(8, '0');
}
/** JSON with keys sorted at every level — the form both sides hash. */
export function canonical(v: unknown): string {
	if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
	if (v && typeof v === 'object')
		return `{${Object.keys(v as object)
			.sort()
			.map((k) => `${JSON.stringify(k)}:${canonical((v as any)[k])}`)
			.join(',')}}`;
	return JSON.stringify(v ?? null);
}

const names = (o: Record<string, any> | undefined, pred: (x: any) => boolean) =>
	Object.entries(o ?? {})
		.filter(([, x]) => pred(x))
		.map(([k]) => k);

/** What the workflow may see of each kind of output. Everything else stays in R/io/. */
export const PROJECT: Record<string, (j: any) => Record<string, unknown>> = {
	none: () => ({}),
	plan: (j) => ({
		defaults: !!j.defaults,
		routes: (j.routes ?? []).map((r: any) => ({ route: r.route, action: r.action ?? 'write' })),
		added: j.added ?? [],
		stages: j.stages ?? {},
		probesAdd: (j.probes?.add ?? []).length,
	}),
	'plan-validate': (j) => ({
		defaults: !!j.defaults,
		routes: j.routes ?? 0,
		skipped: j.skipped ?? 0,
		added: (j.added ?? []).length,
		fallbacks: (j.fallbacks ?? []).length,
	}),
	gates: (j) => ({ ok: !!j.ok, failing: names(j.gates, (g) => g?.status !== 'PASS') }),
	briefs: (j) => ({ batches: j.batches ?? [], needed: (j.needed ?? []).length }),
	merge: (j) => ({
		owned: j.owned ?? 0,
		unowned: j.unowned ?? 0,
		shared: j.shared ?? 0,
		conflicts: j.conflicts ?? 0,
		emptyRoutes: j.emptyRoutes ?? [],
		notInCapture: j.notInCapture ?? [],
	}),
	coverage: (j) => ({
		unowned: (j.unowned ?? []).length,
		conflicts: (j.conflicts ?? []).length,
		emptyRoutes: j.emptyRoutes ?? [],
		notInCapture: j.notInCapture ?? [],
	}),
	count: (j) => ({
		n: Array.isArray(j) ? j.length : Array.isArray(j?.entries) ? j.entries.length : 0,
	}),
	'routes-final': (j) => ({
		routes: (j.routes ?? []).map((r: any) => (typeof r === 'string' ? r : r.route)),
		added: j.added ?? [],
	}),
	decide: (j) => ({
		do: j.do ?? 'continue',
		agent: j.agent ?? null,
		attempt: j.attempt ?? null,
		routes: j.routes ?? [],
		overridden: !!j.overridden,
		hasHint: !!j.hint,
	}),
	subtasks: (j) => ({
		items: (j.subtasks ?? []).map((t: any, i: number) => ({
			i,
			kind: t.kind,
			route: t.route ?? null,
		})),
		dropped: (j.dropped ?? []).length,
	}),
	restore: (j) => ({ status: j.status ?? 'FAIL' }),
	experiments: (j) => ({ kept: j.kept ?? [] }),
	publish: (j) => ({ published: (j.published ?? []).length, missing: (j.missing ?? []).length }),
	prune: (j) => ({ count: j.count ?? 0 }),
	learn: (j) => ({ learned: j.learned ?? 0 }),
	report: (j) => {
		const routes = j.routes ?? [];
		const by: Record<string, number> = {};
		for (const r of routes) by[r.outcome ?? '?'] = (by[r.outcome ?? '?'] ?? 0) + 1;
		return { routes: routes.length, outcomes: by, halted: j.halted ?? null };
	},
	prepare: (j) => ({ refused: !!j.refused }),
	exists: (j) => ({ exists: !!j.exists }),
	same: (j) => ({ same: !!j.same }),
	path: (j) => ({ path: j.path ?? null }),
	'prev-review': (j) => ({ path: j.path ?? null }),
	file: () => ({}),
};

export type Receipt = {
	ok: boolean;
	exit: number;
	ref: string | null;
	bytes: number;
	sha: string;
	summary: Record<string, unknown>;
	summarySha: string;
};

export function receipt(
	ok: boolean,
	exit: number,
	ref: string | null,
	full: string,
	summary: Record<string, unknown>
): Receipt {
	return {
		ok,
		exit,
		ref,
		bytes: Buffer.byteLength(full),
		sha: fnv1a(full),
		summary,
		summarySha: fnv1a(canonical(summary)),
	};
}

if (import.meta.main) {
	const argv = process.argv.slice(2);
	const dd = argv.indexOf('--');
	const head = dd >= 0 ? argv.slice(0, dd) : argv;
	const cmd = dd >= 0 ? argv.slice(dd + 1) : [];
	const [runId, label] = head;
	const kindAt = head.indexOf('--as');
	const kind = kindAt >= 0 ? head[kindAt + 1] : 'none';
	if (!runId || !label || !cmd.length || !(kind in PROJECT)) {
		console.error(
			`Usage: call.ts <run> <label> --as <${Object.keys(PROJECT).join('|')}> -- <command …>`
		);
		process.exit(1);
	}
	const io = join(RUNS_DIR, runId, 'io');
	mkdirSync(io, { recursive: true });
	const safe = label.replace(/[^A-Za-z0-9._-]+/g, '_');
	let full = '';
	let exit = 0;
	let json: any = null;

	if (kind === 'exists') {
		json = { exists: existsSync(cmd[0]) };
		full = JSON.stringify(json);
	} else if (kind === 'same') {
		const [a, b] = cmd;
		json = {
			same: existsSync(a) && existsSync(b) && readFileSync(a).equals(readFileSync(b)),
		};
		full = JSON.stringify(json);
	} else if (kind === 'prev-review') {
		const index = readJson<Record<string, { runId?: string }>>(join(V2_DIR, 'index.json')) ?? {};
		const prev = index[cmd[0]]?.runId;
		const p = prev ? join(RUNS_DIR, prev, cmd[0].replace(/\//g, '-'), 'review.json') : null;
		json = { path: p && existsSync(p) ? p : null };
		full = JSON.stringify(json);
	} else if (cmd.length === 1 && cmd[0].startsWith('/')) {
		// read a file the workflow needs a projection of (no command, no shell) — one absolute path = read that file
		if (existsSync(cmd[0])) {
			full = readFileSync(cmd[0], 'utf8');
		} else {
			full = 'null';
			exit = 2;
		}
	} else {
		const r = spawnSync(cmd[0], cmd.slice(1), {
			cwd: ROOT,
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024,
		});
		full = r.stdout ?? '';
		exit = r.status ?? 1;
		if (r.stderr) writeFileSync(join(io, `${safe}.stderr.txt`), r.stderr);
	}
	if (json === null) {
		try {
			json = full.trim() ? JSON.parse(full) : null;
		} catch {
			json = null;
		}
	}
	const ext = json === null && full.trim() ? 'txt' : 'json';
	const refAbs = join(io, `${safe}.${ext}`);
	writeFileSync(refAbs, full);
	const project = PROJECT[kind] ?? PROJECT.none;
	const summary = json === null ? (kind === 'none' ? {} : { missing: true }) : project(json);
	const ok = exit === 0 && (kind === 'none' || json !== null);
	process.stdout.write(
		JSON.stringify(receipt(ok, exit, relative(ROOT, refAbs), full, summary)) + '\n'
	);
}
