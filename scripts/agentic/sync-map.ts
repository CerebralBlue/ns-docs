/**
 * Keep the map's `description` in step with the page the pipeline just wrote (agentic v3.1).
 *
 *   bun scripts/agentic/sync-map.ts <run-id> <route> [--json]
 *
 * Run by the workflow after a route's gates PASS. Copies the page's frontmatter `description`
 * into the route's block in scripts/migration-map.json by string surgery (`patchRouteBlock`),
 * so the map — which the stub generator, the sidebar and the IA step read — stops carrying the
 * old marketing line once the page is rewritten. Because it only runs after the gates PASS, it
 * also sets `status: written` (from stub/draft) — the pipeline's "gated" mark. `adopted` is a
 * human's mark and is never touched. No change when both already match.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DOCS_DIR, loadMap, MAP_PATH, parseArgs, patchRouteBlock } from './lib';

const args = parseArgs(process.argv.slice(2));
const [runId, route] = args.positional;
if (!runId || !route) {
	console.error('Usage: bun scripts/agentic/sync-map.ts <run-id> <route> [--json]');
	process.exit(1);
}
const { text, map } = loadMap();
const info = map.routes[route];
const page = join(DOCS_DIR, `${route}.md`);
const raw = readFileSync(page, 'utf8');
const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
const m = fm.match(/^description:\s*(.+)$/m);
let description = m ? m[1].trim() : '';
if (/^["'].*["']$/.test(description))
	description = JSON.parse(
		description.startsWith("'") ? `"${description.slice(1, -1).replace(/"/g, '\\"')}"` : description
	);
const result = { runId, route, changed: false, description, status: info?.status as string };
if (!info) {
	console.error(`${route} is not in the map`);
	process.exit(1);
}
let text2 = text;
if (info.status === 'stub' || info.status === 'draft') {
	text2 = patchRouteBlock(text, route, (b) =>
		b.replace(/"status": "(stub|draft)"/, '"status": "written"')
	);
	result.status = 'written';
}
if (description && description !== (info.description ?? '')) {
	text2 = patchRouteBlock(text2, route, (block) =>
		/"description":\s*"(?:[^"\\]|\\.)*"/.test(block)
			? block.replace(
					/"description":\s*"(?:[^"\\]|\\.)*"/,
					`"description": ${JSON.stringify(description)}`
				)
			: block.replace(
					/\n(\s*)"status":/,
					`\n$1"description": ${JSON.stringify(description)},\n$1"status":`
				)
	);
}
if (text2 !== text) {
	JSON.parse(text2); // the map must still parse
	writeFileSync(MAP_PATH, text2);
	result.changed = true;
}
console.log(
	args.flags.has('json')
		? JSON.stringify(result)
		: `${route}: ${result.changed ? 'synced' : 'unchanged'} (status ${result.status})`
);
