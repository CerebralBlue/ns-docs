---
name: docs-explore
description: Run the NeuralDocs v3 pipeline over ONE console area — explore the screen with the browser (every state, screenshots), understand it (briefs per route, coverage plan, probes), probe behaviour on the playground through the MCP, decide the IA if something is unowned, write every route the area owns (contract + FAQ), gate, review once, build once, report, clean the playground up. Leaves every change as an uncommitted diff. Use when Fabio types /docs-explore; never invoke on your own.
argument-hint: '<area> [--only <route>]… [--resume <workflow-run-id> --run <ledger-run-id>] [--attempt <n>]'
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

## 2. Open the run (unless resuming)

```
bun scripts/agentic/queue.ts <area> [--only <route>]… --json
```

Read the JSON: `runId`, `routes`, `kind`, `url`, `alsoReads`, `sidebar`, `notInSidebar`. Show
the route list. If `sidebar` is empty, say so — the IA step has no group to edit, the writers
still run.

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
`args: { "runId": "<runId>", "area": "<area>", "kind": "<kind>", "routes": <routes[]>, "repo": "/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs", "attempt": <n or omit> }`.
(This instruction is the opt-in for multi-agent orchestration.) Note the Workflow's own run id
from the tool result next to the ledger id.

```js
export const meta = {
  name: 'docs-explore',
  description:
    'Explore one console area on the playground, understand it, write every route it owns from the screen — no commits',
  phases: [
    { title: 'Gather', detail: 'explorer (browser) ∥ config export' },
    { title: 'Understand', detail: 'briefs per route, coverage plan, probes' },
    { title: 'Probe', detail: 'runner: the listed MCP probes' },
    { title: 'IA', detail: 'only when something is unowned; then bun run stubs' },
    { title: 'Write', detail: 'prepare-write → writer → gates → reviewer, per route' },
    { title: 'Report', detail: 'bun run verify once, report.ts' },
    { title: 'Cleanup', detail: 'delete docs-* agents, confirm config restored' },
    { title: 'Learn', detail: 'learn.ts → conventions.md' },
  ],
};

// A subagent that dies (context exhausted before StructuredOutput, API error) must cost one
// route, not the run: every agent call goes through A(), which turns a throw into null.
const A = (prompt, opts) =>
  agent(prompt, opts).catch((e) => {
    log(
      `agent failed (${(opts && opts.label) || '?'}): ${String(e && e.message ? e.message : e).slice(0, 160)}`
    );
    return null;
  });
const REPO = args.repo;
const RUN = args.runId;
const R = `${REPO}/_private/agentic-v2/runs/${RUN}`;
const RD = (r) => `${R}/${r.replace(/\//g, '-')}`;
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
    area: args.area,
    loginHalted,
    cleanup: cleaned,
    learned: learned && learned.json,
    report: report && report.json,
    ...extra,
  };
};

// ── 1 · Gather: explorer (browser) ∥ config export ───────────────────────────
const isReference = args.kind === 'reference';
const [explore, config] = await parallel([
  () =>
    isReference
      ? null
      : A(`runId: ${RUN}. Walk the area per your instructions and return the summary.`, {
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
if (explore) await ensureFile(`${R}/explore.json`, explore, 'explore-file', 'Gather');
if (explore && explore.halt === 'login') {
  loginHalted = true;
  log(
    `HALT: console session expired — re-login in the headed Chrome window, then /docs-explore ${args.area} --resume <workflow-run-id> --run ${RUN}`
  );
  return await finish({ stoppedAfter: 'explore' });
}
if (!isReference && !explore)
  log('explorer returned nothing — understanding from whatever states.json holds');
if (config && config.error)
  log(`config export failed: ${config.error} — no restore point this run`);
log(
  explore
    ? `explore: ${explore.states} states, ${explore.images} images, map ${explore.map && explore.map.status}`
    : 'explore: skipped (reference kind)'
);

// ── 2 · Understand (barrier) ─────────────────────────────────────────────────
const understood = await A(
  `runId: ${RUN}. Read everything the explorer captured for this area and write, per your instructions, ${R}/coverage-plan.json, ${R}/probes.json and one brief.md per route under ${R}/<route folder>/.`,
  {
    agentType: 'understand',
    label: `understand:${args.area}`,
    phase: 'Understand',
    schema: UNDERSTAND,
  }
);
if (understood)
  await ensureFile(`${R}/understand.json`, understood, 'understand-file', 'Understand');
if (!understood) {
  log('understand returned nothing — no briefs, nothing to write');
  return await finish({ stoppedAfter: 'understand' });
}
log(
  `understand: ${understood.briefs} briefs, ${understood.probes || 0} probes, empty routes: ${(understood.emptyRoutes || []).join(', ') || 'none'}`
);

// ── 3 · Probe (MCP, no browser) ──────────────────────────────────────────────
const probed =
  understood.probes > 0
    ? await A(
        `runId: ${RUN}. Run the probes in ${R}/probes.json per your instructions and write ${R}/answers.md and ${R}/runner.json.`,
        {
          agentType: 'runner',
          label: `probe:${args.area}`,
          phase: 'Probe',
          schema: RUNNER,
        }
      )
    : null;
if (probed) await ensureFile(`${R}/runner.json`, probed, 'runner-file', 'Probe');

// ── 4 · IA (barrier, conditional) ─────────────────────────────────────────────
const unowned = (understood.controls && understood.controls.unowned) || 0;
const empty = (understood.emptyRoutes || []).length;
let ia = null;
if (unowned > 0 || empty > 0) {
  ia = await A(
    `runId: ${RUN}. The understand step left ${unowned} control(s) unowned and ${empty} route(s) empty. Decide per your instructions, apply, and write ${R}/ia.json and ${R}/routes-final.json.`,
    { agentType: 'ia-agent', label: `ia:${args.area}`, phase: 'IA', schema: IA }
  );
  // The ia-agent has no shell: a route it adds to the map exists only once gen-stubs writes
  // its page, and a sidebar slug without a page fails the build.
  await run(`bun run stubs > /dev/null 2>&1 && echo '{"stubs":true}'`, 'stubs', 'IA');
  log(`IA: ${ia && ia.decisions ? ia.decisions.length : 0} decision(s)`);
} else log('IA: nothing unowned — skipped');
const finalList = await run(
  `test -f ${R}/routes-final.json && cat ${R}/routes-final.json || echo '{"routes":${JSON.stringify(args.routes)}}'`,
  'routes-final',
  'IA'
);
const finalRoutes =
  (finalList &&
    finalList.json &&
    Array.isArray(finalList.json.routes) &&
    finalList.json.routes.length &&
    finalList.json.routes.map((r) => (typeof r === 'string' ? r : r.route))) ||
  args.routes;

// ── 5 · Write → gates → review, per route (parallel across routes) ───────────
const written = await pipeline(
  finalRoutes,
  (r) => run(`bun scripts/agentic/prepare-write.ts ${RUN} ${r} --json`, `prepare:${r}`, 'Write'),
  (p, r) =>
    p && p.ok
      ? A(
          `runId: ${RUN}. route: ${r}. Write the page from ${RD(r)}/brief.md per your instructions and write ${RD(r)}/write.json.`,
          {
            agentType: 'writer',
            label: `write:${r}`,
            phase: 'Write',
            schema: WRITE,
          }
        )
      : null,
  (w, r) =>
    w ? run(`bun scripts/agentic/gates.ts ${RUN} ${r} --json`, `gates:${r}`, 'Write') : null,
  async (g, r) => {
    if (!g || !g.json) return null;
    if (!g.json.ok) {
      log(
        `parked ${r}: ${Object.entries(g.json.gates)
          .filter(([, x]) => x.status !== 'PASS')
          .map(([k]) => k)
          .join(', ')}`
      );
      return { gates: g.json };
    }
    // One review, findings only — no rewrite loop; the report carries the findings.
    const review = await A(
      `Review the route ${r}. The pipeline's brief is in ${RD(r)}/brief.md; the snapshots in ${R}/states/; what the product did in ${R}/answers.md. Return your findings in your usual format and also write ${RD(r)}/review.json as {route, verdict, findings, questions}.`,
      { agentType: 'doc-reviewer', label: `review:${r}`, phase: 'Write', schema: REVIEW }
    );
    return { gates: g.json, review };
  }
);

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
  return `${outcome.padEnd(16)} ${r}`;
});
log(summary.join('\n'));
return await finish({ buildOk: !!(build && build.json && build.json.buildOk), summary });
```

## 5. After the run

1. `cat _private/agentic-v2/runs/<runId>/report.md` — the per-route table (controls, coverage,
   unconfirmed facts, images, FAQ, gates, review, outcome), the explore audit (states, images,
   what could not be opened, denials), the probes, the IA decisions, the reviewer's findings,
   the playground line (agents created / deleted / **leftovers**, config restored), the diff
   commands. A non-empty leftovers list or a NOT restored config is the first thing you say.
2. If the build was red: `bun run verify` yourself to show the error; the diff still stands.
3. Put in front of Fabio, in this order: the report; halted or parked routes with reasons; the
   reviewer's findings; the questions from understand/IA; the token figures from the Workflow
   result; then the exact `git diff` command per changed file (pages, `astro.config.mjs`,
   `scripts/migration-map.json`, `public/img/<area>/`). **Do not commit, do not push, do not
   set `adopted`.**
4. If the explorer halted on login: say so first, and give the exact `--resume` command.
5. Say what the run taught the next one: the lines `learn.ts` appended to
   `_private/agentic-v2/conventions.md` (in the Workflow result as `learned`).
