/**
 * Canvas renderer + force simulation for the site graph.
 *
 * Canvas rather than SVG: the fullscreen view draws 185 nodes and ~240 edges
 * every frame while the simulation settles, and that many live DOM nodes makes
 * the layout thrash on a mid-range laptop.
 *
 * COLOURS ARE NOT DEFINED HERE. Every colour is read from a CSS custom property
 * on the canvas element, so the palette lives in 19-component-graph.css with the
 * rest of the design system and follows the theme for free. The values are
 * cached and re-read when `data-theme` changes.
 */
import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	forceX,
	forceY,
	type Simulation,
} from 'd3-force';
import type { SimEdge, SimNode, SiteGraphData } from './types';

export interface GraphViewOptions {
	/** Node id of the page being viewed; drawn highlighted. */
	current: string;
	/** Pan, zoom and node dragging. The sidebar panel turns this off. */
	interactive: boolean;
	/** Keep the whole graph framed as it moves. On for the panel, off once the user pans. */
	autoFit: boolean;
	onNavigate(id: string): void;
}

export interface GraphView {
	destroy(): void;
	/** Dim everything whose label does not match. Empty string clears the filter. */
	filter(query: string): void;
}

interface Palette {
	edge: string;
	edgeLink: string;
	node: string;
	group: string;
	root: string;
	current: string;
	label: string;
	surface: string;
	stub: string;
	auto: string;
	adopted: string;
	unmapped: string;
}

const PROPS: Record<keyof Palette, string> = {
	edge: '--ns-graph-edge',
	edgeLink: '--ns-graph-edge-link',
	node: '--ns-graph-node',
	group: '--ns-graph-group',
	root: '--ns-graph-root',
	current: '--ns-graph-current',
	label: '--ns-graph-label',
	surface: '--ns-graph-surface',
	stub: '--ns-graph-stub',
	auto: '--ns-graph-auto',
	adopted: '--ns-graph-adopted',
	unmapped: '--ns-graph-unmapped',
};

function readPalette(el: HTMLElement): Palette {
	const cs = getComputedStyle(el);
	const out = {} as Palette;
	for (const [key, prop] of Object.entries(PROPS)) {
		out[key as keyof Palette] = cs.getPropertyValue(prop).trim() || '#888';
	}
	return out;
}

function radiusOf(node: SimNode, current: string): number {
	if (node.id === current) return 7;
	if (node.kind === 'root') return 6.5;
	if (node.kind === 'group') return 5;
	return 3.5;
}

export function createGraphView(
	canvas: HTMLCanvasElement,
	data: SiteGraphData,
	opts: GraphViewOptions
): GraphView {
	const maybeCtx = canvas.getContext('2d');
	if (!maybeCtx) return { destroy() {}, filter() {} };
	// Bound to its own non-nullable const: TypeScript drops the narrowing from
	// the guard above once `ctx` is captured by draw(), fit() and the pointer
	// handlers below, so every use would otherwise be `possibly null`.
	const ctx: CanvasRenderingContext2D = maybeCtx;

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// d3-force mutates what it is given, so hand it copies. Sharing the loaded
	// graph between the panel and the overlay would otherwise let one view's
	// simulation drag the other's node positions around.
	const nodes: SimNode[] = data.nodes.map((n) => ({ ...n }));
	const edges: SimEdge[] = data.edges.map((e) => ({ ...e }));

	let palette = readPalette(canvas);
	let width = 1;
	let height = 1;
	let transform = { k: 1, x: 0, y: 0 };
	let hovered: SimNode | null = null;
	let dragging: SimNode | null = null;
	let panning = false;
	let autoFit = opts.autoFit;
	let query = '';
	let frame = 0;

	const toGraph = (sx: number, sy: number) => ({
		x: (sx - transform.x) / transform.k,
		y: (sy - transform.y) / transform.k,
	});

	const simulation: Simulation<SimNode, SimEdge> = forceSimulation(nodes)
		.force(
			'link',
			forceLink<SimNode, SimEdge>(edges)
				.id((d) => d.id)
				// Tree edges hold the IA together tightly; cross-links are longer
				// and weaker so they bend the layout without distorting the shape.
				.distance((e) => (e.kind === 'tree' ? 26 : 55))
				.strength((e) => (e.kind === 'tree' ? 0.9 : 0.15))
		)
		.force('charge', forceManyBody<SimNode>().strength(-90).distanceMax(400))
		.force(
			'collide',
			forceCollide<SimNode>((d) => radiusOf(d, opts.current) + 3)
		)
		.force('center', forceCenter(0, 0))
		.force('x', forceX(0).strength(0.02))
		.force('y', forceY(0).strength(0.02));

	/** Frame the whole graph with a margin. */
	function fit() {
		if (nodes.length === 0) return;
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const n of nodes) {
			minX = Math.min(minX, n.x ?? 0);
			maxX = Math.max(maxX, n.x ?? 0);
			minY = Math.min(minY, n.y ?? 0);
			maxY = Math.max(maxY, n.y ?? 0);
		}
		const pad = 24;
		const spanX = Math.max(maxX - minX, 1);
		const spanY = Math.max(maxY - minY, 1);
		const k = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY, 2.5);
		transform = {
			k,
			x: width / 2 - ((minX + maxX) / 2) * k,
			y: height / 2 - ((minY + maxY) / 2) * k,
		};
	}

	function colorFor(node: SimNode): string {
		if (node.id === opts.current) return palette.current;
		if (node.kind === 'root') return palette.root;
		if (node.kind === 'group') return palette.group;
		switch (node.status) {
			case 'adopted':
				return palette.adopted;
			case 'auto':
				return palette.auto;
			case 'stub':
				return palette.stub;
			default:
				return palette.unmapped;
		}
	}

	/** A node is dimmed when a search is active and its label does not match. */
	function dimmed(node: SimNode): boolean {
		return query !== '' && !node.label.toLowerCase().includes(query);
	}

	function draw() {
		ctx.save();
		ctx.clearRect(0, 0, width, height);
		ctx.translate(transform.x, transform.y);
		ctx.scale(transform.k, transform.k);

		for (const e of edges) {
			const s = e.source as SimNode;
			const t = e.target as SimNode;
			if (typeof s !== 'object' || typeof t !== 'object') continue;
			const faded = dimmed(s) && dimmed(t);
			ctx.globalAlpha = faded ? 0.12 : e.kind === 'tree' ? 0.65 : 0.9;
			ctx.strokeStyle = e.kind === 'tree' ? palette.edge : palette.edgeLink;
			ctx.lineWidth = (e.kind === 'tree' ? 0.7 : 1) / transform.k;
			if (e.kind === 'link') ctx.setLineDash([3 / transform.k, 3 / transform.k]);
			ctx.beginPath();
			ctx.moveTo(s.x ?? 0, s.y ?? 0);
			ctx.lineTo(t.x ?? 0, t.y ?? 0);
			ctx.stroke();
			ctx.setLineDash([]);
		}

		for (const n of nodes) {
			const r = radiusOf(n, opts.current);
			ctx.globalAlpha = dimmed(n) ? 0.15 : 1;
			ctx.beginPath();
			ctx.arc(n.x ?? 0, n.y ?? 0, r, 0, Math.PI * 2);
			ctx.fillStyle = colorFor(n);
			ctx.fill();

			// The current page gets a ring so it stays findable once the layout
			// has moved; hover gets one too, as the pointer feedback.
			if (n.id === opts.current || n === hovered) {
				ctx.lineWidth = 1.5 / transform.k;
				ctx.strokeStyle = palette.current;
				ctx.globalAlpha = dimmed(n) ? 0.2 : 0.9;
				ctx.beginPath();
				ctx.arc(n.x ?? 0, n.y ?? 0, r + 3 / transform.k, 0, Math.PI * 2);
				ctx.stroke();
			}
		}

		// Labels last so nothing overdraws them. Only the ones worth reading:
		// the current page, whatever is hovered, and — once zoomed in — groups.
		ctx.globalAlpha = 1;
		ctx.fillStyle = palette.label;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		const fontPx = 11 / transform.k;
		// Canvas `font` takes no custom properties — it is parsed as a CSS font
		// shorthand with no cascade behind it, so the stack is spelled out.
		ctx.font = `${fontPx}px "Open Sans", system-ui, sans-serif`;
		for (const n of nodes) {
			const show =
				n === hovered ||
				n.id === opts.current ||
				(transform.k > 1.1 && n.kind !== 'page') ||
				(query !== '' && !dimmed(n));
			if (!show) continue;
			const r = radiusOf(n, opts.current);
			const text = n.label;
			const w = ctx.measureText(text).width;
			// Plate behind the text — labels cross edges constantly otherwise.
			ctx.globalAlpha = 0.85;
			ctx.fillStyle = palette.surface;
			ctx.fillRect(
				(n.x ?? 0) - w / 2 - 2 / transform.k,
				(n.y ?? 0) + r + 2 / transform.k,
				w + 4 / transform.k,
				fontPx + 2 / transform.k
			);
			ctx.globalAlpha = 1;
			ctx.fillStyle = palette.label;
			ctx.fillText(text, n.x ?? 0, (n.y ?? 0) + r + 3 / transform.k);
		}

		ctx.restore();
	}

	function tick() {
		if (autoFit) fit();
		draw();
	}

	simulation.on('tick', tick);

	if (reduceMotion) {
		// No animation: settle the layout in one synchronous burst, then draw the
		// final arrangement once.
		simulation.stop();
		for (let i = 0; i < 300; i++) simulation.tick();
		tick();
	}

	// ---- sizing -------------------------------------------------------------

	function resize() {
		const rect = canvas.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;
		const dpr = window.devicePixelRatio || 1;
		width = rect.width;
		height = rect.height;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		if (autoFit) fit();
		draw();
	}

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);
	resize();

	// ---- theme --------------------------------------------------------------

	const themeObserver = new MutationObserver(() => {
		palette = readPalette(canvas);
		draw();
	});
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme'],
	});

	// ---- interaction --------------------------------------------------------

	function nodeAt(sx: number, sy: number): SimNode | null {
		const p = toGraph(sx, sy);
		let best: SimNode | null = null;
		let bestDist = Infinity;
		for (const n of nodes) {
			const dx = (n.x ?? 0) - p.x;
			const dy = (n.y ?? 0) - p.y;
			const dist = Math.hypot(dx, dy);
			// Generous target: the hit radius never drops below 8 screen px, so
			// 3.5px page dots stay clickable when zoomed out.
			const hit = Math.max(radiusOf(n, opts.current), 8 / transform.k);
			if (dist < hit && dist < bestDist) {
				best = n;
				bestDist = dist;
			}
		}
		return best;
	}

	let pointerStart = { x: 0, y: 0, t: 0 };
	let moved = false;

	function localPoint(e: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function onPointerDown(e: PointerEvent) {
		const p = localPoint(e);
		pointerStart = { x: p.x, y: p.y, t: performance.now() };
		moved = false;
		const hit = nodeAt(p.x, p.y);
		if (hit && opts.interactive) {
			dragging = hit;
			const g = toGraph(p.x, p.y);
			hit.fx = g.x;
			hit.fy = g.y;
			simulation.alphaTarget(0.2).restart();
		} else if (opts.interactive) {
			panning = true;
			autoFit = false;
		}
		canvas.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		const p = localPoint(e);
		if (Math.hypot(p.x - pointerStart.x, p.y - pointerStart.y) > 4) moved = true;

		if (dragging) {
			const g = toGraph(p.x, p.y);
			dragging.fx = g.x;
			dragging.fy = g.y;
			return;
		}
		if (panning) {
			transform.x += e.movementX;
			transform.y += e.movementY;
			draw();
			return;
		}
		const hit = nodeAt(p.x, p.y);
		if (hit !== hovered) {
			hovered = hit;
			canvas.style.cursor = hit ? 'pointer' : opts.interactive ? 'grab' : 'default';
			if (frame) cancelAnimationFrame(frame);
			frame = requestAnimationFrame(draw);
		}
	}

	function onPointerUp(e: PointerEvent) {
		const p = localPoint(e);
		const quick = performance.now() - pointerStart.t < 500;

		if (dragging) {
			dragging.fx = null;
			dragging.fy = null;
			dragging = null;
			simulation.alphaTarget(0);
		}
		panning = false;
		canvas.releasePointerCapture(e.pointerId);

		// A click is a press that neither travelled nor lingered — so a drag that
		// ends on top of a node does not navigate away from the page.
		if (!moved && quick) {
			const hit = nodeAt(p.x, p.y);
			if (hit) opts.onNavigate(hit.id);
		}
	}

	function onWheel(e: WheelEvent) {
		if (!opts.interactive) return;
		e.preventDefault();
		autoFit = false;
		const rect = canvas.getBoundingClientRect();
		const px = e.clientX - rect.left;
		const py = e.clientY - rect.top;
		const before = toGraph(px, py);
		const k = Math.min(Math.max(transform.k * (e.deltaY < 0 ? 1.12 : 0.89), 0.15), 6);
		transform.k = k;
		// Keep the point under the cursor pinned while the scale changes.
		transform.x = px - before.x * k;
		transform.y = py - before.y * k;
		draw();
	}

	canvas.addEventListener('pointerdown', onPointerDown);
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerup', onPointerUp);
	canvas.addEventListener('pointercancel', onPointerUp);
	canvas.addEventListener('wheel', onWheel, { passive: false });

	return {
		destroy() {
			simulation.stop();
			resizeObserver.disconnect();
			themeObserver.disconnect();
			if (frame) cancelAnimationFrame(frame);
			canvas.removeEventListener('pointerdown', onPointerDown);
			canvas.removeEventListener('pointermove', onPointerMove);
			canvas.removeEventListener('pointerup', onPointerUp);
			canvas.removeEventListener('pointercancel', onPointerUp);
			canvas.removeEventListener('wheel', onWheel);
		},
		filter(next: string) {
			query = next.trim().toLowerCase();
			draw();
		},
	};
}
