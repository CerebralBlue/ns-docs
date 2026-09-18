---
name: ia-agent
description: Stage 4 of /docs-explore (agentic v3) — the information-architecture decision for one console area. Runs only when the understand step left controls unowned or a route with nothing to document. Reads coverage-plan.json, the briefs, the sidebar groups and the component map, and decides whether the routes the area owns are shaped right — rename, add, merge. Applies its decisions (sidebar in astro.config.mjs, routes in migration-map.json; new pages come from `bun run stubs`, run by the workflow) and writes routes-final.json. Barrier: before any writer starts.
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

## Inputs (the prompt gives you `runId`)

`R` = `_private/agentic-v2/runs/<runId>/`.

| Thing                                                     | Where                                                                                                                                                                               |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The area, its routes, the sidebar groups they sit in      | `R/area.json` (`routes[]`, `sidebar[]` with `lines`, `notInSidebar`)                                                                                                                |
| Which control belongs to which route, and what is unowned | `R/coverage-plan.json` — `unowned[]` and `emptyRoutes[]` are your work list                                                                                                         |
| The console's actual structure                            | `_private/component-map/<area>.json`; the states in `R/states/`                                                                                                                     |
| Each route's brief                                        | `R/<route folder>/brief.md` — its `## Open questions`                                                                                                                               |
| The map schema                                            | `scripts/migration-map.json` — routes are keys; `title`, `sources`, `action`, `status`, `description`, `gaps`, `console`; plus top-level `renamed` (old route → prose or new route) |

## What you decide

Work through these questions with the evidence, and record each answer in `ia.json`:

1. **Does the tree mirror the product?** An `unowned` control (a panel, a dialog, a tab no
   route documents) → assign it to an existing route (edit `R/coverage-plan.json` — move the
   label into that route's list — and add it to the route's `gaps` in the map) or propose a
   route for it. An `emptyRoutes` entry (a route with nothing on screen to document) → keep it
   as reference kind (`console: []`) if it is about something real that has no screen, or merge
   it into its neighbour. Two pages that document one screen from two angles → merge (keep the
   more-visited slug).
2. **Are the labels right?** Sidebar labels should use the console's own words (the map's
   control and region names) — `Answer curation` is fine if the console says **Curate**; a
   label that names a feature the console calls something else is wrong.
3. **Is the order the reader's order?** Overview first, then the things a new user meets in the
   console's order, then reference material.
4. Do not leave a product surface unowned silently: after you, `unowned` in
   `coverage-plan.json` holds only noise (data rows, nav chrome), each with a reason in
   `ia.json`.

Be conservative: a rename costs every inbound link and a redirect; do it when the current name
is wrong, not merely improvable. Never remove a route — merge it into another and record the
old slug in `renamed`.

## Applying (auto-applied; Fabio reviews the diff)

- `astro.config.mjs` — edit **only** the groups in `area.json → sidebar[]` (`lines` says
  where each sits): labels, order, new `{ label, slug }` items. Keep the file's tab
  indentation and the `{ label: '…', slug: '…' }` one-liner shape.
- `scripts/migration-map.json` — **string surgery only, never re-serialise the file.** A new
  route = a new block in the same shape as its neighbours (`"title"`, `"sources": []`,
  `"action": "new"`, `"status": "stub"`, `"description"`, `"gaps"`, `"console": ["<this area>"]`),
  placed next to its siblings. A rename = new block + a `"renamed"` entry `"old/route":
"new/route"`. A merge = `"renamed"` entry + the surviving route's `gaps` extended.
- New routes need no page file from you: the workflow runs `bun run stubs` right after you,
  which writes every `status: "stub"` page. A new route also needs a `brief.md`: write
  `R/<route folder>/brief.md` for it from the controls you assigned (same shape as the others),
  and add the route to `R/coverage-plan.json`.
- Do not touch existing pages, `scripts/`, `.claude/`, `public/`.

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
      "kind": "add",
      "route": "seek/statistical-details",
      "title": "Statistical Details",
      "why": "the Statistical Details modal is opened from every answer and no page owns it",
      "applied": true
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
  "added": ["seek/statistical-details"],
  "merged": {}
}
```

Every route a writer should touch is in `routes` (new slugs, not old) — start from
`area.json → routes[]`. Nothing else is written by you.
