# NeuralDocs

The NeuralSeek documentation portal, built with [Astro Starlight](https://starlight.astro.build)
and the [`starlight-theme-obsidian`](https://github.com/fevol/starlight-theme-obsidian) theme,
restyled to the NeuralSeek brand.

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

> **Version pin:** this project stays on **Astro 5 / Starlight 0.37.7** on purpose — the theme's
> site-graph engine does not yet support Astro 6/7. Don't upgrade those without checking the theme.

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
