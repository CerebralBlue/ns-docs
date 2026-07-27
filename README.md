# NeuralDocs

The NeuralSeek documentation portal, built with [Astro Starlight](https://starlight.astro.build)
and restyled to the NeuralSeek brand — a minimal, corporate/dev system of hairline rules,
sharp corners, and monospace micro-labels, sharing its design tokens with the NeuralSeek
marketing site.

Live (preview): https://cerebralblue.github.io/ns-docs/

## Develop

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev        # local dev server at http://localhost:4321/ns-docs
```

| Command              | Action                                                |
| :------------------- | :---------------------------------------------------- |
| `bun run dev`        | Start the dev server                                  |
| `bun run build`      | Build the production site to `./dist/`                |
| `bun run preview`    | Preview the production build locally                  |
| **`bun run verify`** | **format + lint + type-check + build — what CI runs** |
| `bun run format`     | Apply Prettier                                        |
| `bun run lint:css`   | Stylelint over `src/**/*.css`                         |
| `bun run check`      | `astro check` (type-checks `.astro` and `.ts`)        |
| `bun run stubs`      | Regenerate stub pages from the migration map          |

Run `bun run verify` before pushing — the CI `lint` job runs exactly that and gates the deploy.

Currently on **Astro 5 / Starlight 0.37.7**. The old hard pin is gone — it came from
`starlight-theme-obsidian`, which was dropped in favour of the in-house style layer.
TypeScript is pinned to **6.x**: TS 7's native compiler drops the API `astro check` needs.

## Structure

```
src/
├─ content/docs/     Documentation pages (routes = file paths)
├─ components/       Component overrides (SocialIcons, Footer, Hero, ChatWidget)
├─ styles/           The design system — numbered modules; index.css holds the cascade order
├─ plugins/          Remark plugins (base path, ns-* directives) + vendored icons
├─ lib/ns-chat/      Chat widget logic (constants, session, seek client)
└─ assets/           Logos
public/              favicon, hero art
planning/            IA proposal + page template
scripts/             migration map + generators
```

Add pages as `.md`/`.mdx` under `src/content/docs/`; register them in the sidebar in
`astro.config.mjs`. **Write internal links without the `/ns-docs` prefix** —
`src/plugins/remark-base-path.mjs` adds it at build time.

Before editing `src/styles/`, read `src/styles/index.css`: the CSS is unlayered on purpose, so
file order decides equal-specificity conflicts and the numbered `@import` list is that order.

See `CLAUDE.md` for branding, deployment, and base-path notes.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`withastro/action` and publishes to GitHub Pages. The site is served under the `/ns-docs`
base path until a custom domain is attached.
