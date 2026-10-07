---
name: cleanup
description: Last stage of /docs-explore. Leaves the playground as the run found it — deletes every agent the runners created (docs-* names only; the hook refuses anything else) and, when the area has a restore reference, takes fresh snapshots of the reference's screens and runs verify-restore.ts check --when finish. Never restores anything itself. Writes cleanup.json into the run folder. Runs at the end of every area run, including halted and crashed ones.
model: sonnet
effort: low
maxTurns: 50
tools: Read, Write, Glob, Bash(bun scripts/agentic/verify-restore.ts *), mcp__neuralseek-node__list_agents, mcp__neuralseek-node__delete_agent, mcp__neuralseek-ui__browser_navigate, mcp__neuralseek-ui__browser_snapshot, mcp__neuralseek-ui__browser_click, mcp__neuralseek-ui__browser_press_key, mcp__neuralseek-ui__browser_wait_for, mcp__neuralseek-ui__browser_find
color: cyan
hooks:
  PreToolUse:
    - matcher: 'mcp__neuralseek-node__.*'
      hooks:
        - type: command
          command: '${CLAUDE_PROJECT_DIR}/.claude/hooks/mcp-policy.sh'
          timeout: 10
---

# cleanup

`R` = `_private/agentic-v2/runs/<runId>` — a name in these instructions, not a shell variable:
write every path out in full in your commands (`R=…; cmd` is refused by the shell hook). You only look and delete `docs-*` agents. You never
save, roll back or change a setting — the browser hook refuses it anyway (you are a pipeline
agent: no commit button, no dropdown option, Escape is the only key).

1. **Agents.** Read `R/runner.json` if it exists and collect `created[]`. `list_agents`; for every
   name that starts with `docs-` — listed or not (a crashed runner leaves orphans) —
   `delete_agent`. Record what you deleted and what failed.
2. **Restore check** — only if `R/area.json` `mode` is not `write-only` **and**
   `_private/agentic-v2/reference/<area>.json` exists. Read the reference: `reach` (clicks from
   the area URL to the settings screen) and `changelogReach` (clicks to the Change Log).
   - `browser_navigate` to the area URL (`https://<instance.host>/<instance.id><area.url>` from
     `R/area.json`) — this reload also discards any unsaved pick a variant left behind. Then
     `browser_wait_for` the text "Default Config" **before** the first snapshot: a snapshot of a
     half-loaded page has other refs, and the hook refuses a click whose ref is not in it
     (run 202609270050: cleanup died on exactly that).
   - Follow `reach`: before each click snapshot to `R/restore/_nav.yml` and click the ref whose
     line matches the step's role and label. Then open every accordion named before `›` in the
     reference's `values` keys that is not already `[expanded]`. Snapshot the whole page →
     `R/restore/finish-config.yml`. Press Escape.
   - Follow `changelogReach` the same way; `browser_wait_for` the text "Proposal ID" (the rows load
     after the dialog opens — run 202609270311 photographed an empty table); snapshot →
     `R/restore/finish-changelog.yml`; Escape.
   - `bun scripts/agentic/verify-restore.ts check <runId> --snapshot <abs R/restore/finish-config.yml> --changelog <abs R/restore/finish-changelog.yml> --when finish`
     — copy its printed line into `restore`. A FAIL is reported, never repaired: the main session
     rolls back (`_private/agentic-v2/playground-versions.md`).
   - If the page is a login screen, set `restore` to `"not checked: login"`.
3. Write `R/cleanup.json` and return it:

```json
{
  "deleted": ["docs-seek-overview-personalize"],
  "failed": [],
  "leftovers": [],
  "restore": "restore finish: PASS — 41 controls compared, 0 differ; Change Log 13/13 rows, newest unchanged (reference docs-baseline)"
}
```

`leftovers` = `docs-*` agents still present after step 1; `restore` = `"not due"` when step 2 does
not apply. Nothing else is written or deleted.
