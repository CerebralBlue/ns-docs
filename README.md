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

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `bun run dev`     | Start the dev server                            |
| `bun run build`   | Build the production site to `./dist/`          |
| `bun run preview` | Preview the production build locally            |

Currently on **Astro 5 / Starlight 0.37.7**. The old hard pin is gone — it came from
`starlight-theme-obsidian`, which was dropped in favour of the in-house style layer.

## Structure

```
src/
├─ content/docs/     Documentation pages (routes = file paths)
├─ components/       Component overrides (SocialIcons, Footer, ChatWidget)
├─ styles/           neuralseek.css — all brand overrides
└─ assets/           Logos
public/              favicon, hero art
planning/            IA proposal + page template
scripts/             migration map + generators
```

Add pages as `.md`/`.mdx` under `src/content/docs/`; register them in the sidebar in
`astro.config.mjs`. See `CLAUDE.md` for branding, deployment, and base-path notes.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`withastro/action` and publishes to GitHub Pages. The site is served under the `/ns-docs`
base path until a custom domain is attached.
