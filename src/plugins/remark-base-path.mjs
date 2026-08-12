/**
 * Prefix root-relative links with the site's `base` path at build time.
 *
 * WHY THIS EXISTS
 * The site deploys to GitHub Pages as a PROJECT page, so every URL is served
 * under `/ns-docs`. Starlight auto-prefixes the things it owns — nav, sidebar,
 * assets, the favicon, the sitemap — but NOT links written inside page content.
 * Without this plugin every author has to remember to type the prefix by hand,
 * 84 content files carry a deployment detail in their prose, and the planned
 * custom-domain cutover becomes a find/replace across all of them.
 *
 * With it, content is authored prefix-free:
 *
 *     [Quickstart](/getting-started/quickstart-seek/)
 *     :::ns-card[Set up]{href="/getting-started/quickstart-seek/"}
 *
 * and the cutover is a one-line change to `BASE` in astro.config.mjs.
 *
 * ORDERING
 * Register this BEFORE remark-ns-directives so it sees the authored directive
 * nodes and can rewrite their `href`/`src` attributes. Afterwards those nodes
 * have been rewritten into paragraphs carrying `data.hProperties`, which this
 * plugin does not look at.
 *
 * WHAT IT COVERS
 *   - Markdown links, images, and reference definitions.
 *   - `href`/`src` on `:::ns-card`, `::ns-button` and any other ns-* directive.
 *   - `href`/`src` on MDX JSX elements — `<LinkButton href="/…">`,
 *     `<LinkCard href="/…">`, `<Card>`. Only STATIC string attributes;
 *     an expression value (`href={x}`) is left alone, since its value is not
 *     knowable here.
 *
 * WHAT IT DOES NOT COVER (both need doing by hand at cutover)
 *   - `hero.actions` links in index.mdx — YAML frontmatter takes no expressions.
 *   - Raw `<a href>` written inline in an HTML block.
 * Both are grep-able:  grep -rn '/ns-docs' src/content/
 */

import { visit } from 'unist-util-visit';

/** URL forms that must never be touched. */
const SCHEME = /^[a-z][a-z0-9+.-]*:/i; // https:, mailto:, tel:, data:, …

/**
 * @param {string | undefined} url
 * @param {string} base normalized, no trailing slash (e.g. `/ns-docs`)
 * @returns {string | undefined} the rewritten URL, or undefined to leave as-is
 */
function withBase(url, base) {
	if (typeof url !== 'string' || !url) return undefined;
	if (url[0] === '#') return undefined; // in-page anchor
	if (url.startsWith('//')) return undefined; // protocol-relative
	if (SCHEME.test(url)) return undefined; // absolute, or a non-http scheme
	if (url[0] !== '/') return undefined; // already relative to the page
	// Idempotent: a hand-written prefix (or a second pass) must not double up.
	if (url === base || url.startsWith(`${base}/`)) return undefined;
	return base + url;
}

/**
 * @param {{ base?: string }} [options]
 * @returns {(tree: any) => void}
 */
export default function remarkBasePath(options = {}) {
	const base = (options.base || '').replace(/\/+$/, '');

	// No base (custom domain, or `base: '/'`) ⇒ nothing to do. Returning a
	// no-op transformer rather than throwing keeps the cutover a one-liner.
	if (!base) return () => {};

	return (tree) => {
		visit(tree, (node) => {
			// Markdown links, images, and reference-style definitions.
			if (node.type === 'link' || node.type === 'image' || node.type === 'definition') {
				const next = withBase(node.url, base);
				if (next) node.url = next;
				return;
			}

			// Directive attributes — `:::ns-card{href="/…"}`, `::ns-button{href="/…"}`.
			// These are plain strings on `node.attributes`, not link nodes, so the
			// branch above never sees them.
			if (
				node.type === 'containerDirective' ||
				node.type === 'leafDirective' ||
				node.type === 'textDirective'
			) {
				const attrs = node.attributes;
				if (!attrs) return;
				for (const key of ['href', 'src']) {
					const next = withBase(attrs[key], base);
					if (next) attrs[key] = next;
				}
				return;
			}

			// MDX JSX attributes — `<LinkButton href="/…">`, `<LinkCard href="/…">`.
			// Here `attributes` is an ARRAY of {type,name,value}, and only a plain
			// string value is safe to rewrite: an expression container carries an
			// ESTree program whose runtime value is unknowable at build time.
			if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
				if (!Array.isArray(node.attributes)) return;
				for (const attr of node.attributes) {
					if (attr.type !== 'mdxJsxAttribute') continue;
					if (attr.name !== 'href' && attr.name !== 'src') continue;
					const next = withBase(attr.value, base);
					if (next) attr.value = next;
				}
			}
		});
	};
}
