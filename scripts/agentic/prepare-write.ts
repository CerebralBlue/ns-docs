/**
 * Run right before a writer starts on a route (and never by the writer itself).
 *
 *   bun scripts/agentic/prepare-write.ts <run-id> <route> [--json]
 *
 *   1. before.md — the page as it is now, saved once under runs/<id>/<route>/. If before.md
 *      already exists and write.json does not, a previous writer died mid-edit: the page is
 *      RESTORED from before.md so the rerun starts from a known state (the resume rule).
 *   2. status → "auto" in scripts/migration-map.json, by string surgery on the route's block.
 *      `bun run stubs` never touches an `auto` page, and `adopted` is a human's mark, so
 *      the pipeline sets exactly this and nothing else.
 *   3. If the page does not exist yet (a route the IA stage added) a minimal page is created
 *      from the map's title/description so the writer has a file to edit.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { DOCS_DIR, loadMap, MAP_PATH, parseArgs, patchRouteBlock, ROOT, routeDir } from './lib';

const args = parseArgs(process.argv.slice(2));
const [runId, route] = args.positional;
if (!runId || !route) {
	console.error('Usage: bun scripts/agentic/prepare-write.ts <run-id> <route> [--json]');
	process.exit(1);
}
const { text, map } = loadMap();
const info = map.routes[route];
if (!info) {
	console.error(`${route} is not in scripts/migration-map.json — the IA stage must add it first`);
	process.exit(1);
}
const dir = routeDir(runId, route);
mkdirSync(dir, { recursive: true });
const page = join(DOCS_DIR, `${route}.md`);
const before = join(dir, 'before.md');
const writeJsonPath = join(dir, 'write.json');
const result: Record<string, unknown> = { route, page: relative(ROOT, page) };

if (!existsSync(page)) {
	mkdirSync(dirname(page), { recursive: true });
	writeFileSync(
		page,
		`---\ntitle: ${JSON.stringify(info.title)}\ndescription: ${JSON.stringify(info.description ?? `${info.title} — NeuralSeek documentation.`)}\n---\n\n## What is it\n`
	);
	result.created = true;
}
if (existsSync(before) && !existsSync(writeJsonPath)) {
	copyFileSync(before, page);
	result.restored = true;
} else if (!existsSync(before)) {
	copyFileSync(page, before);
	result.savedBefore = true;
}
if (info.status !== 'auto') {
	const patched = patchRouteBlock(text, route, (b) =>
		b.replace(/"status": "(stub|adopted|auto)"/, '"status": "auto"')
	);
	if (patched !== text) writeFileSync(MAP_PATH, patched);
	result.status = { from: info.status, to: 'auto' };
}
if (args.flags.has('json')) console.log(JSON.stringify(result));
else
	console.log(
		`${route}: ${[result.created && 'page created', result.restored && 'restored from before.md', result.savedBefore && 'before.md saved', result.status && `status ${info.status} → auto`].filter(Boolean).join(' · ') || 'nothing to do'}`
	);
