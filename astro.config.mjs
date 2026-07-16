// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeObsidian from 'starlight-theme-obsidian';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages project site. When the custom domain lands (Phase 4),
	// set `site: 'https://documentation.neuralseek.com'` and remove `base`
	// (then also drop the `/ns-docs` prefixes on public-asset refs — see AGENTS.md).
	site: 'https://cerebralblue.github.io',
	base: '/ns-docs',
	integrations: [
		starlight({
			plugins: [starlightThemeObsidian()],
			title: 'NeuralDocs',
			description: 'Official documentation for NeuralSeek — guides, reference, and how-tos.',
			lastUpdated: true,
			logo: {
				light: './src/assets/neuraldocs-logo-light.svg',
				dark: './src/assets/neuraldocs-logo-dark.svg',
				replacesTitle: true,
			},
			favicon: '/favicon.png',
			customCss: ['./src/styles/neuralseek.css'],
			components: {
				SocialIcons: './src/components/SocialIcons.astro',
				Footer: './src/components/Footer.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/CerebralBlue/ns-docs' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
