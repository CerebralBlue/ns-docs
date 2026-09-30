# The page contract

Every page has a **type**, set per route in `scripts/migration-map.json` (`routes[route].type`).
The type decides the headings. The definition the gates enforce is
`scripts/agentic/contract.ts`; the starting files are `planning/templates/<type>.md`. This file
explains why the shapes are what they are.

Modelled on documentation readers already trust (Cloudflare, Stripe, Supabase): an intro above
the first heading, headings named after the task or topic, tables for options, numbered steps for
procedures, related links at the end — and no fixed generic headings, no mandatory FAQ.

## Contents

- [Every page](#every-page)
- [The four types](#the-four-types)
- [Choosing the type](#choosing-the-type)
- [Frontmatter](#frontmatter)
- [House style](#house-style)
- [Markdown and component mechanics](#markdown-and-component-mechanics)

## Every page

- `title` and `description` in the frontmatter.
- **An intro paragraph before the first `##`, with no heading.** The first words say what this is
  and who it is for. It replaces the old "What is it" section.
- **No in-body H1** — Starlight renders `title` as the page heading.
- **`## Related` is the last `##`** — the pages a reader goes to next, and the owner pages of the
  concepts named on this one.
- **`## FAQ` is optional.** When present: 2–6 questions a customer would actually ask, placed
  before Related. A question-shaped heading helps the docs chatbot retrieve the page; an invented
  question hurts it. Never a question about something that does not exist.

## The four types

| Type         | What the page is                      | Required `##` (matched by keyword)                                  | Section images go under    |
| ------------ | ------------------------------------- | ------------------------------------------------------------------- | -------------------------- |
| `concept`    | what a feature is and when to use it  | How it works · When to use it                                       | How it works               |
| `task`       | doing one job                         | one `##` per task with numbered steps · Verify _or_ Troubleshooting | the step they show         |
| `reference`  | a settings screen, control by control | Where to find it · Settings                                         | Settings (`###` per group) |
| `quickstart` | first success, start to finish        | Before you begin · Step … · Next steps (in that order)              | each Step                  |

Optional sections by type: concept — Limits; task — Before you begin (only with real
prerequisites); reference — Limits and interactions. Any page may add a `##` the topic needs.

**Keyword matching** means "How Seek caching works" satisfies How it works and "Troubleshooting
sync errors" satisfies Troubleshooting. Name headings after the reader's topic, not the template.

**reference** pages: one `###` per control group as the console groups it, each with its section
crop and a table — setting · what it does · when to change it. A dropdown's options go in a table:
option · what choosing it does. A value the screen happened to show is not a default; write a
default only when the product states it.

**task** pages: steps start with a verb; one action per step; a standard button is part of the
step ("…, then select **Save**"), never its own paragraph.

## Choosing the type

- Does the reader come here to **do** something specific? → `task`.
- Does the page walk through **one screen's settings**? → `reference`.
- Is it the **first thing** a new user follows end to end? → `quickstart`.
- Otherwise it explains a feature → `concept`.

The seed (2026-09-30) assigned types by route pattern; change a route's `type` in the map when a
page is clearly something else. The gates read it.

## Frontmatter

Only `title` and `description` are used. The stub generator emits them as JSON strings
(`title: "Seek overview"`), which is safe for colons and quotes — keep that style.

`description` is what a search result and the docs chatbot show, and often the only sentence a
reader sees before opening the page. One sentence: what this does and who needs it. Do not start
it with the page title again.

## House style

The voice is in `SKILL.md → Voice` (task-first, explain why, document what exists, only names a
customer sees, no UI narration, link don't repeat). On top of it:

- Second person, present tense, active voice.
- No marketing register: _powerful, seamless, simply, effortlessly, robust, cutting-edge,
  leverage (as a verb), unlock, empower_.
- Prefer "NeuralSeek does X" over "NeuralSeek's X feature enables users to be able to X".
- Bold a UI label the first time you name it (**Load Q&A**), then use it plainly.
- Backticks for anything typed or literal: field names, file names, values, endpoints.
- Sentence case for headings. Never "click here" — link the words that name the destination.
- American spelling.

## Markdown and component mechanics

- **Asides** are Starlight's four types: `:::note`, `:::tip`, `:::caution`, `:::danger`. A title
  goes in square brackets: `:::caution[For Bring-your-own LLM users]`.
- **Collapsibles** are raw HTML: `<details><summary>Title</summary>` … `</details>`, with a blank
  line after the `<summary>` line so the body parses as Markdown.
- **Components in `.md`** come from the `ns-*` remark directives — `ns-grid` and `ns-card`
  (containers), `ns-button` (leaf, `::`), `ns-label` (text, `:`). The outer container needs **more
  colons** than the inner one (`::::ns-grid` around `:::ns-card`); equal run lengths close the
  grid at the first card. Always quote `href`. Icons are in `src/plugins/ns-icons.mjs`.
- **`:word` in prose is a text directive and vanishes** (`user:pass@host` renders as
  `user@host`) — escape it as `user\:pass`.
- **Links are authored without the `/ns-docs` base** — `remark-base-path.mjs` adds it at build
  time. Internal links end with a trailing slash: `/governance/semantic-analytics/`.
- **Images** come from the capture (`/img/<area>/<state>--<section>.png`); write alt text that
  says what the image shows.
- **NTL code fences use ` ```text `** until a Shiki grammar exists.
- A directive typo does not fail the build — it warns with `file:line:column`, and **the line
  number is body-relative** because Astro strips frontmatter before remark runs.
