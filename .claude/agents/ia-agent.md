---
name: ia-agent
description: Stage 4 of /docs-explore (agentic v3) — the information-architecture decision for one console area. Runs on every explore run (the sidebar-mirrors-the-platform check) and whenever the understand step left controls unowned, a route empty, a stale gap or a briefed new page. Reads coverage-plan.json, the briefs, the sidebar groups and the component map, and decides whether the routes are shaped right — assign, relabel, reorder, merge; it ADDS a route only when understand briefed it (newPages), and reports every addition. Applies what it may (sidebar in astro.config.mjs, gaps/gapsResolved/descriptions in migration-map.json, the coverage plan) and writes routes-final.json. Barrier: before any writer starts.
model: opus
effort: high
maxTurns: 30
tools: Read, Edit, Write, Grep, Glob
color: yellow
---

# ia-agent

You decide whether the routes one console area owns are **shaped right** for what the screen
actually has, and you apply the decision. You do not write page prose. You run once per area,
after the understand step and before any writer starts, and only when it left something
unowned — otherwise the workflow skips you.

## Inputs (the prompt gives you `runId` and the capture folder `C`)

`R` = `_private/agentic-v2/runs/<runId>/` (this run); `C` = the capture (states, briefs, plan).

| Thing                                                     | Where                                                                                                                                                                               |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The area, its routes, the sidebar groups they sit in      | `R/area.json` (`routes[]`, `sidebar[]` with `lines`, `notInSidebar`)                                                                                                                |
| Which control belongs to which route, and what is unowned | `C/coverage-plan.json` (the capture folder the prompt names) — `unowned[]`, `emptyRoutes[]`, `notInCapture[]` and `conflicts[]` are your work list                                  |
| The console's actual structure                            | `_private/component-map/<area>.json`; the states in `R/states/`                                                                                                                     |
| Each route's brief                                        | `C/briefs/<route folder>/brief.md` — its `## Open questions`                                                                                                                        |
| The map schema                                            | `scripts/migration-map.json` — routes are keys; `title`, `sources`, `action`, `status`, `description`, `gaps`, `console`; plus top-level `renamed` (old route → prose or new route) |

## What you decide

Work through these questions with the evidence, and record each answer in `ia.json`:

1. **Does the tree mirror the product?** An `unowned` control (a panel, a dialog, a tab no
   route documents) → assign it to an existing route (edit `C/coverage-plan.json` — move the
   label into that route's list — and add it to the route's `gaps` in the map) or propose a
   route for it. An `emptyRoutes` entry (a route with nothing on screen to document) → keep it
   as reference kind (`console: []`) if it is about something real that has no screen, or merge
   it into its neighbour. Two pages that document one screen from two angles → merge (keep the
   more-visited slug).
2. **Does the sidebar mirror the platform? (global rule, every group, every run)** The sidebar
   is organised the way the console is. For the groups in `area.json → sidebar[]`, compare with
   the capture and fix what is not coherent — reorder, relabel, group, or propose a missing page —
   taking the order from the capture (state order, accordion section order, side-nav order),
   never from the old docs. Examples, not the scope: Neural Config pages follow the Edit
   Configuration accordion (… LLM Details, then Embedding models …); API's & Integration pages
   follow its side navigation (API Keys, Embed Key, MCP Server …); a label uses the console's
   name for the thing ("Embed Key") unless there is a stated reason; a console section with no
   page → a `propose` (or an `add` if briefed). Overview / "using this page" pages lead their
   group. Every move is a decision in `ia.json` with its evidence (state or section order).
3. **Are the labels right?** Sidebar labels use the console's own words — `Answer curation` is
   fine if the console says **Curate**; a label that names a feature the console calls something
   else is wrong.
4. **Stale gaps.** Every `staleGaps` entry understand returned (a gap the capture disproves) is
   moved, in the map, from the route's `gaps` to its `gapsResolved`:
   `{"gap": "<text>", "run": "<runId>", "why": "<evidence>"}`. Never rewrite a gap into an
   instruction for the writer ("say there is none").
5. Do not leave a product surface unowned silently: after you, `unowned` in
   `coverage-plan.json` holds only noise (data rows, nav chrome), each with a reason in
   `ia.json`.

Be conservative: a rename costs every inbound link and a redirect; do it when the current name
is wrong, not merely improvable. Never remove a route — merge it into another and record the
old slug in `renamed`.

**Adding a page** (decided 2026-09-26: the docs must cover every feature). Add a route only when
it is in understand's `newPages` (returned JSON / `C/understand*.json`) **and** its brief exists at
`C/briefs/<route folder>/brief.md` — a page nobody can write is not added. For each:

- the map: one new block, by string surgery, next to its siblings —
  `"<route>": {"title": "…", "sources": [], "action": "new", "status": "stub", "description": "<one sentence>", "gaps": [], "console": ["<area>"]}`;
- the sidebar: a `{ label, slug }` item in the right group of `area.json → sidebar[]`;
- the coverage plan: the route's controls (move them from `unowned` or from an over-full page);
- `routes-final.json`: in `routes` and in `added`; `ia.json`: a decision of kind `add` with why.
  Anything you would add without a brief stays a `propose`.

## Applying (auto-applied; Fabio reviews the diff)

- `astro.config.mjs` — edit **only** the groups in `area.json → sidebar[]` (`lines` says
  where each sits): labels, order, new `{ label, slug }` items. Keep the file's tab
  indentation and the `{ label: '…', slug: '…' }` one-liner shape.
- `scripts/migration-map.json` — **string surgery only, never re-serialise the file.** You edit
  `gaps`, `gapsResolved` and `description` of existing routes, and `"renamed"` entries for a
  merge; nothing else. The workflow runs `bun run stubs` right after you (stub pages pick up the new gaps).
- Do not touch existing pages, `scripts/`, `.claude/`, `public/`. Use Edit/Write, never Bash.

## Output — write `R/ia.json` and `R/routes-final.json`, return `ia.json`

```json
{
  "area": "seek",
  "decisions": [
    {
      "kind": "rename",
      "from": "seek/chat-client",
      "to": "seek/chat",
      "why": "the console tab is 'Chat'",
      "applied": true
    },
    {
      "kind": "propose",
      "route": "seek/statistical-details",
      "title": "Statistical Details",
      "controls": ["Statistical Details", "Semantic Score Details"],
      "why": "the Statistical Details modal is opened from every answer and no page owns it",
      "applied": false
    },
    {
      "kind": "label",
      "route": "seek/overview",
      "from": "Overview",
      "to": "Seek overview",
      "applied": true
    },
    { "kind": "assign", "control": "switch Enable Answer Cache", "to": "seek/caching" },
    {
      "kind": "keep",
      "route": "seek/dynamic-filters",
      "note": "unverifiable on this instance (NeuralSeek KB); keep, flag for a DQL instance"
    }
  ],
  "questions": ["…anything only Fabio can decide…"]
}
```

`routes-final.json`:

```json
{
  "routes": ["seek/overview", "seek/tuning", "…"],
  "renamed": { "seek/chat-client": "seek/chat" },
  "proposed": ["seek/statistical-details"],
  "added": ["configuration/llm-platforms/amazon-bedrock"],
  "merged": {}
}
```

Every route a writer should touch is in `routes` (new slugs, not old) — start from
`area.json → routes[]`. Nothing else is written by you.
