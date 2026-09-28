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

**Read `_private/agentic-v2/conventions.md` first.** A `hint` in the prompt (from a checkpoint
after a failed batch) is an instruction; `mustCover` items for a route go into its brief as
required sections.

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
- `_private/agentic-v2/backlog.json` — entries whose `target` is `route:<one of your routes>`
  are topics a reviewer of another page said this page must cover: give each a section (or a
  paragraph in the right section) in the brief, quoting the backlog `id`, so the writer covers
  it and the reviewer can close it. Entries `capture:<area>` are for the explorer; if one of
  them is still open, say so in the brief's Open questions (the capture did not do it yet).
- `_private/component-map/<area>.json` — every control by region and state
  (`role`, `name`, `kind`, `commits`, `destructive`, `opens`, `states[]`, table `columns`).
- **Context budget — read only what your routes need** (run 202609270311: batches that read every
  state and image of a 74-state capture ran out of context and wrote nothing). First list, per
  route, the states it needs: `jq` over `C/states.json` (ids, `variant.routes`, section/option
  labels) and `grep -l` the route's words across `C/states/*.yml`. Then open **only those**
  snapshots, search them with Grep instead of reading them whole, and Read an image only when you
  must transcribe it (an option list with no a11y values) — never "every panel image once".
  **Write each route's brief as soon as it is done**, then the coverage plan — never hold all of
  them until the end.
- **Read in this order**: `C/states.json` + `C/states/<state>.yml` first (structure: labels,
  values, options, table columns, help text — the snapshot is the truth), then the images
  `public/img/<area>/*.png` (layout, icons; Read shows them — every panel image once), then the
  old page (the _why_). Per state, `states.json` holds `viewport`, `panel`, **`sections`**
  (`{id: {label, image}}` — one crop per field group; these are the images the pages use) and
  **`options`** (`{id: {label, value, values[], image, snapshot}}` — every dropdown's option
  list; `values[]` empty means the a11y tree did not expose the menu — **Read the image and
  transcribe the options from it**, and say so in the brief: `options (from image): …`).
- `R/section/config.json` — the config export. On this platform it is a packed blob
  (`packed: true`, no keys). **A value on screen is one test instance's setting, not a default
  and not a fact for the reader** — never put it in a brief as "X is set to Y". Call a value a
  default only when the screen says so ("Default: 0.7", a reset control, help text) or the old
  page says so (then under "From the old page"). The pages are for customers: nothing in a brief
  may lead the writer to mention the instance, the playground, the MCP, probes or runs.
- **Purpose, not label.** For every control the brief says what it DOES and when to change it.
  Evidence, best first: an experiment (you propose it below; the experimenter runs it after you and
  the writer reads `C/experiments.md`), a probe, help text on screen, the old page (UNCONFIRMED). Where none of
  these exists, add an experiment (below) or a probe; "by its label" is never an explanation.
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

**Variant states first.** A state id with `@` (`knowledgebase-connection@kb-pinecone`) is the same
screen with dropdown options picked; `states.json[id].variant.when` says which ("KnowledgeBase
Type = Pinecone") and `.routes` which pages it serves. Its controls belong to those routes, and
the brief says under which setting they appear ("Shown when KnowledgeBase Type is Pinecone").
Two variants can show the same label ("Index Name") — qualify it in the plan as
`"Index Name [kb-pinecone]"`; the coverage check strips the brackets.

A route goes in `notInCapture` only when no state — default or variant — shows its controls. It
gets a one-paragraph `brief.md` naming the screen AND the setting it needs, and the same in
`needsVariant` in your returned JSON: `[{route, set: [{pick: "<dropdown label>", value: "<option>"}]}]`
— the next plan turns that into a variant capture instead of a skip.

Every named control in the component map (skip the top navigation, the banner, unnamed icon
buttons and table rows) appears exactly once as owned, or in `unowned` with a reason in the
brief. A control that two pages need (a setting one page explains and another page uses)
goes to the page that explains it and is listed in `shared` so the other page links there.
Routes with `console: []` (reference kind) get no controls.

**New pages.** When the screen has more than the routes can explain well — a dropdown whose every
option is its own product (LLM platforms, KnowledgeBase types), a dialog no route owns — propose
a page in `newPages` (returned JSON) with its route (next to its siblings), why, and the controls it
would own, **and write its brief** like any other route's. The IA step adds briefed pages to the map
and sidebar; the writers fill them in the same run. No brief, no page.

**2. `C/briefs/<route folder>/brief.md`** per route, this shape:

```md
# <route> — <title>

Screen: <area> (<url>). Also reads: <areas>. Status today: <stub|auto>. Kind: console|reference.

## Sections

### <h2 the page should have>

Purpose: one sentence — what the reader does here.
Image: `/img/<area>/<state>--<section id>.png` — the section crop that shows these controls (required whenever the section lists a control; `Image: none — <why>` only if no crop exists).
Controls:

- **<label exactly as on screen>** (<role>; state `<id>`; section `<section id>`) — what the screen says it is / does (quote help text); current value `<value>`; options: `Exact Match | Vector Similarity | Fuzzy Match | Keyword Match | Fuzzy Keyword Match` (from `options[].values`, or `options (from image <path>): …`); opens: <what>. Default: <only if the screen says so>.
- …
  Behaviour to confirm: <probe id> — <what the MCP should show>, or "none".

### …

## Shared — explained here for this feature, owned elsewhere

(Feature pages only — e.g. `seek/caching` depends on Intent Match Tolerance, owned by
`configuration/neural-config/intent-matching-caching`.) One `###`-style block per shared control,
in the same shape as a section: `Image:` (the same section crop), the control with its options,
and **what each option means for this feature** ("Vector Similarity lets a rephrased question hit
the same cached answer…" — from the help text and the option names, marked unconfirmed where
you infer). The owner page gets the full control; this page gets the feature's angle plus a link
`[…](/<owner route>/)`. List every shared control in `coverage-plan.shared` under BOTH routes —
coverage counts them on both.

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

**4. `R/experiments.json`** (append; ids `e<batch><n>`) — at most 5 for the whole area: what a
setting DOES, shown by changing it. The experimenter changes ONE setting, saves it as a named
version, asks the same Seek question before and after, and rolls back. Pick the settings whose
purpose no screen text, probe or help text explains (a toggle explained only "by its label"):

```json
[
  {
    "id": "e01",
    "control": "Check document titles as part of the Semantic Match",
    "value": "Enable",
    "question": "What is NeuralSeek?",
    "routes": ["configuration/semantic-model"],
    "why": "no help text; what changes in the semantic score when titles count?"
  }
]
```

`control` = the exact label of a dropdown whose captured option list contains `value`.
`experiments.ts validate` drops anything else (secrets, keys, endpoints, logging, filters, text
inputs, more than 5) — you do not need to police it, but do not waste the budget.

## Rules

- Quote labels **exactly** (case, punctuation, `&`). The coverage gate greps the page for them.
- One control, one owner — but a feature page that depends on a setting lists it in `shared`
  and explains it for the feature. A console-kind page must end with ≥ 1 owned or shared
  control; if you cannot find one on any captured screen, it is `emptyRoutes`, never a page of
  prose.
- Every section that lists a control names its `Image:`; pick the section crop whose label
  matches (states.json → sections). Never point a section at the viewport image.
- The stub's `gaps` list and the route `title` tell you what each page was meant to cover; the
  sidebar order is in `area.json.sidebar`.
- A route that ends up with no controls and no reference material is a `## Open questions`
  entry in its brief and appears in `emptyRoutes[]` in the coverage plan — the IA step decides
  what to do with it. Do not invent content for it.
- Do not write pages. Do not edit the map. Write only under `C/` (briefs, your partial plan)
  and `R/probes.json` / `R/experiments.json`. Use the Write tool — never a shell redirection.

## Output — return this JSON

```json
{
  "area": "neural-config",
  "routes": 31,
  "briefs": 31,
  "controls": { "owned": 84, "unowned": 6, "shared": 4 },
  "emptyRoutes": ["configuration/neural-config/using-this-page"],
  "notInCapture": [],
  "needsVariant": [],
  "newPages": [
    {
      "route": "configuration/llm-platforms/amazon-bedrock",
      "why": "14 platforms in Add an LLM; one page cannot explain each",
      "controls": ["…"]
    }
  ],
  "probes": 4,
  "experiments": 3,
  "questions": ["…"],
  "notes": "one factual line per thing worth remembering about this screen; no narrative"
}
```
