/**
 * Run right before a writer starts on a route (and never by the writer itself).
 *
 *   bun scripts/agentic/prepare-write.ts <run-id> <route> [--json]
 *
 *   1. before.md — the page as it is now, saved once under runs/<id>/<route>/. If before.md
 *      already exists and write.json does not, a previous writer died mid-edit: the page is
 *      RESTORED from before.md so the rerun starts from a known state (the resume rule).
 *   2. status stub → "draft" in scripts/migration-map.json, by string surgery on the route's
 *      block, so `bun run stubs` can never reclaim the page mid-write. `draft`/`written` stay as
 *      they are (sync-map.ts sets `written` once the gates pass). **An `adopted` page is a
 *      human's sign-off: it is refused (exit 1, the writer never starts) unless
 *      `--allow-adopted` is passed — then it becomes `written` and keeps reviewedAt/reviewedRun,
 *      so doc-lint and the report flag it as changed since review.
 *   3. If the page does not exist yet (a route the IA stage added) a page is created from the
 *      map's title/description with its type's contract skeleton (contract.ts), so the writer
 *      starts from the right headings.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { isPageType, skeleton } from './contract';
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
if (info.status === 'adopted' && !args.flags.has('allow-adopted')) {
	const msg = `${route} is adopted (reviewed ${info.reviewedAt ?? '?'}) — refusing to rewrite a human-checked page; pass --allow-adopted to override`;
	if (args.flags.has('json')) console.log(JSON.stringify({ route, refused: msg }));
	else console.error(msg);
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
		`---\ntitle: ${JSON.stringify(info.title)}\ndescription: ${JSON.stringify(info.description ?? `${info.title} — NeuralSeek documentation.`)}\n---\n\n${skeleton(isPageType(info.type) ? info.type : 'concept')}`
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
const next = info.status === 'stub' ? 'draft' : info.status === 'adopted' ? 'written' : null;
if (next) {
	const patched = patchRouteBlock(text, route, (b) =>
		b.replace(/"status": "(stub|adopted)"/, `"status": "${next}"`)
	);
	if (patched !== text) writeFileSync(MAP_PATH, patched);
	result.status = { from: info.status, to: next };
}
if (args.flags.has('json')) console.log(JSON.stringify(result));
else
	console.log(
		`${route}: ${[result.created && 'page created', result.restored && 'restored from before.md', result.savedBefore && 'before.md saved', result.status && `status ${info.status} → ${next}`].filter(Boolean).join(' · ') || 'nothing to do'}`
	);
