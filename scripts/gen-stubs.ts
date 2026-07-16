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
 * Usage: bun scripts/gen-stubs.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const map = JSON.parse(readFileSync(join(ROOT, 'scripts/migration-map.json'), 'utf8'));

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
