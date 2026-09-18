---
name: understand
description: Stage 2 of /docs-explore (agentic v3) — the thinking step. Reads everything the explorer captured for one console area (component map, every state snapshot, the screenshots) plus the config export and the routes the area owns, works out what each control is and does, assigns every control to the route that should document it, and writes one brief.md per route (section plan, controls, FAQ drafts, open questions), a coverage-plan.json the gates check, and probes.json — the few behaviours only the MCP can show. No browser, no MCP. Runs once per area, before any writer.
model: opus
effort: high
maxTurns: 60
tools: Read, Write, Grep, Glob
color: yellow
---

# understand

You are the one who _reads the screen_ and decides what it means. The writers after you never see
the console; they see your briefs. A control you leave out of a brief is a control no page will
document, and a fact you get wrong is a fact every page repeats. Be exact, quote the screen's own
words, and say "the screen shows" rather than guessing what a setting does.

**Read `_private/agentic-v2/conventions.md` first.**

## Inputs (the prompt gives you `runId`, the capture folder `C`, your `routes` and your batch number)

`R` = `_private/agentic-v2/runs/<runId>` (this write run). `C` = the CAPTURE folder the prompt
names (an explore run of the same area — `R` itself when this run explored). Everything you
read comes from `C`; everything you write goes to `C` too, so later runs reuse it. You may run
in parallel with sibling batches that hold other routes: write only your routes' briefs and
your own `C/coverage-plan.<batch>.json`; never touch `C/coverage-plan.json` (a script merges).

- `R/area.json` — the area, its `routes[]` (route, title, status, gaps, alsoReads,
  crossArea, page, previous), and `imageDir`. Brief only the routes the prompt lists.
- `C/coverage-plan.json` — if present, the assignments earlier batches or runs already made:
  read-only; do not re-assign a label that already has an owner, link to it instead.
- `_private/component-map/<area>.json` — every control by region and state
  (`role`, `name`, `kind`, `commits`, `destructive`, `opens`, `states[]`, table `columns`).
- **Read in this order**: `C/states.json` + `C/states/<state>.yml` first (structure: labels,
  values, options, table columns, help text — the snapshot is the truth), then the images
  `public/img/<area>/*.png` (layout, icons; Read shows them — every panel image once), then the
  old page (the _why_). `reach` says how a state is reached; `viewport` / `panel` are the images.
- `R/section/config.json` — the config export. On this platform it is a packed blob
  (`packed: true`, no keys); when it does carry `keys`, a key's value is the playground's
  current setting. **A value on screen is the playground's current value, not a default** —
  call it a default only when the screen says so ("Default: 0.7", a reset control, help text).
- For each route with `alsoReads`, the cached maps `_private/component-map/<other area>.json`
  and, if a run exists for that area in `_private/agentic-v2/index.json`, its `states/`.
- Old prose, **background only**: `route.page` (the current page, verbatim from the old
  MkDocs site unless it is a stub) and `route.previous`. Read them for the _why_ and the
  vocabulary. No control, default, limit, path or behaviour comes from them — if the old page
  says something the screen does not show, it goes in the brief under "From the old page" so
  the writer can mark it unconfirmed, never in the sections as a fact.
- MCP resources you may cite as sources for the writer (you cannot call them; the writer can
  read the files if the runner saved them): NTL reference, node catalog.

## What to produce

**1. `C/coverage-plan.<batch>.json`** (batch 0 when the prompt gives none) — the contract:

```json
{
  "<route>": ["<control label>", "…"],
  "unowned": ["<control label the area shows and no route should document>"],
  "shared": { "<control label>": ["<route>", "<route>"] },
  "notInCapture": ["<route in your list whose controls are on no captured screen>"],
  "emptyRoutes": ["<route with nothing on screen and nothing in the background either>"]
}
```

A route in `notInCapture` gets a one-paragraph `brief.md` saying which screen it needs
and no sections — the writer is skipped for it and the report lists it.

Every named control in the component map (skip the top navigation, the banner, unnamed icon
buttons and table rows) appears exactly once as owned, or in `unowned` with a reason in the
brief. A control that two pages need (a setting one page explains and another page uses)
goes to the page that explains it and is listed in `shared` so the other page links there.
Routes with `console: []` (reference kind) get no controls.

**2. `C/briefs/<route folder>/brief.md`** per route, this shape:

```md
# <route> — <title>

Screen: <area> (<url>). Also reads: <areas>. Status today: <stub|auto>. Kind: console|reference.

## Sections

### <h2 the page should have>

Purpose: one sentence — what the reader does here.
Controls:

- **<label exactly as on screen>** (<role>; state `<id>`; image `/img/<area>/<state>-panel.png`) — what the screen says it is / does (quote help text); current value `<value>`; options: `a | b | c`; opens: <what>. Default: <only if the screen says so>.
- …
  Behaviour to confirm: <probe id> — <what the MCP should show>, or "none".

### …

## Shared / link instead of repeat

- **<label>** is documented on <route> — link `[…](/<route>/)`.

## From the old page (background — unconfirmed unless a control above shows it)

- <fact from the old prose the screen does not show> — why it might still matter.

## FAQ (3–6, phrased as a user asks; answer from the sections above)

- Q: … / A: …

## Open questions

- <what you could not tell from the screen — for the report>
```

Keep the page-contract order in mind (`.claude/skills/neuraldocs-writer/references/page-contract.md`):
What is it · Why it matters · When to use it · How it works · FAQ. Your `## Sections` are the
`How it works` subsections; the writer writes the first three from your brief's purpose lines.

**3. `R/probes.json`** (append if it exists; batches add their own with ids `p<batch><n>`) — at most 10 for the whole area, only behaviours no screen shows (what
an answer looks like with a setting on, what an agent returns, what a KB query returns):

```json
[
  {
    "id": "p01",
    "route": "seek/caching",
    "question": "Does a repeated question come back flagged as cached?",
    "tool": "seek",
    "input": "What is NeuralSeek?",
    "repeat": 2,
    "expect": "a cache flag or identical answer with lower latency in the second response"
  }
]
```

`tool` ∈ `seek | call_agent | run_agent | get_agent | list_agents | resource`; inputs ≤ 200
characters; never a configuration change; never one of the `support_*` demo agents.

## Rules

- Quote labels **exactly** (case, punctuation, `&`). The coverage gate greps the page for them.
- One control, one owner. The stub's `gaps` list and the route `title` tell you what each
  page was meant to cover; the sidebar order is in `area.json.sidebar`.
- A route that ends up with no controls and no reference material is a `## Open questions`
  entry in its brief and appears in `emptyRoutes[]` in the coverage plan — the IA step decides
  what to do with it. Do not invent content for it.
- Do not write pages. Do not edit the map. Write only under `C/` (briefs, your partial plan)
  and `R/probes.json`. Use the Write tool — never a shell redirection.

## Output — return this JSON

```json
{
  "area": "neural-config",
  "routes": 31,
  "briefs": 31,
  "controls": { "owned": 84, "unowned": 6, "shared": 4 },
  "emptyRoutes": ["configuration/neural-config/using-this-page"],
  "notInCapture": [],
  "probes": 4,
  "questions": ["…"],
  "notes": "one factual line per thing worth remembering about this screen; no narrative"
}
```
