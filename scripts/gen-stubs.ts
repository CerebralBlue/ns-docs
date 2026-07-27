/**
 * Generate skeleton stub pages from scripts/migration-map.json.
 *
 * For every route with status "stub", writes src/content/docs/<route>.md
 * containing frontmatter (title + description) and a short placeholder body.
 * Descriptions fall back to the primary old-doc source's frontmatter
 * description when the map doesn't override one.
 *
 * Safe to re-run: existing files whose map status is no longer "stub"
 * (auto/adopted) are never touched; stub files are re-written each run.
 *
 * Usage: bun run stubs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not `.pathname` — the latter leaves percent-encoding in place,
// so any directory with a space in it yields a path that does not exist.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MAP_PATH = join(ROOT, 'scripts/migration-map.json');

let map: { sourceRoot: string; routes: Record<string, any> };
try {
	map = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
} catch (err) {
	console.error(`Could not read the migration map at ${MAP_PATH}\n  ${String(err)}`);
	process.exit(1);
}
if (!map.routes || typeof map.routes !== 'object') {
	console.error(`${MAP_PATH} has no "routes" object — nothing to generate.`);
	process.exit(1);
}

function sourceFrontmatter(relPath: string): { title?: string; description?: string } {
	try {
		const raw = readFileSync(join(map.sourceRoot, relPath), 'utf8');
		const m = raw.match(/^---\n([\s\S]*?)\n---/);
		if (!m) return {};
		const fm: Record<string, string> = {};
		for (const line of m[1].split('\n')) {
			const kv = line.match(/^(title|description):\s*(.*)$/);
			if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
		}
		return fm;
	} catch {
		return {};
	}
}

const actionNote: Record<string, string> = {
	keep: 'Content will be converted from the existing documentation.',
	rewrite: 'Content will be rewritten from the existing documentation with a capability focus.',
	merge: 'Content will be merged from multiple existing pages.',
	distill: 'Content will be distilled from the existing documentation (developer/admin scope only).',
	new: 'This page is brand new for the restructured docs.',
};

let written = 0;
let skipped = 0;

for (const [route, info] of Object.entries<any>(map.routes)) {
	const outPath = join(ROOT, 'src/content/docs', `${route}.md`);
	if (info.status !== 'stub') {
		skipped++;
		continue;
	}
	const src = info.sources?.[0] ? sourceFrontmatter(info.sources[0]) : {};
	const title = info.title ?? src.title ?? route.split('/').pop();
	const description = info.description ?? src.description ?? `${title} — NeuralSeek documentation.`;
	const sourcesLine = info.sources?.length
		? `\nSource${info.sources.length > 1 ? 's' : ''}: ${info.sources.map((s: string) => `\`${s}\``).join(', ')} (${info.action}).`
		: '';

	const body = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
---

:::note[Draft]
This page is part of the new documentation structure and its content is being prepared.
:::

${actionNote[info.action] ?? ''}${sourcesLine}
`;
	mkdirSync(dirname(outPath), { recursive: true });
	writeFileSync(outPath, body);
	written++;
}

console.log(`stubs written: ${written}, skipped (non-stub): ${skipped}`);
