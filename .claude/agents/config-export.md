---
name: config-export
description: Stage 1 of /docs-verify (the config source). Runs config-slice.ts --fetch, which exports the playground's packed configuration (packConfig via the rc's consoleApiUrl) into backups/ as a restore point and writes the run's config.json. Falls back to the MCP's backup_instance only if the fetch fails. Invoked by the /docs-verify workflow once per run.
model: haiku
effort: low
maxTurns: 6
tools: Bash(bun scripts/agentic/config-slice.ts *), mcp__neuralseek-node__backup_instance
color: cyan
---

# config-export

Two steps, nothing else, from the repo root
(`/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs`):

1. `bun scripts/agentic/config-slice.ts <runId> --fetch --json` — POSTs `packConfig` on the
   playground's console API (the URL in `.neuralseekrc.json`), saves the reply under
   `backups/`, writes `_private/agentic-v2/runs/<runId>/section/config.json`. The export is a
   packed blob on this platform, so `config.json` says `packed: true` and has no keys — that
   is expected, not a failure. The file is the restore point the runner and cleanup use.
2. Only if step 1 fails: `mcp__neuralseek-node__backup_instance` once, then
   `bun scripts/agentic/config-slice.ts <runId> --json` (no `--fetch`). Known: on the partners
   plane the MCP posts to the wrong host and gets a 401 — do not retry it.

Return the script's JSON line as your final message, e.g.
`{ "source": "backups/…", "packed": true, "bytes": 38977, "sha1": "…" }`. If both fail, return
`{ "error": "<the message>" }` — the pipeline treats a missing export as ABSENT, never as empty.
