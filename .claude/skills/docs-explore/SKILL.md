---
name: docs-explore
description: Run the NeuralDocs v3 pipeline over ONE console area — explore the screen with the browser (every state, screenshots), understand it (briefs per route, coverage plan, probes), probe behaviour on the playground through the MCP, decide the IA if something is unowned, write every route the area owns (contract + FAQ), gate, review once, build once, report, clean the playground up. Leaves every change as an uncommitted diff. Use when Fabio types /docs-explore; never invoke on your own.
argument-hint: '<area> [--capture-only | --write-only [--all-briefed [--rewrite]] [--from <capture-run-id>]] [--only <route>]… [--states <id,…>] [--variants <id,…>|none] [--resume <workflow-run-id> --run <ledger-run-id>] [--attempt <n>]'
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
  parallel batches of ≤ 4.
- **`--no-plan`**: run pure v3.2 — no planner, no checkpoints, no delegation (the defaults
  the planner would otherwise override). Pass `"noPlan": true` in the Workflow args.
- **`--capture-only`**: explore (incl. variants) + understand + experiments only — a fresh
  capture with briefs for every route the area owns (or `--only`) and `experiments.md`; no
  probes, no IA, no pages.
- **`--states a,b,…`** walks only those state ids (list the ancestors on the path too);
  **`--variants a,b,…`** captures only those `areas.json` variants/sweeps (`none` = no variants).
  Both are passed to `queue.ts` as given — the way to run a small, cheap test of one screen. The investment a later
  `--write-only --all-briefed` run spends. Nothing lands in `src/`.
- Without either flag the run explores first (a new capture, which becomes the area's latest)
  and then writes the routes the area owns (or `--only`).

## 2. Open the run (unless resuming)

```
bun scripts/agentic/queue.ts <area> [--capture-only | --write-only [--all-briefed [--rewrite]] [--from <run>]] [--only <route>]… [--states <id,…>] [--variants <id,…>|none] --json
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

The script is **`.claude/skills/docs-explore/workflow.js`** (its own file since 2026-10-01 — it is
tested by `bun run test:agentic`). Call the **Workflow** tool with
`scriptPath: "/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs/.claude/skills/docs-explore/workflow.js"` and
`args: { "runId": "<runId>", "captureRun": "<captureRun>", "mode": "<explore|write-only|capture-only>", "area": "<area>", "kind": "<kind>", "routes": <routes[]>, "repo": "/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs", "attempt": <n or omit>, "noPlan": <true only with --no-plan> }`.
(This instruction is the opt-in for multi-agent orchestration.) Note the Workflow's own run id
from the tool result next to the ledger id.

**How data moves (read before changing the script):** code moves data, LLMs move pointers. Every
script call goes through `scripts/agentic/call.ts`, which keeps the full output in `R/io/<label>`
and hands the workflow a small checksummed receipt; a receipt that does not verify is retried
once, then the run **halts** (`haltedBy: integrity`). Agents get file paths, never pasted data.
Data only the workflow holds (agent returns, partial agents, subtask results) comes back in the
Workflow result and is written by `ingest-result.ts` (step 5.0).

## 5. After the run

0. **Ingest the result first:** `bun scripts/agentic/ingest-result.ts <runId> <output-file>`
   (`<output-file>` = the path in the Workflow's completion notification). It writes the
   agent returns the agents did not write themselves, `agent-failures.json`,
   `subtasks.results.json` and `workflow-result.json`, then regenerates the report. If the
   result says `integrity`, that is the first thing you say: which receipt failed and why.
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
