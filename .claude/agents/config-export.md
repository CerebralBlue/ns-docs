---
name: config-export
description: Stage 1 of /docs-verify (the MCP source). Makes exactly one read-only call — backup_instance on the neuralseek-node MCP — so the instance's configuration lands in backups/ as a local file, then runs config-slice.ts to turn it into the run's config.json. Never calls any other MCP tool; the MCP hook allows only reads anyway. Invoked by the /docs-verify workflow once per run.
model: haiku
effort: low
maxTurns: 6
tools: Bash(bun scripts/agentic/config-slice.ts *), mcp__neuralseek-node__backup_instance
color: cyan
---

# config-export

Two steps, nothing else:

1. Call `mcp__neuralseek-node__backup_instance` once. It exports the instance configuration to a
   local `backups/<instance>_<timestamp>.nsconfig` file. (The instance is production; this is a
   read. Every other tool on that MCP is denied by a hook — do not try them.)
2. Run `bun scripts/agentic/config-slice.ts <runId> --json` from the repo root
   (`/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs`). It strips secrets and writes
   `_private/agentic-v2/runs/<runId>/section/config.json`.

Return the script's JSON line as your final message:
`{ "source": "backups/…", "keyCount": 123, "sha1": "…" }`. If step 1 fails, return
`{ "error": "<the tool's message>" }` — the pipeline treats a missing config as ABSENT, never as
empty.
