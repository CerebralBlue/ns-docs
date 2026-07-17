# NeuralDocs — project context

NeuralSeek's documentation portal. Astro **Starlight** + the `starlight-theme-obsidian`
plugin, restyled to the NeuralSeek brand. Replaces the current MkDocs site at
documentation.neuralseek.com (Starlight was approved 2026-07-14).

## Commit rules

- **NEVER add a co-author trailer to commits.** No `Co-Authored-By: Claude ...`, ever.
- Keep commit messages short and descriptive.

## Stack & versions — pinned on purpose

- **Astro 5.18** + **Starlight 0.37.7**. Do **not** bump to Astro 6/7: the theme's engine
  (`starlight-site-graph`) depends on the deprecated `astro-integration-kit`, which only
  supports Astro ≤5 and hard-fails on 7. Starlight 0.37.7 is the newest release on Astro 5.
  Revisit when the theme author ships the rewrite (upstream issue: site-graph #36).
- Package manager: **bun** (`bun run dev`, `bun run build`).
- Fonts self-hosted via `@fontsource` (Open Sans + JetBrains Mono).

## Layout

- `src/content/docs/` — documentation pages. Routes = file paths.
- `src/styles/neuralseek.css` — all brand overrides (fonts, colors, gradient canvas, title
  gradients, cards, code surface, mobile logo). Rules are **unlayered on purpose** so they
  win over the theme's `starlight`/`obsidian` cascade layers.
- `src/components/` — component overrides registered in `astro.config.mjs`:
  - `SocialIcons.astro` — appends a NeuralSeek link (renders everywhere social icons do).
  - `Footer.astro` — branded footer + mounts `ChatWidget`; skips Starlight's default footer
    on splash pages (pagination/edit-link are meaningless there and it double-borders).
  - `ChatWidget.astro` — "Ask AI" launcher. **Frontend-only stub**; `sendMessage()` echoes a
    placeholder. Wiring it to NeuralSeek is a later phase (instance
    `neuralseek-documentation-website`, embedCode `2041675160`, `/seek` streaming). Any real
    call goes through a server-side proxy — never put the admin API key in client code.
- `src/assets/` — logos (`neuraldocs-logo-light/dark.svg` = wordmark, `neuraldocs-icon.png` = N mark).
- `public/` — `favicon.png`, hero art.
- `planning/` — IA proposal (`structure-sketch.md`) + page template.
- `scripts/` — `migration-map.json` (old→new route map, drives stub/content generation) +
  `gen-stubs.ts`.
- `src/content/docs/styleguide.mdx` — internal component/branding kitchen-sink page; out of the
  sidebar but still routable.

## Branding notes (the non-obvious bits)

- Accent = Trust Blue `#2D5BFF`. Accent scales **must** be declared per-theme
  (`:root[data-theme='...']`) and **inverted** — in dark `-high` is the lightest shade, in
  light it's the darkest. Starlight declares its own under `[data-theme='light']`, which
  out-specifies a plain `:root` override; that's why a single scale silently fails in light.
- The rolling-glow gradient is scoped to splash/hero pages only via `:root[data-has-hero]`
  (Starlight sets that attribute on `<html>`). Doc pages stay flat — this matches the
  original theme, where gradient pages have no sidebar so the two never mix.
- Page titles: cyan→soft-blue in dark, trust-blue→indigo in light (contrast on white).

## Deployment — GitHub Pages

- Repo `CerebralBlue/ns-docs` (public). `.github/workflows/deploy.yml` builds with
  `withastro/action` on push to `main` → https://cerebralblue.github.io/ns-docs/
- **Project page ⇒ base path.** `astro.config.mjs` sets `site: 'https://cerebralblue.github.io'`
  + `base: '/ns-docs'`.
- **Base-path caveat:** Starlight auto-prefixes nav/sidebar links, assets, the favicon, and the
  site-graph sitemap. It does **NOT** prefix (fix these by hand):
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
