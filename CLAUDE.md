# NeuralDocs — project context

NeuralSeek's documentation portal. Astro **Starlight**, restyled to the NeuralSeek brand.
Replaces the current MkDocs site at documentation.neuralseek.com (Starlight was approved
2026-07-14).

## Commit rules

- **NEVER add a co-author trailer to commits.** No `Co-Authored-By: Claude ...`, ever.
- Keep commit messages short and descriptive.

## Stack & versions

- **Astro 5.18** + **Starlight 0.37.7**. No third-party theme — the look is entirely
  `src/styles/`. The old "do not bump past Astro 5" pin came from
  `starlight-theme-obsidian` → `starlight-site-graph` → deprecated `astro-integration-kit`;
  that theme was **dropped 2026-07-24**, so the pin no longer applies. An Astro 6/7 upgrade
  is now a normal upgrade (untested, but nothing structural blocks it).
- Package manager: **bun** (`bun run dev`, `bun run build`).
- Fonts self-hosted via `@fontsource` (Open Sans + JetBrains Mono).
- **`bun run verify`** = `format:check` → `lint:css` → `check` → `build`. This is exactly what
  CI runs (`.github/workflows/deploy.yml`, `lint` job, gating `build`); run it before pushing.
  Individually: `bun run format` (Prettier), `bun run lint:css` (Stylelint), `bun run check`
  (`astro check`), `bun run stubs` (regenerate stub pages).
- **TypeScript is pinned to 6.x on purpose.** TS 7's native compiler does not expose the
  programmatic API `astro check` needs, so bumping to 7 silently breaks type-checking.

## Layout

- `src/content/docs/` — documentation pages. Routes = file paths.
- `src/styles/` — the design system, split into ~18 numbered modules. Rules are **unlayered on
  purpose** so they win over Starlight's `@layer starlight.*` cascade layers. See
  "The stylesheet" below — read `src/styles/index.css` before touching any of it.
- `src/lib/ns-chat/` — the chat widget's non-DOM logic, so it is readable and testable apart
  from the component: `constants.ts` (endpoint, embedCode, storage keys, user-facing strings),
  `session.ts` (identity + history persistence; all `localStorage` access), `seek-client.ts`
  (the `/seek` call, with timeout and typed `SeekError`s).
- `src/components/` — component overrides registered in `astro.config.mjs`:
  - `SocialIcons.astro` — appends a NeuralSeek link (renders everywhere social icons do).
  - `Footer.astro` — branded footer + mounts `ChatWidget`; skips Starlight's default footer
    on splash pages (pagination/edit-link are meaningless there and it double-borders).
  - `Hero.astro` — **wraps** Starlight's Hero (renders `<Default />` inside) and adds the
    split code panel beside it. It wraps rather than reimplements because the h1's `id="_top"`
    is the SkipLink and TOC target, and `PAGE_TITLE_ID` lives in
    `@astrojs/starlight/constants`, which is **not** in the package `exports` map — a
    reimplementation would have to hardcode it. Only `index.mdx` has `hero:` frontmatter, so
    this affects one page.
  - `ChatWidget.astro` — "NeuralSeek Assistant" launcher / "Ask NeuralSeek" panel. Only DOM
    wiring lives here; everything else is in `src/lib/ns-chat/` (above). It calls the
    `neuralseek-documentation-website` instance's `/seek` endpoint (`stagingapi.neuralseek.com`
    — **staging on purpose** while pre-launch) with an `embedcode` header (`2041675160`). That
    is **not** the admin API key — embedCodes are scoped to only the seek/mAIstro endpoints, so
    unlike the admin key they're meant to ship in public frontend code; no proxy needed. Chat
    history + a `sessionId`/`userId` pair persist in `localStorage` (`ns-chat-v1` /
    `ns-session-id` / `ns-user-id`); the restart button clears history and rotates `sessionId`
    only. **It reparents itself to `<body>` on mount** — see the stacking-context note below.
- `src/assets/` — logos (`neuraldocs-logo-light/dark.svg` = wordmark, `neuraldocs-icon.png` = N mark).
- `public/` — `favicon.png`, hero art.
- `planning/` — IA proposal (`structure-sketch.md`) + page template.
- `scripts/` — `migration-map.json` (old→new route map, drives stub/content generation) +
  `gen-stubs.ts`.
- `src/plugins/` — `remark-base-path.mjs` (prefixes root-relative links with `base`),
  `remark-ns-directives.mjs` (the `ns-*` component layer), `ns-icons.mjs` (vendored Starlight
  glyphs). The two remark plugins are registered via `markdown.remarkPlugins` in
  `astro.config.mjs`, **in that order** — base-path must see the authored directive nodes
  before ns-directives rewrites them into paragraphs.
- `src/content/docs/styleguide.mdx` — internal component/branding kitchen-sink page; out of the
  sidebar but still routable.
- `src/content/docs/directives-test.md` — `draft: true` regression page for the directives in
  plain `.md` (incl. failure modes). Excluded from production builds; visible in dev.

## Components in plain `.md` — the `ns-*` directives

Astro `.md` cannot import components; that is an Astro limit, not Starlight's. The docs stay
plain Markdown on purpose (portable, agent-readable, and safe for NTL's `{{ … }}` / `<< … >>`,
which MDX would parse as JSX and fail on). Remark directives give `.md` a component layer
anyway, and they work in `.mdx` too — so there is **one implementation for both**.

```md
::::ns-grid{cols=2}

:::ns-card[Set up NeuralSeek]{icon=rocket href="/ns-docs/getting-started/quickstart-seek/"}
Body copy. Regular **markdown** works in here.
:::

::::

::ns-button[Get started]{href="/ns-docs/…" icon=right-arrow variant=primary}
Inline status: :ns-label[beta]
```

- **The outer container needs MORE COLONS than the inner one** (`::::` grid, `:::` card).
  Micromark closes a container on the first matching run length, so equal markers end the grid
  at the first card. A `:::note` inside a card pushes the card to `::::` and the grid to `:::::`.
- Always quote `href` — unquoted attribute values end at whitespace.
- Icons come from `src/plugins/ns-icons.mjs`. They are **copied verbatim** from Starlight, not
  imported: its `exports` map has no `./components/*` wildcard, so the specifier does not
  resolve. Add one by copying its value out of `@astrojs/starlight/components/Icons.ts`.
- Adding a directive = one entry in the `DIRECTIVES` table in `remark-ns-directives.mjs` plus a
  builder. The table holds the marker each directive requires (`containerDirective` /
  `leafDirective` / `textDirective`), so the dispatch and the wrong-marker error come free.
- `[Label]` and the `title=` / `text=` attributes are interchangeable on every directive —
  one `resolveLabel()` handles the container and leaf/text forms.
- Typos never fail the build — they warn, with `file:line:column`. A bad leaf/text directive
  comes back as literal text; a bad container renders as a plain `<div>`, content intact.
  **Line numbers are body-relative** (Astro strips frontmatter before remark), so add the
  frontmatter length to match your editor. `remarkNsDirectives({ strict: true })` escalates
  to `file.fail()` — verified: Starlight logs `[ERROR] Error rendering <file>` and drops that
  page, but the build still exits 0, so it is a loud signal, not an exit-code gate.
- **Astro does not print remark vfile messages at all** (verified on 5.18 / Starlight 0.37.7,
  dev and build). That is why the plugin does `console.warn` _and_ `file.message()`. Re-test
  before deleting the console call.
- `scripts/gen-stubs.ts` **rewrites every `status: "stub"` file on each run** — never hand-add
  directives to a stub. Change the generator's body template, or flip the route's status in
  `scripts/migration-map.json` first.

## Branding notes (the non-obvious bits)

- Accent = Trust Blue `#2D5BFF`. Accent scales **must** be declared per-theme
  (`:root[data-theme='...']`) and **inverted** — in dark `-high` is the lightest shade, in
  light it's the darkest. Starlight declares its own under `[data-theme='light']`, which
  out-specifies a plain `:root` override; that's why a single scale silently fails in light.
- The rolling-glow gradient is scoped to splash/hero pages only via `:root[data-has-hero]`
  (Starlight sets that attribute on `<html>`). Doc pages stay flat — gradient pages have no
  sidebar, so the two never share a screen.
- Page titles are **solid** on doc pages (crisp reads as corporate); the cyan→soft-blue /
  trust-blue→indigo gradient is reserved for the splash hero. To bring gradient titles back,
  add the doc-title selectors to the `.hero h1` rule.

## The stylesheet — `src/styles/` (split 2026-07-27)

The design system was one 1200-line `neuralseek.css`. It is now ~18 numbered modules plus
`src/styles/index.css`, which is **the only entry in `customCss`** and holds the `@import`
list. Read its header before changing anything here.

**The one rule that matters:** the CSS is unlayered on purpose (so it beats
`@layer starlight.*`), which means equal-specificity conflicts are decided by **source
order** — and the numbered `@import` list _is_ that order. If two rules that can match the
same element have equal specificity, **the higher-numbered file wins.** Files carrying a
real ordering hazard say so in their header (`04-theme` ↔ `16-page-splash` over
`--sl-color-bg-nav` is the live one; `10-component-cards` ↔ `13-component-treatments` is a
latent one).

Numeric prefix = cascade position; the name says what breaks it — `chrome-*` on a Starlight
upgrade, `content-*` on a markdown-pipeline change, `component-*` on a
`remark-ns-directives.mjs` change, `page-*` is `:root[data-has-hero]`-scoped. So
`ls src/styles/` prints the cascade.

Two things that look like bugs and are not:

- **Seven brand primitives have no `var()` consumer.** The palette is mirrored 1:1 from the
  marketing site and kept whole deliberately; four of them are also live as hand-typed `rgba`
  literals in the splash gradient (annotated in `16-page-splash.css`). Do not prune them.
- **The mono-label recipe is repeated at six call sites and is not unified.** Three of them use
  different tracking, so a blanket merge changes rendering — and one selector group spanning
  five components would have to live in one file, defeating the split.

**`50rem` is a magic number that cannot be a token.** `@media (min-width: var(--x))` is invalid
CSS — media-feature values resolve before custom-property substitution. It is Starlight's own
layout switch, repeated in `03`/`10`/`13`/`17`; `grep -rn "50rem" src/styles/` before changing it.

There are **no `!important` declarations left**. All five were verified redundant with a
computed-style probe (3 pages × 2 themes × 4 widths) — unlayered CSS already beats Starlight's
layered rules. Add one only with the same evidence.

### Design system (Phase A, 2026-07-24)

Minimal corporate/dev look modelled on Supabase docs + the NeuralSeek marketing site.
Brand tokens are **identical** to that site (`--brand-cyan`/`--trust-blue`/`--ink`/… ), so
the two stay in sync by construction. What creates the look:

- `--ns-hairline` / `--ns-hairline-strong` — every border routes through these, including
  Starlight's own `--sl-color-hairline*`. Sections are separated by 1px rules, not boxes.
- `--ns-radius: 4px` — sharp corners everywhere (cards, code, buttons, pagination).
- **The mono micro-label** — 11px uppercase JetBrains Mono at `0.16em` tracking. The
  signature element: sidebar group headings, TOC heading, table headers, aside titles,
  pagination labels. Reusable as `.ns-label`.
- Nav and sidebar are flattened onto the page canvas (`--sl-color-bg-nav`/`-sidebar`), so a
  hairline is the only thing dividing them. Active sidebar item = 2px accent bar, not a pill.

**Card lattice (Phase B).** Cards share 1px rules with zero gap, forming one connected grid.
Interior lines are `box-shadow`s drawn _outside_ each cell on its top + inline-start edges
only, so no two cells can draw the same line and double it; the container's `overflow: clip`
erases the first row/column and leaves the container border as the only outer frame. A
container background was rejected — the cells are translucent, so it would tint every cell
interior and block the splash gradient. `.ns-grid`/`.ns-card` (directives) and
`.card-grid`/`.card` (Starlight components) are styled **together** on purpose.

Starlight behaviours worth remembering (all cost real debugging time):

- **`.main-pane` is a stacking context.** `TwoColumnContent.astro` sets `isolation: isolate`
  on it. Anything rendered from `Footer.astro` (i.e. the ChatWidget) lives inside it, so a
  `position: fixed; z-index: N` overlay is trapped there — and the full-height fixed
  `.right-sidebar`, which is OUTSIDE `.main-pane`, paints over it. This made the chat launcher
  unclickable on every doc page at ≥50rem while working fine on the splash page (no sidebar),
  which is why it went unnoticed for a long time. The widget now reparents itself to `<body>`
  on mount. **Any future page-level overlay must do the same.**

- **Headings are wrapped.** Starlight puts `h2`–`h6` inside `.sl-heading-wrapper.level-hN`
  for anchor links, which makes the heading itself `display: inline`. A `border-top` on the
  `<h2>` spans only the _text_, not the column — put section rules on the **wrapper**.
- **`Card` tints icons by index.** Starlight cycles `--sl-card-border`/`--sl-card-bg` through
  orange/purple/green/red/blue on `nth-child(4n+…)`, giving a rainbow of icon chips. The chip
  is stripped entirely so the grid reads as one monochrome system.
- **There is no `.action` class.** `Hero.astro` renders hero actions through `<LinkButton>`, so
  everything button-shaped — hero actions, in-content `<LinkButton>`, `::ns-button` — is
  `.sl-link-button`. One rule set covers all three. A `.hero .action` selector matches nothing.
- **The navbar is page-type dependent.** Starlight sizes the header's first grid column from
  `--sl-content-inline-start` (0 on splash, `18.75rem` on doc pages) and `--sl-content-width`
  (`67.5rem` vs `45rem`), which made the search box jump ~7.8rem between the landing page and
  any doc page. Two things now hold it still: the first track is pinned to a fixed width, and
  the search is **right-aligned** in column 2 so it hangs off the always-stable right-hand
  group instead of off the variable left column. Below `50rem` the header is flex and is
  deliberately left alone — the hamburger only exists on sidebar pages, so the search sits 48px
  (one hamburger) further left there, which is correct rather than a bug.
- **`site-search` is `display: contents`.** The flex/grid item to align or size is
  `button[data-open-modal]`, not the `<site-search>` element or its wrapper.
- **`Code` is not at `user-components/Code.astro`.** That file does not exist and
  `./user-components/*` is not exported at all. `import { Code } from '@astrojs/starlight/components'`
  is the only specifier that resolves; it is a re-export of `astro-expressive-code/components`
  and works inside a component override.
- **`frame="none"` on a `bash` `<Code>` block.** With the default `frame="auto"`, Expressive
  Code treats shell languages as terminals and draws macOS traffic-light dots. `frame="none"`
  removes the titlebar and keeps the copy button.

## Landing page (`index.mdx`)

Split hero — copy left, a real `/seek` call right, in a **translucent** panel
(`.ns-hero-panel`). Translucent is required: an opaque panel would punch a hole in the
`[data-has-hero]` gradient canvas, the same reason the card lattice has no container
background. Inside it, Expressive Code's own surfaces are neutralised (`--ec-codeBg`,
`--ec-frm-edBg`, `--ec-brdCol` → transparent) so the panel supplies the only frame.

The hero snippet uses **real** `/seek` field names, verified against the REST API reference:
`answer`, `KBscore`, `semanticScore`, `url`, `document`. Note `KBscore` is capitalised exactly
like that in the REST response, while the NTL `seekOut` node spells the same concept `kbScore`.
There is no `confidence` or `sources` field — don't invent one.

Page sections, each wrapped in a treatment class that restyles the same `ns-card` output:
Start here (`.ns-tiles .ns-tiles--spotlight`) · Browse by capability (`.ns-index`) ·
Deployment & platforms (`.ns-tiles`, 2 cards) · Resources & community (`.ns-links`).

- **`.ns-index`** is the six-capability directory: grouped **link lists** inside the card
  lattice — the Stripe/Vercel density pattern — rendered as one ruled table. Desktop uses
  `grid-template-rows: subgrid` so each cell's description/links hairline lands on the same
  baseline across the row; the row count is **hardcoded 3×2**, so six groups is a constraint,
  not a coincidence. Keep five links per group — a ragged column bottom shows in a table.
- **The spotlight is opt-in** (`--spotlight`). `.ns-tiles` is used twice; the accent wash on
  the first card is the page's single "start here" signal, so only one block carries it.
- **Splash headings have no rule and no anchor link.** Scoped to `:root[data-has-hero]`:
  every block already carries its own treatment, so the `h2` hairline is a second divider,
  and nobody deep-links a landing-page heading. Doc pages keep both. Site-wide anchor
  removal would instead be `markdown: { headingLinks: false }` in `astro.config.mjs`.

## Deployment — GitHub Pages

- Repo `CerebralBlue/ns-docs` (public). `.github/workflows/deploy.yml` builds with
  `withastro/action` on push to `main` → https://cerebralblue.github.io/ns-docs/
- **Project page ⇒ base path.** `astro.config.mjs` sets `site: 'https://cerebralblue.github.io'`
  together with `base: '/ns-docs'`.
- **Author links WITHOUT the prefix.** `src/plugins/remark-base-path.mjs` adds it at build time
  to markdown links/images, `ns-*` directive `href`/`src`, and static MDX JSX `href`/`src`. So
  write `[Quickstart](/getting-started/quickstart-seek/)`. The rewrite is idempotent, so a
  stray hand-written prefix still resolves. `BASE` in `astro.config.mjs` is the single source
  of truth and feeds both Astro's `base` and the plugin.
- **The plugin cannot reach two things**, which stay hand-written:
  - **hero action links** in `index.mdx` frontmatter — YAML takes no expressions
  - raw `<a href>` inside an HTML block
    Find them with `grep -rn '/ns-docs' src/content/` — currently exactly one hit, plus its
    explanatory comment.
- **Custom-domain cutover (later):** set `site: 'https://documentation.neuralseek.com'`, set
  `BASE = ''`, fix the hero action link, add `public/CNAME`.

## Old docs (migration source)

The content is being restructured from the previous MkDocs site (read-only reference clone):
`~/Documents/NeuralSeek/knowledge/neuralseek/documentation/`. Known conversion hazards when
porting a page: `!!!` admonitions (→ `:::` asides), `???` collapsibles (→ `<details>`), internal
links hardcoded to `documentation.neuralseek.com`, NTL code fences (no Shiki grammar), and
in-body H1s that would double with Starlight's auto-title.

> Roadmap, phase status, and current priorities live in `CLAUDE.local.md` (gitignored, private).
