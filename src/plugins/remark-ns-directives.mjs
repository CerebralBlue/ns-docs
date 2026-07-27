/**
 * NeuralDocs custom components, authored as remark directives.
 *
 * WHY DIRECTIVES AND NOT ASTRO COMPONENTS
 * Astro `.md` files cannot import or use components — that is an Astro
 * limitation, not a Starlight one. The docs are deliberately plain Markdown
 * (portable, agent-readable, and safe for NTL's `{{ … }}` / `<< … >>` syntax,
 * which MDX would parse as JSX and fail on). Directives give `.md` pages a
 * component layer without giving up any of that, and they work in `.mdx` too,
 * so there is exactly one implementation for both authoring surfaces.
 *
 * SYNTAX
 *   ::::ns-grid{cols=2}
 *
 *   :::ns-card[Card title]{icon=rocket href="/ns-docs/some/page/"}
 *   Body copy. Regular **markdown** works in here.
 *   :::
 *
 *   ::::
 *
 *   ::ns-button[Get started]{href="/ns-docs/…" icon=right-arrow variant=primary}
 *   Inline status: :ns-label[beta]
 *
 * AUTHORING TRAPS
 *   - The OUTER container needs MORE COLONS than the inner one (`::::` vs
 *     `:::`). Micromark closes a container on the first matching run length,
 *     so same-length markers would close the grid at the first card.
 *   - Always quote `href`. Unquoted attribute values end at whitespace and may
 *     not contain " ' < = > `.
 *   - Never name a directive `note`, `tip`, `caution` or `danger` — Starlight's
 *     asides own those.
 *
 * COUPLING (accepted, deliberate)
 * This plugin does NOT register `remark-directive`. Starlight already does, in
 * `integrations/remark-rehype.ts`, unconditionally for every file. Registering
 * it a second time would attach the micromark extension twice. If Starlight
 * ever stops doing that, directives silently stop parsing and this file must
 * add `remarkDirective` itself.
 *
 * Astro CONCATENATES `markdown.remarkPlugins` (user array first — see
 * `astro/dist/core/config/merge.js`), so this transformer runs BEFORE
 * Starlight's asides and long before its directive-restoration pass.
 */

import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import { nsIcons } from './ns-icons.mjs';

/** Directive names this plugin handles. */
const HANDLED = new Set(['ns-grid', 'ns-card', 'ns-button', 'ns-label']);

/** Column counts with a matching `.ns-grid--N` modifier class. */
const COLS = new Set(['1', '2', '3', '4']);

/** Button variants mapped straight onto Starlight's own LinkButton classes. */
const VARIANTS = new Set(['primary', 'secondary', 'minimal']);

/**
 * Build an mdast node that `mdast-util-to-hast` emits as an arbitrary HTML
 * element. Same approach as Starlight's `integrations/asides.ts`.
 *
 * @param {string} tagName
 * @param {Record<string, unknown>} [properties]
 * @param {any[]} [children]
 */
function el(tagName, properties = {}, children = []) {
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

/** @param {any} file @param {string} message */
function warn(file, message) {
	const where = file && file.path ? ` (${file.path})` : '';
	console.warn(`[ns-directives] ${message}${where}`);
}

/**
 * Render one of the vendored Starlight glyphs as REAL hast element nodes.
 *
 * This must not use a `{type:'raw'}` node or an mdast `html` node. Raw nodes
 * survive the `.md` pipeline only because Astro runs `rehypeRaw`; in the `.mdx`
 * pipeline `hast-util-to-estree` has no `raw` handler and DROPS them silently,
 * so the icon would vanish from `.mdx` pages with no error. Parsing to real
 * hast nodes and handing them over as `hChildren` is pipeline-agnostic — it is
 * what Starlight itself does for custom aside icons.
 *
 * @param {unknown} name
 * @param {string} className
 * @param {any} file
 */
function iconNode(name, className, file) {
	if (typeof name !== 'string' || !name.trim()) return undefined;
	const key = name.trim();
	const source = nsIcons[key];
	if (!source) {
		warn(file, `unknown icon "${key}" — rendering without one. Known icons: ${Object.keys(nsIcons).join(', ')}`);
		return undefined;
	}
	// Wrap in <svg> so the fragment parses in the SVG namespace, then keep only
	// the glyph children — the wrapper's attributes come from hProperties below.
	const parsed = /** @type {any} */ (
		fromHtml(`<svg>${source}</svg>`, { fragment: true, space: 'svg' }).children[0]
	);
	return {
		type: 'paragraph',
		children: [],
		data: {
			hName: 'svg',
			hProperties: {
				className: [className],
				viewBox: '0 0 24 24',
				width: 16,
				height: 16,
				fill: 'currentColor',
				'aria-hidden': 'true',
			},
			hChildren: parsed.children,
		},
	};
}

/**
 * Pull the `[Label]` off a CONTAINER directive. remark-directive emits it as a
 * leading paragraph tagged `data.directiveLabel`; it is removed from
 * `node.children` so it does not render twice.
 *
 * Leaf and text directives are different: their `[Label]` content becomes
 * `node.children` directly, with no wrapper paragraph — so they use
 * `node.children` rather than this helper.
 *
 * @param {any} node
 * @returns {any[] | undefined}
 */
function takeLabel(node) {
	const first = node.children[0];
	if (
		first &&
		first.type === 'paragraph' &&
		first.data &&
		'directiveLabel' in first.data &&
		first.children.length > 0
	) {
		node.children.shift();
		return first.children;
	}
	return undefined;
}

/** @param {any} attrs @param {string} key */
function str(attrs, key) {
	const v = attrs && attrs[key];
	return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** `::::ns-grid{cols=2}` → the lattice container. */
function buildGrid(node) {
	const cols = str(node.attributes, 'cols');
	const className = ['ns-grid'];
	// A modifier class, never an inline `style` string: CSS custom properties
	// in a style attribute do not round-trip reliably through hast-util-to-estree.
	if (cols && COLS.has(cols)) className.push(`ns-grid--${cols}`);
	// `node.children` is reused BY REFERENCE, not cloned. unist-util-visit walks
	// the original array, so reuse is what lets nested ns-cards still be visited
	// and replaced after this grid node has been swapped in. Cloning here would
	// silently leave every card unprocessed.
	return el('div', { className }, node.children);
}

/** `:::ns-card[Title]{icon= href=}` → one lattice cell. */
function buildCard(node, file) {
	const attrs = node.attributes || {};
	const href = str(attrs, 'href');

	let titleChildren = takeLabel(node);
	if (!titleChildren) {
		const title = str(attrs, 'title');
		if (title) titleChildren = [{ type: 'text', value: title }];
	}

	const head = [];
	const icon = iconNode(attrs.icon, 'ns-card__icon', file);
	if (icon) head.push(icon);

	if (titleChildren) {
		head.push(
			href
				? el('a', { className: ['ns-card__label'], href }, titleChildren)
				: el('span', { className: ['ns-card__label'] }, titleChildren)
		);
	} else {
		warn(file, 'ns-card has no title — add `[Title]` after the directive name, or a `title=` attribute.');
	}

	if (href) {
		const arrow = iconNode('right-arrow', 'ns-card__arrow', file);
		if (arrow) head.push(arrow);
	}

	const children = [];
	if (head.length) {
		// `not-content` goes HERE and nowhere else. Starlight's markdown CSS is
		// written as `:not(:where(.not-content *))`, i.e. it exempts DESCENDANTS
		// of the marked element. On the title that frees the <svg> (which would
		// otherwise collect a content margin and `height: auto`) and the title
		// link (markdown underline + accent colour), while the card body below
		// keeps normal prose rhythm.
		children.push(el('p', { className: ['ns-card__title', 'not-content'] }, head));
	}
	children.push(el('div', { className: ['ns-card__body'] }, node.children));

	const className = ['ns-card'];
	if (href) className.push('ns-card--link');
	return el('div', { className }, children);
}

/**
 * `::ns-button[Label]{href= icon= variant=}` → a button.
 *
 * Emits Starlight's own `sl-link-button` classes on purpose, so hero actions,
 * in-content `<LinkButton>` and this directive are all covered by one rule set
 * in neuralseek.css.
 */
function buildButton(node, file) {
	const attrs = node.attributes || {};
	const href = str(attrs, 'href');
	if (!href) {
		warn(file, 'ns-button has no `href` — skipped.');
		return undefined;
	}
	const variant = str(attrs, 'variant');
	const className = ['sl-link-button', 'not-content', variant && VARIANTS.has(variant) ? variant : 'primary'];

	// Leaf directive: `[Label]` lands directly in node.children, not in a
	// `directiveLabel` paragraph (that form is container-directive only).
	const text = str(attrs, 'text');
	const label = node.children.length
		? node.children.slice()
		: text
			? [{ type: 'text', value: text }]
			: undefined;
	if (!label) {
		warn(file, 'ns-button has no label — add `[Label]` after the directive name.');
		return undefined;
	}

	const children = label;
	const icon = iconNode(attrs.icon, 'ns-button__icon', file);
	if (icon) children.push(icon);

	// Wrapped in a block-level row on purpose. `.sl-link-button` is
	// `display: inline-flex`, and a tall inline-level box overflows its line
	// box — left bare in the content flow it visually collides with the
	// following paragraph. The wrapper also lets consecutive buttons sit
	// side by side instead of stacking.
	return el('p', { className: ['ns-button-row'] }, [el('a', { className, href }, children)]);
}

/** `:ns-label[text]` → an inline mono micro-label. */
function buildLabel(node) {
	return el('span', { className: ['ns-label', 'ns-label--inline'] }, node.children);
}

/**
 * @returns {(tree: any, file: any) => void}
 */
export default function remarkNsDirectives() {
	return function transformer(tree, file) {
		// Parity with Starlight's own transformers, which skip virtual files.
		if (!file || !file.path) return;

		visit(tree, (node, index, parent) => {
			if (
				node.type !== 'containerDirective' &&
				node.type !== 'leafDirective' &&
				node.type !== 'textDirective'
			) {
				return;
			}
			if (index === undefined || !parent) return;

			const name = node.name;
			if (!name || !name.startsWith('ns-')) return;

			if (!HANDLED.has(name)) {
				// Container directives are never restored to source text by
				// Starlight, so a typo would otherwise render as a bare <div>
				// with no clue why. Leaf/text typos self-heal via restoration.
				warn(file, `unknown directive ":${name}" — known: ${[...HANDLED].join(', ')}`);
				return;
			}

			let replacement;
			if (name === 'ns-grid' && node.type === 'containerDirective') {
				replacement = buildGrid(node);
			} else if (name === 'ns-card' && node.type === 'containerDirective') {
				replacement = buildCard(node, file);
			} else if (name === 'ns-button' && node.type === 'leafDirective') {
				replacement = buildButton(node, file);
			} else if (name === 'ns-label' && node.type === 'textDirective') {
				replacement = buildLabel(node);
			} else {
				warn(
					file,
					`":${name}" used with the wrong marker. Use ":::" for ns-grid/ns-card, "::" for ns-button, ":" for ns-label.`
				);
				return;
			}

			if (replacement) parent.children[index] = replacement;
		});
	};
}
