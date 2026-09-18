/**
 * The console-area registry and the route → area seeding for /docs-explore (agentic v3).
 *
 *   bun scripts/agentic/areas.ts list [--json]              areas.json with the routes each owns
 *   bun scripts/agentic/areas.ts propose [--json]           routes with no `console` → proposals
 *   bun scripts/agentic/areas.ts apply [<proposals.json>]   write the proposals into the map
 *
 * `_private/agentic-v2/areas.json` names every console screen the explorer may open (url,
 * navPath, an optional `entry` input for screens that are empty until you type something, and
 * `alias` for names the map uses for the same screen). Routes are attached to areas through the
 * map's `console` field — this script proposes a value for the routes that have none, by section
 * default plus the hand exceptions in DEFAULTS, and writes the proposals into the map only on
 * `apply` (string surgery, the map is hand-formatted). Routes with no screen at all get
 * `console: []` and are written from the config export, MCP resources and the old prose, with an
 * "Unverified" banner — the `reference` kind.
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	loadMap,
	MAP_PATH,
	parseArgs,
	patchRouteBlock,
	readJson,
	ROOT,
	V2_DIR,
	writeJson,
} from './lib';

export const AREAS_FILE = join(V2_DIR, 'areas.json');
export type Area = {
	url: string | null;
	navPath: string[];
	kind: 'console' | 'reference';
	entry?: { type: 'seek' | 'type'; input: string; target?: string } | null;
	/** A top-nav menu the explorer opens first; its items become page-states of the area. */
	menu?: string;
	alias?: string;
	note?: string;
};
export type Areas = Record<string, Area>;

export function loadAreas(): Areas {
	if (!existsSync(AREAS_FILE)) writeJson(AREAS_FILE, DEFAULT_AREAS);
	return readJson<Areas>(AREAS_FILE)!;
}
/** The area a map `console` name resolves to (aliases collapse onto the screen they name). */
export const resolveArea = (areas: Areas, name: string): string =>
	areas[name]?.alias ? resolveArea(areas, areas[name].alias!) : name;

/**
 * Section defaults + hand exceptions. First match wins; `[]` = reference kind (no screen).
 * Order matters: specific prefixes before their parents.
 */
const DEFAULTS: [RegExp, string[]][] = [
	[/^getting-started\/quickstart-seek$/, ['home', 'seek']],
	[/^getting-started\/quickstart-maistro$/, ['home', 'maistro']],
	[/^getting-started\//, ['home']],
	[/^seek\//, ['seek']],
	[/^maistro\/(run-agents|inspector)$/, ['runagent', 'maistro']],
	[/^maistro\//, ['maistro']],
	[/^knowledge\/ingestion-overview$/, ['knowledge', 'data-loader']],
	[/^knowledge\/hybrid-vector-semantic-search$/, ['neural-config', 'knowledge']],
	[/^knowledge\//, ['knowledge']],
	[/^integrations\/chat-sdk$/, ['chat']],
	[/^integrations\//, ['admin-tools']],
	[/^configuration\/neural-config\//, ['neural-config']],
	[/^configuration\/administration\/(support-plans|self-hosting-an-llm)$/, []],
	[/^configuration\/administration\//, ['admin-tools']],
	[/^configuration\//, ['neural-config']],
	[/^governance\/guardrails\//, ['governance', 'neural-config']],
	[/^governance\/corporate-document-filter$/, ['neural-config', 'governance']],
	[/^governance\/analytics\//, ['governance']],
	[/^governance\//, ['governance']],
	[/^reference\//, []],
];

/** The registry as first written — every url below was seen in a captured component map or a run log; `null` = reach it by navPath. */
const DEFAULT_AREAS: Areas = {
	home: { url: '/home', navPath: ['NeuralSeek (logo)'], kind: 'console' },
	'neural-config': {
		url: '/configure',
		navPath: ['Neural Config'],
		kind: 'console',
		note: 'The routing tree. Edit Configuration (the accordions) opens from the Default Config node — the explorer reaches it as a state, so every accordion is one state of this area.',
	},
	'neural-config:advanced': {
		url: '/configure',
		navPath: ['Neural Config'],
		kind: 'console',
		alias: 'neural-config',
		note: 'v2 name for the expanded Edit Configuration accordions; same screen.',
	},
	knowledge: { url: '/knowledge', navPath: ['KnowledgeBase'], kind: 'console' },
	'data-loader': {
		url: '/loader',
		navPath: ['KnowledgeBase', 'Go to Document Loader'],
		kind: 'console',
	},
	seek: {
		url: '/seek',
		navPath: ['Seek'],
		kind: 'console',
		entry: { type: 'seek', input: 'What is NeuralSeek?' },
		note: 'The answer panel, Statistical Details and the feedback controls exist only after one question — `entry` is typed once, before the walk.',
	},
	curate: { url: '/curate', navPath: ['Admin Tools', 'Curate'], kind: 'console' },
	chat: { url: '/chat', navPath: ['Chat SDK', 'Chat'], kind: 'console' },
	governance: {
		url: '/go-overview',
		navPath: ['Governance'],
		kind: 'console',
		note: 'The dashboards (Seek / mAIstro insights, tokens & cost, model comparison, custom) are tabs or links on this screen — states, not areas.',
	},
	'admin-tools': {
		url: '/in-apikeys',
		navPath: ['Admin Tools', "API's & Integration"],
		kind: 'console',
		menu: 'Admin Tools',
		note: 'Admin Tools is a menu; every item (API keys, Users, Curate, Entity Extraction, integrations…) is a page-state of this area. Curate and Entity Extraction also have their own areas when a section needs only them.',
	},
	extract: { url: '/extract', navPath: ['Admin Tools', 'Entity Extraction'], kind: 'console' },
	maistro: { url: '/maistro', navPath: ['mAIstro'], kind: 'console' },
	runagent: { url: '/runagent', navPath: ['mAIstro', 'Run Agents'], kind: 'console' },
	reference: {
		url: null,
		navPath: [],
		kind: 'reference',
		note: 'No screen. Pages with console: [] are written from the config export, MCP resources and the old prose, and carry an Unverified banner.',
	},
};

// ── CLI ───────────────────────────────────────────────────────────────────────
if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const verb = args.positional[0];
	const asJson = args.flags.has('json');
	const isNtl = (r: string) => r.startsWith('maistro/ntl/');

	const areas = loadAreas();
	const { text, map } = loadMap();

	if (verb === 'list') {
		// A route is WRITTEN by its primary area (console[0]); the other areas it names are screens
		// its writer may also read. So every route is written exactly once per night.
		const owned: Record<string, string[]> = {};
		const touched: Record<string, string[]> = {};
		for (const [r, info] of Object.entries(map.routes)) {
			if (isNtl(r)) continue;
			const names = (info.console ?? []).map((x) => resolveArea(areas, x));
			(owned[names[0] ?? 'reference'] ??= []).push(r);
			for (const n of new Set(names.slice(1))) (touched[n] ??= []).push(r);
		}
		if (asJson)
			console.log(JSON.stringify({ file: relative(ROOT, AREAS_FILE), areas, owned, touched }));
		else
			for (const [name, a] of Object.entries(areas)) {
				if (a.alias) continue;
				console.log(
					`${name.padEnd(16)} ${(a.url ?? '(by navPath)').padEnd(14)} ${String(owned[name]?.length ?? 0).padStart(3)} owned  ${String(touched[name]?.length ?? 0).padStart(3)} also read  ${a.navPath.join(' > ')}`
				);
			}
		process.exit(0);
	}

	if (verb === 'propose' || verb === 'apply') {
		const file = args.positional[1] ?? join(V2_DIR, 'console-proposals.json');
		let proposals: Record<string, string[]>;
		if (verb === 'apply' && existsSync(file)) proposals = readJson(file)!;
		else {
			proposals = {};
			for (const [r, info] of Object.entries(map.routes)) {
				if (isNtl(r) || info.console) continue;
				const hit = DEFAULTS.find(([re]) => re.test(r));
				proposals[r] = hit ? hit[1] : [];
			}
			writeJson(file, proposals);
			const md = [
				'# Console-area proposals (agentic v3)',
				'',
				`Routes with no \`console\` field in the map, with the section default. Edit \`${relative(ROOT, file)}\` then \`bun scripts/agentic/areas.ts apply\`. \`[]\` = reference kind (no screen; Unverified banner).`,
				'',
				'| route | proposed | title |',
				'|---|---|---|',
				...Object.entries(proposals).map(
					([r, a]) =>
						`| ${r} | ${a.length ? a.join(', ') : '— (reference)'} | ${map.routes[r].title} |`
				),
				'',
			];
			writeFileSync(file.replace(/\.json$/, '.md'), md.join('\n'));
		}
		if (verb === 'propose') {
			if (asJson)
				console.log(
					JSON.stringify({
						file: relative(ROOT, file),
						count: Object.keys(proposals).length,
						proposals,
					})
				);
			else {
				console.log(
					`${Object.keys(proposals).length} route(s) without console → ${relative(ROOT, file)} (+ .md)`
				);
				for (const [r, a] of Object.entries(proposals))
					console.log(`  ${r.padEnd(52)} ${a.length ? a.join(', ') : '— (reference)'}`);
			}
			process.exit(0);
		}
		let out = text;
		let applied = 0;
		for (const [r, names] of Object.entries(proposals)) {
			if (!map.routes[r] || map.routes[r].console) continue;
			for (const n of names)
				if (!areas[n]) {
					console.error(`${r}: unknown area '${n}' (not in ${relative(ROOT, AREAS_FILE)})`);
					process.exit(1);
				}
			const next = patchRouteBlock(out, r, (block) => {
				const m = block.match(/\n(\s*)"status":/);
				const indent = m ? m[1] : '      ';
				const line = `\n${indent}"console": [${names.map((n) => `"${n}"`).join(', ')}],`;
				return block.replace(/\n(\s*)"status":/, `${line}\n$1"status":`);
			});
			if (next !== out) applied++;
			out = next;
		}
		writeFileSync(MAP_PATH, out);
		JSON.parse(out); // the map must still parse, or the surgery was wrong
		console.log(asJson ? JSON.stringify({ applied }) : `console written for ${applied} route(s)`);
		process.exit(0);
	}
	console.error('Usage: areas.ts list | propose | apply [<proposals.json>]');
	process.exit(1);
}
