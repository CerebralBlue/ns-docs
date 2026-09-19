---
name: docs-explore
description: Run the NeuralDocs v3 pipeline over ONE console area — explore the screen with the browser (every state, screenshots), understand it (briefs per route, coverage plan, probes), probe behaviour on the playground through the MCP, decide the IA if something is unowned, write every route the area owns (contract + FAQ), gate, review once, build once, report, clean the playground up. Leaves every change as an uncommitted diff. Use when Fabio types /docs-explore; never invoke on your own.
argument-hint: '<area> [--capture-only | --write-only [--all-briefed [--rewrite]] [--from <capture-run-id>]] [--only <route>]… [--resume <workflow-run-id> --run <ledger-run-id>] [--attempt <n>]'
disable-model-invocation: false
allowed-tools: Bash(bun scripts/agentic/*), Bash(git status *), Bash(git diff *), Bash(cat _private/agentic-v2/*), Bash(node -e *), Read, Workflow
---

# /docs-explore — run the pipeline on one console area

Arguments: `$ARGUMENTS`

You are the operator. You do not explore, decide or write pages yourself — the agents do, the
scripts decide what passes, and the hooks lock every browser and MCP call to the **playground**
instance (production is on a locked list). Your job is to open the run, launch the Workflow,
and put the result in front of Fabio.
**Nothing is committed. Ever. `adopted` is never set by the pipeline. The playground is left
as it was found — the cleanup stage runs on every exit.**

The design, with the diagram: `_private/agentic-v2/diagrams/architecture.html`.

## 1. Parse

- First bare word = the area (`bun scripts/agentic/areas.ts list` prints them; `reference` is
  the pseudo-area for routes with no screen).
- `--only <route>` (repeatable) restricts the routes written. `--resume <workflow-run-id> --run
<ledger-run-id>` re-launches with `resumeFromRunId`; `--attempt <n>` (default 2 on a resume)
  makes the script wrappers re-run instead of replaying a cached failure.
- **`--write-only`**: no browser. Reuses the area's latest capture (`_private/agentic-v2/captures.json`,
  or `--from <capture-run-id>`): its states, images, map and briefs. `--only` may then name
  **any** route whose controls are on that screen, owned by the area or not (the report marks
  them cross-area). `--all-briefed` writes every route that has a brief in the capture and no
  page written by a v3 run yet (`--rewrite` ignores that and re-writes them too — after a
  fresh capture, for instance). The understand step runs only for routes without a brief, in
  parallel batches of ≤ 8.
- **`--no-plan`**: run pure v3.2 — no planner, no checkpoints, no delegation (the defaults
  the planner would otherwise override). Pass `"noPlan": true` in the Workflow args.
- **`--capture-only`**: explore + understand only — a fresh capture with briefs for every
  route the area owns (or `--only`), no probes, no IA, no pages. The investment a later
  `--write-only --all-briefed` run spends. Nothing lands in `src/`.
- Without either flag the run explores first (a new capture, which becomes the area's latest)
  and then writes the routes the area owns (or `--only`).

## 2. Open the run (unless resuming)

```
bun scripts/agentic/queue.ts <area> [--capture-only | --write-only [--all-briefed [--rewrite]] [--from <run>]] [--only <route>]… --json
```

(Add `--dry-run` to preview without opening a run.) Read the JSON: `runId`, `captureRun`,
`mode`, `routes`, `crossArea`, `briefed`, `kind`, `url`, `sidebar`, `notInSidebar`. Show the
route list. If `sidebar` is empty, say so — the IA step has no group to edit, the writers
still run. A write-only run with routes not yet `briefed` will brief them first (understand).

## 3. Preconditions — check, do not assume

- `git status --porcelain src/content/docs astro.config.mjs scripts/migration-map.json` must
  be empty (the report attributes changes to this run). If not, stop and ask — unless Fabio
  already said the working tree is his.
- `_private/agentic-v2/current-run` now names this run (queue.ts wrote it — the hooks log to it).
- `queue.ts` already refused to run unless `.neuralseekrc.json` points at the playground named
  in `_private/agentic-v2/instances.json`; if it exited 2, relay its message and stop.
- The Playwright profile must hold a live Auth0 session for the playground. Not checkable from
  here; the explorer returns `halt: "login"` if it is not, and the run stops itself.

## 4. Launch the Workflow

Extract the script below to a file (`sed -n '/^```js$/,/^```$/p' .claude/skills/docs-explore/SKILL.md | sed '1d;$d' > <scratchpad>/docs-explore.js`)
and call the **Workflow** tool with `scriptPath` and
`args: { "runId": "<runId>", "captureRun": "<captureRun>", "mode": "<explore|write-only|capture-only>", "area": "<area>", "kind": "<kind>", "routes": <routes[]>, "repo": "/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs", "attempt": <n or omit>, "noPlan": <true only with --no-plan> }`.
(This instruction is the opt-in for multi-agent orchestration.) Note the Workflow's own run id
from the tool result next to the ledger id.

```js
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
    { title: 'Probe', detail: 'runner: the listed MCP probes' },
    { title: 'IA', detail: 'only when something is unowned; then bun run stubs' },
    {
      title: 'Write',
      detail: 'prepare-write → writer → gates → reviewer ⟲ fix (once) → verdict, per route',
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
const failures = [];
const A = (prompt, opts) =>
  agent(prompt, opts).catch((e) => {
    const msg = `agent failed (${(opts && opts.label) || '?'}): ${String(e && e.message ? e.message : e).slice(0, 160)}`;
    log(msg);
    failures.push(msg);
    return null;
  });
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

// Scripts run through a cheap wrapper agent: the workflow itself has no shell.
const SCRIPT = {
  type: 'object',
  properties: { ok: { type: 'boolean' }, json: { type: 'object' }, stderr: { type: 'string' } },
  required: ['ok'],
};
const run = (cmd, label, phase) =>
  A(
    `From ${REPO}, run exactly this command and nothing else:\n\n${cmd}${cmd.startsWith('bun scripts/agentic/') ? ATTEMPT : ''}\n\nReturn {ok: <exit code was 0>, json: <the JSON it printed, parsed>, stderr: <stderr if any>}. Do not fix anything, do not run anything else.`,
    { label, phase, schema: SCRIPT, model: 'haiku', effort: 'low', agentType: 'general-purpose' }
  );
// An agent's return value is a copy of the file it should have written; when the file is
// missing (it happens), a haiku wrapper writes it from the return value.
const ensureFile = (path, data, label, phase) =>
  A(
    `If the file ${path} exists, return {ok: true, json: {existed: true}} and do nothing else. Otherwise create it with the Write tool, its content being exactly this JSON (verbatim, no edits, no reformatting):\n\n${JSON.stringify(data)}\n\nThen return {ok: true, json: {written: true}}.`,
    { label, phase, schema: SCRIPT, model: 'haiku', effort: 'low', agentType: 'general-purpose' }
  );

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
const planRoute = (r) => (plan && plan.routes.find((x) => x.route === r)) || {};
const stageFlag = (k, dflt) => (plan && plan.stages && plan.stages[k]) || dflt;
// The checkpoint: review the stage, apply the budget, return what to do.
const checkpoint = async (stage, result, extra) => {
  if (!PLAN_ON) return { do: 'continue' };
  const dg = await run(
    `bun scripts/agentic/digest.ts ${RUN} ${stage}${extra && extra.route ? ` --route ${extra.route}` : ''} --json`,
    `digest:${stage}${extra && extra.route ? ':' + extra.route : ''}`,
    'Plan'
  );
  const digest = (dg && dg.json) || {};
  digest.agentFailures = [...(digest.agentFailures || []), ...failures.slice(-6)];
  const expectation =
    (plan && plan.checkpoints && plan.checkpoints[stage]) || 'the stage produced its files';
  const review = await A(
    `mode: review. runId: ${RUN}. stage: ${stage}. Expectation from the plan: ${JSON.stringify(expectation)}. Agent result: ${JSON.stringify(result).slice(0, 3000)}. Digest: ${JSON.stringify(digest).slice(0, 5000)}. Catalog: _private/agentic-v2/catalog.json (read the entry for ${(extra && extra.agent) || stage}). Return one decision per your REVIEW mode.`,
    {
      agentType: 'planner',
      model: 'sonnet',
      effort: 'medium',
      label: `checkpoint:${stage}${extra && extra.route ? ':' + extra.route : ''}`,
      phase: 'Plan',
      schema: DECISION,
    }
  );
  if (!review) return { do: 'continue' };
  const applied = await run(
    `bun scripts/agentic/orchestrate.ts decide ${RUN} ${stage} --decision '${JSON.stringify(review).replace(/'/g, "'\\''")}' --json`,
    `decide:${stage}`,
    'Plan'
  );
  const d = (applied && applied.json) || { do: 'continue' };
  if (d.overridden) log(`checkpoint ${stage}: ${review.decision} → ${d.do} (${d.overridden})`);
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
const CLEANUP = {
  type: 'object',
  properties: {
    deleted: { type: 'array' },
    failed: { type: 'array' },
    leftovers: { type: 'array' },
    configRestored: { type: 'array' },
    configNotRestored: { type: 'array' },
  },
  required: ['deleted', 'leftovers'],
};

let loginHalted = false;
const learn = () => run(`bun scripts/agentic/learn.ts ${RUN} --json`, 'learn', 'Learn');
const cleanup = () =>
  A(
    `runId: ${RUN}. Leave the playground as the run found it per your instructions and write ${R}/cleanup.json.`,
    {
      agentType: 'cleanup',
      label: 'cleanup',
      phase: 'Cleanup',
      schema: CLEANUP,
    }
  );
const finish = async (extra) => {
  const cleaned = await cleanup();
  const report = await run(`bun scripts/agentic/report.ts ${RUN} --json`, 'report', 'Report');
  const learned = await learn();
  return {
    runId: RUN,
    captureRun: CAPTURE,
    mode: writeOnly ? 'write-only' : 'explore',
    area: args.area,
    loginHalted,
    cleanup: cleaned,
    learned: learned && learned.json,
    report: report && report.json,
    ...extra,
  };
};

// ── 0 · Plan ─────────────────────────────────────────────────────────────────
if (PLAN_ON) {
  await run(`bun scripts/agentic/catalog.ts --json`, 'catalog', 'Plan');
  const planned = await A(
    `mode: plan. runId: ${RUN}. Capture folder C: ${C}. Read the catalog, area.json, the backlog, index.json, captures.json, the last reports of this area and conventions.md per your PLAN mode, write ${R}/plan.json and return it.`,
    { agentType: 'planner', label: `plan:${args.area}`, phase: 'Plan', schema: PLAN }
  );
  if (planned) await ensureFile(`${R}/plan.json`, planned, 'plan-file', 'Plan');
}
const validated = await run(
  `bun scripts/agentic/plan.ts validate ${RUN} --json`,
  'plan:validate',
  'Plan'
);
const normalised = await run(`cat ${R}/plan.normalised.json`, 'plan:read', 'Plan');
plan = (normalised && normalised.json) || null;
if (validated && validated.json)
  log(
    `plan: ${validated.json.defaults ? 'defaults (no plan.json)' : `${validated.json.routes} route(s), ${validated.json.skipped} skipped, ${(validated.json.added || []).length} added`}${(validated.json.fallbacks || []).length ? ` · fallbacks: ${validated.json.fallbacks.length}` : ''}`
  );

// ── 1 · Gather: explorer (browser) ∥ config export ───────────────────────────
const isReference = args.kind === 'reference';
const exploreStage = stageFlag('explore', 'run');
const explorerPrompt = (hint, attempt) =>
  `runId: ${RUN}. Walk the area per your instructions — including the capture requests \`bun scripts/agentic/backlog.ts list --target capture:${args.area}\` prints${plan && plan.capture && plan.capture.priorityStates && plan.capture.priorityStates.length ? `; priorityStates: ${plan.capture.priorityStates.join(', ')}` : ''}${hint ? `. RESUME (attempt ${attempt}) — hint from the checkpoint: ${hint}` : ''} — and return the summary.`;
const [explore0, config] = await parallel([
  () =>
    isReference || writeOnly || exploreStage === 'skip'
      ? null
      : A(explorerPrompt('', 1), {
          agentType: 'explorer',
          label: `explore:${args.area}`,
          phase: 'Gather',
          schema: EXPLORE,
        }),
  () =>
    A(`runId: ${RUN}. Export the instance config and slice it per your instructions.`, {
      agentType: 'config-export',
      label: 'config',
      phase: 'Gather',
      schema: CONFIG,
    }),
]);
let explore = explore0;
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
  } else if (d.do === 'halt') {
    log(`HALT by checkpoint: ${d.hint || ''}`);
    return await finish({ stoppedAfter: 'gather', haltedBy: 'checkpoint' });
  }
}
if (explore) await ensureFile(`${R}/explore.json`, explore, 'explore-file', 'Gather');
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
const briefPlan = await run(`bun scripts/agentic/briefs.ts ${RUN} --json`, 'briefs', 'Understand');
const batches =
  stageFlag('understand', 'run') === 'skip'
    ? []
    : (briefPlan && briefPlan.json && briefPlan.json.batches) || [args.routes];
let understood = null;
const understandPrompt = (routes, i, n, hint, attempt) =>
  `runId: ${RUN}. Capture folder C: ${C}. Batch ${i + 1} of ${n}. Your routes: ${routes.join(', ')}.${routes.some((r) => (planRoute(r).mustCover || []).length) ? ` mustCover: ${JSON.stringify(Object.fromEntries(routes.map((r) => [r, planRoute(r).mustCover || []])))}.` : ''}${hint ? ` RETRY (attempt ${attempt}) — hint from the checkpoint: ${hint}.` : ''} Read everything the explorer captured for this area, plus the backlog entries targeting your routes (bun scripts/agentic/backlog.ts list --target route:<route>), and write, per your instructions, ${C}/briefs/<route folder>/brief.md for each of your routes, ${C}/coverage-plan.${i + 1}.json, and append your probes to ${R}/probes.json.`;
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
    `bun scripts/agentic/briefs.ts merge ${RUN} --json`,
    'briefs:merge',
    'Understand'
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
        questions: ok.flatMap((p) => p.questions || []),
        notes: ok
          .map((p) => p.notes || '')
          .filter(Boolean)
          .join(' '),
      }
    : null;
  if (understood)
    await ensureFile(`${R}/understand.json`, understood, 'understand-file', 'Understand');
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
  const plan = await run(`cat ${C}/coverage-plan.json`, 'coverage-plan', 'Understand');
  const pj = (plan && plan.json) || {};
  const probeList = await run(
    `test -f ${C}/probes.json && cat ${C}/probes.json || echo '[]'`,
    'probes-list',
    'Understand'
  );
  const nProbes = Array.isArray(probeList && probeList.json) ? probeList.json.length : 0;
  understood = {
    area: args.area,
    briefs: 0,
    probes: nProbes,
    controls: {
      owned: 0,
      unowned: (pj.unowned || []).length,
      shared: 0,
      conflicts: (pj.conflicts || []).length,
    },
    emptyRoutes: pj.emptyRoutes || [],
    notInCapture: pj.notInCapture || [],
    questions: [],
  };
  log(`understand: all ${args.routes.length} route(s) already briefed in ${CAPTURE} — reused`);
}
const notInCapture = new Set(understood.notInCapture || []);

if (captureOnly) {
  log(`capture-only: ${understood.briefs} brief(s) written to ${C}; no pages written`);
  return await finish({ stoppedAfter: 'understand', captureOnly: true });
}

// ── 3 · Probe (MCP, no browser) ──────────────────────────────────────────────
const PROBES = writeOnly ? `${C}/probes.json` : `${R}/probes.json`;
const planProbes = (plan && plan.probes) || {};
const runnerPrompt = (hint, attempt) =>
  `runId: ${RUN}. Run the probes in ${PROBES} per your instructions${planProbes.priority && planProbes.priority.length ? `; priority: ${planProbes.priority.join(', ')}` : ''}${planProbes.add && planProbes.add.length ? `; add these probes from the orchestrator: ${JSON.stringify(planProbes.add).slice(0, 2500)}` : ''}${hint ? `. RETRY (attempt ${attempt}) — hint from the checkpoint: ${hint}` : ''} and write ${R}/answers.md and ${R}/runner.json.`;
let probed =
  stageFlag('probe', 'run') !== 'skip' &&
  (understood.probes > 0 || (planProbes.add && planProbes.add.length))
    ? await A(runnerPrompt('', 1), {
        agentType: 'runner',
        label: `probe:${args.area}`,
        phase: 'Probe',
        schema: RUNNER,
      })
    : null;
if (
  stageFlag('probe', 'run') !== 'skip' &&
  (understood.probes > 0 || (planProbes.add && planProbes.add.length))
) {
  const d = await checkpoint('probe', probed, { agent: 'runner' });
  if (d.do === 'retry' && d.agent === 'runner')
    probed =
      (await A(runnerPrompt(d.hint, d.attempt || 2), {
        agentType: 'runner',
        label: `probe:${args.area}:retry`,
        phase: 'Probe',
        schema: RUNNER,
      })) || probed;
  else if (d.do === 'halt') return await finish({ stoppedAfter: 'probe', haltedBy: 'checkpoint' });
}
if (probed) await ensureFile(`${R}/runner.json`, probed, 'runner-file', 'Probe');

// ── 4 · IA (barrier, conditional) ─────────────────────────────────────────────
const unowned = (understood.controls && understood.controls.unowned) || 0;
const conflicts = (understood.controls && understood.controls.conflicts) || 0;
const empty = (understood.emptyRoutes || []).length;
let ia = null;
const iaFlag = stageFlag('ia', 'auto');
if (iaFlag === 'run' || (iaFlag === 'auto' && (unowned > 0 || empty > 0 || conflicts > 0))) {
  ia = await A(
    `runId: ${RUN}. Capture folder C: ${C}. The understand step left ${unowned} control(s) unowned, ${conflicts} conflict(s) and ${empty} route(s) empty. Decide per your instructions (assign / relabel / reorder / propose — never add a route), apply, and write ${R}/ia.json and ${R}/routes-final.json.`,
    { agentType: 'ia-agent', label: `ia:${args.area}`, phase: 'IA', schema: IA }
  );
  // The ia-agent has no shell: a route it adds to the map exists only once gen-stubs writes
  // its page, and a sidebar slug without a page fails the build.
  await run(`bun run stubs > /dev/null 2>&1 && echo '{"stubs":true}'`, 'stubs', 'IA');
  log(`IA: ${ia && ia.decisions ? ia.decisions.length : 0} decision(s)`);
  const d = await checkpoint('ia', ia, { agent: 'ia-agent' });
  if (d.do === 'halt') return await finish({ stoppedAfter: 'ia', haltedBy: 'checkpoint' });
} else log(iaFlag === 'skip' ? 'IA: skipped by the plan' : 'IA: nothing unowned — skipped');
const finalList = await run(
  `test -f ${R}/routes-final.json && cat ${R}/routes-final.json || echo '{"routes":${JSON.stringify(args.routes)}}'`,
  'routes-final',
  'IA'
);
const iaRoutes =
  (finalList &&
    finalList.json &&
    Array.isArray(finalList.json.routes) &&
    finalList.json.routes.length &&
    finalList.json.routes.map((r) => (typeof r === 'string' ? r : r.route))) ||
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
for (const x of (plan && plan.routes) || [])
  if (x.action === 'skip') log(`skip ${x.route} (plan): ${x.reason || ''}`);

// ── 5 · Write → gates → review ⟲ fix (once) → gates → verdict, per route ─────
// Evaluator = gates (deterministic) + reviewer (checklist over the gates' evidence).
// Optimizer = the writer in fix mode, once, on the fixable findings only. Max 2 writer passes.
const gatesFor = (r, label) =>
  run(`bun scripts/agentic/gates.ts ${RUN} ${r} --json`, label, 'Write');
const parkedText = (g) =>
  Object.entries(g.gates)
    .filter(([, x]) => x.status !== 'PASS')
    .map(([k]) => k)
    .join(', ');
const written = await pipeline(
  finalRoutes,
  (r) => run(`bun scripts/agentic/prepare-write.ts ${RUN} ${r} --json`, `prepare:${r}`, 'Write'),
  async (p, r) => {
    if (!(p && p.ok)) return null;
    const pr = planRoute(r);
    const writerPrompt = (hint, attempt) =>
      `runId: ${RUN}. route: ${r}. Capture folder C: ${C}.${(pr.mustCover || []).length ? ` mustCover: ${JSON.stringify(pr.mustCover)}.` : ''}${(pr.expectedImages || []).length ? ` expectedImages: ${JSON.stringify(pr.expectedImages)}.` : ''}${hint ? ` RETRY (attempt ${attempt}) — hint from the checkpoint: ${hint}.` : ''} Write the page from ${BRIEF(r)} per your instructions — outline first (${RD(r)}/outline.md), then the page with the Write tool, every section with its Image — and write ${RD(r)}/write.json.`;
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
    const changed = await run(
      `cmp -s ${RD(r)}/before.md ${REPO}/src/content/docs/${r}.md && echo '{"changed":false}' || echo '{"changed":true}'`,
      `changed:${r}`,
      'Write'
    );
    if (changed && changed.json && changed.json.changed) {
      log(`${r}: writer returned nothing but the page changed — gating it anyway (no write.json)`);
      return { w: null, wrote: true, noWriteJson: true };
    }
    return null;
  },
  (x, r) => (x && x.wrote ? gatesFor(r, `gates:${r}`).then((g) => ({ ...x, g })) : null),
  async (x, r) => {
    if (!x || !x.g || !x.g.json) return null;
    const noWriteJson = !!x.noWriteJson;
    let g = x.g.json;
    if (!g.ok) {
      log(`parked ${r}: ${parkedText(g)}`);
      return { gates: g, noWriteJson, passes: 1 };
    }
    await run(`bun scripts/agentic/sync-map.ts ${RUN} ${r} --json`, `sync-map:${r}`, 'Write');
    // Evaluate — with memory: the route's previous review (index.json → last run) and the
    // open backlog entries that target it, so recurring findings read as recurring.
    const prev = await run(
      `bun scripts/agentic/backlog.ts list --target route:${r} --json`,
      `backlog:${r}`,
      'Write'
    );
    const prevReview = await run(
      `P=$(jq -r '.["${r}"].runId // empty' ${REPO}/_private/agentic-v2/index.json); test -n "$P" && test -f ${REPO}/_private/agentic-v2/runs/$P/${r.replace(/\//g, '-')}/review.json && echo "{\"path\":\"${REPO}/_private/agentic-v2/runs/$P/${r.replace(/\//g, '-')}/review.json\"}" || echo '{"path":null}'`,
      `prev-review:${r}`,
      'Write'
    );
    const prevPath = prevReview && prevReview.json && prevReview.json.path;
    const openForRoute = (prev && prev.json && prev.json.entries) || [];
    const review = await A(
      `Review the route ${r}. Run folder: ${R}. Capture folder: ${C}. Read ${RD(r)}/gates.json (its values / section-image / links / coverage evidence) and ${RD(r)}/outline.md first, then the brief at ${BRIEF(r)} and the snapshots in ${C}/states/; what the product did is in ${R}/answers.md.${prevPath ? ` The previous review of this route is ${prevPath} — re-check its findings and do not rediscover them.` : ''}${openForRoute.length ? ` Open backlog entries this page owes: ${JSON.stringify(openForRoute.map((e) => ({ id: e.id, what: e.what }))).slice(0, 2500)} — close the ones the page now satisfies via resolvedBacklog.` : ''} Work your checklist, mark each finding fixable or not with needs {kind, target, what} on the non-fixable ones, and write ${RD(r)}/review.json as {route, verdict, findings: [{kind, line, what, evidence, fixable, needs}], questions: [{what, needs}], resolvedBacklog: [ids]}.`,
      { agentType: 'doc-reviewer', label: `review:${r}`, phase: 'Write', schema: REVIEW }
    );
    if (review) await ensureFile(`${RD(r)}/review.json`, review, `review-file:${r}`, 'Write');
    const settle = async () => {
      await run(
        `bun scripts/agentic/backlog.ts add ${RUN} ${r} --json`,
        `backlog-add:${r}`,
        'Write'
      );
      await run(
        `bun scripts/agentic/backlog.ts resolve ${RUN} ${r} --json`,
        `backlog-resolve:${r}`,
        'Write'
      );
    };
    const fixable = ((review && review.findings) || []).filter((f) => f && f.fixable);
    if (!review || review.verdict === 'ready' || !fixable.length) {
      await settle();
      return { gates: g, review, noWriteJson, passes: 1, fixed: 0 };
    }
    // Optimize, once.
    const fix = await A(
      `runId: ${RUN}. route: ${r}. Capture folder C: ${C}. Fix mode: the reviewer returned these fixable findings — ${JSON.stringify(fixable).slice(0, 4000)}. Fix exactly those on the page with Edit, per your Fix mode instructions, update ${RD(r)}/write.json and return it with fixed: <n>.`,
      { agentType: 'writer', label: `fix:${r}`, phase: 'Write', schema: WRITE }
    );
    const g2 = await gatesFor(r, `gates2:${r}`);
    g = (g2 && g2.json) || g;
    if (!g.ok) {
      log(`parked ${r} after fix: ${parkedText(g)}`);
      await settle();
      return { gates: g, review, noWriteJson, passes: 2, fixed: (fix && fix.fixed) || 0 };
    }
    await run(`bun scripts/agentic/sync-map.ts ${RUN} ${r} --json`, `sync-map2:${r}`, 'Write');
    const verdict = await A(
      `Verdict-only mode for the route ${r}. Run folder: ${R}. Capture folder: ${C}. The writer applied these findings: ${JSON.stringify(fixable.map((f) => ({ line: f.line, what: f.what }))).slice(0, 3000)}. Re-check only those lines against the capture and write ${RD(r)}/review.json as {route, verdict, resolved: [{line, resolved}], findings: [], questions: []}.`,
      { agentType: 'doc-reviewer', label: `verdict:${r}`, phase: 'Write', schema: REVIEW }
    );
    if (verdict) await ensureFile(`${RD(r)}/review.json`, verdict, `verdict-file:${r}`, 'Write');
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
let subtaskResults = [];
if (PLAN_ON && !loginHalted && !captureOnly) {
  const proposed = await A(
    `mode: delegate. runId: ${RUN}. Capture folder C: ${C}. Routes written this run: ${finalRoutes.join(', ')}. Read the open backlog, this run's per-route gates/review/write files and ${R}/answers.md per your DELEGATE mode, write ${R}/subtasks.json and return {subtasks: [...]}.`,
    { agentType: 'planner', label: `delegate:${args.area}`, phase: 'Delegate', schema: SUBTASKS }
  );
  if (proposed)
    await ensureFile(`${R}/subtasks.json`, proposed.subtasks || [], 'subtasks-file', 'Delegate');
  const valid = await run(
    `bun scripts/agentic/orchestrate.ts subtasks ${RUN} --validate --json`,
    'subtasks:validate',
    'Delegate'
  );
  const subtasks = (valid && valid.json && valid.json.subtasks) || [];
  if (valid && valid.json && valid.json.dropped && valid.json.dropped.length)
    log(
      `delegate: ${valid.json.dropped.length} subtask(s) dropped — ${valid.json.dropped.join('; ').slice(0, 400)}`
    );
  log(`delegate: ${subtasks.length} subtask(s)`);
  subtaskResults = await parallel(
    subtasks.map((t) => async () => {
      if (t.kind === 'probe') {
        const rr = await A(
          `runId: ${RUN}. Run exactly these probes from the orchestrator (append to ${R}/answers.md and ${R}/runner.json; ids as given): ${JSON.stringify(t.probes).slice(0, 3000)}. Backlog ids they answer: ${t.backlog.join(', ')}.`,
          { agentType: 'runner', label: `subtask:probe`, phase: 'Delegate', schema: RUNNER }
        );
        return { kind: 'probe', ok: !!rr, backlog: t.backlog };
      }
      if (t.kind === 'rebrief') {
        const u = await A(
          understandPrompt([t.route], 0, 1, `re-brief this route: ${t.instructions}`, 1),
          {
            agentType: 'understand',
            label: `subtask:rebrief:${t.route}`,
            phase: 'Delegate',
            schema: UNDERSTAND,
          }
        );
        await run(
          `bun scripts/agentic/briefs.ts merge ${RUN} --json`,
          `subtask:merge:${t.route}`,
          'Delegate'
        );
        return { kind: 'rebrief', route: t.route, ok: !!u, backlog: t.backlog };
      }
      // fix-page: writer fix mode → gates → reviewer verdict → backlog resolve
      await run(
        `bun scripts/agentic/prepare-write.ts ${RUN} ${t.route} --json`,
        `subtask:prepare:${t.route}`,
        'Delegate'
      );
      const fx = await A(
        `runId: ${RUN}. route: ${t.route}. Capture folder C: ${C}. Fix mode, from the orchestrator: ${t.instructions} Backlog ids this closes: ${t.backlog.join(', ')} — quote them in write.json.backlog. Edit the page in place per your Fix mode instructions, update ${RD(t.route)}/write.json and return it with fixed: <n>.`,
        { agentType: 'writer', label: `subtask:fix:${t.route}`, phase: 'Delegate', schema: WRITE }
      );
      const g = await gatesFor(t.route, `subtask:gates:${t.route}`);
      const ok = !!(g && g.json && g.json.ok);
      if (ok) {
        await run(
          `bun scripts/agentic/sync-map.ts ${RUN} ${t.route} --json`,
          `subtask:sync:${t.route}`,
          'Delegate'
        );
        const v = await A(
          `Verdict-only mode for the route ${t.route}. Run folder: ${R}. Capture folder: ${C}. The orchestrator asked the writer to: ${t.instructions} (backlog ${t.backlog.join(', ')}). Re-check the page for exactly that and write ${RD(t.route)}/review.json as {route, verdict, resolved: [{line, resolved}], resolvedBacklog: [ids], findings: [], questions: []}.`,
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
            v,
            `subtask:verdict-file:${t.route}`,
            'Delegate'
          );
        await run(
          `bun scripts/agentic/backlog.ts resolve ${RUN} ${t.route} --json`,
          `subtask:resolve:${t.route}`,
          'Delegate'
        );
      } else
        log(
          `subtask fix-page ${t.route}: gates ${g && g.json ? parkedText(g.json) : 'absent'} — page kept, not resolved`
        );
      return { kind: 'fix-page', route: t.route, ok: !!fx, gatesOk: ok, backlog: t.backlog };
    })
  );
  await run(
    `echo '${JSON.stringify(subtaskResults).replace(/'/g, "'\\''")}' > ${R}/subtasks.results.json`,
    'subtasks:results',
    'Delegate'
  );
}

// ── 6 · Build once, report, cleanup, learn ───────────────────────────────────
const build = await run(
  `bun run verify > /dev/null 2>&1 && echo '{"buildOk":true}' || echo '{"buildOk":false}'`,
  'build',
  'Report'
);
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
  buildOk: !!(build && build.json && build.json.buildOk),
  summary,
  plan: plan
    ? {
        defaults: !!plan.defaults,
        routes: plan.routes.length,
        skipped: plan.routes.filter((x) => x.action === 'skip').length,
        added: plan.added || [],
        fallbacks: plan.fallbacks || [],
      }
    : null,
  skippedByCheckpoint: [...skippedByCheckpoint],
  subtasks: subtaskResults,
});
```

## 5. After the run

1. `cat _private/agentic-v2/runs/<runId>/report.md` — the per-route table (controls, coverage,
   unconfirmed facts, images, FAQ, gates with link warnings, review, outcome, cross-area
   marks), the explore audit (states, images on disk, what was not opened or excluded by
   policy, denials), the coverage plan (unowned, conflicts, not in capture), the probes, the
   IA decisions and **proposed routes** (never added — your call), the reviewer's findings, the
   playground line (agents created / deleted / **leftovers**, config restored), the diff
   commands split into pages written / stubs regenerated / already dirty. A non-empty leftovers
   list or a NOT restored config is the first thing you say.
2. If the build was red: `bun run verify` yourself to show the error; the diff still stands.
3. Put in front of Fabio, in this order: the report; halted or parked routes with reasons; the
   reviewer's findings; the questions from understand/IA; the token figures from the Workflow
   result; then the exact `git diff` command per changed file (pages, `astro.config.mjs`,
   `scripts/migration-map.json`, `public/img/<area>/`). **Do not commit, do not push, do not
   set `adopted`.**
4. If the explorer halted on login: say so first, and give the exact `--resume` command.
5. Say what the run taught the next one: the lines `learn.ts` appended to
   `_private/agentic-v2/conventions.md` (in the Workflow result as `learned`).
