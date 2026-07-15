# NeuralDocs — Claude Code Project Context

NeuralSeek documentation portal built on **Astro Starlight** with the
`starlight-theme-obsidian` theme, restyled with the NeuralSeek brand.

## Commit rules

- **NEVER add a co-author line to commits.** Do not append
  `Co-Authored-By: Claude ...` (or any co-author trailer) to commit messages. Ever.
- Keep commit messages short and descriptive.

## Stack & versions

- **Astro 5.18** + **Starlight 0.37.7** — pinned to Astro 5 on purpose: the theme's
  engine (`starlight-site-graph`) depends on the deprecated `astro-integration-kit`,
  which only supports Astro ≤5. Do not bump to Astro 6/7 until the theme ships its rewrite.
- Package manager: **bun** (`bun run dev`, `bun run build`).
- Fonts self-hosted via `@fontsource` (Open Sans + JetBrains Mono).

## Development

Start the dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Layout

- `src/content/docs/` — documentation pages (Markdown/MDX).
- `src/styles/neuralseek.css` — all brand overrides (fonts, colors, gradient canvas,
  title gradients, mobile logo). Unlayered rules intentionally win over the theme's
  `starlight`/`obsidian` cascade layers.
- `src/components/` — component overrides registered in `astro.config.mjs`:
  `SocialIcons.astro` (adds NeuralSeek link), `Footer.astro` (branded footer + ChatWidget),
  `ChatWidget.astro`.
- `src/assets/` — logos (`neuraldocs-logo-light/dark.svg`, `neuraldocs-icon.png`).
- `public/` — favicons.

## Branding notes

- Accent = Trust Blue `#2D5BFF`. Accent scales are declared **per-theme** and inverted
  (`-high` is lightest in dark, darkest in light) — Starlight requires this.
- The rolling-glow gradient is scoped to splash/hero pages only (`:root[data-has-hero]`),
  matching the original theme; doc pages stay flat.
- Page titles: cyan→soft-blue in dark, trust-blue→indigo in light (contrast).

## Astro docs

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
