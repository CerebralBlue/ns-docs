# `scripts/migration-map.json` — the route registry

The site's route registry: one entry per page, what state it is in, what kind of page it is,
which console screens it is written from, and what it still owes. (The file name is from the
migration; renaming it to `routes.json` is planned for the domain cutover.)

Read this before editing the map or picking up a route.

## Contents

- [Top-level shape](#top-level-shape)
- [A route entry](#a-route-entry)
- [`status` — who may touch the page](#status--who-may-touch-the-page)
- [`type` — the page contract](#type--the-page-contract)
- [`console` — where the facts come from](#console--where-the-facts-come-from)
- [`gaps` and `gapsResolved`](#gaps-and-gapsresolved)
- [`redirects` and `renamed`](#redirects-and-renamed)
- [Editing the map safely](#editing-the-map-safely)
- [Useful one-liners](#useful-one-liners)

## Top-level shape

```jsonc
{
  "$comment": "…",
  "routes": { "<route>": { … }, … },          // 151 entries, in the site's reading order
  "renamed": { "<old route>": "what happened to it" },
  "redirects": {
    "sourceCommit": "…",                       // the old MkDocs docs at CerebralBlue/knowledge
    "from": { "<old source path>": "<route>" },  // old URL → the route that replaces it
    "kill": { "<old source path>": "why it was not carried over" }
  }
}
```

A key of `routes` is the route and the file path: `src/content/docs/<route>.md`, served at
`/<route>/` (plus the `/ns-docs` base at build time).

## A route entry

```jsonc
"configuration/neural-config/llm-details": {
  "title": "LLM Details",
  "description": "…",                      // synced from the page's frontmatter by sync-map.ts
  "console": ["neural-config"],            // first = the area that owns the page
  "status": "written",
  "type": "reference",
  "reviewedAt": "2026-10-02",              // only with status adopted, set by hand
  "reviewedRun": "202609270311-neural-config",
  "gaps": ["…"],
  "gapsResolved": [{ "gap": "…", "run": "…", "why": "…" }]
}
```

## `status` — who may touch the page

| Status    | Meaning                                                              | Set by                                                   | Regenerated?              |
| --------- | -------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------- |
| `stub`    | generated placeholder                                                | `gen-stubs.ts`                                           | **every** `bun run stubs` |
| `draft`   | prose not yet checked against the product (verbatim port, mid-write) | `prepare-write.ts` (stub → draft)                        | never                     |
| `written` | written by the `/docs-explore` pipeline and its gates passed         | `sync-map.ts`, after the gates PASS                      | never                     |
| `adopted` | a human checked it                                                   | **a person, by hand**, with `reviewedAt` + `reviewedRun` | never                     |

- `prepare-write.ts` **refuses** to rewrite an `adopted` page (exit 1; the writer never starts)
  unless `--allow-adopted` — then it becomes `written` and keeps its review fields.
- `doc-lint` warns `changed-since-review` when `_private/agentic-v2/index.json` shows a newer run
  than `reviewedRun`: re-read the page, then update `reviewedRun`.
- Working by hand on a `stub`, move it to `draft` first, so `bun run stubs` cannot reclaim it.
- `adopted` does not mean free of `<!-- SCREENSHOT -->` markers — image findings never block.

## `type` — the page contract

`concept` · `task` · `reference` · `quickstart`. Decides the required sections
(`scripts/agentic/contract.ts`, `references/page-contract.md`). Seeded by route pattern on
2026-09-30; correct it here when a page is clearly another type.

## `console` — where the facts come from

The console areas (`_private/agentic-v2/areas.json`) whose captures a page is written from; the
first owns it. `[]` = a reference page with no screen (written from config/MCP resources, with an
Unverified caution). `bun scripts/agentic/areas.ts list` prints the split.

## `gaps` and `gapsResolved`

`gaps` lists product surfaces the page must still cover. Stub pages show them as a visible "To
document on this page" list; older ported pages carry them as a hidden
`<!-- STILL TO DOCUMENT ON THIS PAGE: -->` comment. A gap a capture **disproves** (no such control
on any captured screen) is moved by the IA stage to `gapsResolved` with the run and the evidence —
it is never documented as an absence ("there is none").

## `redirects` and `renamed`

`redirects.from` maps each old MkDocs page to the route that replaced it (a route's first source
was its primary donor); `redirects.kill` lists old pages deliberately not carried over, with the
reason. `scripts/url-inventory.ts` reconciles them against the old site's sitemap and builds the
redirect map at the domain cutover. `renamed` records structural moves between new routes.

## Editing the map safely

- Small, targeted edits (`Edit`); keep the 2-space indentation; `bun run format:check` covers the
  file, so a malformed edit fails `verify`.
- Do not reorder routes casually; the order is the reading order the IA stage maintains.
- Pipeline agents never edit it except the IA agent (string surgery on `gaps`, `gapsResolved`,
  `description`, `renamed`, new stub routes) — the scripts own `status`.

## Useful one-liners

```bash
# One route's entry
jq '.routes["seek/curation"]' scripts/migration-map.json

# Routes by status, and by type
jq -r '[.routes[].status]|group_by(.)|map("\(.[0]) \(length)")[]' scripts/migration-map.json
jq -r '.routes|to_entries[]|"\(.value.type) \(.key)"' scripts/migration-map.json

# Pages a human has reviewed, with the run they read
jq -r '.routes|to_entries[]|select(.value.status=="adopted")|"\(.key) \(.value.reviewedAt) \(.value.reviewedRun)"' scripts/migration-map.json
```
