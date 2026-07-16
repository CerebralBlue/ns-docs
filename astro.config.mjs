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
			// IA per planning/structure-sketch.md (v1 draft — team review pending).
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is NeuralSeek', slug: 'getting-started/what-is-neuralseek' },
						{ label: 'Quickstart: Seek', slug: 'getting-started/quickstart-seek' },
						{ label: 'Quickstart: mAIstro', slug: 'getting-started/quickstart-maistro' },
						{ label: 'Core concepts', slug: 'getting-started/concepts' },
						{ label: 'Deployment options', slug: 'getting-started/deployment' },
					],
				},
				{
					label: 'Seek — Answering Questions',
					items: [
						{ label: 'Overview', slug: 'seek/overview' },
						{ label: 'Tuning answers', slug: 'seek/tuning' },
						{ label: 'Virtual KB', slug: 'seek/virtual-kb' },
						{ label: 'Dynamic filters', slug: 'seek/dynamic-filters' },
						{ label: 'Conversational context', slug: 'seek/conversational-context' },
						{ label: 'Caching', slug: 'seek/caching' },
						{ label: 'Personalization', slug: 'seek/personalization' },
						{ label: 'Answer curation', slug: 'seek/curation' },
						{ label: 'Chat client', slug: 'seek/chat-client' },
					],
				},
				{
					label: 'mAIstro — Agents & Workflows',
					items: [
						{ label: 'Overview', slug: 'maistro/overview' },
						{ label: 'Visual editor', slug: 'maistro/visual-editor' },
						{ label: 'NTL overview', slug: 'maistro/ntl-overview' },
						{
							label: 'NTL Node Reference',
							collapsed: true,
							autogenerate: { directory: 'maistro/ntl' },
						},
					],
				},
				{
					label: 'Knowledge & Data',
					items: [
						{ label: 'Connect a knowledge base', slug: 'knowledge/connect-a-kb' },
						{ label: 'Supported knowledge bases', slug: 'knowledge/supported-knowledgebases' },
						{ label: 'Pinecone setup', slug: 'knowledge/pinecone' },
						{ label: 'Elasticsearch vector model', slug: 'knowledge/elasticsearch-vector-model' },
						{ label: 'Loading documents', slug: 'knowledge/load' },
						{ label: 'Extracting data', slug: 'knowledge/extract' },
						{ label: 'Table understanding', slug: 'knowledge/table-understanding' },
						{ label: 'Auto data cleanse', slug: 'knowledge/auto-data-cleanse' },
					],
				},
				{
					label: 'Integrations',
					items: [
						{ label: 'Virtual agents', slug: 'integrations/virtual-agents' },
						{ label: 'Training virtual agents', slug: 'integrations/training-virtual-agents' },
						{ label: 'watsonx Assistant streaming', slug: 'integrations/watsonx-assistant-streaming' },
						{ label: 'NICE CXone', slug: 'integrations/nice-cxone' },
						{ label: 'Chat SDK', slug: 'integrations/chat-sdk' },
						{ label: 'Implementing feedback', slug: 'integrations/feedback' },
					],
				},
				{
					label: 'Configuration',
					items: [
						{ label: 'Overview', slug: 'configuration/overview' },
						{ label: 'Neural Config options', slug: 'configuration/neural-config' },
						{ label: 'Supported LLMs', slug: 'configuration/supported-llms' },
						{ label: 'Multi-LLM', slug: 'configuration/multi-llm' },
						{ label: 'Multimodal', slug: 'configuration/multimodal' },
						{ label: 'Semantic model tuning', slug: 'configuration/semantic-model' },
						{ label: 'Language handling', slug: 'configuration/language' },
						{ label: 'Backup & restore', slug: 'configuration/backup-restore' },
					],
				},
				{
					label: 'Governance & Analytics',
					items: [
						{ label: 'Overview', slug: 'governance/overview' },
						{ label: 'PII detection', slug: 'governance/pii-detection' },
						{ label: 'Real-time logging', slug: 'governance/logging' },
						{ label: 'Replay', slug: 'governance/replay' },
						{ label: 'Data security & privacy', slug: 'governance/data-security' },
						{ label: 'Semantic analytics', slug: 'governance/semantic-analytics' },
						{ label: 'Content analytics', slug: 'governance/content-analytics' },
						{ label: 'Sentiment', slug: 'governance/sentiment' },
						{ label: 'Intent categorization', slug: 'governance/intent-categorization' },
						{ label: 'Entity extraction', slug: 'governance/entity-extraction' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Changelog', slug: 'reference/changelog' },
						{ label: 'Plans & platforms', slug: 'reference/plans-and-platforms' },
					],
				},
			],
		}),
	],
});
