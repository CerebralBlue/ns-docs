/**
 * Fetching and slicing the site graph.
 *
 * Kept apart from the renderer so the "which nodes belong on screen" decision
 * is readable and testable without a canvas — the same split as src/lib/ns-chat.
 */
import type { GraphEdge, SiteGraphData } from './types';

/**
 * One in-flight fetch shared by every caller.
 *
 * The sidebar panel and the fullscreen overlay both want the graph, and on a
 * fast expand they ask within the same tick. Caching the PROMISE rather than
 * the result means the second caller waits on the first request instead of
 * firing a duplicate.
 */
let pending: Promise<SiteGraphData> | null = null;

export function loadGraph(url: string): Promise<SiteGraphData> {
	if (!pending) {
		pending = fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`graph.json: HTTP ${res.status}`);
				return res.json() as Promise<SiteGraphData>;
			})
			.catch((err) => {
				// Clear the cache so a later expand can retry rather than
				// re-throwing a stale failure for the life of the page.
				pending = null;
				throw err;
			});
	}
	return pending;
}

/** Undirected adjacency, built once per slice. */
function adjacency(edges: GraphEdge[]): Map<string, Set<string>> {
	const adj = new Map<string, Set<string>>();
	const add = (a: string, b: string) => {
		let set = adj.get(a);
		if (!set) adj.set(a, (set = new Set()));
		set.add(b);
	};
	for (const e of edges) {
		add(e.source, e.target);
		add(e.target, e.source);
	}
	return adj;
}

/**
 * The subgraph within `depth` hops of `rootId`, edges included.
 *
 * Used by the sidebar panel: 185 nodes in a 200px-tall box is a smudge, so the
 * panel shows local context — the page, its parent, its siblings and whatever
 * it links to — while the fullscreen view gets the whole thing.
 *
 * Falls back to the complete graph when `rootId` is not a node, which is what
 * happens on a route that has no entry (a 404, or a page excluded from the
 * generator).
 */
export function neighborhood(data: SiteGraphData, rootId: string, depth: number): SiteGraphData {
	if (!data.nodes.some((n) => n.id === rootId)) return data;

	const adj = adjacency(data.edges);
	const keep = new Set<string>([rootId]);
	let frontier = [rootId];

	for (let hop = 0; hop < depth; hop++) {
		const next: string[] = [];
		for (const id of frontier) {
			for (const neighbour of adj.get(id) ?? []) {
				if (!keep.has(neighbour)) {
					keep.add(neighbour);
					next.push(neighbour);
				}
			}
		}
		if (next.length === 0) break;
		frontier = next;
	}

	return {
		nodes: data.nodes.filter((n) => keep.has(n.id)),
		edges: data.edges.filter((e) => keep.has(e.source) && keep.has(e.target)),
	};
}

/**
 * Route id -> href, honouring the deployment prefix.
 *
 * Node ids are authored-form routes (`seek/curation`, `''` for the landing
 * page) exactly as gen-graph.ts writes them, so the prefix is added here the
 * same way remark-base-path adds it to markdown links at build time.
 */
export function hrefFor(id: string, base: string): string {
	const prefix = base.endsWith('/') ? base : `${base}/`;
	return id === '' ? prefix : `${prefix}${id}/`;
}
