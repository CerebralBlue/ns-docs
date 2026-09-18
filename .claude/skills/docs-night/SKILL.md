---
name: docs-night
description: Drive the overnight run of /docs-explore across every console area, one Workflow per area in dependency order, then one cross-page consistency pass, then the morning report. State lives in _private/agentic-v2/night/<id>/state.json (scripts/agentic/night.ts); the model only reads it and launches the next step. Use when Fabio types /docs-night start | continue | report; never invoke on your own.
argument-hint: 'start | continue | report | status'
allowed-tools: Bash(bun scripts/agentic/*), Bash(git status *), Bash(cat _private/agentic-v2/*), Bash(sed *), Bash(node -e *), Read, Workflow
---

# /docs-night — the overnight driver

Arguments: `$ARGUMENTS`

You chain Workflows; you do not explore or write anything yourself. Every decision is a script's
output — read it, act on it, stop the turn. When a Workflow finishes, its completion
notification wakes you: record it, ask the script what is next, launch it, stop. Nothing about
the night is kept in your head — if in doubt, `bun scripts/agentic/night.ts next --json`.

**Nothing is committed. Ever. `adopted` is never set. The playground is cleaned up by every
area's own Cleanup stage.**

## `start`

1. `bun scripts/agentic/night.ts plan` — prints the areas and route counts. If a night is
   already in progress (`_private/agentic-v2/night/current-night` exists and its state has a
   `running` or `pending` section), say so and use `continue` instead.
2. Preconditions, once: `git status --porcelain src/content/docs astro.config.mjs scripts/migration-map.json`
   empty (or Fabio said the tree is his); `_private/agentic-v2/instances.json` and
   `areas.json` present; the headed Chrome window is logged into the playground (Fabio
   confirms — a login redirect halts the first area otherwise).
3. Then do `continue`.

## `continue`

1. `bun scripts/agentic/night.ts next --json` →
   - `{area, section, mode, kind, routes, alreadyRunning, workflowRunId}`: if `alreadyRunning`
     and `workflowRunId` is set, a Workflow is (or was) running for it — do not launch another;
     check `/workflows`; if it is gone, record it `failed` and call `next` again. Otherwise go
     to 2. `mode: "explore"` = capture + write the owned routes; `mode: "write-only"` (the
     `leftovers:<area>` sections after every area is captured) = write from the area's latest
     capture, no browser. `section` is the name to `record` (it differs from `area` for leftovers).
   - `{skipped: "leftovers", callNextAgain: true}`: nothing left to write — call `next` again.
   - `{consistency: true, routes, runIds, alreadyRunning}`: go to 3.
   - `{done: true}`: go to `report`.
2. **Launch a section.** Explore mode: `bun scripts/agentic/queue.ts <area> --json` (the routes
   it prints are the ones the area owns — they match `next`). Write-only mode:
   `bun scripts/agentic/queue.ts <area> --write-only --only <r1> --only <r2> … --json` with the
   routes `next` listed. Either way → `runId`, `captureRun`, `mode`. Record it:
   `bun scripts/agentic/night.ts record <section> --ledger <runId>`. Extract the docs-explore
   script to a file (`sed -n '/^```js$/,/^```$/p' .claude/skills/docs-explore/SKILL.md | sed '1d;$d' > <scratchpad>/docs-explore.js`,
   once per night) and call the **Workflow** tool with `scriptPath` and
   `args: { runId, captureRun, mode, area, kind, routes, repo: "/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs" }`.
   Then `bun scripts/agentic/night.ts record <section> --workflow <the Workflow run id>`. **Stop
   the turn** — say which section is running and that the completion notification continues it.
3. **Launch the consistency pass.** Extract the script below the same way and call the
   Workflow tool with `args: { nightId, routes, runIds, captureRuns, repo }`. Record `--workflow`. Stop the turn.
4. **On a completion notification** (its result JSON is in the notification): for a section,
   `bun scripts/agentic/night.ts record <section> --status <done|halted> --tokens <subagent_tokens
from the notification's usage> --result '<the result JSON, minified, without the report field>'`
   — `halted` when the result has `loginHalted: true`, else `done`. A failed Workflow (error,
   no result) → `--status failed`. For the consistency pass, `record consistency --status done
--tokens … --result …`. Then go to 1. Do not summarise mid-night; the report does that.

A login halt stops the browser for every later area. Record it, then **stop and tell Fabio** the
resume command (`/docs-explore <area> --resume <workflowRunId> --run <ledgerRunId>`), then
`/docs-night continue`. The `reference` area needs no browser and may still run.

## `report` / `status`

`bun scripts/agentic/night.ts report` prints and writes `night/<id>/REPORT.md`. Put in front of
Fabio, in this order: leftovers on the playground (must be none), halted areas with the
resume command, the per-area table, the consistency findings, the reviewer findings, the
questions, the diff commands. `status` = `night.ts next --json` without launching anything,
plus `/workflows`.

## The consistency Workflow script

```js
export const meta = {
  name: 'docs-night-consistency',
  description:
    'Cross-page consistency pass over every route written tonight — one bounded fix per page, no commits',
  phases: [
    { title: 'Neighbours', detail: 'neighbours.ts per route' },
    { title: 'Compare', detail: 'consistency agent per route' },
    { title: 'Fix', detail: 'writer (own page only) + gates, only when needs-fix' },
  ],
};
const A = (prompt, opts) =>
  agent(prompt, opts).catch((e) => {
    log(
      `agent failed (${(opts && opts.label) || '?'}): ${String(e && e.message ? e.message : e).slice(0, 160)}`
    );
    return null;
  });
const REPO = args.repo;
const NIGHT = args.nightId;
const CD = (r) => `${REPO}/_private/agentic-v2/night/${NIGHT}/consistency/${r.replace(/\//g, '-')}`;
const RD = (r) => `${REPO}/_private/agentic-v2/runs/${args.runIds[r]}/${r.replace(/\//g, '-')}`;
const CAP = (r) =>
  `${REPO}/_private/agentic-v2/runs/${(args.captureRuns && args.captureRuns[r]) || args.runIds[r]}`;
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
const CONSISTENCY = {
  type: 'object',
  properties: {
    route: { type: 'string' },
    contradictions: { type: 'array' },
    duplicates: { type: 'array' },
    missing_links: { type: 'array' },
    verdict: { type: 'string', enum: ['consistent', 'needs-fix'] },
  },
  required: ['route', 'verdict'],
};
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

const results = await pipeline(
  args.routes,
  (r) =>
    run(
      `bun scripts/agentic/neighbours.ts ${r} --night ${NIGHT} --json`,
      `neighbours:${r}`,
      'Neighbours'
    ),
  (n, r) =>
    n && n.ok
      ? A(
          `nightId: ${NIGHT}. route: ${r}. Compare this page with its neighbours per your instructions and write ${CD(r)}/consistency.json.`,
          { agentType: 'consistency', label: `compare:${r}`, phase: 'Compare', schema: CONSISTENCY }
        )
      : null,
  async (c, r) => {
    if (!c) return null;
    if (c.verdict !== 'needs-fix') return { route: r, verdict: c.verdict, fixed: false };
    if (!args.runIds[r]) {
      log(`${r}: needs-fix but no run to write against — skipped`);
      return { route: r, verdict: c.verdict, fixed: false };
    }
    const w = await A(
      `runId: ${args.runIds[r]}. route: ${r}. Capture folder C: ${CAP(r)}. Apply the consistency fixes in ${CD(r)}/consistency.json to your page only, per your instructions, and update ${RD(r)}/write.json.`,
      { agentType: 'writer', label: `fix:${r}`, phase: 'Fix', schema: WRITE }
    );
    const g = w
      ? await run(`bun scripts/agentic/gates.ts ${args.runIds[r]} ${r} --json`, `gates:${r}`, 'Fix')
      : null;
    return { route: r, verdict: c.verdict, fixed: !!w, gatesOk: !!(g && g.json && g.json.ok) };
  }
);
const fixed = results
  .filter(Boolean)
  .filter((x) => x.fixed)
  .map((x) => x.route);
log(`consistency: ${results.filter(Boolean).length} compared, ${fixed.length} fixed`);
return {
  nightId: NIGHT,
  compared: results.filter(Boolean).length,
  fixed,
  results: results.filter(Boolean),
};
```
