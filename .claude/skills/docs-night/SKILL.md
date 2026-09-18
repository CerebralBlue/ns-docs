---
name: docs-night
description: Drive the overnight run of /docs-verify across every sourced section, one Workflow per section in dependency order, then one cross-page consistency pass, then the morning report. State lives in _private/agentic-v2/night/<id>/state.json (scripts/agentic/night.ts); the model only reads it and launches the next step. Use when Fabio types /docs-night start | continue | report; never invoke on your own.
argument-hint: 'start | continue | report | status'
allowed-tools: Bash(bun scripts/agentic/*), Bash(git status *), Bash(cat _private/agentic-v2/*), Read, Workflow
---

# /docs-night — the overnight driver

Arguments: `$ARGUMENTS`

You chain Workflows; you do not verify or write anything yourself. Every decision is a script's
output — read it, act on it, stop the turn. When a Workflow finishes, its completion
notification wakes you: record it, ask the script what is next, launch it, stop. Nothing about
the night is kept in your head — if in doubt, `bun scripts/agentic/night.ts next --json`.

**Nothing is committed. Ever. `adopted` is never set. The playground is cleaned up by every
section's own Cleanup stage.**

## `start`

1. `bun scripts/agentic/night.ts plan` — prints the sections and routes. If a night is already in
   progress (`_private/agentic-v2/night/current-night` exists and its state has a `running` or
   `pending` section), say so and use `continue` instead.
2. Preconditions, once: `git status --porcelain src/content/docs astro.config.mjs scripts/migration-map.json`
   empty; `_private/agentic-v2/instances.json` present; the headed Chrome window is logged into
   the playground (Fabio confirms — a login redirect halts the first section otherwise).
3. Then do `continue`.

## `continue`

1. `bun scripts/agentic/night.ts next --json` →
   - `{section, routes, areas, refreshMap, alreadyRunning, workflowRunId}`: if `alreadyRunning`
     and `workflowRunId` is set, a Workflow is (or was) running for it — do not launch another;
     check `/workflows`; if it is gone, record it `failed` and call `next` again. Otherwise go to 2.
   - `{consistency: true, routes, runIds, alreadyRunning}`: go to 3.
   - `{done: true}`: go to `report`.
2. **Launch a section.** `bun scripts/agentic/queue.ts <section> --only <r1> --only <r2> … --json` (one `--only` per route from `next` — the section prefix alone would also queue its stubs) → `runId`. Record it:
   `bun scripts/agentic/night.ts record <section> --ledger <runId>`. Call the **Workflow** tool
   with the docs-verify script (`.claude/skills/docs-verify/SKILL.md`, the `js` block, verbatim)
   and `args: { runId, prefix: <section>, routes, areas, noWrite: false, refreshMap: <from next>,
repo: "/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs" }`. Then
   `bun scripts/agentic/night.ts record <section> --workflow <the Workflow run id>`. **Stop the
   turn** — say which section is running and that the completion notification continues it.
3. **Launch the consistency pass.** Call the Workflow tool with the script below and
   `args: { nightId, routes, runIds, repo }`. Record `--workflow`. Stop the turn.
4. **On a completion notification** (its result JSON is in the notification): for a section,
   `bun scripts/agentic/night.ts record <section> --status <done|halted> --tokens <subagent_tokens
from the notification's usage> --result '<the result JSON, minified>'` — `halted` when the
   result has `loginHalted: true`, else `done`. A failed Workflow (error, no result) → `--status
failed`. For the consistency pass, `record consistency --status done --tokens … --result …`.
   Then go to 1. Do not summarise mid-night; the report does that.

A login halt stops the browser for every later section; `next` will still hand you the next one.
Launch it anyway only if its areas are all cached (`refreshMap: false`) — the verifier still
needs the browser, so in practice: record, then **stop and tell Fabio** the resume command
(`/docs-verify <section> --resume <workflowRunId> --run <ledgerRunId>`), then `/docs-night continue`.

## `report` / `status`

`bun scripts/agentic/night.ts report` prints and writes `night/<id>/REPORT.md`. Put in front of
Fabio, in this order: leftovers on the playground (must be none), halted sections with the
resume command, the per-section table, the consistency findings, the IA questions, the diff
commands. `status` = `night.ts next --json` without launching anything, plus `/workflows`.

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
const REPO = args.repo;
const NIGHT = args.nightId;
const CD = (r) => `${REPO}/_private/agentic-v2/night/${NIGHT}/consistency/${r.replace(/\//g, '-')}`;
const RD = (r) => `${REPO}/_private/agentic-v2/runs/${args.runIds[r]}/${r.replace(/\//g, '-')}`;
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
      ? agent(
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
    const w = await agent(
      `runId: ${args.runIds[r]}. route: ${r}. Apply the consistency fixes in ${CD(r)}/consistency.json to your page only, per your instructions, and update ${RD(r)}/write.json.`,
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
