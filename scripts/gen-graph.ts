/**
 * Build the site graph that feeds the sidebar graph panel.
 *
 * Output: public/graph.json — read at runtime by src/components/SiteGraph.astro.
 *
 * WHY TWO EDGE TYPES. An Obsidian-style graph assumes a densely wikilinked
 * vault. This site is not one yet: of 171 pages, only ~30 contain a single
 * internal link (measured 2026-09-02). Drawing authored links alone produces
 * ~141 orphan dots, which reads as a broken widget rather than as a map. So the
 * IA carries the graph and the links decorate it:
 *
 *   kind: 'tree'  parent -> child, derived from the route path. Always present,
 *                 so the graph is connected on day one.
 *   kind: 'link'  an authored markdown link between two pages. Sparse today,
 *                 densifies for free as the migration adds cross-references.
 *
 * The renderer draws them differently. As real links accumulate the picture
 * shifts from "table of contents" to "knowledge graph" with no code change.
 *
 * Hierarchy comes from the ROUTE PATH, not from the sidebar config, because
 * astro.config.mjs feeds its sidebar array into starlight() and the integration
 * does not hand it back. Path and sidebar agree by construction here — routes
 * ARE file paths, and the 8 top-level groups are the 8 directories.
 *
 * Usage:  bun scripts/gen-graph.ts        (also runs from `bun run prebuild`)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS = join(ROOT, 'src/content/docs');
const MAP_PATH = join(ROOT, 'scripts/migration-map.json');
const OUT_PATH = join(ROOT, 'public/graph.json');

/**
 * Pages that exist as routes but are not part of the documentation tree.
 * `index` is handled separately — it becomes the graph's root node.
 */
const EXCLUDE = new Set(['directives-test']);

/**
 * Labels for the 8 top-level groups. These MIRROR the top-level `label:` values
 * in astro.config.mjs's sidebar; they are duplicated here only because the
 * integration swallows that array (see the header note). The assertion below
 * fails loudly if a new top-level directory appears without a label, so the two
 * cannot drift silently.
 */
const GROUP_LABELS: Record<string, string> = {
	'getting-started': 'Getting Started',
	seek: 'Seek',
	maistro: 'mAIstro',
	knowledge: 'Knowledge',
	configuration: 'Configuration',
	integrations: 'Integrations',
	governance: 'Governance',
	reference: 'Reference',
};

/** Segments whose title-cased form would be wrong. */
const ACRONYMS: Record<string, string> = {
	ntl: 'NTL',
	pii: 'PII',
	api: 'API',
	neuraledit: 'NeuralEdit',
};

type Node = {
	id: string;
	label: string;
	kind: 'root' | 'group' | 'page';
	group: string;
	depth: number;
	status: string;
};
type Edge = { source: string; target: string; kind: 'tree' | 'link' };

const map: { routes: Record<string, { status?: string; title?: string }> } = JSON.parse(
	readFileSync(MAP_PATH, 'utf8')
);

/** Recursive walk — mirrors doc-lint.ts rather than pulling in a glob dependency. */
function walk(dir: string, acc: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, acc);
		else if (['.md', '.mdx'].includes(extname(entry))) acc.push(full);
	}
	return acc;
}

function frontmatter(raw: string): Record<string, string> {
	if (!raw.startsWith('---')) return {};
	const end = raw.indexOf('\n---', 3);
	if (end === -1) return {};
	const out: Record<string, string> = {};
	for (const line of raw.slice(3, end).split('\n')) {
		const m = /^(\w+):\s*(.+?)\s*$/.exec(line);
		if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
	}
	return out;
}

function titleCase(segment: string): string {
	if (ACRONYMS[segment]) return ACRONYMS[segment];
	return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Normalize an authored link target to a route id.
 *
 * Content is authored WITHOUT the deployment prefix and remark-base-path adds
 * it at build time — but several pages carry a hand-written `/ns-docs/...`
 * anyway (the rewrite is idempotent, so both forms ship correctly). Both must
 * collapse to the same node or the graph would draw two of everything.
 */
function normalizeLink(href: string): string | null {
	let h = href.split('#')[0].split('?')[0];
	if (!h.startsWith('/')) return null;
	h = h.replace(/^\/ns-docs/, '');
	h = h.replace(/^\/+|\/+$/g, '');
	if (!h || h.startsWith('img/') || h.startsWith('_')) return null;
	return h;
}

const nodes = new Map<string, Node>();
const edges: Edge[] = [];
const seenEdges = new Set<string>();

function addEdge(source: string, target: string, kind: Edge['kind']) {
	if (source === target) return;
	const key = `${kind}:${source}>${target}`;
	if (seenEdges.has(key)) return;
	seenEdges.add(key);
	edges.push({ source, target, kind });
}

// The landing page is the root every top-level group hangs off, so the graph is
// one connected component rather than 8 floating islands.
nodes.set('', {
	id: '',
	label: 'NeuralDocs',
	kind: 'root',
	group: '',
	depth: 0,
	status: 'adopted',
});

/** Create the group node for a directory path, and the chain above it. */
function ensureGroup(path: string): void {
	if (nodes.has(path)) return;
	const segments = path.split('/');
	const label = segments.length === 1 ? GROUP_LABELS[path] : titleCase(segments.at(-1)!);
	if (!label) {
		throw new Error(
			`gen-graph: top-level directory "${path}" has no entry in GROUP_LABELS.\n` +
				`Add it there (mirroring its sidebar label in astro.config.mjs).`
		);
	}
	nodes.set(path, {
		id: path,
		label,
		kind: 'group',
		group: segments[0],
		depth: segments.length,
		status: 'group',
	});
	const parent = segments.slice(0, -1).join('/');
	ensureGroup(parent === path ? '' : parent);
	addEdge(parent, path, 'tree');
}

// Pass 1 — nodes.
const files = walk(DOCS).sort();
const bodies = new Map<string, string>();

for (const file of files) {
	const rel = file.slice(DOCS.length + 1);
	const route = rel.replace(/\.mdx?$/, '').replace(/\/index$/, '');
	if (route === 'index' || EXCLUDE.has(route)) continue;

	const raw = readFileSync(file, 'utf8');
	const fm = frontmatter(raw);
	bodies.set(route, raw);

	const segments = route.split('/');
	const parent = segments.slice(0, -1).join('/');
	ensureGroup(parent);

	nodes.set(route, {
		id: route,
		label: fm.title || map.routes[route]?.title || titleCase(segments.at(-1)!),
		kind: 'page',
		group: segments[0],
		depth: segments.length,
		status: map.routes[route]?.status ?? 'unmapped',
	});
	addEdge(parent, route, 'tree');
}

// Pass 2 — authored links. Done after every node exists so a link to a page
// that appears later in the walk still resolves.
const LINK_RE = /\]\((\/[^)\s]*)\)/g;
for (const [route, raw] of bodies) {
	for (const m of raw.matchAll(LINK_RE)) {
		const target = normalizeLink(m[1]);
		if (target !== null && nodes.has(target)) addEdge(route, target, 'link');
	}
}

const graph = {
	$comment:
		'Generated by scripts/gen-graph.ts — do not edit. Regenerate with `bun scripts/gen-graph.ts`.',
	generated: new Date().toISOString(),
	nodes: [...nodes.values()],
	edges,
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(graph), 'utf8');

const linkEdges = edges.filter((e) => e.kind === 'link').length;
console.log(
	`graph.json: ${graph.nodes.length} nodes ` +
		`(${[...nodes.values()].filter((n) => n.kind === 'page').length} pages, ` +
		`${[...nodes.values()].filter((n) => n.kind === 'group').length} groups), ` +
		`${edges.length - linkEdges} tree edges, ${linkEdges} link edges`
);
