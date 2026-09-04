/**
 * Shapes shared by the graph generator, the loader and the renderer.
 *
 * The source of truth for these is scripts/gen-graph.ts, which writes
 * public/graph.json. Keep the two in step — nothing type-checks across that
 * boundary, because the file is fetched at runtime rather than imported.
 */
import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

/** Why a node exists: the landing page, an IA group, or a real doc page. */
export type NodeKind = 'root' | 'group' | 'page';

/**
 * How an edge was derived.
 *
 * `tree` is the IA backbone (parent -> child from the route path); `link` is an
 * author's markdown cross-reference. They are drawn differently — see
 * 19-component-graph.css.
 */
export type EdgeKind = 'tree' | 'link';

export interface GraphNode {
	/** Route without the deployment prefix, e.g. `seek/curation`. Root is `''`. */
	id: string;
	label: string;
	kind: NodeKind;
	/** First path segment — the top-level section this belongs to. */
	group: string;
	depth: number;
	/** migration-map status: stub | auto | adopted | unmapped | group. */
	status: string;
}

export interface GraphEdge {
	source: string;
	target: string;
	kind: EdgeKind;
}

export interface SiteGraphData {
	nodes: GraphNode[];
	edges: GraphEdge[];
}

/** A node once d3-force has attached position and velocity to it. */
export interface SimNode extends GraphNode, SimulationNodeDatum {}

/**
 * An edge after d3-force's `forceLink` has resolved the string ids into node
 * objects in place. Before the simulation runs, `source`/`target` are still
 * strings — which is why the renderer never reads them until after setup.
 */
export interface SimEdge extends SimulationLinkDatum<SimNode> {
	kind: EdgeKind;
}
