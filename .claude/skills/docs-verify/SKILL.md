---
name: docs-verify
description: Run the NeuralDocs v2 pipeline over a section — gather (repo · MCP config · console component map) → verify every page against the production console → compile evidence → IA decision → design (if flagged) → write → gates → review → build once → report. Leaves every change as an uncommitted diff. Use when Fabio types /docs-verify; never invoke on your own.
disable-model-invocation: true
argument-hint: '<route-prefix> [--only <route>] [--no-write] [--refresh-map] [--resume <workflow-run-id> --run <ledger-run-id>]'
allowed-tools: Bash(bun scripts/agentic/*), Bash(git status *), Bash(git diff *), Bash(bun run verify), Bash(cat _private/agentic-v2/*), Read, Workflow
---

# /docs-verify — run the pipeline

Arguments: `$ARGUMENTS`

You are the operator. You do not verify, decide or write pages yourself — the agents do, the
scripts decide what passes, and the two hooks keep production read-only for everyone. Your job
is to open the run, launch the Workflow, and put the result in front of Fabio.
**Nothing is committed. Ever. `adopted` is never set by the pipeline.**

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
- The Playwright profile must hold a live Auth0 session. Not checkable from here; the map-agent
  returns `halt: "login"` if it is not, and the run stops itself.
- `.neuralseekrc.json` points at the partners instance (`console-partners…/28b3b687…`).

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
    { title: 'Verify', detail: 'verifier per route, one at a time (one browser)' },
    { title: 'Compile', detail: 'compile.ts → evidence.md, coverage.json' },
    { title: 'IA', detail: 'ia-agent, section barrier' },
    { title: 'Design', detail: 'designer, only when a route is flagged' },
    { title: 'Write', detail: 'prepare-write → writer → gates → reviewer, per route' },
    { title: 'Report', detail: 'bun run verify once, report.ts' },
  ],
};

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
  agent(
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
      agent(
        `runId: ${RUN}. refreshMap: ${!!args.refreshMap}. Areas: ${args.areas.join(', ')}. Bring the component map current for these areas per your instructions.`,
        { agentType: 'map-agent', label: 'map', phase: 'Gather', schema: MAP }
      )
    ),
  () =>
    agent(`runId: ${RUN}. Export the instance config and slice it per your instructions.`, {
      agentType: 'config-export',
      label: 'config',
      phase: 'Gather',
      schema: CONFIG,
    }),
  ...args.routes.map(
    (r) => () =>
      agent(
        `runId: ${RUN}. route: ${r}. Decompose this page into claims per your instructions and write ${RD(r)}/docs.json.`,
        { agentType: 'docs-agent', label: `docs:${r}`, phase: 'Gather', schema: DOCS }
      )
  ),
]);
const mapResult = gather[0];
if (!mapResult || mapResult.halt === 'login') halt('console session expired during the map stage');
if (mapResult)
  log(
    `map: ${Object.entries(mapResult.areas || {})
      .map(([a, s]) => `${a} ${s.status}`)
      .join(' · ')}`
  );
if (gather[1] && gather[1].error)
  log(`config export failed: ${gather[1].error} — config tier is ABSENT this run`);
const docsOk = new Set(
  gather
    .slice(2)
    .filter(Boolean)
    .map((d) => d.route)
);

// ── 2 · Verify (serialized) ───────────────────────────────────────────────────
const toVerify = args.routes.filter((r) => docsOk.has(r));
const verified = await pipeline(toVerify, (r) => {
  if (loginHalted) {
    log(`skip verify ${r}: halted`);
    return null;
  }
  return withBrowser(async () => {
    if (loginHalted) return null;
    const v = await agent(
      `runId: ${RUN}. route: ${r}. Verify the claims in ${RD(r)}/docs.json against the console per your instructions and write ${RD(r)}/verdicts.json.`,
      { agentType: 'verifier', label: `verify:${r}`, phase: 'Verify', schema: VERDICTS }
    );
    if (v && v.halt === 'login') halt(`console session expired while verifying ${r}`);
    return v;
  });
});
const verifiedRoutes = toVerify.filter((r, i) => verified[i] && !verified[i].halt);

// ── 3 · Compile ───────────────────────────────────────────────────────────────
const compiled = await run(`bun scripts/agentic/compile.ts ${RUN} --json`, 'compile', 'Compile');
if (!compiled || !compiled.ok) log('compile.ts failed — see the wrapper output');
if (args.noWrite || loginHalted) {
  const report = await run(`bun scripts/agentic/report.ts ${RUN} --json`, 'report', 'Report');
  return {
    runId: RUN,
    stoppedAfter: loginHalted ? 'halt' : 'compile',
    verified: verifiedRoutes,
    loginHalted,
    report: report && report.json,
  };
}

// ── 4 · IA (barrier) ──────────────────────────────────────────────────────────
const ia = await agent(
  `runId: ${RUN}. section: ${args.prefix}. Decide the section's tree per your instructions, apply it, and write section/ia.json and section/routes-final.json.`,
  { agentType: 'ia-agent', label: 'ia', phase: 'IA', schema: IA }
);
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
  await agent(
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
      ? agent(
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
    const review = await agent(
      `Review the route ${r}. The pipeline's evidence is in ${RD(r)}/ — read verdicts.json and evidence.md first. Return your findings in your usual format and also write ${RD(r)}/review.json as {route, verdict, findings, questions}.`,
      { agentType: 'doc-reviewer', label: `review:${r}`, phase: 'Write', schema: REVIEW }
    );
    if (!review || review.verdict === 'ready') return { gates: g.json, review };
    // One writer loop, then park.
    const w2 = await agent(
      `runId: ${RUN}. route: ${r}. The reviewer returned needs-work: ${JSON.stringify(review.findings).slice(0, 2000)}. Address every finding you can from the evidence, update ${RD(r)}/write.json, and leave what you cannot in left_unresolved.`,
      { agentType: 'writer', label: `rewrite:${r}`, phase: 'Write', schema: WRITE }
    );
    const g2 = w2
      ? await run(`bun scripts/agentic/gates.ts ${RUN} ${r} --json`, `gates2:${r}`, 'Write')
      : null;
    const review2 =
      g2 && g2.json && g2.json.ok
        ? await agent(
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
const report = await run(`bun scripts/agentic/report.ts ${RUN} --json`, 'report', 'Report');
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
  report: report && report.json,
};
```

## 5. After the run

1. `cat _private/agentic-v2/runs/<runId>/section/report.md` — the per-route table, the browser
   audit (navigations, hosts, denials), the IA decisions, the diff commands.
2. If the build was red: `bun run verify` yourself to show the error; the diff still stands.
3. Put in front of Fabio, in this order: the report; halted or parked routes with reasons; the
   IA decisions and any `questions` from ia.json; the token/cost figures from the Workflow
   result; then the exact `git diff` command per changed file (pages, `astro.config.mjs`,
   `scripts/migration-map.json`, `public/img/<route>/`). **Do not commit, do not push, do not
   set `adopted`.**
4. If the verifier halted on login: say so first, and give the exact `--resume` command.
5. `--no-write` runs: show `section/coverage.json` per route (verdict counts, uncovered
   controls, integrity problems) — that is the deliverable.
