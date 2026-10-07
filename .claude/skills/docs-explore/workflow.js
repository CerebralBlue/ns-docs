export const meta = {
	name: 'docs-explore',
	description:
		'Explore one console area on the playground, understand it, write every route it owns from the screen — no commits',
	phases: [
		{
			title: 'Plan',
			detail: 'planner: backlog + index + reports + catalog → plan.json (skippable)',
		},
		{ title: 'Gather', detail: 'explorer (browser, explore mode only) ∥ config export' },
		{ title: 'Understand', detail: 'briefs for routes without one, in parallel batches; merge' },
		{
			title: 'Experiment',
			detail: 'experimenter: change one setting, Save as a version, Seek, roll back, verify',
		},
		{ title: 'Probe', detail: 'runner: the listed MCP probes' },
		{
			title: 'IA',
			detail: 'when something is unowned or a new page is briefed; then bun run stubs',
		},
		{
			title: 'Write',
			detail:
				'prepare-write → writer → publish images → gates → image review → reviewer ⟲ fix (once) → verdict, per route',
		},
		{
			title: 'Delegate',
			detail:
				'planner: open backlog → ≤ 5 subtasks (fix-page · rebrief · probe), executed under the same gates',
		},
		{ title: 'Report', detail: 'bun run verify once, report.ts' },
		{ title: 'Cleanup', detail: 'delete docs-* agents, confirm config restored' },
		{ title: 'Learn', detail: 'learn.ts → conventions.md' },
	],
};

// A subagent that dies (context exhausted before StructuredOutput, API error) must cost one
// route, not the run: every agent call goes through A(), which turns a throw into null.
//
// PARTIAL + RESUME (2026-10-01). A subagent that stops before returning — it hit its maxTurns,
// died on an API error, or was skipped — comes back as a throw or null, with no reason. That is
// recorded as PARTIAL (not "failed": its files are on disk), logged with whatever error text
// there is, and the same task is RESUMED once by a continuation agent told to keep what exists
// and finish the rest. Every agent here writes its outputs as it goes, so a resume continues
// instead of starting over. Not resumed: the explorer (it resumes through its own batch loop),
// the experimenter (it must never repeat a Save), the haiku script wrappers (cheap; the caller
// handles a missing result). Everything is written to R/agent-failures.json at finish().
const failures = [];
const NO_RESUME = new Set(['explorer', 'experimenter']);
const RESUME_NOTE = (why) =>
	`\n\nRESUME — a previous attempt at this exact task stopped before returning its result (${why}). That attempt is PARTIAL, not wrong: everything it already wrote is on disk. First check which of the output files named above already exist and are complete, keep them, and do only what is missing. Then return the result for the WHOLE task, as asked above.`;
const errText = (e) =>
	e
		? String(e && e.message ? e.message : e).slice(0, 400)
		: 'returned nothing — turn limit, API error or skipped';
const once = (prompt, opts) =>
	agent(prompt, opts).then(
		(r) => ({ r }),
		(e) => ({ e: errText(e) })
	);
const A = async (prompt, opts = {}) => {
	const label = opts.label || '?';
	let { r, e } = await once(prompt, opts);
	if (r != null) return r;
	const first = {
		label,
		agentType: opts.agentType || 'workflow',
		attempt: 1,
		partial: true,
		error: e || errText(null),
	};
	failures.push(first);
	log(`partial: ${label} — ${first.error.slice(0, 160)}`);
	if (opts.noResume || NO_RESUME.has(opts.agentType) || opts.model === 'haiku') return null;
	({ r, e } = await once(prompt + RESUME_NOTE(first.error.slice(0, 200)), {
		...opts,
		label: `${label}:resume`,
	}));
	if (r != null) {
		first.resumed = true;
		log(`resumed: ${label}`);
		return r;
	}
	first.resumed = false;
	failures.push({
		label: `${label}:resume`,
		agentType: opts.agentType || 'workflow',
		attempt: 2,
		partial: true,
		error: e || errText(null),
	});
	log(`partial again, giving up: ${label}`);
	return null;
};
const REPO = args.repo;
const RUN = args.runId;
const R = `${REPO}/_private/agentic-v2/runs/${RUN}`;
const RD = (r) => `${R}/${r.replace(/\//g, '-')}`;
// The capture this run reads from: itself when it explores, an earlier explore run when
// --write-only. States, images, map and briefs live there; write.json/gates/review live in R.
const CAPTURE = args.captureRun || RUN;
const C = `${REPO}/_private/agentic-v2/runs/${CAPTURE}`;
const BRIEF = (r) => `${C}/briefs/${r.replace(/\//g, '-')}/brief.md`;
const writeOnly = args.mode === 'write-only';
// capture-only: explore + understand (briefs for every owned route), no probes, no IA, no
// writers — the investment a later --write-only run spends.
const captureOnly = args.mode === 'capture-only';
// args.attempt (set on a --resume after a script fix) changes the command text so the cached
// result of a failed script run is not replayed; the scripts ignore the flag.
const ATTEMPT = args.attempt ? ` --attempt ${args.attempt}` : '';

// ── Script calls: code moves data, LLMs move pointers (2026-10-01) ─────────────
// The workflow has no shell, so a Haiku wrapper runs each command. It used to RETYPE the script's
// whole JSON — and on 2026-10-01 it retyped a 37 KB plan as 4 routes instead of 29. Now every
// command goes through scripts/agentic/call.ts, which keeps the full output on disk (`ref`) and
// prints only a small RECEIPT {ok, exit, ref, bytes, sha, summary, summarySha}. The wrapper just
// returns that receipt; run() recomputes summarySha (FNV-1a over key-sorted JSON, the same code as
// call.ts) and a missing or altered receipt is retried once, then HALTS the run (IntegrityError).
// Agents that need the data read `ref` themselves.
const fnv1a = (s) => {
	let h = 0x811c9dc5;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h.toString(16).padStart(8, '0');
};
const canonical = (v) =>
	Array.isArray(v)
		? `[${v.map(canonical).join(',')}]`
		: v && typeof v === 'object'
			? `{${Object.keys(v)
					.sort()
					.map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`)
					.join(',')}}`
			: JSON.stringify(v === undefined ? null : v);
const RECEIPT = {
	type: 'object',
	properties: {
		ok: { type: 'boolean' },
		exit: { type: 'number' },
		ref: { type: ['string', 'null'] },
		bytes: { type: 'number' },
		sha: { type: 'string' },
		summary: { type: 'object' },
		summarySha: { type: 'string' },
	},
	required: ['ok', 'exit', 'ref', 'bytes', 'sha', 'summary', 'summarySha'],
	additionalProperties: false,
};
class IntegrityError extends Error {}
let integrity = null; // {label, why} of the first unrecoverable receipt — reported by finish()
const IO = (label) => `${R}/io/${label.replace(/[^A-Za-z0-9._-]+/g, '_')}`;
// run(label, phase, kind, cmd) → {ok, exit, ref, json: summary} — `cmd` is argv (no shell):
// paths and plain arguments only; data goes by file, never inline.
const run = async (label, phase, kind, cmd, opts = {}) => {
	const line = `bun scripts/agentic/call.ts ${RUN} ${label.replace(/[^A-Za-z0-9._:-]+/g, '_')} --as ${kind}${ATTEMPT} -- ${cmd}`;
	const ask = (attempt) =>
		A(
			`From ${REPO}, run exactly this one command with the Bash tool and nothing else:\n\n${line}\n\nIt prints one line of JSON (a receipt). Return that JSON object exactly as printed — same fields, same values, no wrapping, no edits. Do not fix anything, do not run anything else.${attempt > 1 ? ' (Second attempt: copy the printed JSON character for character.)' : ''}`,
			{
				label: attempt > 1 ? `${label}:again` : label,
				phase,
				schema: RECEIPT,
				model: 'haiku',
				effort: 'low',
				agentType: 'general-purpose',
			}
		);
	for (let attempt = 1; attempt <= 2; attempt++) {
		const r = await ask(attempt);
		if (r && fnv1a(canonical(r.summary)) === r.summarySha)
			return { ok: r.ok, exit: r.exit, ref: r.ref, json: r.summary };
		const why = r
			? `summarySha ${r.summarySha} ≠ ${fnv1a(canonical(r.summary))} (the receipt was altered in transit)`
			: 'no receipt returned';
		failures.push({
			label,
			agentType: 'wrapper',
			attempt,
			partial: true,
			error: `integrity: ${why}`,
		});
		log(`integrity: ${label} — ${why}${attempt === 1 ? ' — retrying' : ''}`);
		if (attempt === 2) {
			if (opts.soft) return null; // only inside finish(): report what we can, never loop
			integrity = integrity || { label, why };
			throw new IntegrityError(`${label}: ${why}`);
		}
	}
};
// An agent writes its own output file (its instructions say so). We only check it exists — a
// wrapper never retypes an agent's JSON into a file. Missing → recorded, shown in the report.
const ensureFile = async (path, label, phase) => {
	const r = await run(label, phase, 'exists', path);
	if (!(r && r.json.exists)) {
		failures.push({
			label,
			agentType: 'file',
			attempt: 1,
			partial: true,
			error: `missing ${path}`,
		});
		log(`missing file: ${path}`);
	}
	return !!(r && r.json.exists);
};
// Workflow-born data (the agents' returned JSON, failures, subtask results) goes back in the
// Workflow result; scripts/agentic/ingest-result.ts writes it to the run folder afterwards.
const artifacts = {};

// ── the orchestrator (v3.3): a bounded planner ───────────────────────────────
// plan.json decides what and in which order; checkpoints decide continue/retry/skip/halt
// inside the budget orchestrate.ts enforces; delegate turns the backlog into ≤ 5 subtasks.
// --no-plan (args.noPlan) runs pure v3.2: no planner calls, defaults everywhere.
const PLAN_ON = !args.noPlan;
const DECISION = {
	type: 'object',
	properties: {
		stage: { type: 'string' },
		verdict: { type: 'string', enum: ['ok', 'degraded', 'failed'] },
		decision: { type: 'string', enum: ['continue', 'retry', 'skip', 'halt'] },
		agent: { type: 'string' },
		routes: { type: 'array' },
		hint: { type: 'string' },
		reason: { type: 'string' },
		backlog: { type: 'array' },
	},
	required: ['stage', 'decision'],
};
const PLAN = {
	type: 'object',
	properties: {
		run: { type: 'string' },
		mode: { type: 'string' },
		reasoning: { type: 'string' },
		routes: { type: 'array' },
		added: { type: 'array' },
		capture: { type: 'object' },
		probes: { type: 'object' },
		stages: { type: 'object' },
		checkpoints: { type: 'object' },
	},
	required: ['run', 'routes'],
};
const SUBTASKS = {
	type: 'object',
	properties: { subtasks: { type: 'array' } },
	required: ['subtasks'],
};
let plan = null; // normalised plan (plan.ts validate), or defaults
const stageFlag = (k, dflt) => (plan && plan.stages && plan.stages[k]) || dflt;
// The checkpoint: review the stage, apply the budget, return what to do. The digest and the
// decision travel as files: the planner reads the digest at its path and WRITES its decision to a
// file; orchestrate.ts reads that file. Nothing is retyped in between.
const checkpoint = async (stage, result, extra) => {
	if (!PLAN_ON) return { do: 'continue' };
	const tag = `${stage}${extra && extra.route ? ':' + extra.route : ''}`;
	const dg = await run(
		`digest:${tag}`,
		'Plan',
		'none',
		`bun scripts/agentic/digest.ts ${RUN} ${stage}${extra && extra.route ? ` --route ${extra.route}` : ''} --json`
	);
	const decisionFile = `${IO(`decision-${tag}`)}.json`;
	const review = await A(
		`mode: review. runId: ${RUN}. stage: ${stage}. The plan's expectation for this stage is ${R}/plan.normalised.json → checkpoints.${stage} (missing = "the stage produced its files"). Agent result: ${JSON.stringify(result).slice(0, 3000)}. Digest: read ${REPO}/${dg.ref}. Agents that stopped early this run: ${JSON.stringify(failures.slice(-6))}. Catalog: _private/agentic-v2/catalog.json (read the entry for ${(extra && extra.agent) || stage}). Decide per your REVIEW mode, WRITE the decision JSON to ${decisionFile} with the Write tool, and return the same JSON.`,
		{
			agentType: 'planner',
			model: 'opus',
			effort: 'high',
			label: `checkpoint:${tag}`,
			phase: 'Plan',
			schema: DECISION,
		}
	);
	if (!review) return { do: 'continue' };
	if (!(await ensureFile(decisionFile, `decision-file:${tag}`, 'Plan'))) return { do: 'continue' };
	const applied = await run(
		`decide:${tag}`,
		'Plan',
		'decide',
		`bun scripts/agentic/orchestrate.ts decide ${RUN} ${stage} --decision-file ${decisionFile} --json`
	);
	const d = { ...((applied && applied.json) || { do: 'continue' }) };
	// the retry hint stays in the file; prompts point at it
	d.hint = d.hasHint ? `read the checkpoint's hint in ${REPO}/${applied.ref} (field "hint")` : '';
	if (d.overridden)
		log(`checkpoint ${stage}: ${review.decision} → ${d.do} (overridden by the budget)`);
	else if (d.do !== 'continue')
		log(
			`checkpoint ${stage}: ${d.do}${d.agent ? ' ' + d.agent : ''}${review.reason ? ' — ' + review.reason : ''}`
		);
	return d;
};

const EXPLORE = {
	type: 'object',
	properties: {
		area: { type: 'string' },
		halt: { type: ['string', 'null'] },
		done: { type: 'boolean' },
		pending: { type: 'number' },
		states: { type: 'number' },
		images: { type: 'number' },
		skipped: { type: 'array' },
		map: { type: 'object' },
		navigations: { type: 'number' },
		notes: { type: 'string' },
	},
	required: ['area'],
};
const CONFIG = {
	type: 'object',
	properties: {
		source: { type: 'string' },
		packed: { type: 'boolean' },
		error: { type: 'string' },
	},
};
const UNDERSTAND = {
	type: 'object',
	properties: {
		area: { type: 'string' },
		routes: { type: 'number' },
		briefs: { type: 'number' },
		controls: { type: 'object' },
		emptyRoutes: { type: 'array' },
		notInCapture: { type: 'array' },
		probes: { type: 'number' },
		questions: { type: 'array' },
		notes: { type: 'string' },
	},
	required: ['area', 'briefs'],
};
const RUNNER = {
	type: 'object',
	properties: {
		area: { type: 'string' },
		probes: { type: 'number' },
		results: { type: 'array' },
		created: { type: 'array' },
		notes: { type: 'string' },
	},
	required: ['area', 'results'],
};
const IA = {
	type: 'object',
	properties: {
		area: { type: 'string' },
		decisions: { type: 'array' },
		questions: { type: 'array' },
	},
	required: ['decisions'],
};
const WRITE = {
	type: 'object',
	properties: {
		route: { type: 'string' },
		edits: { type: 'array' },
		images: { type: 'array' },
		placeholders: { type: 'number' },
		unconfirmed: { type: 'number' },
		faq: { type: 'number' },
		fixed: { type: 'number' },
		left_unresolved: { type: 'array' },
		asks: { type: 'array' },
		lint: { type: 'string' },
	},
	required: ['route', 'edits'],
};
const REVIEW = {
	type: 'object',
	properties: {
		route: { type: 'string' },
		verdict: { type: 'string', enum: ['ready', 'needs-work'] },
		findings: { type: 'array' },
		resolved: { type: 'array' },
		questions: { type: 'array' },
	},
	required: ['route', 'verdict', 'findings'],
};
const IMAGE_REVIEW = {
	type: 'object',
	properties: {
		route: { type: 'string' },
		images: { type: 'array' },
		ok: { type: 'number' },
		problems: { type: 'number' },
	},
	required: ['route', 'images'],
};
const EXPERIMENTS = {
	type: 'object',
	properties: { experiments: { type: 'array' }, halt: { type: ['string', 'null'] } },
	required: ['experiments'],
};
const CLEANUP = {
	type: 'object',
	properties: {
		deleted: { type: 'array' },
		failed: { type: 'array' },
		leftovers: { type: 'array' },
		restore: { type: 'string' },
	},
	required: ['deleted', 'leftovers'],
};

let loginHalted = false;
const cleanup = () =>
	A(
		`runId: ${RUN}. Run folder (absolute — use it in every path and snapshot filename): ${R}. Leave the playground as the run found it per your instructions and write ${R}/cleanup.json.`,
		{
			agentType: 'cleanup',
			label: 'cleanup',
			phase: 'Cleanup',
			schema: CLEANUP,
		}
	);
// The playground restore gate (v3.4): verify-restore.ts decides; PASS/NONE = go.
const restoreGate = async (stage, opts = {}) => {
	const g = await run(
		`restore:${stage}`,
		'Gather',
		'restore',
		`bun scripts/agentic/verify-restore.ts gate ${RUN} --stage ${stage.replace('-retry', '')}`,
		opts
	);
	const status = (g && g.json && g.json.status) || 'FAIL';
	if (status === 'FAIL')
		log(
			`HALT: CONFIG NOT RESTORED (${stage}) — reason in ${g ? `${REPO}/${g.ref}` : 'the gate did not answer'}. The main session rolls back to playground-versions.json \`current\` (_private/agentic-v2/playground-versions.md) and re-runs verify-restore.ts check.`
		);
	return status;
};
// finish() runs once, whatever path gets here (halts, the end, a crash, an integrity halt).
// Its script calls are `soft`: an unreadable receipt here is reported, never a second halt.
let finished = null;
const finish = async (extra) => {
	if (finished) return finished;
	finished = { runId: RUN, pending: true };
	const cleaned = await cleanup();
	const restore = await restoreGate('finish', { soft: true });
	const report = await run(
		'report',
		'Report',
		'report',
		`bun scripts/agentic/report.ts ${RUN} --json`,
		{ soft: true }
	);
	// public/ keeps only what pages use; everything else stays in the capture library.
	await run(
		'library:prune',
		'Report',
		'prune',
		'bun scripts/agentic/library.ts prune-public --apply --json',
		{ soft: true }
	);
	const learned = await run(
		'learn',
		'Learn',
		'learn',
		`bun scripts/agentic/learn.ts ${RUN} --json`,
		{ soft: true }
	);
	finished = {
		restore,
		runId: RUN,
		captureRun: CAPTURE,
		mode: writeOnly ? 'write-only' : 'explore',
		area: args.area,
		loginHalted,
		integrity, // non-null = the run halted because a receipt could not be trusted
		cleanup: cleaned,
		learned: learned && learned.json,
		report: report && report.json,
		// Workflow-born data for ingest-result.ts (agent returns, failures, subtask results)
		artifacts: { ...artifacts, failures },
		...extra,
	};
	return finished;
};

try {
	// ── 0 · Plan ─────────────────────────────────────────────────────────────────
	if (PLAN_ON) {
		await run('catalog', 'Plan', 'none', 'bun scripts/agentic/catalog.ts --json');
		const planned = await A(
			`mode: plan. runId: ${RUN}. Capture folder C: ${C}. Read the catalog, area.json, the backlog, index.json, captures.json, the last reports of this area and conventions.md per your PLAN mode, write ${R}/plan.json and return it.`,
			{ agentType: 'planner', label: `plan:${args.area}`, phase: 'Plan', schema: PLAN }
		);
		artifacts.plan = planned;
		if (planned) await ensureFile(`${R}/plan.json`, 'plan-file', 'Plan');
	}
	const validated = await run(
		'plan:validate',
		'Plan',
		'plan-validate',
		`bun scripts/agentic/plan.ts validate ${RUN} --json`
	);
	// The control fields of the plan (route order, actions, stages, additions) — projected by
	// call.ts from the file. Everything else in the plan (mustCover, expectedImages, checkpoints,
	// capture requests, probes) is read by the agents themselves at PLAN_FILE.
	const PLAN_FILE = `${R}/plan.normalised.json`;
	const normalised = await run('plan:read', 'Plan', 'plan', PLAN_FILE);
	plan =
		normalised && normalised.ok && Array.isArray(normalised.json.routes) ? normalised.json : null;
	if (validated && validated.json)
		log(
			`plan: ${validated.json.defaults ? 'defaults (no plan.json)' : `${validated.json.routes} route(s), ${validated.json.skipped} skipped, ${validated.json.added} added`}${validated.json.fallbacks ? ` · fallbacks: ${validated.json.fallbacks}` : ''}`
		);

	// ── 1 · Gather: explorer (browser) ∥ config export ───────────────────────────
	const isReference = args.kind === 'reference';
	const exploreStage = stageFlag('explore', 'run');
	const explorerPrompt = (hint, attempt) =>
		`runId: ${RUN}. Walk the area per your instructions — including the capture requests \`bun scripts/agentic/backlog.ts list --target capture:${args.area}\` prints, and the plan's capture.priorityStates / capture.requests in ${R}/plan.normalised.json${hint ? `. RESUME (attempt ${attempt}) — hint from the checkpoint: ${hint}` : ''} — and return the summary.`;
	// The explorer works in batches (v3.4): one area does not fit one context. Each call records
	// ≤ EXPLORE_BATCH states/variants and returns {done, pending}; the walk resumes from disk.
	const EXPLORE_BATCH = 8;
	const exploreLoop = async () => {
		let last = null;
		let dead = 0;
		for (let call = 1; call <= 20; call++) {
			const e = await A(`${explorerPrompt('', 1)} batch: ${EXPLORE_BATCH}. call: ${call}.`, {
				agentType: 'explorer',
				label: `explore:${args.area}:${call}`,
				phase: 'Gather',
				schema: EXPLORE,
			});
			if (!e) {
				if (++dead >= 2) break; // two dead calls in a row: stop, the gate decides
				continue;
			}
			dead = 0;
			last = e;
			if (e.halt || e.done) break;
			log(`explore call ${call}: ${e.pending ?? '?'} pending`);
		}
		return last;
	};
	const [explore0, config] = await parallel([
		() => (isReference || writeOnly || exploreStage === 'skip' ? null : exploreLoop()),
		() =>
			A(`runId: ${RUN}. Export the instance config and slice it per your instructions.`, {
				agentType: 'config-export',
				label: 'config',
				phase: 'Gather',
				schema: CONFIG,
			}),
	]);
	let explore = explore0;
	// The restore gate comes BEFORE any retry: a retry on a changed playground would capture it as default.
	if (
		!isReference &&
		!writeOnly &&
		exploreStage !== 'skip' &&
		(await restoreGate('gather')) === 'FAIL'
	)
		return await finish({ stoppedAfter: 'gather', haltedBy: 'restore' });
	// checkpoint: gather (the explorer may be resumed once, in explore mode only)
	if (!isReference && !writeOnly && exploreStage !== 'skip') {
		const d = await checkpoint('gather', explore, { agent: 'explorer' });
		if (d.do === 'retry' && d.agent === 'explorer') {
			explore =
				(await A(explorerPrompt(d.hint, d.attempt || 2), {
					agentType: 'explorer',
					label: `explore:${args.area}:retry`,
					phase: 'Gather',
					schema: EXPLORE,
				})) || explore;
			if ((await restoreGate('gather-retry')) === 'FAIL')
				return await finish({ stoppedAfter: 'gather', haltedBy: 'restore' });
		} else if (d.do === 'halt') {
			log(`HALT by checkpoint: ${d.hint || ''}`);
			return await finish({ stoppedAfter: 'gather', haltedBy: 'checkpoint' });
		}
	}
	artifacts.explore = explore;
	// File this capture into the capture library (screen → section folders + generated READMEs).
	if (explore)
		await run(
			'library',
			'Gather',
			'none',
			`bun scripts/agentic/library.ts build --run ${RUN} --json`
		);
	if (explore && explore.halt === 'login') {
		loginHalted = true;
		log(
			`HALT: console session expired — re-login in the headed Chrome window, then /docs-explore ${args.area} --resume <workflow-run-id> --run ${RUN}`
		);
		return await finish({ stoppedAfter: 'explore' });
	}
	if (!isReference && !writeOnly && !explore)
		log('explorer returned nothing — understanding from whatever states.json holds');
	if (config && config.error)
		log(`config export failed: ${config.error} — no restore point this run`);
	log(
		explore
			? `explore: ${explore.states} states, ${explore.images} images, map ${explore.map && explore.map.status}`
			: writeOnly
				? `explore: skipped — writing from capture ${CAPTURE}`
				: 'explore: skipped (reference kind)'
	);

	// ── 2 · Understand (barrier): only routes without a brief, in parallel batches ──
	const briefPlan = await run(
		'briefs',
		'Understand',
		'briefs',
		`bun scripts/agentic/briefs.ts ${RUN} --json`
	);
	const batches =
		stageFlag('understand', 'run') === 'skip'
			? []
			: (briefPlan && briefPlan.json && briefPlan.json.batches) || [args.routes];
	let understood = null;
	const understandPrompt = (routes, i, n, hint, attempt) =>
		`runId: ${RUN}. Capture folder C: ${C}. Batch ${i + 1} of ${n}. Your routes: ${routes.join(', ')}. What the plan says each must cover: ${R}/plan.normalised.json → routes[<route>].mustCover (absent = nothing extra).${hint ? ` RETRY (attempt ${attempt}) — ${hint}.` : ''} Read everything the explorer captured for this area, plus the backlog entries targeting your routes (bun scripts/agentic/backlog.ts list --target route:<route>), and write, per your instructions, ${C}/briefs/<route folder>/brief.md for each of your routes, ${C}/coverage-plan.${i + 1}.json, and append your probes to ${R}/probes.json.`;
	if (batches.length && batches[0].length) {
		let parts = await parallel(
			batches.map(
				(routes, i) => () =>
					A(understandPrompt(routes, i, batches.length, '', 1), {
						agentType: 'understand',
						label: `understand:${args.area}:${i + 1}`,
						phase: 'Understand',
						schema: UNDERSTAND,
					})
			)
		);
		// checkpoint: understand — a retry re-runs only the batches whose routes the decision names
		{
			const d = await checkpoint(
				'understand',
				parts.map((p, i) => ({ batch: i + 1, ok: !!p, briefs: p && p.briefs })),
				{ agent: 'understand' }
			);
			if (d.do === 'retry' && d.agent === 'understand') {
				const want = new Set(d.routes || []);
				const idx = batches
					.map((b, i) => i)
					.filter((i) => !parts[i] || b.some((r) => want.has(r)) || !want.size);
				const again = await parallel(
					idx.map(
						(i) => () =>
							A(understandPrompt(batches[i], i, batches.length, d.hint, d.attempt || 2), {
								agentType: 'understand',
								label: `understand:${args.area}:${i + 1}:retry`,
								phase: 'Understand',
								schema: UNDERSTAND,
							})
					)
				);
				idx.forEach((i, k) => (parts[i] = again[k] || parts[i]));
			} else if (d.do === 'halt')
				return await finish({ stoppedAfter: 'understand', haltedBy: 'checkpoint' });
		}
		const merged = await run(
			'briefs:merge',
			'Understand',
			'merge',
			`bun scripts/agentic/briefs.ts merge ${RUN} --json`
		);
		const ok = parts.filter(Boolean);
		understood = ok.length
			? {
					area: args.area,
					briefs: ok.reduce((n, p) => n + (p.briefs || 0), 0),
					probes: ok.reduce((n, p) => n + (p.probes || 0), 0),
					controls: {
						owned: (merged && merged.json && merged.json.owned) || 0,
						unowned: (merged && merged.json && merged.json.unowned) || 0,
						shared: (merged && merged.json && merged.json.shared) || 0,
						conflicts: (merged && merged.json && merged.json.conflicts) || 0,
					},
					emptyRoutes: (merged && merged.json && merged.json.emptyRoutes) || [],
					notInCapture: (merged && merged.json && merged.json.notInCapture) || [],
					staleGaps: ok.flatMap((p) => p.staleGaps || []),
					newPages: ok.flatMap((p) => p.newPages || []),
					questions: ok.flatMap((p) => p.questions || []),
					notes: ok
						.map((p) => p.notes || '')
						.filter(Boolean)
						.join(' '),
				}
			: null;
		artifacts.understood = understood;
		if (!understood) {
			log('understand returned nothing — no briefs, nothing to write');
			return await finish({ stoppedAfter: 'understand' });
		}
		log(
			`understand: ${understood.briefs} new brief(s) in ${batches.length} batch(es), ${understood.probes} probes, ${understood.controls.conflicts} conflict(s), empty: ${understood.emptyRoutes.join(', ') || 'none'}, not in capture: ${understood.notInCapture.join(', ') || 'none'}`
		);
	} else {
		// Every route already has a brief in the capture: reuse, no understand cost. The capture's
		// probes.json still has to RUN (a capture-only run never runs the runner).
		const cov = await run('coverage-plan', 'Understand', 'coverage', `${C}/coverage-plan.json`);
		const pj = (cov && cov.ok && cov.json) || {};
		const probeList = await run('probes-list', 'Understand', 'count', `${C}/probes.json`);
		const nProbes = (probeList && probeList.ok && probeList.json.n) || 0;
		understood = {
			area: args.area,
			briefs: 0,
			probes: nProbes,
			controls: {
				owned: 0,
				unowned: pj.unowned || 0, // counts — call.ts projects them
				shared: 0,
				conflicts: pj.conflicts || 0,
			},
			emptyRoutes: pj.emptyRoutes || [],
			notInCapture: pj.notInCapture || [],
			questions: [],
		};
		log(`understand: all ${args.routes.length} route(s) already briefed in ${CAPTURE} — reused`);
	}
	const notInCapture = new Set(understood.notInCapture || []);

	// ── 2b · Experiment (browser, sequential): what a setting DOES (v3.4) ────────
	// Only in explore/capture runs (a write-only run has no browser). experiments.ts decides what is
	// allowed; the hook enforces it; the restore gate decides whether anything after may run.
	if (!writeOnly && !isReference && stageFlag('experiment', 'run') !== 'skip') {
		const validatedExp = await run(
			'experiments:validate',
			'Experiment',
			'experiments',
			`bun scripts/agentic/experiments.ts validate ${RUN} --json`
		);
		const kept = (validatedExp && validatedExp.json && validatedExp.json.kept) || [];
		if (kept.length) {
			const experimented = await A(
				`runId: ${RUN}. Run the experiments in ${R}/experiments.normalised.json (${kept.join(', ')}) per your instructions, one at a time, and write ${R}/experiments.md.`,
				{
					agentType: 'experimenter',
					label: `experiment:${args.area}`,
					phase: 'Experiment',
					schema: EXPERIMENTS,
				}
			);
			log(
				`experiments: ${((experimented && experimented.experiments) || []).map((e) => `${e.id} ${e.status}`).join(', ') || 'no result'}`
			);
			if ((await restoreGate('experiment')) === 'FAIL')
				return await finish({ stoppedAfter: 'experiment', haltedBy: 'restore' });
		} else log('experiments: none proposed or none valid');
	}

	if (captureOnly) {
		log(`capture-only: ${understood.briefs} brief(s) written to ${C}; no pages written`);
		return await finish({ stoppedAfter: 'understand', captureOnly: true });
	}

	// ── 3 · Probe (MCP, no browser) ──────────────────────────────────────────────
	const PROBES = writeOnly ? `${C}/probes.json` : `${R}/probes.json`;
	const probesAdd = (plan && plan.probesAdd) || 0;
	const runnerPrompt = (hint, attempt) =>
		`runId: ${RUN}. Run the probes in ${PROBES} per your instructions, in the order of ${R}/plan.normalised.json → probes.priority, plus the orchestrator's extra probes in probes.add of the same file (${probesAdd})${hint ? `. RETRY (attempt ${attempt}) — ${hint}` : ''}, and write ${R}/answers.md and ${R}/runner.json.`;
	let probed =
		stageFlag('probe', 'run') !== 'skip' && (understood.probes > 0 || probesAdd > 0)
			? await A(runnerPrompt('', 1), {
					agentType: 'runner',
					label: `probe:${args.area}`,
					phase: 'Probe',
					schema: RUNNER,
				})
			: null;
	if (stageFlag('probe', 'run') !== 'skip' && (understood.probes > 0 || probesAdd > 0)) {
		const d = await checkpoint('probe', probed, { agent: 'runner' });
		if (d.do === 'retry' && d.agent === 'runner')
			probed =
				(await A(runnerPrompt(d.hint, d.attempt || 2), {
					agentType: 'runner',
					label: `probe:${args.area}:retry`,
					phase: 'Probe',
					schema: RUNNER,
				})) || probed;
		else if (d.do === 'halt')
			return await finish({ stoppedAfter: 'probe', haltedBy: 'checkpoint' });
	}
	artifacts.probed = probed;
	if (probed) await ensureFile(`${R}/runner.json`, 'runner-file', 'Probe');

	// ── 4 · IA (barrier, conditional) ─────────────────────────────────────────────
	const unowned = (understood.controls && understood.controls.unowned) || 0;
	const conflicts = (understood.controls && understood.controls.conflicts) || 0;
	const empty = (understood.emptyRoutes || []).length;
	const newPages = (understood.newPages || []).length;
	const staleGaps = understood.staleGaps || [];
	let ia = null;
	const iaFlag = stageFlag('ia', 'auto');
	// The sidebar-mirrors-the-platform rule is checked on every fresh capture (explore mode).
	if (
		iaFlag === 'run' ||
		(iaFlag === 'auto' &&
			(!writeOnly ||
				unowned > 0 ||
				empty > 0 ||
				conflicts > 0 ||
				newPages > 0 ||
				staleGaps.length > 0))
	) {
		ia = await A(
			`runId: ${RUN}. Capture folder C: ${C}. The understand step left ${unowned} control(s) unowned, ${conflicts} conflict(s), ${empty} route(s) empty, proposed ${newPages} new page(s) and found ${staleGaps.length} stale gap(s)${staleGaps.length ? `: ${JSON.stringify(staleGaps).slice(0, 2500)}` : ''}. Decide per your instructions (sidebar mirrors the platform; assign / relabel / reorder / merge / ADD a page when understand briefed it; move stale gaps to gapsResolved), apply, and write ${R}/ia.json and ${R}/routes-final.json.`,
			{ agentType: 'ia-agent', label: `ia:${args.area}`, phase: 'IA', schema: IA }
		);
		// The ia-agent has no shell: a route it adds to the map exists only once gen-stubs writes
		// its page, and a sidebar slug without a page fails the build.
		await run('stubs', 'IA', 'none', 'bun run stubs');
		artifacts.ia = ia;
		log(`IA: ${ia && ia.decisions ? ia.decisions.length : 0} decision(s)`);
		const d = await checkpoint('ia', ia, { agent: 'ia-agent' });
		if (d.do === 'halt') return await finish({ stoppedAfter: 'ia', haltedBy: 'checkpoint' });
	} else log(iaFlag === 'skip' ? 'IA: skipped by the plan' : 'IA: nothing unowned — skipped');
	// routes-final.json exists only when the IA ran; absent → the queued routes
	const finalList = await run('routes-final', 'IA', 'routes-final', `${R}/routes-final.json`);
	const iaRoutes =
		(finalList && finalList.ok && finalList.json.routes.length && finalList.json.routes) ||
		args.routes;
	// The plan decides order, skips and additions; the IA's list and notInCapture still filter.
	const planned = plan
		? plan.routes.filter((x) => x.action !== 'skip').map((x) => x.route)
		: iaRoutes;
	const skippedByCheckpoint = new Set();
	const finalRoutes = planned.filter((r) => {
		if (notInCapture.has(r)) {
			log(`skip ${r}: its controls are not in capture ${CAPTURE}`);
			return false;
		}
		if (plan && !plan.defaults && !iaRoutes.includes(r) && !(plan.added || []).includes(r))
			return false;
		return true;
	});
	// Pages the IA created this run (briefed by understand) are written in the same run.
	for (const r of (finalList && finalList.ok && finalList.json.added) || [])
		if (!finalRoutes.includes(r)) finalRoutes.push(r);
	for (const x of (plan && plan.routes) || [])
		if (x.action === 'skip') log(`skip ${x.route} (plan): ${x.reason || ''}`);

	// ── 5 · Write → gates → review ⟲ fix (once) → gates → verdict, per route ─────
	// Evaluator = gates (deterministic) + reviewer (checklist over the gates' evidence).
	// Optimizer = the writer in fix mode, once, on the fixable findings only. Max 2 writer passes.
	// gates → {ok, failing[]} (call.ts projection); the full result is RD/gates.json.
	const gatesFor = (r, label) =>
		run(label, 'Write', 'gates', `bun scripts/agentic/gates.ts ${RUN} ${r} --json`);
	const parkedText = (g) => ((g && g.failing) || []).join(', ');
	const written = await pipeline(
		finalRoutes,
		(r) =>
			run(
				`prepare:${r}`,
				'Write',
				'prepare',
				`bun scripts/agentic/prepare-write.ts ${RUN} ${r} --json`
			),
		async (p, r) => {
			if (!(p && p.ok)) return null;
			const writerPrompt = (hint, attempt) =>
				`runId: ${RUN}. route: ${r}. Capture folder C: ${C}. The plan's mustCover and expectedImages for this route: ${R}/plan.normalised.json → routes[route = ${r}] (absent = none).${hint ? ` RETRY (attempt ${attempt}) — ${hint}.` : ''} Write the page from ${BRIEF(r)} per your instructions — outline first (${RD(r)}/outline.md), then the page with the Write tool, every section with its Image — and write ${RD(r)}/write.json.`;
			let w = await A(writerPrompt('', 1), {
				agentType: 'writer',
				label: `write:${r}`,
				phase: 'Write',
				schema: WRITE,
			});
			if (!w) {
				// checkpoint: a dead writer may be retried once with a hint, before the gates
				const d = await checkpoint('write', null, { agent: 'writer', route: r });
				if (d.do === 'retry' && d.agent === 'writer')
					w = await A(writerPrompt(d.hint, d.attempt || 2), {
						agentType: 'writer',
						label: `write:${r}:retry`,
						phase: 'Write',
						schema: WRITE,
					});
				else if (d.do === 'skip') {
					skippedByCheckpoint.add(r);
					return null;
				} else if (d.do === 'halt') {
					loginHalted = true;
					return null;
				}
			}
			if (w) return { w, wrote: true };
			// The writer died without returning (turn cap, API error) but may have written the page:
			// a page that differs from before.md still goes through the gates and the review.
			const same = await run(
				`changed:${r}`,
				'Write',
				'same',
				`${RD(r)}/before.md ${REPO}/src/content/docs/${r}.md`
			);
			if (same && !same.json.same) {
				log(
					`${r}: writer returned nothing but the page changed — gating it anyway (no write.json)`
				);
				return { w: null, wrote: true, noWriteJson: true };
			}
			return null;
		},
		// Images the page references that public/ lacks come from the capture library first.
		(x, r) =>
			x && x.wrote
				? run(
						`publish:${r}`,
						'Write',
						'publish',
						`bun scripts/agentic/library.ts publish ${r} --json`
					)
						.then(() => gatesFor(r, `gates:${r}`))
						.then((g) => ({ ...x, g }))
				: null,
		async (x, r) => {
			if (!x || !x.g || !x.g.json) return null;
			const noWriteJson = !!x.noWriteJson;
			let g = x.g.json;
			if (!g.ok) {
				log(`parked ${r}: ${parkedText(g)}`);
				return { gates: g, noWriteJson, passes: 1 };
			}
			await run(
				`sync-map:${r}`,
				'Write',
				'none',
				`bun scripts/agentic/sync-map.ts ${RUN} ${r} --json`
			);
			// Evaluate — with memory: the route's previous review (index.json → last run) and the
			// open backlog entries that target it, so recurring findings read as recurring.
			const prev = await run(
				`backlog:${r}`,
				'Write',
				'count',
				`bun scripts/agentic/backlog.ts list --target route:${r} --json`
			);
			const prevReview = await run(`prev-review:${r}`, 'Write', 'prev-review', r);
			const prevPath = prevReview && prevReview.json.path;
			const openN = (prev && prev.json.n) || 0;
			// Look at every image next to its section (right section, no neighbour, not cut off…).
			const imageReview = await A(
				`Review the images of the route ${r}. Write ${RD(r)}/image-review.json per your instructions and return it.`,
				{ agentType: 'image-reviewer', label: `images:${r}`, phase: 'Write', schema: IMAGE_REVIEW }
			);
			if (imageReview)
				await ensureFile(`${RD(r)}/image-review.json`, `image-review-file:${r}`, 'Write');
			const review = await A(
				`Review the route ${r}. Run folder: ${R}. Capture folder: ${C}. Read ${RD(r)}/gates.json (its values / section-image / links / coverage evidence), ${RD(r)}/image-review.json (the image verdicts — turn each problem into a finding: kind \`image\`, fixable when its fix is swap/drop/recrop, not fixable with needs {kind: "capture"} when it is recapture) and ${RD(r)}/outline.md first, then the brief at ${BRIEF(r)} and the snapshots in ${C}/states/; what the product did is in ${R}/answers.md.${prevPath ? ` The previous review of this route is ${prevPath} — re-check its findings and do not rediscover them.` : ''}${openN ? ` Open backlog entries this page owes (${openN}): ${REPO}/${prev.ref} → entries[] — close the ones the page now satisfies via resolvedBacklog.` : ''} Work your checklist, mark each finding fixable or not with needs {kind, target, what} on the non-fixable ones, and write ${RD(r)}/review.json as {route, verdict, findings: [{kind, line, what, evidence, fixable, needs}], questions: [{what, needs}], resolvedBacklog: [ids]}.`,
				{ agentType: 'doc-reviewer', label: `review:${r}`, phase: 'Write', schema: REVIEW }
			);
			if (review) await ensureFile(`${RD(r)}/review.json`, `review-file:${r}`, 'Write');
			const settle = async () => {
				await run(
					`backlog-add:${r}`,
					'Write',
					'none',
					`bun scripts/agentic/backlog.ts add ${RUN} ${r} --json`
				);
				await run(
					`backlog-resolve:${r}`,
					'Write',
					'none',
					`bun scripts/agentic/backlog.ts resolve ${RUN} ${r} --json`
				);
			};
			const fixable = ((review && review.findings) || []).filter((f) => f && f.fixable);
			if (!review || review.verdict === 'ready' || !fixable.length) {
				await settle();
				return { gates: g, review, noWriteJson, passes: 1, fixed: 0 };
			}
			// Optimize, once.
			const fix = await A(
				`runId: ${RUN}. route: ${r}. Capture folder C: ${C}. Fix mode: the reviewer's findings are in ${RD(r)}/review.json — fix exactly the ${fixable.length} marked fixable: true on the page with Edit, per your Fix mode instructions, update ${RD(r)}/write.json and return it with fixed: <n>.`,
				{ agentType: 'writer', label: `fix:${r}`, phase: 'Write', schema: WRITE }
			);
			const g2 = await gatesFor(r, `gates2:${r}`);
			g = (g2 && g2.json) || g;
			if (!g.ok) {
				log(`parked ${r} after fix: ${parkedText(g)}`);
				await settle();
				return { gates: g, review, noWriteJson, passes: 2, fixed: (fix && fix.fixed) || 0 };
			}
			await run(
				`sync-map2:${r}`,
				'Write',
				'none',
				`bun scripts/agentic/sync-map.ts ${RUN} ${r} --json`
			);
			const verdict = await A(
				`Verdict-only mode for the route ${r}. Run folder: ${R}. Capture folder: ${C}. The writer applied the findings marked fixable in ${RD(r)}/review.json (${fixable.length}). Re-check only those lines against the capture and write ${RD(r)}/review.json as {route, verdict, resolved: [{line, resolved}], findings: [], questions: []}.`,
				{ agentType: 'doc-reviewer', label: `verdict:${r}`, phase: 'Write', schema: REVIEW }
			);
			if (verdict) await ensureFile(`${RD(r)}/review.json`, `verdict-file:${r}`, 'Write');
			await settle();
			return {
				gates: g,
				review: verdict || review,
				firstReview: review,
				noWriteJson,
				passes: 2,
				fixed: (fix && fix.fixed) || fixable.length,
			};
		}
	);

	// ── 5b · Delegate: the open backlog → ≤ 5 subtasks, executed under the same gates ──
	// The planner writes R/subtasks.json; orchestrate.ts validates it into R/io/subtasks_validate.json.
	// The workflow sees only [{i, kind, route}]; each executor reads ITS subtask (instructions,
	// probes, backlog ids) from that file — nothing is retyped.
	let subtaskResults = [];
	if (PLAN_ON && !loginHalted && !captureOnly) {
		const proposed = await A(
			`mode: delegate. runId: ${RUN}. Capture folder C: ${C}. Routes written this run: ${finalRoutes.join(', ')}. Read the open backlog, this run's per-route gates/review/write files and ${R}/answers.md per your DELEGATE mode, write ${R}/subtasks.json and return {subtasks: [...]}.`,
			{ agentType: 'planner', label: `delegate:${args.area}`, phase: 'Delegate', schema: SUBTASKS }
		);
		artifacts.subtasksProposed = proposed;
		if (proposed) await ensureFile(`${R}/subtasks.json`, 'subtasks-file', 'Delegate');
		const valid = await run(
			'subtasks:validate',
			'Delegate',
			'subtasks',
			`bun scripts/agentic/orchestrate.ts subtasks ${RUN} --validate --json`
		);
		const items = (valid && valid.ok && valid.json.items) || [];
		const SUB = valid ? `${REPO}/${valid.ref}` : null;
		const its = (t) =>
			`subtask #${t.i} in ${SUB} → subtasks[${t.i}] (its instructions, probes and backlog ids)`;
		if (valid && valid.json.dropped)
			log(`delegate: ${valid.json.dropped} subtask(s) dropped — reasons in ${SUB}`);
		log(`delegate: ${items.length} subtask(s)`);
		subtaskResults = await parallel(
			items.map((t) => async () => {
				if (t.kind === 'probe') {
					const rr = await A(
						`runId: ${RUN}. Run exactly the probes of ${its(t)} (append to ${R}/answers.md and ${R}/runner.json; ids as given).`,
						{
							agentType: 'runner',
							label: `subtask:probe:${t.i}`,
							phase: 'Delegate',
							schema: RUNNER,
						}
					);
					return { i: t.i, kind: 'probe', ok: !!rr };
				}
				if (t.kind === 'rebrief') {
					const u = await A(
						understandPrompt([t.route], 0, 1, `re-brief this route as asked by ${its(t)}`, 1),
						{
							agentType: 'understand',
							label: `subtask:rebrief:${t.route}`,
							phase: 'Delegate',
							schema: UNDERSTAND,
						}
					);
					await run(
						`subtask:merge:${t.route}`,
						'Delegate',
						'merge',
						`bun scripts/agentic/briefs.ts merge ${RUN} --json`
					);
					return { i: t.i, kind: 'rebrief', route: t.route, ok: !!u };
				}
				// fix-page: writer fix mode → gates → reviewer verdict → backlog resolve
				await run(
					`subtask:prepare:${t.route}`,
					'Delegate',
					'prepare',
					`bun scripts/agentic/prepare-write.ts ${RUN} ${t.route} --json`
				);
				const fx = await A(
					`runId: ${RUN}. route: ${t.route}. Capture folder C: ${C}. Fix mode, from the orchestrator: do what ${its(t)} says; quote its backlog ids in write.json.backlog. Edit the page in place per your Fix mode instructions, update ${RD(t.route)}/write.json and return it with fixed: <n>.`,
					{ agentType: 'writer', label: `subtask:fix:${t.route}`, phase: 'Delegate', schema: WRITE }
				);
				const g = await gatesFor(t.route, `subtask:gates:${t.route}`);
				const ok = !!(g && g.json.ok);
				if (ok) {
					await run(
						`subtask:sync:${t.route}`,
						'Delegate',
						'none',
						`bun scripts/agentic/sync-map.ts ${RUN} ${t.route} --json`
					);
					const v = await A(
						`Verdict-only mode for the route ${t.route}. Run folder: ${R}. Capture folder: ${C}. The orchestrator asked the writer to do ${its(t)}. Re-check the page for exactly that and write ${RD(t.route)}/review.json as {route, verdict, resolved: [{line, resolved}], resolvedBacklog: [ids], findings: [], questions: []}.`,
						{
							agentType: 'doc-reviewer',
							label: `subtask:verdict:${t.route}`,
							phase: 'Delegate',
							schema: REVIEW,
						}
					);
					if (v)
						await ensureFile(
							`${RD(t.route)}/review.json`,
							`subtask:verdict-file:${t.route}`,
							'Delegate'
						);
					await run(
						`subtask:resolve:${t.route}`,
						'Delegate',
						'none',
						`bun scripts/agentic/backlog.ts resolve ${RUN} ${t.route} --json`
					);
				} else
					log(
						`subtask fix-page ${t.route}: gates ${g ? parkedText(g.json) : 'absent'} — page kept, not resolved`
					);
				return { i: t.i, kind: 'fix-page', route: t.route, ok: !!fx, gatesOk: ok };
			})
		);
		artifacts.subtaskResults = subtaskResults;
	}

	// ── 6 · Build once, report, cleanup, learn ───────────────────────────────────
	const build = await run('build', 'Report', 'none', 'bun run verify');
	const summary = finalRoutes.map((r, i) => {
		const w = written[i];
		let outcome = 'dropped';
		if (w && w.review && w.review.verdict === 'ready') outcome = 'ready';
		else if (w && w.review) outcome = 'ready, findings';
		else if (w && w.gates && !w.gates.ok) outcome = 'parked: gates';
		else if (w && w.gates) outcome = 'gated';
		const tag = w
			? ` (passes ${w.passes || 1}${w.fixed ? `, fixed ${w.fixed}` : ''}${w.noWriteJson ? ', no write.json' : ''})`
			: '';
		return `${outcome.padEnd(16)} ${r}${tag}`;
	});
	log(summary.join('\n'));
	return await finish({
		buildOk: !!(build && build.ok),
		summary,
		plan: plan
			? {
					defaults: !!plan.defaults,
					routes: plan.routes.length,
					skipped: plan.routes.filter((x) => x.action === 'skip').length,
					added: plan.added || [],
				}
			: null,
		skippedByCheckpoint: [...skippedByCheckpoint],
		subtasks: subtaskResults,
	});
} catch (e) {
	// A throw in the script body (not in an agent — A() already catches those) must still clean
	// up, check the playground and write the report. An IntegrityError is a deliberate halt.
	if (e instanceof IntegrityError) {
		log(
			`HALT (integrity): ${e.message} — a script's receipt could not be trusted after a retry; nothing was written from it.`
		);
		return await finish({ haltedBy: 'integrity' });
	}
	log(`CRASH: ${String((e && e.stack) || e).slice(0, 500)}`);
	return await finish({ crashed: String(e).slice(0, 300) });
}
