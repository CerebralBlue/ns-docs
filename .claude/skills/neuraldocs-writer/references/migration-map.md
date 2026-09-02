# `scripts/migration-map.json`

The single source of truth for the old-docs → new-site restructure. It also doubles as the
link-rewrite map for the converter and as the future redirect map.

Read this before editing the map or picking up a route.

## Contents

- [Top-level shape](#top-level-shape)
- [A route entry](#a-route-entry)
- [`status` — the field that protects your work](#status--the-field-that-protects-your-work)
- [`action` — which path a route is on](#action--which-path-a-route-is-on)
- [`gaps` — the documentation gap audit](#gaps--the-documentation-gap-audit)
- [`kill` and `renamed`](#kill-and-renamed)
- [Editing the map safely](#editing-the-map-safely)
- [Useful one-liners](#useful-one-liners)

## Top-level shape

```jsonc
{
  "$comment": "…",
  "sourceRoot": "/home/fabio/Documents/NeuralSeek/knowledge/neuralseek/documentation/docs",
  "routes":  { "<new route>": { … }, … },   // 151 entries
  "kill":    { "<old path>": "why it is not migrating", … },
  "renamed": { "<old route>": "what happened to it", … }
}
```

A key of `routes` is the new-site route, which is also the file path:
`src/content/docs/<route>.md`, served at `/<route>/` (plus the `/ns-docs` base at build time).

## A route entry

```jsonc
"seek/curation": {
  "title": "Answer curation",
  "description": "…",                 // optional — 77 of 151 have one
  "sources": [                        // always present; empty array for new pages
    "ui/curate/index.md",             // paths relative to sourceRoot
    "features/answer_curation/index.md"
  ],
  "action": "merge",
  "status": "adopted",
  "gaps": [ "…", "…" ]                // optional — 96 of 151 have one
}
```

`title`, `sources`, `action` and `status` are on every entry. The **first** source is the primary
content donor; its frontmatter `description` is the fallback when the entry has no `description`.

Counts at last check: 151 routes; 76 with sources, 75 without.

## `status` — the field that protects your work

| Status    | Meaning                            | Who overwrites it                                  |
| --------- | ---------------------------------- | -------------------------------------------------- |
| `stub`    | generated placeholder              | `bun run stubs` rewrites it **every run**          |
| `auto`    | script-converted from the old docs | `bun scripts/convert.ts` rewrites it **on re-run** |
| `adopted` | a human has edited the page        | **nothing ever touches it**                        |

Set `adopted` the moment you start editing a page. It is the only thing standing between an
afternoon of writing and a regenerated blank page. The converter sets `auto` for you; moving to
`adopted` is always manual.

Two corollaries worth remembering:

- The converter **skips** `adopted` routes. If a page still needs converting, convert first, then
  flip the status.
- `adopted` does not mean _finished_. Several adopted pages still carry `<!-- MERGE: -->` markers
  and their gap comment. Always read the file before assuming.

Distribution at last check: 121 `stub`, 21 `auto`, 9 `adopted`.

## `action` — which path a route is on

| Action    | Count | Meaning                                                                      |
| --------- | ----- | ---------------------------------------------------------------------------- |
| `new`     | 75    | Nothing to migrate. Write it from the product. **Path B.**                   |
| `keep`    | 60    | Straight conversion of one old page.                                         |
| `rewrite` | 8     | Old page exists but needs rewriting with a capability focus, not a UI tour.  |
| `merge`   | 5     | Two or more old pages become one. The converter concatenates; a human folds. |
| `distill` | 3     | Take only the developer/admin-relevant slice of a longer old page.           |

`keep`, `rewrite`, `merge` and `distill` are all Path A. `gen-stubs.ts` turns each action into a
one-line note on the stub page, which is why a stub says things like "Content will be merged from
multiple existing pages."

## `gaps` — the documentation gap audit

`gaps` is a list of product surfaces someone confirmed are undocumented on that route. It is
rendered into the page two different ways depending on status:

- **Stub pages** (`bun run stubs`) render it as a visible `## To document on this page` section —
  so ~70 draft pages currently publish their own worklist. That is deliberate while the site is
  unannounced.
- **Converted pages** (`bun scripts/convert.ts`) render it as an HTML comment at the bottom:
  `<!-- STILL TO DOCUMENT ON THIS PAGE: … -->` — invisible on the published site, visible to
  whoever edits the file.

For a `new` route the gaps array is effectively the page outline. For a converted route it is the
list of things the old page never covered. Either way the page is not done until the list is worked
through and the comment deleted.

96 of 151 routes carry a gap list.

## `kill` and `renamed`

`kill` maps an old source path to the reason it is deliberately **not** migrating — UI tab-tour
shells, MkDocs tag indexes, marketing pages that belong on the main site, and a couple of
"confirm at review" entries. Check it before hunting for a source that seems to be missing.

`renamed` records structural moves, with the redirect intent spelled out — for example
`getting-started/deployment` was split into `getting-started/how-to-get-neuralseek` (plans,
purchasing) and `reference/deployment` (platform mechanics). Check it when a link will not resolve.

## Editing the map safely

The file is hand-grouped with blank lines between sections, and the converter edits it with
targeted string replacement to preserve that. Match it:

- Make small, targeted edits (`Edit`), not a JSON reserialize.
- Keep tab indentation and grouping intact.
- Do not reorder routes; the order is the site's reading order.
- `bun run format:check` covers this file via Prettier, so a malformed edit fails `verify`.

## Useful one-liners

```bash
# One route's entry
python3 -c "import json,sys; print(json.dumps(json.load(open('scripts/migration-map.json'))['routes'][sys.argv[1]], indent=2))" seek/curation

# Everything still to migrate (has sources, not adopted)
python3 -c "
import json
r=json.load(open('scripts/migration-map.json'))['routes']
for k,v in r.items():
    if v['sources'] and v['status']!='adopted': print(v['status'], v['action'], k)
"

# Every from-scratch page and its gap count
python3 -c "
import json
r=json.load(open('scripts/migration-map.json'))['routes']
for k,v in r.items():
    if v['action']=='new': print(len(v.get('gaps',[])), k)
"
```
