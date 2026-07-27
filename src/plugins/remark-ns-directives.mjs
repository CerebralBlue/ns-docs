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
import { nsIcons, nsIconNames } from './ns-icons.mjs';

/**
 * Column counts with a matching `.ns-grid--N` modifier class.
 * Must stay in sync with the `.ns-grid--N` rules in
 * src/styles/10-component-cards.css.
 */
const COLS = new Set(['1', '2', '3', '4']);

/**
 * Button variants mapped straight onto Starlight's own LinkButton classes.
 * Styled in src/styles/11-component-buttons.css.
 */
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

/**
 * Build the reporter used by every builder.
 *
 * Does BOTH a `console.warn` and a `file.message()`, deliberately:
 *
 *   - VERIFIED (2026-07-27, Astro 5.18 + Starlight 0.37.7): Astro does NOT
 *     print remark vfile messages, in dev OR in build. So `file.message()`
 *     alone is completely silent — it is structured data for tooling, not
 *     something a human ever sees. Re-test before removing the console call.
 *   - `console.warn` is therefore still the only thing an author actually
 *     reads. Unlike the previous version it now carries `file:line:column`,
 *     so the message points at the mistake instead of just naming the page.
 *
 * POSITIONS ARE BODY-RELATIVE. Astro strips frontmatter before remark runs,
 * so line 1 is the first line AFTER the closing `---`. Add the frontmatter
 * length to match the editor's line numbers.
 *
 * `strict: true` escalates to `file.fail()`. VERIFIED behaviour: Starlight's
 * docs-loader catches the throw per file, logs `[ERROR] Error rendering
 * <file>`, and DROPS that page from the output — but the build still exits 0.
 * So strict is a loud, page-dropping signal, NOT an exit-code gate; a CI job
 * wanting to block on it must grep the build log for `[ns-directives]`.
 *
 * @param {any} file
 * @param {boolean} strict
 * @returns {(node: any, message: string) => void}
 */
function createReporter(file, strict) {
	return (node, message) => {
		const place = node && node.position;
		const options = { place, ruleId: 'ns-directives', source: 'ns-docs' };
		if (strict) file.fail(message, options);

		const start = place && place.start;
		const where = start ? `${file.path}:${start.line}:${start.column}` : file.path;
		console.warn(`[ns-directives] ${where} — ${message}`);
		file.message(message, options);
	};
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
 * @param {any} node the directive node, for error positions
 * @param {(node: any, message: string) => void} report
 */
function iconNode(name, className, node, report) {
	if (typeof name !== 'string' || !name.trim()) return undefined;
	const key = name.trim();
	const source = nsIcons[key];
	if (!source) {
		report(node, `unknown icon "${key}" — rendering without one. Known icons: ${nsIconNames.join(', ')}`);
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

/**
 * Resolve a directive's label, whichever way it was written.
 *
 * There is one concept here — "the visible text of this directive" — and it
 * previously had two independent implementations that also disagreed on the
 * attribute name (`title=` for cards, `text=` for buttons). Both spellings are
 * now accepted on both, and the mdast difference is handled in one place:
 *
 *   - CONTAINER directives put `[Label]` in a leading paragraph tagged
 *     `data.directiveLabel`, which `takeLabel` removes so it cannot render
 *     twice. What remains in `node.children` is the BODY.
 *   - LEAF and TEXT directives have no wrapper paragraph — `[Label]` lands
 *     directly in `node.children`, and there is no body.
 *
 * @param {any} node
 * @param {any} attrs
 * @returns {any[] | undefined} inline nodes for the label, or undefined
 */
function resolveLabel(node, attrs) {
	const inline =
		node.type === 'containerDirective'
			? takeLabel(node)
			: node.children.length
				? node.children.slice()
				: undefined;
	if (inline) return inline;

	const fallback = str(attrs, 'title') || str(attrs, 'text');
	return fallback ? [{ type: 'text', value: fallback }] : undefined;
}

/**
 * Append an optional icon. Written once because the
 * "build it, push it only if it resolved" dance appeared three times.
 *
 * @param {any[]} target
 * @param {unknown} name
 * @param {string} className
 * @param {any} node
 * @param {(node: any, message: string) => void} report
 */
function pushIcon(target, name, className, node, report) {
	const icon = iconNode(name, className, node, report);
	if (icon) target.push(icon);
}

/**
 * `::::ns-grid{cols=2}` → the lattice container.
 * Styled by src/styles/10-component-cards.css.
 */
function buildGrid(node, report) {
	const cols = str(node.attributes, 'cols');
	const className = ['ns-grid'];
	// A modifier class, never an inline `style` string: CSS custom properties
	// in a style attribute do not round-trip reliably through hast-util-to-estree.
	if (cols && COLS.has(cols)) className.push(`ns-grid--${cols}`);
	else if (cols) {
		report(node, `ns-grid has cols=${cols}; only ${[...COLS].join('/')} are supported — falling back to 2.`);
	}
	// `node.children` is reused BY REFERENCE, not cloned. unist-util-visit walks
	// the original array, so reuse is what lets nested ns-cards still be visited
	// and replaced after this grid node has been swapped in. Cloning here would
	// silently leave every card unprocessed.
	return el('div', { className }, node.children);
}

/**
 * `:::ns-card[Title]{icon= href=}` → one lattice cell.
 * Styled by src/styles/10-component-cards.css (base) and
 * src/styles/13-component-treatments.css (per-section overrides).
 */
function buildCard(node, report) {
	const attrs = node.attributes || {};
	const href = str(attrs, 'href');

	// NOTE resolveLabel must run BEFORE node.children is read as the body —
	// for a container directive it shifts the label paragraph off the front.
	const titleChildren = resolveLabel(node, attrs);

	const head = [];
	pushIcon(head, attrs.icon, 'ns-card__icon', node, report);

	if (titleChildren) {
		head.push(
			href
				? el('a', { className: ['ns-card__label'], href }, titleChildren)
				: el('span', { className: ['ns-card__label'] }, titleChildren)
		);
	} else {
		report(node, 'ns-card has no title — add `[Title]` after the directive name, or a `title=` attribute.');
	}

	if (href) pushIcon(head, 'right-arrow', 'ns-card__arrow', node, report);

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
 * in src/styles/11-component-buttons.css.
 */
function buildButton(node, report) {
	const attrs = node.attributes || {};
	const href = str(attrs, 'href');
	if (!href) {
		report(node, 'ns-button has no `href` — skipped.');
		return undefined;
	}

	const variant = str(attrs, 'variant');
	if (variant && !VARIANTS.has(variant)) {
		report(node, `ns-button has variant=${variant}; only ${[...VARIANTS].join('/')} exist — falling back to primary.`);
	}
	const className = ['sl-link-button', 'not-content', variant && VARIANTS.has(variant) ? variant : 'primary'];

	const children = resolveLabel(node, attrs);
	if (!children) {
		report(node, 'ns-button has no label — add `[Label]` after the directive name, or a `text=` attribute.');
		return undefined;
	}

	pushIcon(children, attrs.icon, 'ns-button__icon', node, report);

	// Wrapped in a block-level row on purpose. `.sl-link-button` is
	// `display: inline-flex`, and a tall inline-level box overflows its line
	// box — left bare in the content flow it visually collides with the
	// following paragraph. The wrapper also lets consecutive buttons sit
	// side by side instead of stacking.
	return el('p', { className: ['ns-button-row'] }, [el('a', { className, href }, children)]);
}

/**
 * `:ns-label[text]` → an inline mono micro-label.
 * Styled by src/styles/05-label.css.
 */
function buildLabel(node) {
	return el('span', { className: ['ns-label', 'ns-label--inline'] }, node.children);
}

/**
 * The directive registry — the single source of truth for what exists.
 *
 * Replaces a 5-branch if/else plus a separate `HANDLED` set that had to be kept
 * in sync with it by hand. The marker each directive requires is now DATA
 * (`type`) rather than prose in an error message, so adding a directive means
 * one entry here and one builder, and nothing else.
 *
 * `marker` is only ever shown to an author who got it wrong.
 */
const DIRECTIVES = {
	'ns-grid': { type: 'containerDirective', marker: ':::: ', build: buildGrid },
	'ns-card': { type: 'containerDirective', marker: '::: ', build: buildCard },
	'ns-button': { type: 'leafDirective', marker: ':: ', build: buildButton },
	'ns-label': { type: 'textDirective', marker: ': ', build: buildLabel },
};

const DIRECTIVE_TYPES = ['containerDirective', 'leafDirective', 'textDirective'];

/**
 * @param {{ strict?: boolean }} [options] `strict: true` turns every authoring
 *   warning into a build failure. Intended for CI.
 * @returns {(tree: any, file: any) => void}
 */
export default function remarkNsDirectives(options = {}) {
	const strict = options.strict === true;

	return function transformer(tree, file) {
		// Parity with Starlight's own transformers, which skip virtual files.
		if (!file || !file.path) return;
		const report = createReporter(file, strict);

		visit(tree, DIRECTIVE_TYPES, (node, index, parent) => {
			if (index === undefined || !parent) return;

			const name = node.name;
			if (!name || !name.startsWith('ns-')) return;

			const spec = DIRECTIVES[name];
			if (!spec) {
				// Container directives are never restored to source text by
				// Starlight, so a typo would otherwise render as a bare <div>
				// with no clue why. Leaf/text typos self-heal via restoration.
				report(node, `unknown directive ":${name}" — known: ${Object.keys(DIRECTIVES).join(', ')}`);
				return;
			}

			if (node.type !== spec.type) {
				report(
					node,
					`":${name}" used with the wrong marker — it is a ${spec.type}, so write "${spec.marker.trim()}${name}".`
				);
				return;
			}

			const replacement = spec.build(node, report);
			if (replacement) parent.children[index] = replacement;
		});
	};
}
