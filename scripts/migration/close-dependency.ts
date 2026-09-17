/**
 * Phase 5 of the verbatim migration: make the old-docs clone unnecessary.
 *
 *   bun scripts/migration/close-dependency.ts [--source <dir>] [--dry]
 *
 * After every sourced route is converted (check.ts --all exits 0), three things still read
 * the clone: the stale-image check in doc-lint.ts / migrate-gates.ts (sha1 of every old
 * image), the title/description fallback in gen-stubs.ts, and the map's `sourceRoot` path.
 * This script:
 *
 *   1. writes scripts/old-docs-image-hashes.json — sha1 → old path for every old image —
 *      which doc-lint and migrate-gates read instead of walking `sourceRoot`;
 *   2. verifies every sourced route in the map carries a `description` (convert.ts injected
 *      them), so gen-stubs.ts needs no fallback;
 *   3. rewrites the map's `sourceRoot` to the GitHub location of the clone at its commit,
 *      and adds `sourceCommit`, by string surgery — `sources` stay as provenance.
 *
 * The migration scripts themselves keep working from `--source <dir>` / $NS_OLD_DOCS_DIR.
 * Idempotent; --dry reports without writing.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	loadMap,
	MAP_PATH,
	OLD_DOCS_REPO,
	OLD_DOCS_SUBDIR,
	rel,
	resolveSourceDir,
	ROOT,
	sha1,
	walkImages,
} from './lib';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const { text: mapText, map } = loadMap();
const SRC = resolveSourceDir(args, map);

const head = spawnSync('git', ['-C', SRC, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
const commit = head.status === 0 ? head.stdout.trim() : map.sourceCommit;
if (!commit) {
	console.error(
		'Cannot determine the clone commit (not a git checkout) and the map has no sourceCommit.'
	);
	process.exit(1);
}

// 1. image hash manifest
const images = walkImages(SRC);
const hashes: Record<string, string> = {};
for (const abs of images) hashes[sha1(abs)] = rel(abs, SRC);
const manifest = {
	$comment:
		'sha1 of every image in the old MkDocs docs, so doc-lint.ts and migrate-gates.ts can flag a ' +
		'carried-over screenshot (byte-identical => shows the old UI) without the clone on disk. ' +
		'Regenerate with `bun scripts/migration/close-dependency.ts --source <clone>/' +
		OLD_DOCS_SUBDIR +
		'`.',
	repo: OLD_DOCS_REPO,
	commit,
	subdir: OLD_DOCS_SUBDIR,
	images: images.length,
	hashes: Object.fromEntries(Object.entries(hashes).sort()),
};
const manifestPath = join(ROOT, 'scripts/old-docs-image-hashes.json');
const manifestText = JSON.stringify(manifest, null, 2) + '\n';

// 2. descriptions
const missing = Object.entries(map.routes)
	.filter(([, r]) => r.sources.length && !r.description)
	.map(([route]) => route);

// 3. sourceRoot surgery
const newRoot = `${OLD_DOCS_REPO}/tree/${commit}/${OLD_DOCS_SUBDIR}`;
let out = mapText.replace(/"sourceRoot": "[^"]*"/, `"sourceRoot": ${JSON.stringify(newRoot)}`);
if (!/"sourceCommit":/.test(out)) {
	out = out.replace(
		/("sourceRoot": "[^"]*",\n)/,
		`$1  "sourceCommit": ${JSON.stringify(commit)},\n`
	);
} else {
	out = out.replace(/"sourceCommit": "[^"]*"/, `"sourceCommit": ${JSON.stringify(commit)}`);
}

console.log(`old docs        ${SRC} @ ${commit.slice(0, 7)}`);
console.log(`image manifest  ${images.length} images → scripts/old-docs-image-hashes.json`);
console.log(
	`descriptions    ${missing.length ? `MISSING on ${missing.length} sourced route(s): ${missing.join(', ')}` : 'every sourced route has one'}`
);
console.log(`sourceRoot      → ${newRoot}`);
if (missing.length) {
	console.log('\nRun convert.ts --all first; it injects the descriptions.');
	process.exit(1);
}
if (dry) {
	console.log('\n[dry run] nothing written.');
	process.exit(0);
}
let existing = '';
try {
	existing = readFileSync(manifestPath, 'utf8');
} catch {}
if (existing !== manifestText) writeFileSync(manifestPath, manifestText);
if (out !== mapText) writeFileSync(MAP_PATH, out);
console.log(
	'\nWritten. Now `bun run stubs && bun run verify` and `bun scripts/doc-lint.ts --all --screenshots` must work with the clone moved away.'
);
