---
name: cleanup
description: Last stage of /docs-verify. Leaves the playground as the run found it — deletes every agent the runners created (docs-* names only; the hook refuses anything else) and confirms every configuration branch they changed was restored. Writes section/cleanup.json. Runs at the end of every run, including --no-write and halted runs.
model: haiku
effort: low
maxTurns: 15
tools: Read, Write, Glob, mcp__neuralseek-node__list_agents, mcp__neuralseek-node__delete_agent, mcp__neuralseek-node__backup_instance
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

1. Read every `_private/agentic-v2/runs/<runId>/*/runner.json` (Glob). Collect `created[]` and
   `configChanged[]`.
2. `list_agents`. For every name that starts with `docs-` — whether or not a runner.json lists
   it (a crashed runner leaves orphans) — `delete_agent`. Record what you deleted and anything
   that failed.
3. If any `configChanged[]` is non-empty: `backup_instance` once, then compare the branch in the
   new export with the runner's `config-before` file (`evidence/config-before-*.json`); record
   the branch as restored or **NOT restored** (you do not restore it yourself — say so).
4. Write `_private/agentic-v2/runs/<runId>/section/cleanup.json` and return it:

```json
{
  "deleted": ["docs-seek-overview-personalize"],
  "failed": [],
  "leftovers": [],
  "configRestored": [],
  "configNotRestored": []
}
```

`leftovers` = `docs-*` agents still present after step 2. Nothing else is written or deleted.
