/**
 * Turn every ```ntl fence into a two-tab block: "Visualize" (default) renders
 * the NTL as mAIstro nodes via NeuralSeek's embed; "Code" shows the source
 * with Expressive Code's own copy button.
 *
 * AUTHORING — nothing to learn, just write a normal fence:
 *
 *     ```ntl
 *     {{ selectAgent | registry: "digital_tasks" | query: "Send email" }}
 *     ```
 *
 *     ```ntl title="agent.ntl"      <- Expressive Code meta still works
 *     ```ntl novis                  <- opt out: code only, no tabs
 *     ```text                       <- sample OUTPUT is not NTL; use text/plain
 *
 * HOW IT WORKS
 * This plugin only emits markup:
 *
 *     <div class="ns-ntl" data-ns-ntl-block>
 *       <div class="ns-ntl__bar" role="tablist"> …two buttons… </div>
 *       <div class="ns-ntl__viz" data-ns-ntl-src="…escaped NTL…"></div>
 *       <div class="ns-ntl__code" hidden> …the ORIGINAL code node… </div>
 *     </div>
 *
 * The code node is kept as a real mdast node, so Expressive Code still
 * highlights it and supplies the copy button. Tabs, lazy-loading the embed and
 * rendering live in public/ntl-viz.js; styles in src/styles/19-component-ntl-viz.css.
 *
 * Its lang is rewritten to `text`: NTL has no Shiki grammar, and an unknown
 * language would only make Expressive Code warn on every block.
 */
import { visit, SKIP } from 'unist-util-visit';

const escapeAttr = (s) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\r?\n/g, '&#10;');

const OPEN = (ntl) =>
	'<div class="ns-ntl" data-ns-ntl-block>' +
	'<div class="ns-ntl__bar" role="tablist" aria-label="NTL view">' +
	'<button type="button" class="ns-ntl__tab" role="tab" data-ns-ntl-tab="viz" aria-selected="true">Visualize</button>' +
	'<button type="button" class="ns-ntl__tab" role="tab" data-ns-ntl-tab="code" aria-selected="false">Code</button>' +
	'</div>' +
	`<div class="ns-ntl__viz" data-ns-ntl-src="${escapeAttr(ntl)}"><span class="ns-ntl__status">Rendering visualization…</span></div>` +
	'<div class="ns-ntl__code" hidden>';

const CLOSE = '</div></div>';

export default function remarkNtlViz() {
	return (tree) => {
		visit(tree, 'code', (node, index, parent) => {
			if (!parent || index == null) return;
			if (String(node.lang).toLowerCase() !== 'ntl') return;
			const meta = node.meta ?? '';
			if (/(^|\s)novis(\s|$)/.test(meta)) {
				node.meta = meta.replace(/(^|\s)novis(?=\s|$)/, '').trim() || null;
				node.lang = 'text';
				return;
			}
			const ntl = node.value;
			node.lang = 'text';
			parent.children.splice(index, 1, { type: 'html', value: OPEN(ntl) }, node, {
				type: 'html',
				value: CLOSE,
			});
			return [SKIP, index + 3];
		});
	};
}
