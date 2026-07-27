# NeuralDocs — project context

NeuralSeek's documentation portal. Astro **Starlight**, restyled to the NeuralSeek brand.
Replaces the current MkDocs site at documentation.neuralseek.com (Starlight was approved
2026-07-14).

## Commit rules

- **NEVER add a co-author trailer to commits.** No `Co-Authored-By: Claude ...`, ever.
- Keep commit messages short and descriptive.

## Stack & versions

- **Astro 5.18** + **Starlight 0.37.7**. No third-party theme — the look is entirely
  `src/styles/neuralseek.css`. The old "do not bump past Astro 5" pin came from
  `starlight-theme-obsidian` → `starlight-site-graph` → deprecated `astro-integration-kit`;
  that theme was **dropped 2026-07-24**, so the pin no longer applies. An Astro 6/7 upgrade
  is now a normal upgrade (untested, but nothing structural blocks it).
- Package manager: **bun** (`bun run dev`, `bun run build`).
- Fonts self-hosted via `@fontsource` (Open Sans + JetBrains Mono).

## Layout

- `src/content/docs/` — documentation pages. Routes = file paths.
- `src/styles/neuralseek.css` — the entire design system (tokens, hairlines, markdown
  typography, sidebar, TOC, cards, code, asides, gradient canvas, mobile logo). Rules are
  **unlayered on purpose** so they win over Starlight's `@layer starlight.*` cascade layers.
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
  - `ChatWidget.astro` — "NeuralSeek Assistant" launcher / "Ask NeuralSeek" panel. `sendMessage()`
    calls the `neuralseek-documentation-website` instance's `/seek` endpoint
    (`stagingapi.neuralseek.com`) directly from the client, authenticated with an `embedcode`
    header (`2041675160`). This is **not** the admin API key — embedCodes are scoped to only the
    seek/mAIstro endpoints, so unlike the admin key they're meant to ship in public frontend
    code; no server-side proxy needed. Chat history + a `sessionId`/`userId` pair persist in
    `localStorage` (`ns-chat-v1` / `ns-session-id` / `ns-user-id`); the header's restart button
    clears history and rotates `sessionId` only.
- `src/assets/` — logos (`neuraldocs-logo-light/dark.svg` = wordmark, `neuraldocs-icon.png` = N mark).
- `public/` — `favicon.png`, hero art.
- `planning/` — IA proposal (`structure-sketch.md`) + page template.
- `scripts/` — `migration-map.json` (old→new route map, drives stub/content generation) +
  `gen-stubs.ts`.
- `src/plugins/` — `remark-ns-directives.mjs` (the `ns-*` component layer) + `ns-icons.mjs`
  (vendored Starlight glyphs). Registered via `markdown.remarkPlugins` in `astro.config.mjs`.
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
- Typos never fail the build — they warn. A bad leaf/text directive comes back as literal text;
  a bad container renders as a plain `<div>` with its content intact.
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

## Design system (Phase A, 2026-07-24)

Minimal corporate/dev look modelled on Supabase docs + the NeuralSeek marketing site.
Brand tokens are **identical** to that site (`--brand-cyan`/`--trust-blue`/`--ink`/… ), so
the two stay in sync by construction. What creates the look:

- `--ns-hairline` / `--ns-hairline-strong` — every border routes through these, including
  Starlight's own `--sl-color-hairline*`. Sections are separated by 1px rules, not boxes.
- `--ns-radius: 4px` — sharp corners everywhere (cards, code, buttons, pagination).
- **The mono micro-label** — 11px uppercase JetBrains Mono at `0.16em` tracking. The
  signature element: sidebar group headings, TOC heading, table headers, aside titles,
  pagination labels. Reusable as `.ns-label` (+ `.ns-label--accent`).
- Nav and sidebar are flattened onto the page canvas (`--sl-color-bg-nav`/`-sidebar`), so a
  hairline is the only thing dividing them. Active sidebar item = 2px accent bar, not a pill.

**Card lattice (Phase B).** Cards share 1px rules with zero gap, forming one connected grid.
Interior lines are `box-shadow`s drawn *outside* each cell on its top + inline-start edges
only, so no two cells can draw the same line and double it; the container's `overflow: clip`
erases the first row/column and leaves the container border as the only outer frame. A
container background was rejected — the cells are translucent, so it would tint every cell
interior and block the splash gradient. `.ns-grid`/`.ns-card` (directives) and
`.card-grid`/`.card` (Starlight components) are styled **together** on purpose.

Four Starlight behaviours worth remembering (all cost real debugging time):

- **Headings are wrapped.** Starlight puts `h2`–`h6` inside `.sl-heading-wrapper.level-hN`
  for anchor links, which makes the heading itself `display: inline`. A `border-top` on the
  `<h2>` spans only the *text*, not the column — put section rules on the **wrapper**.
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
  + `base: '/ns-docs'`.
- **Base-path caveat:** Starlight auto-prefixes nav/sidebar links, assets, the favicon, and the
  sitemap. It does **NOT** prefix (fix these by hand):
  - **hero action links** in `index.mdx` frontmatter
  - **hardcoded absolute paths to `public/` assets** — hero `<img src="/ns-docs/...">`,
    `url('/ns-docs/favicon.png')` in `neuralseek.css`
- **Custom-domain cutover (later):** set `site: 'https://documentation.neuralseek.com'`, remove
  `base`, drop every `/ns-docs` prefix above, add `public/CNAME`.

## Old docs (migration source)

The content is being restructured from the previous MkDocs site (read-only reference clone):
`~/Documents/NeuralSeek/knowledge/neuralseek/documentation/`. Known conversion hazards when
porting a page: `!!!` admonitions (→ `:::` asides), `???` collapsibles (→ `<details>`), internal
links hardcoded to `documentation.neuralseek.com`, NTL code fences (no Shiki grammar), and
in-body H1s that would double with Starlight's auto-title.

> Roadmap, phase status, and current priorities live in `CLAUDE.local.md` (gitignored, private).
