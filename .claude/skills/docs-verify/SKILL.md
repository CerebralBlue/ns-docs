---
name: docs-verify
description: Section-level QA of a page the /docs-explore pipeline wrote — when a section or its image looks wrong or does not make sense, find what it was written from in the capture library, show image + README + snapshot next to the text, run the image reviewer and a claims check, and propose the fix (recrop, a better library image, or rewrite just that section), then re-gate. No browser. Use when Fabio types /docs-verify <route> [<section heading>]; never invoke on your own.
argument-hint: '<route> [<section heading>]'
---

# /docs-verify — check one page section against what we captured

The pipeline's own output gets a second look here, from the **capture library**
(`_private/capture-library/<area>/<state>/…`, built by `scripts/agentic/library.ts`), not from a
new capture. No browser, no playground. Nothing is committed. A change to the page or an image
is proposed first and applied only when Fabio says so.

## 1. Locate (read-only)

1. Route and optional section from the arguments. Read `src/content/docs/<route>.md`; the section
   is the `##`/`###` whose heading contains the given text (whole page when none is given).
2. `bun scripts/agentic/library.ts find <route> "<section label or heading>" --json` — for every
   image on the page, the library file it came from; plus the library folders whose README
   mentions the label.
3. The run that wrote the page: `jq '.["<route>"]' _private/agentic-v2/index.json`
   (`runId`, `captureRun`). Its brief: `_private/agentic-v2/runs/<captureRun>/briefs/<route with / → ->/brief.md`.
4. Show Fabio, side by side: the section's text, each of its images (Read them), and the library
   README(s) — what the image shows, how to reach it, the named elements on that screen.

## 2. Check (in parallel, read-only agents)

Make a folder `_private/agentic-v2/runs/verify-<YYYYMMDDHHMM>/` and spawn together:

- **`image-reviewer`** — "Review the images of the route `<route>`" (all images, or the
  section's), writing `…/verify-<ts>/<route folder>/image-review.json`.
- **`doc-reviewer`** — scoped to the section: "Review only the section `<heading>` of `<route>`
  (lines A–B). Check every label, value and behaviour it states against the brief
  `<brief path>`, the snapshots in `<capture>/states/` and the library README(s) `<paths>`; mark
  anything they do not show. Findings only, to `…/verify-<ts>/<route folder>/review.json`."

Also run `bun scripts/agentic/image-check.ts <route>` and
`bun scripts/agentic/values.ts <runId> <route>` yourself for the pixel and label evidence.

## 3. Propose — one fix per problem, cheapest first

| Problem                             | Fix                 | How                                                                                                                                                             |
| ----------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neighbour section / section cut off | recrop              | the library `panel.png`/`dialog.png` → `bun scripts/agentic/compose-panel.ts --item … --dialog … --out <scratchpad>` (or a sharp crop by rows); show the result |
| Wrong or weak image                 | swap                | another crop of the same section from the library folder (`sections/<id>/image.png`)                                                                            |
| Tiny image (a lone checkbox)        | drop                | remove it; the sentence carries the label                                                                                                                       |
| Claim the capture does not show     | rewrite the section | the `writer` in fix mode, on that section only, from the brief + library README                                                                                 |
| Nothing in the library shows it     | recapture           | a targeted `/docs-explore <area> --states <state> --only <route>` — say which                                                                                   |

Present the proposals with before/after images. **Apply only what Fabio approves.**

## 4. Apply (after approval) and re-gate

- New image: write it into the library folder it belongs to (keep the old one as
  `*.prev.png`), then `bun scripts/agentic/library.ts publish <route>`; change the page's
  `![…](…)` path only if the file name changes.
- Section rewrite: spawn `writer` in fix mode with the approved finding list, `runId` = the
  page's `runId`, `C` = its `captureRun`.
- Then `bun scripts/agentic/gates.ts <runId> <route>` and `bun run verify`. Report the gates.
- `status` stays as it is; `adopted` is Fabio's to set. Never commit.
