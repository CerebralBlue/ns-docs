---
name: docs-verify
description: Run the NeuralDocs v2 pipeline over a section — gather (repo · MCP config · console component map) → verify every page against the playground console and run small probes → compile evidence → IA decision → design (if flagged) → write → gates → review → build once → report → clean the playground up. Leaves every change as an uncommitted diff. Use when Fabio types /docs-verify; never invoke on your own.
disable-model-invocation: false
argument-hint: '<route-prefix> [--only <route>] [--no-write] [--refresh-map] [--resume <workflow-run-id> --run <ledger-run-id>]'
allowed-tools: Bash(bun scripts/agentic/*), Bash(git status *), Bash(git diff *), Bash(bun run verify), Bash(cat _private/agentic-v2/*), Read, Workflow
---

# /docs-verify — run the pipeline

Arguments: `$ARGUMENTS`

You are the operator. You do not verify, decide or write pages yourself — the agents do, the
scripts decide what passes, and the two hooks lock every browser and MCP call to the
**playground** instance (production is on a locked list). Your job is to open the run, launch
the Workflow, and put the result in front of Fabio.
**Nothing is committed. Ever. `adopted` is never set by the pipeline. The playground is left
as it was found — the cleanup stage runs on every exit.**

The design, with the diagram: `_private/agentic-v2/diagrams/architecture.html`.

## 1. Parse

- First bare word = the route prefix (`seek/`, `maistro/ntl/`, or `--all`).
- `--only <route>` restricts the queue. `--no-write` stops after Compile (no IA, design, write).
- `--refresh-map` makes the map-agent rebuild every area even if the cache is fresh.
- `--resume <workflow-run-id> --run <ledger-run-id>` re-launches with `resumeFromRunId`; both ids
  are in the previous run's `section/report.md` / the earlier tool result.

## 2. Open the run (unless resuming)

```
bun scripts/agentic/queue.ts <prefix> [--only <route>] --json
```

Read the JSON: `runId`, `routes`, `areas`, `proposals`, `sidebar`, `notInSidebar`. Show the route
list. If `proposals` is non-empty, the map has no `console` field for those routes: say so — the
run uses the proposal (the section's own area) for them, and Fabio should add `console` to the
map afterwards. If `sidebar` is null, stop and ask: the IA stage needs a group to edit.

## 3. Preconditions — check, do not assume

- `git status --porcelain src/content/docs/<prefix> astro.config.mjs scripts/migration-map.json`
  must be empty (the report attributes changes to this run). If not, stop and ask.
- `_private/agentic-v2/current-run` now names this run (queue.ts wrote it — the hooks log to it).
- `queue.ts` already refused to run unless `.neuralseekrc.json` points at the playground named
  in `_private/agentic-v2/instances.json`; if it exited 2, relay its message and stop.
- The Playwright profile must hold a live Auth0 session for the playground. Not checkable from
  here; the map-agent returns `halt: "login"` if it is not, and the run stops itself.

## 4. Launch the Workflow

Call the **Workflow** tool with
`args: { "runId": "<runId>", "prefix": "<prefix>", "routes": <routes[]>, "areas": <areas[]>, "noWrite": <bool>, "refreshMap": <bool>, "repo": "/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs" }`
and the script below, verbatim. (This instruction is the opt-in for multi-agent orchestration.)
Note the Workflow's own run id from the tool result next to the ledger id.

```js
export const meta = {
  name: 'docs-verify',
  description:
    'Verify a docs section against the production console, then rewrite it from evidence — no commits',
  phases: [
    { title: 'Gather', detail: 'docs-agent per route · config export · map-agent (browser)' },
    {
      title: 'Verify',
      detail: 'verifier per route, one at a time (one browser) · runner per route (MCP probes)',
    },
    { title: 'Compile', detail: 'compile.ts → evidence.md, coverage.json' },
    { title: 'IA', detail: 'ia-agent, section barrier' },
    { title: 'Design', detail: 'designer, only when a route is flagged' },
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
const RD = (r) => `${REPO}/_private/agentic-v2/runs/${RUN}/${r.replace(/\//g, '-')}`;

// Scripts run through a cheap wrapper agent: the workflow itself has no shell.
const SCRIPT = {
  type: 'object',
  properties: { ok: { type: 'boolean' }, json: { type: 'object' }, stderr: { type: 'string' } },
  required: ['ok'],
};
const run = (cmd, label, phase) =>
  A(
    `From ${REPO}, run exactly this command and nothing else:\n\n${cmd}\n\nReturn {ok: <exit code was 0>, json: <the JSON it printed, parsed>, stderr: <stderr if any>}. Do not fix anything, do not run anything else.`,
    { label, phase, schema: SCRIPT, model: 'haiku', effort: 'low', agentType: 'general-purpose' }
  );

const DOCS = {
  type: 'object',
  properties: {
    route: { type: 'string' },
    claims: { type: 'array' },
    questions: { type: 'array' },
    needs_component: { type: 'object' },
  },
  required: ['route', 'claims'],
};
const MAP = {
  type: 'object',
  properties: {
    halt: { type: ['string', 'null'] },
    areas: { type: 'object' },
    navigations: { type: 'number' },
  },
  required: ['areas'],
};
const CONFIG = {
  type: 'object',
  properties: {
    source: { type: 'string' },
    keyCount: { type: 'number' },
    error: { type: 'string' },
  },
};
const VERDICTS = {
  type: 'object',
  properties: {
    route: { type: 'string' },
    halt: { type: ['string', 'null'] },
    navigations: { type: 'number' },
    verdicts: { type: 'array' },
    observed: { type: 'array' },
    map_gaps: { type: 'array' },
  },
  required: ['route', 'verdicts'],
};
const RUNNER = {
  type: 'object',
  properties: {
    route: { type: 'string' },
    probes: { type: 'number' },
    verdicts: { type: 'array' },
    created: { type: 'array' },
    configChanged: { type: 'array' },
    notes: { type: 'string' },
  },
  required: ['route', 'verdicts'],
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
const IA = {
  type: 'object',
  properties: {
    section: { type: 'string' },
    decisions: { type: 'array' },
    questions: { type: 'array' },
  },
  required: ['decisions'],
};
const DESIGN = { type: 'object', properties: { routes: { type: 'object' } }, required: ['routes'] };
const WRITE = {
  type: 'object',
  properties: {
    route: { type: 'string' },
    edits: { type: 'array' },
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

// One browser profile → every browser stage is a critical section.
let browser = Promise.resolve();
let loginHalted = false;
const withBrowser = (fn) => {
  const p = browser.then(fn);
  browser = p.catch(() => {});
  return p;
};
const learn = () => run(`bun scripts/agentic/learn.ts ${RUN} --json`, 'learn', 'Learn');
const cleanup = () =>
  A(
    `runId: ${RUN}. Leave the playground as the run found it per your instructions and write section/cleanup.json.`,
    { agentType: 'cleanup', label: 'cleanup', phase: 'Cleanup', schema: CLEANUP }
  );
const halt = (why) => {
  loginHalted = true;
  log(
    `HALT: ${why} — re-login in the headed Chrome window, then /docs-verify … --resume <workflow-run-id> --run ${RUN}`
  );
};

// ── 1 · Gather ────────────────────────────────────────────────────────────────
const gather = await parallel([
  () =>
    withBrowser(() =>
      A(
        `runId: ${RUN}. refreshMap: ${!!args.refreshMap}. Areas: ${args.areas.join(', ')}. Bring the component map current for these areas per your instructions.`,
        { agentType: 'map-agent', label: 'map', phase: 'Gather', schema: MAP }
      )
    ),
  () =>
    A(`runId: ${RUN}. Export the instance config and slice it per your instructions.`, {
      agentType: 'config-export',
      label: 'config',
      phase: 'Gather',
      schema: CONFIG,
    }),
  ...args.routes.map(
    (r) => () =>
      A(
        `runId: ${RUN}. route: ${r}. Decompose this page into claims per your instructions and write ${RD(r)}/docs.json.`,
        { agentType: 'docs-agent', label: `docs:${r}`, phase: 'Gather', schema: DOCS }
      )
  ),
]);
const mapResult = gather[0];
// An explicit login halt stops the run. A map-agent that returned nothing (browser closed,
// agent failed) is not fatal by itself: the verifier can work from the cached map.
if (mapResult && mapResult.halt === 'login') halt('console session expired during the map stage');
else if (!mapResult) log('map-agent returned nothing — continuing on the cached component map');
if (mapResult)
  log(
    `map: ${Object.entries(mapResult.areas || {})
      .map(([a, s]) => `${a} ${s.status}`)
      .join(' · ')}`
  );
if (gather[1] && gather[1].error)
  log(`config export failed: ${gather[1].error} — config tier is ABSENT this run`);
const docsResults = gather.slice(2).filter(Boolean);
// The docs-agent sometimes returns its claims without writing docs.json (5 of 8 routes in one
// run). The return value is the same JSON, so a wrapper writes the file when it is missing.
await parallel(
  docsResults.map(
    (d) => () =>
      A(
        `If the file ${RD(d.route)}/docs.json exists, return {ok: true, json: {existed: true}} and do nothing else. Otherwise create it with the Write tool, its content being exactly this JSON (verbatim, no edits, no reformatting):\n\n${JSON.stringify(d)}\n\nThen return {ok: true, json: {written: true}}.`,
        {
          label: `docs-file:${d.route}`,
          phase: 'Gather',
          schema: SCRIPT,
          model: 'haiku',
          effort: 'low',
          agentType: 'general-purpose',
        }
      )
  )
);
const docsOk = new Set(docsResults.map((d) => d.route));

// ── 2 · Verify (browser, serialized) ∥ Run (MCP probes, parallel) ────────────
const toVerify = args.routes.filter((r) => docsOk.has(r));
const verified = await pipeline(toVerify, (r) =>
  parallel([
    () => {
      if (loginHalted) {
        log(`skip verify ${r}: halted`);
        return null;
      }
      return withBrowser(async () => {
        if (loginHalted) return null;
        const v = await A(
          `runId: ${RUN}. route: ${r}. Verify the claims in ${RD(r)}/docs.json against the playground console per your instructions and write ${RD(r)}/verdicts.json.`,
          { agentType: 'verifier', label: `verify:${r}`, phase: 'Verify', schema: VERDICTS }
        );
        if (v && v.halt === 'login') halt(`console session expired while verifying ${r}`);
        return v;
      });
    },
    () =>
      A(
        `runId: ${RUN}. route: ${r}. Run the probes named in ${RD(r)}/docs.json on the playground per your instructions and write ${RD(r)}/runner.json.`,
        { agentType: 'runner', label: `run:${r}`, phase: 'Verify', schema: RUNNER }
      ),
  ]).then(([v, run]) => ({ v, run }))
);
const verifiedRoutes = toVerify.filter(
  (r, i) => verified[i] && ((verified[i].v && !verified[i].v.halt) || verified[i].run)
);

// ── 3 · Compile ───────────────────────────────────────────────────────────────
const compiled = await run(`bun scripts/agentic/compile.ts ${RUN} --json`, 'compile', 'Compile');
if (!compiled || !compiled.ok) log('compile.ts failed — see the wrapper output');
if (args.noWrite || loginHalted) {
  const cleaned = await cleanup();
  const report = await run(`bun scripts/agentic/report.ts ${RUN} --json`, 'report', 'Report');
  const learned = await learn();
  return {
    runId: RUN,
    stoppedAfter: loginHalted ? 'halt' : 'compile',
    learned: learned && learned.json,
    verified: verifiedRoutes,
    loginHalted,
    cleanup: cleaned,
    report: report && report.json,
  };
}

// ── 4 · IA (barrier) ──────────────────────────────────────────────────────────
const ia = await A(
  `runId: ${RUN}. section: ${args.prefix}. Decide the section's tree per your instructions, apply it, and write section/ia.json and section/routes-final.json.`,
  { agentType: 'ia-agent', label: 'ia', phase: 'IA', schema: IA }
);
// The ia-agent has no shell: a route it adds to the map exists only once gen-stubs writes
// its page, and a sidebar slug without a page fails the build.
await run(`bun run stubs > /dev/null 2>&1 && echo '{"stubs":true}'`, 'stubs', 'IA');
const recompiled = await run(
  `bun scripts/agentic/compile.ts ${RUN} --routes-final --json`,
  'compile:final',
  'IA'
);
const finalRoutes =
  (recompiled && recompiled.json && Object.keys(recompiled.json.routes || {})) || verifiedRoutes;
log(
  `IA: ${ia && ia.decisions ? ia.decisions.length : 0} decision(s); ${finalRoutes.length} route(s) to write`
);

// ── 5 · Design (barrier, conditional) ─────────────────────────────────────────
const flagged = finalRoutes.filter((r) => {
  const c = recompiled && recompiled.json && recompiled.json.routes && recompiled.json.routes[r];
  return c && c.needsComponent;
});
if (flagged.length) {
  await A(
    `runId: ${RUN}. Flagged routes: ${flagged.join(', ')}. Decide and deliver per your instructions.`,
    { agentType: 'designer', label: 'design', phase: 'Design', schema: DESIGN }
  );
}

// ── 6 · Write → gates → review, per route ─────────────────────────────────────
const written = await pipeline(
  finalRoutes,
  (r) => run(`bun scripts/agentic/prepare-write.ts ${RUN} ${r} --json`, `prepare:${r}`, 'Write'),
  (p, r) =>
    p && p.ok
      ? A(
          `runId: ${RUN}. route: ${r}. Write the page from ${RD(r)}/evidence.md per your instructions and write ${RD(r)}/write.json.`,
          { agentType: 'writer', label: `write:${r}`, phase: 'Write', schema: WRITE }
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
    const review = await A(
      `Review the route ${r}. The pipeline's evidence is in ${RD(r)}/ — read verdicts.json and evidence.md first. Return your findings in your usual format and also write ${RD(r)}/review.json as {route, verdict, findings, questions}.`,
      { agentType: 'doc-reviewer', label: `review:${r}`, phase: 'Write', schema: REVIEW }
    );
    if (!review || review.verdict === 'ready') return { gates: g.json, review };
    // One writer loop, then park.
    const w2 = await A(
      `runId: ${RUN}. route: ${r}. The reviewer returned needs-work: ${JSON.stringify(review.findings).slice(0, 2000)}. Address every finding you can from the evidence, update ${RD(r)}/write.json, and leave what you cannot in left_unresolved.`,
      { agentType: 'writer', label: `rewrite:${r}`, phase: 'Write', schema: WRITE }
    );
    const g2 = w2
      ? await run(`bun scripts/agentic/gates.ts ${RUN} ${r} --json`, `gates2:${r}`, 'Write')
      : null;
    const review2 =
      g2 && g2.json && g2.json.ok
        ? await A(
            `Second review of ${r} after one rewrite; evidence in ${RD(r)}/. Write ${RD(r)}/review.json.`,
            { agentType: 'doc-reviewer', label: `review2:${r}`, phase: 'Write', schema: REVIEW }
          )
        : null;
    return { gates: g2 && g2.json, review: review2, looped: true };
  }
);

// ── 7 · Build once, report ────────────────────────────────────────────────────
const build = await run(
  `bun run verify > /dev/null 2>&1 && echo '{"buildOk":true}' || echo '{"buildOk":false}'`,
  'build',
  'Report'
);
const cleaned = await cleanup();
const report = await run(`bun scripts/agentic/report.ts ${RUN} --json`, 'report', 'Report');
const learned = await learn();
const summary = finalRoutes.map((r, i) => {
  const w = written[i];
  let outcome = 'dropped';
  if (w && w.review && w.review.verdict === 'ready') outcome = 'ready';
  else if (w && w.gates && !w.gates.ok) outcome = 'parked: gates';
  else if (w && w.review) outcome = 'parked: review';
  return `${outcome.padEnd(16)} ${r}`;
});
log(summary.join('\n'));
return {
  runId: RUN,
  buildOk: !!(build && build.json && build.json.buildOk),
  loginHalted,
  summary,
  cleanup: cleaned,
  learned: learned && learned.json,
  report: report && report.json,
};
```

## 5. After the run

1. `cat _private/agentic-v2/runs/<runId>/section/report.md` — the per-route table, the browser
   audit (navigations, hosts, denials), the playground line (probes by tool, agents created /
   deleted / **leftovers**, config branches changed / restored), the IA decisions, the diff
   commands. A non-empty leftovers list or a NOT CONFIRMED restore is the first thing you say.
2. If the build was red: `bun run verify` yourself to show the error; the diff still stands.
3. Put in front of Fabio, in this order: the report; halted or parked routes with reasons; the
   IA decisions and any `questions` from ia.json; the token/cost figures from the Workflow
   result; then the exact `git diff` command per changed file (pages, `astro.config.mjs`,
   `scripts/migration-map.json`, `public/img/<route>/`). **Do not commit, do not push, do not
   set `adopted`.**
4. If the verifier halted on login: say so first, and give the exact `--resume` command.
5. `--no-write` runs: show `section/coverage.json` per route (verdict counts, uncovered
   controls, integrity problems) — that is the deliverable.
6. Say what the run taught the next one: the lines `learn.ts` appended to
   `_private/agentic-v2/conventions.md` (in the Workflow result as `learned`).
