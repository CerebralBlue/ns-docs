/**
 * Shared helpers for the docs-explore pipeline scripts (scripts/agentic/*.ts).
 *
 * Paths, the map file, the run ledger, and the parser for Playwright MCP accessibility
 * snapshots (`browser_snapshot` saved to a .yml). Everything here is deterministic; the
 * agents call these scripts and read their JSON — they never re-derive what a script owns.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const MAP_PATH = join(ROOT, 'scripts/migration-map.json');
export const DOCS_DIR = join(ROOT, 'src/content/docs');
export const V2_DIR = join(ROOT, '_private/agentic-v2');
export const RUNS_DIR = join(V2_DIR, 'runs');
export const COMPONENT_MAP_DIR = join(ROOT, '_private/component-map');
export const PW_OUTPUT_DIR = join(ROOT, '_private/tools/playwright/output');
export const CURRENT_RUN_FILE = join(V2_DIR, 'current-run');
export const INSTANCES_FILE = join(V2_DIR, 'instances.json');
export const RC_FILE = join(ROOT, '.neuralseekrc.json');

/**
 * The one instance the pipeline may touch (the playground) and the ids it must never touch.
 * Gitignored: `_private/agentic-v2/instances.json`. Both hooks read the same file.
 */
export type Instances = { host: string; playground: string; locked: string[]; agentPrefix: string };
export function loadInstances(): Instances {
	if (!existsSync(INSTANCES_FILE)) {
		console.error(`missing ${INSTANCES_FILE} — {host, playground, locked[], agentPrefix}`);
		process.exit(2);
	}
	return JSON.parse(readFileSync(INSTANCES_FILE, 'utf8'));
}
/** The instance id `.neuralseekrc.json` currently points the MCP at, or null. */
export function rcInstance(): string | null {
	if (!existsSync(RC_FILE)) return null;
	const m = String(JSON.parse(readFileSync(RC_FILE, 'utf8')).baseUrl ?? '').match(
		/\/([0-9a-f]{24})\/?$/
	);
	return m ? m[1] : null;
}
export const consoleUrl = (inst: Instances, page: string) =>
	`https://${inst.host}/${inst.playground}/${page.replace(/^\//, '')}`;

/** A control whose name matches commits an action — information for the explorer (never clicked by the walk). */
export const COMMIT_VERBS =
	/\b(save|run|submit|delete|remove|apply|update|test|send|generate|regenerate|upload|merge|train|enhance|import|export|reset|clear|confirm|ok|yes|create|add|edit|publish|deploy|start|stop|execute|sign out|log ?out)\b/i;

/** Same list as .claude/hooks/pw-policy.sh — the hook never lets these be clicked, on any instance. */
export const DESTRUCTIVE = /\b(delete|remove|purge|erase|reset|clear all|sign out|log ?out)\b/i;

export type Route = {
	title: string;
	sources: string[];
	action: string;
	status: 'stub' | 'auto' | 'adopted';
	description?: string;
	gaps?: string[];
	console?: string[];
	note?: string;
};
export type MigrationMap = {
	routes: Record<string, Route>;
	kill?: Record<string, string>;
	renamed?: Record<string, string>;
	[k: string]: unknown;
};

export function loadMap(): { text: string; map: MigrationMap } {
	const text = readFileSync(MAP_PATH, 'utf8');
	return { text, map: JSON.parse(text) };
}

/** One route's `"route": { … }` block, patched by string surgery — the map is hand-formatted. */
export function patchRouteBlock(mapText: string, route: string, fn: (b: string) => string): string {
	const key = `"${route}": {`;
	const start = mapText.indexOf(key);
	if (start === -1) return mapText;
	const end = mapText.indexOf('\n    }', start);
	if (end === -1) return mapText;
	return mapText.slice(0, start) + fn(mapText.slice(start, end)) + mapText.slice(end);
}

export const routeFolder = (route: string) => route.replace(/\//g, '-');
export const currentRun = () =>
	existsSync(CURRENT_RUN_FILE) ? readFileSync(CURRENT_RUN_FILE, 'utf8').trim() : '';
export const runDir = (runId: string) => join(RUNS_DIR, runId);
export const routeDir = (runId: string, route: string) => join(RUNS_DIR, runId, routeFolder(route));

export function readJson<T = any>(path: string): T | null {
	return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}
export function writeJson(path: string, data: unknown) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}
/**
 * Captures are first-class (v3.1): an explore run's states, images, map and BRIEFS are reused
 * by every later write run of the same area. `area.json.captureRun` names the capture a write
 * run reads from; an explore run is its own capture. `captures.json` indexes the latest
 * capture per area.
 */
export const CAPTURES_FILE = join(V2_DIR, 'captures.json');
export type Capture = {
	runId: string;
	capturedAt: string;
	states: number;
	images: number;
	mapHash?: string;
};
export const loadCaptures = (): Record<string, Capture> => readJson(CAPTURES_FILE) ?? {};
export function captureRunOf(runId: string): string {
	const area = readJson<any>(join(RUNS_DIR, runId, 'area.json'));
	return area?.captureRun ?? runId;
}
export const captureDir = (runId: string) => join(RUNS_DIR, captureRunOf(runId));
/** Where a route's brief lives: with the capture, so every write run of the area shares it. */
export const briefDir = (runId: string, route: string) =>
	join(captureDir(runId), 'briefs', routeFolder(route));
export const sha1 = (data: string | Buffer) => createHash('sha1').update(data).digest('hex');

/** Positional args, `--flag` booleans and `--key value` pairs (repeatable keys collect). */
export function parseArgs(argv: string[]) {
	const positional: string[] = [];
	const flags = new Set<string>();
	const values: Record<string, string[]> = {};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (!a.startsWith('--')) {
			positional.push(a);
			continue;
		}
		const key = a.slice(2);
		const next = argv[i + 1];
		if (next !== undefined && !next.startsWith('--')) {
			(values[key] ??= []).push(next);
			i++;
		} else flags.add(key);
	}
	return { positional, flags, values, get: (k: string) => values[k]?.[0] };
}

// ── Accessibility snapshot parser ─────────────────────────────────────────────

export type SnapNode = {
	role: string;
	name: string;
	ref: string;
	attrs: string[];
	depth: number;
	url?: string;
	text?: string;
	parent: SnapNode | null;
	children: SnapNode[];
	line: number;
};

/**
 * Parses the YAML-ish tree the Playwright MCP writes:
 *   - button "Save" [ref=e12] [cursor=pointer]
 *   - link "Seek" [ref=e21]:
 *     - /url: ./seek
 *   - paragraph [ref=e5]: 1 item selected
 * Indentation = nesting. `/url:` lines attach to their parent. Unknown lines are kept as
 * `text` on the nearest node so nothing is silently dropped.
 */
export function parseSnapshot(yaml: string): SnapNode[] {
	const roots: SnapNode[] = [];
	const stack: SnapNode[] = [];
	const lines = yaml.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const raw = lines[i];
		if (!raw.trim()) continue;
		const indent = raw.match(/^ */)![0].length;
		const body = raw.trim();
		while (stack.length && stack[stack.length - 1].depth >= indent) stack.pop();
		const parent = stack[stack.length - 1] ?? null;
		const url = body.match(/^-\s*\/url:\s*(.*)$/);
		if (url) {
			if (parent) parent.url = url[1].trim();
			continue;
		}
		const m = body.match(
			/^-\s*([a-z]+)(?:\s+"((?:[^"\\]|\\.)*)")?((?:\s*\[[^\]]*\])*)\s*:?\s*(.*)$/
		);
		if (!m) {
			if (parent) parent.text = ((parent.text ?? '') + ' ' + body.replace(/^-\s*/, '')).trim();
			continue;
		}
		const attrs = [...(m[3] ?? '').matchAll(/\[([^\]]*)\]/g)].map((a) => a[1]);
		const ref = attrs.find((a) => a.startsWith('ref='))?.slice(4) ?? '';
		const node: SnapNode = {
			role: m[1],
			name: (m[2] ?? '').replace(/\\"/g, '"'),
			ref,
			attrs: attrs.filter((a) => !a.startsWith('ref=')),
			depth: indent,
			text: m[4]?.trim() || undefined,
			parent,
			children: [],
			line: i + 1,
		};
		if (parent) parent.children.push(node);
		else roots.push(node);
		stack.push(node);
	}
	return roots;
}

export function walkSnapshot(nodes: SnapNode[], fn: (n: SnapNode) => void) {
	for (const n of nodes) {
		fn(n);
		walkSnapshot(n.children, fn);
	}
}

export const INTERACTIVE = new Set([
	'button',
	'link',
	'checkbox',
	'switch',
	'textbox',
	'searchbox',
	'combobox',
	'listbox',
	'option',
	'tab',
	'radio',
	'slider',
	'spinbutton',
	'menuitem',
	'menuitemcheckbox',
	'menuitemradio',
	'textarea',
]);
export const LANDMARKS = new Set([
	'banner',
	'navigation',
	'main',
	'region',
	'dialog',
	'alertdialog',
	'tabpanel',
	'table',
	'form',
	'complementary',
	'contentinfo',
	'menu',
	'toolbar',
	'list',
]);

/** Nearest ancestor that names a region: a landmark role, or a named container. */
export function regionOf(n: SnapNode): string {
	for (let p = n.parent; p; p = p.parent) {
		if (LANDMARKS.has(p.role)) return p.name ? `${p.role}:${p.name}` : p.role;
	}
	return 'page';
}

/** A control's accessible name, inherited from the nearest named ancestor when it has none (icon buttons wrapped in a tooltip). */
export function nameOf(n: SnapNode): string {
	if (n.name) return n.name;
	for (let p = n.parent; p; p = p.parent) {
		if (p.name && !LANDMARKS.has(p.role) && p.role !== 'row') return p.name;
		if (LANDMARKS.has(p.role)) break;
	}
	return '';
}
