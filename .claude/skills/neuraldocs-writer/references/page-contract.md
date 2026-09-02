# The page contract

Every documentation page in this repo follows one shape. The canonical copy is
`planning/templates/feature-page.md`; this file explains why each part exists and shows the
reshaping work in practice.

## Contents

- [The template](#the-template)
- [Frontmatter](#frontmatter)
- [What each section is for](#what-each-section-is-for)
- [House style](#house-style)
- [Reshaping an old page: before and after](#reshaping-an-old-page-before-and-after)
- [Markdown and component mechanics](#markdown-and-component-mechanics)

## The template

```markdown
---
title: <Feature or option name>
description: <One sentence a search result or the chatbot can cite — what this does and who needs it.>
---

## What is it

## Why it matters

## When to use it

## How it works

## FAQ

### <A real question users ask, phrased the way they ask it?>
```

One topic per page. If a page grows a second topic, that is a signal to split it — but splitting
means a new route, a map entry and a sidebar entry, so raise it rather than doing it silently.

## Frontmatter

Only `title` and `description` are used. The converter and the stub generator both emit them as
JSON strings (`title: "Seek overview"`), which is safe for colons and quotes — keep that style.

`description` is not decoration. It is what a search result and the docs chatbot show, and often
the only sentence a reader sees before deciding to open the page. Write it as one sentence that
answers _what this does and who needs it_. Avoid starting it with the page title again.

There is **no in-body H1** — Starlight renders `title` as the page heading. The shallowest heading
in the body must be `h2`, or the table of contents (built from h2/h3) comes out empty.

## What each section is for

**What is it** — two or three sentences. A plain definition. A reader who has never heard the
feature name should finish this section able to say what it is in their own words.

**Why it matters** — the problem it solves for a developer or admin. This is the section where
saying _when it is the wrong tool_ earns the most trust: "if you only need X, use Y instead" saves
a reader an hour.

**When to use it** — concrete scenarios. A bullet list is fine and usually better than prose.

**How it works** — the mechanics: settings, request and response shapes, defaults, limits, order
of operations. Code samples in fenced blocks. Screenshots only where a setting is genuinely hard
to find in the UI; a screenshot is not a substitute for naming the setting in text, because the
chatbot cannot read the image.

**FAQ** — real questions phrased the way users ask them, each with a direct one-paragraph answer.
This section does disproportionate work for retrieval: a question-shaped heading matches a
question-shaped query. Do not invent questions to fill the section — two real ones beat six
manufactured ones. If the source material supports none, leave the section out rather than pad it.

## House style

- Second person for instructions ("you"), present tense, active voice.
- No marketing register. Banned in practice: _powerful, seamless, simply, effortlessly, robust,
  cutting-edge, leverage (as a verb), unlock, empower_. The old MkDocs pages are full of these —
  removing them is part of a migration, not an optional polish step.
- Prefer "NeuralSeek does X" over "NeuralSeek's X feature enables users to be able to X".
- Bold a UI label the first time you name it (**Load Q&A**), then use it plainly.
- Use backticks for anything typed or literal: field names, file names, values, endpoints.
- Sentence case for headings.
- Do not write "click here" — link the words that name the destination.
- American spelling, Oxford comma optional but be consistent within a page.

## Reshaping an old page: before and after

Old MkDocs pages are UI tab tours. They use **bold pseudo-headings** and wrap paragraphs in
bullets, which produces a page with no usable table of contents and a hostile shape for
retrieval. Converting one means keeping every fact and changing the shape.

**Before** (from `ui/seek/index.md`, as it lands after `bun scripts/convert.ts`):

```markdown
## Overview

**What is it?**

- NeuralSeek's Seek feature enables users to test questions and generate answers using
  content from their connected KnowledgeBase. ...

**Why is it important?**

- This feature empowers users to obtain precise and well-contextualized answers by ...

**How does it work?**

- Users begin by inputting a query, defining the language of the query, and then clicking
  the 'Seek' button. ...
```

**After** — the same facts, in the contract:

```markdown
## What is it

Seek is the tab where you ask a question and NeuralSeek answers it from the connected
KnowledgeBase. It highlights which source passages the answer came from and scores how
closely the answer matches them.

## Why it matters

An answer you cannot trace is an answer you cannot ship. Seek exists so you can see the
retrieved sources and the semantic match score beside every answer, and catch a wrong
answer before a user does. It is a testing and tuning surface, not a production endpoint —
production traffic goes through the `/seek` API.

## When to use it

- Sanity-checking a KnowledgeBase after ingestion.
- Reproducing a bad answer a user reported, with the same `User ID` and `Session ID`.
- Comparing answers before and after a Configure change.

## How it works

Enter the query, set its language, and select **Seek**. The answer generates below, with:

| Output                     | What it tells you                                             |
| -------------------------- | ------------------------------------------------------------- |
| Semantic Match %           | How closely the answer aligns with the retrieved source text. |
| KnowledgeBase Confidence % | How related the KnowledgeBase believes the sources are.       |
| ...                        |
```

Three things happened: bold pseudo-headings became real `h2`s (so the page has a TOC),
"enables users to" prose became direct statements, and the section that says when Seek is _not_
the right tool was added. The last one is the part a reader remembers.

Note that the bullet-wrapped paragraph is a real hazard: a single bullet holding a 90-word
paragraph should become a paragraph, while a list of genuinely parallel items stays a list.

## Markdown and component mechanics

- **Asides** are Starlight's four types: `:::note`, `:::tip`, `:::caution`, `:::danger`. A title
  goes in square brackets: `:::caution[For Bring-your-own LLM users]`. Every MkDocs admonition
  type collapses into one of these four.
- **Collapsibles** are raw HTML: `<details><summary>Title</summary>` … `</details>`, with a blank
  line after the `<summary>` line so the body parses as Markdown.
- **Components in `.md`** come from the `ns-*` remark directives — `ns-grid` and `ns-card`
  (containers), `ns-button` (leaf, `::`), `ns-label` (text, `:`). The outer container needs **more
  colons** than the inner one (`::::ns-grid` around `:::ns-card`); equal run lengths close the
  grid at the first card. Always quote `href`. Available icons are defined in
  `src/plugins/ns-icons.mjs`.
- **Links are authored without the `/ns-docs` base** — `remark-base-path.mjs` adds it at build
  time. Internal links end with a trailing slash: `/governance/semantic-analytics/`.
- **Images** live at `/img/<route>/<file>.png` and the file under `public/img/<route>/`. Write
  meaningful alt text; the converter carries over whatever the old page had, which is often the
  filename.
- **NTL code fences use ` ```text `** until a Shiki grammar exists.
- A directive typo does not fail the build — it warns with `file:line:column`, and **the line
  number is body-relative** because Astro strips frontmatter before remark runs. Add the
  frontmatter length to match your editor.
