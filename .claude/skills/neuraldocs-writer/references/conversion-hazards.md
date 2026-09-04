# MkDocs → Starlight conversion

Read this at the start of any Path A (migration) task. **Conversion is done by hand** — the
`scripts/convert.ts` script was removed on 2026-09-04, because mechanically reshaping a stale
page produced pages that looked finished and were not. Everything below is now your checklist
rather than a description of a tool. The old site is a read-only clone at the map's `sourceRoot`
(`/home/fabio/Documents/NeuralSeek/ns-documentation/knowledge/neuralseek/documentation/docs`).

## Contents

- [Editing the migration map](#editing-the-migration-map)
- [What to convert](#what-to-convert)
- [What needs a judgement call](#what-needs-a-judgement-call)
- [Hazards a script could never see](#hazards-a-script-could-never-see)
- [Finishing checklist for a converted page](#finishing-checklist-for-a-converted-page)

## Editing the migration map

`scripts/migration-map.json` is hand-grouped, with blank lines separating sections. **Edit it with
small targeted string edits, never by loading and re-serialising it** — a reserialize reflows all
3,000 lines, destroys the grouping, and buries the one field you meant to change in an unreviewable
diff. (This has been done by accident; it is recoverable only because the data rarely changes.)

When you start hand-editing a page, set that route's `status` to `adopted` so `bun run stubs`
cannot reclaim the file.

## What to convert

| Old MkDocs                                   | Becomes                                         | Notes                                   |
| -------------------------------------------- | ----------------------------------------------- | --------------------------------------- |
| `!!! type "Title"` + 4-space indented body   | `:::note[Title]` … `:::`                        | ~55 files                               |
| `??? type "Title"` / `???+`                  | `<details><summary>Title</summary>`             | ~24 files                               |
| In-body `# H1`                               | removed                                         | Starlight renders the frontmatter title |
| Headings starting at h3/h4                   | promoted so the shallowest is `h2`              | otherwise the TOC is empty              |
| `](https://documentation.neuralseek.com/x/)` | `](/new-route/)`                                | resolved through the map                |
| `![alt](images/x.png)` and `<img src="…">`   | `/img/<route>/x.png` + file copied to `public/` | 452 images in the old site              |
| ` ```ntl `                                   | ` ```text `                                     | no Shiki grammar for NTL yet            |

Admonition types collapse into Starlight's four asides. The mapping is wide —
`note/info/abstract/quote/example/examples/question/important` → `note`;
`tip/success/hint` → `tip`; `warning/attention/caution` → `caution`;
`danger/error/failure/bug` → `danger`. `!!! example` is by far the most common block in the old
docs and becomes a plain `note`, so **check every converted `:::note` that used to be an example**
— often it reads better as a fenced code block or an ordinary paragraph than as an aside.

Admonition bodies end at the first non-blank unindented line; blank lines inside the block are
kept. A `???` block with no title falls back to the capitalised type as its `<summary>`.

## What needs a judgement call

These are design decisions, not bugs. Do not "fix" them in the script — finish them in the page.

**Only `](url)` markdown links are rewritten.** Bare `https://documentation.neuralseek.com/...`
URLs are left alone because some pages quote the docs URL as example _content_ — inside backticks,
or as the `url:` of an NTL `{{ web }}` node. A blanket rewrite would corrupt those. So after a
conversion, scan for remaining absolute docs URLs and decide one at a time whether each is
navigation (rewrite it to a root-relative route) or content (leave it).

**Merges are not merged.** A route with `action: "merge"` gets its sources concatenated with

```
<!-- MERGE: everything below came from <path>. Fold it into the sections above, then delete this comment. -->
```

between them. The two halves usually repeat each other — both old pages tend to open with
"What is it? / Why is it important? / How does it work?". Folding them means keeping the better
sentences from each, not appending one to the other. The page is not done while the marker is
present. As of the last check this affects `seek/curation` and `governance/overview` among others.

**Unresolved links are reported, not guessed.** If an old absolute link points at a path with no
entry in the map, it stays absolute and the route is flagged. Deciding where it should point is a
human call — check `renamed` and `kill` in the map first, then ask.

**Missing images are reported, not invented.** The converter copies only images a page actually
references, and only if the file exists in the old repo. A reported missing image usually means the
old page linked something that was already broken.

## Hazards a script could never see

- **Shape.** The output is a converted old page, not a page that follows the contract. Bold
  pseudo-headings (`**What is it?**`) and bullet-wrapped paragraphs survive conversion untouched.
  Reshaping is the main human work — see `page-contract.md`.
- **Marketing prose.** The old pages lean hard on "empowers", "seamless", "invaluable". Rewrite.
- **Stale facts.** The clone is a snapshot. Version numbers, model names, limits and pricing are
  the most likely things to have drifted; check them against the live portal
  (https://documentation.neuralseek.com/, `/changelog/` updates roughly monthly).
- **MkDocs macros with no Starlight equivalent.** `{pagelist}` is the one that shows up in the gap
  lists — it generated a "Guides" link list on tab pages. There is no equivalent; hand-author the
  link list.
- **Tables** copied from the old site often have ragged trailing pipes and stray whitespace.
  Prettier (`bun run format`) does not reformat markdown table bodies for you; fix them by hand if
  they render wrong.
- **Trailing whitespace and non-breaking characters** from the old pages, plus smart quotes
  (`NeuralSeek’s`). Harmless, but do not add more.

## Finishing checklist for a converted page

1. Read the old source alongside the converted file — confirm nothing was dropped.
2. Fold and delete every `<!-- MERGE: -->` marker.
3. Resolve every reported unresolved link and missing image.
4. Sweep remaining absolute `documentation.neuralseek.com` URLs; rewrite the navigational ones.
5. Re-check every `:::note` that came from `!!! example`.
6. Reshape into the page contract; rewrite the marketing prose.
7. Work through and delete the `<!-- STILL TO DOCUMENT ON THIS PAGE: -->` comment.
8. Set `"status": "adopted"`.
9. `bun run verify`.
