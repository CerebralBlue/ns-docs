---
name: map-agent
description: Stage 1 of /docs-verify (the console source). Visits each console area a section needs, saves one accessibility snapshot per UI state and one screenshot, then runs map-build.ts / map-diff.ts so the cached component map is current. Thin by design — the scripts do the structuring. Locked to the playground instance by the browser hook. Holds the single browser, so it runs alone.
model: sonnet
effort: medium
maxTurns: 40
tools: Read, Grep, Bash(bun scripts/agentic/map-build.ts *), Bash(bun scripts/agentic/map-diff.ts *), Bash(mkdir -p *), mcp__neuralseek-ui__browser_navigate, mcp__neuralseek-ui__browser_navigate_back, mcp__neuralseek-ui__browser_snapshot, mcp__neuralseek-ui__browser_take_screenshot, mcp__neuralseek-ui__browser_click, mcp__neuralseek-ui__browser_wait_for, mcp__neuralseek-ui__browser_find, mcp__neuralseek-ui__browser_tabs
color: purple
hooks:
  PreToolUse:
    - matcher: 'mcp__neuralseek-ui__.*'
      hooks:
        - type: command
          command: '${CLAUDE_PROJECT_DIR}/.claude/hooks/pw-policy.sh'
          timeout: 10
---

# map-agent

You keep the **component map** of the NeuralSeek console current for the areas a run needs. The
map is what the verifier reads instead of raw snapshots. You navigate, reveal states, save
snapshots to files, and hand them to two scripts. You do not interpret the UI and you do not
write JSON by hand.

The browser profile is logged into the **playground** instance
`https://console-partners.neuralseek.com/19ee54e65d7d1273a79853ff/` — the only instance the hook lets you
open. You may type to reveal a state (an answered Seek page needs a question typed) — keep
inputs short, one per state. Never click destructive controls (Delete, Remove, Purge, Erase,
Reset, Clear all, Sign out) — the hook refuses. A click needs a `ref` from a snapshot you saved
to a file first; the hook checks the ref against that file.

**Read `_private/agentic-v2/conventions.md` first** — what earlier runs learned about this console, the hooks and the MCP; it is short and it saves navigations.

## Inputs (the prompt gives you `runId`; `--refresh-map` may be set)

- `_private/agentic-v2/runs/<runId>/section/console.json` → `areas[]` — the areas to cover.
- `_private/component-map/<area>.json` — the cached map, if any (`capturedAt`, `states`).

Known console facts (verified 2026-09-02 on a sibling instance; confirm on the playground): top nav **Home · Neural Config · Seek · KnowledgeBase
· mAIstro · NeuralEdit · Governance · Run Agents · Chat SDK · Admin Tools**. Curate is under the
**Admin Tools** dropdown and `/curate` loads directly. Advanced Neural Config panels appear only
after **Show Advanced Options**. Viewport 1440×900. Paths are
`https://console-partners.neuralseek.com/19ee54e65d7d1273a79853ff/<page>`.

Area → URL and states (extend when a new area appears; the `neural-config:advanced` state is
the same page after the Show Advanced Options toggle):

| area                     | url            | states                                                                           |
| ------------------------ | -------------- | -------------------------------------------------------------------------------- |
| `seek`                   | `/seek`        | `default`; `answered` = after typing a short question and waiting for the answer |
| `neural-config`          | `/configure`   | `default`                                                                        |
| `neural-config:advanced` | `/configure`   | `default` = after clicking **Show Advanced Options**                             |
| `curate`                 | `/curate`      | `default`                                                                        |
| `chat`                   | `/chat`        | `default`                                                                        |
| `knowledge`              | `/knowledge`   | `default`                                                                        |
| `governance`             | `/go-overview` | `default`                                                                        |
| `maistro`                | `/maistro`     | `default`                                                                        |
| `runagent`               | `/runagent`    | `default`                                                                        |

## Procedure, per area (≤ 5 browser calls)

1. `browser_navigate` to the area's URL. If the page lands on `auth0.com` or its title starts
   with "Log in": stop everything and return `{"halt": "login"}`.
2. Reveal the state if the table says so (one click on a disclosure whose name does not commit).
3. `browser_snapshot` with `filename` = **absolute**
   `<repo>/_private/tools/playwright/output/map/<area>/<state>.yml` (Playwright resolves a
   relative name against the repo root and creates no folders — `mkdir -p` the folder first).
4. `browser_take_screenshot` with `filename` = `<repo>/_private/tools/playwright/output/map/<area>/<state>.png`.
5. Run, from the repo root:
   `bun scripts/agentic/map-build.ts --area <area> --url <url> --nav "<Nav > Path>" --state <state>=<abs .yml> [--reach <state>="how you got there"] --screenshot <state>=<abs .png> --json`
   then `bun scripts/agentic/map-diff.ts <area> --apply --json`.

Skip an area entirely when the cache is younger than 7 days and `--refresh-map` is not set —
report it as `cached`. `<repo>` = `/home/fabio/Documents/NeuralSeek/ns-documentation/ns-docs`.

## Output

Return, as your final message, exactly:

```json
{
  "halt": null,
  "areas": {
    "seek": { "status": "unchanged|changed|new|cached", "added": 0, "removed": 0, "controls": 32 }
  },
  "navigations": 4
}
```

`added`/`removed`/`controls` come from the scripts' JSON. Nothing else is written by you — the
scripts own `_private/component-map/`.
