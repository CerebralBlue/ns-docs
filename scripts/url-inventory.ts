/**
 * The allow-list of old-docs URLs the pipeline may harvest, and a reconciliation
 * against scripts/migration-map.json.
 *
 * Why this exists: the pipeline's harvest step fetches a URL and treats whatever
 * comes back as documentation. Hand it a wrong path and it processes a 404 page's
 * text as prose, confidently. A URL is only safe to harvest if the live site
 * actually publishes it, so this resolves that from the site's own sitemap rather
 * than from a hand-kept list that would drift.
 *
 * The old site is MkDocs, so sitemap.xml is authoritative — no crawling.
 *
 * Usage:
 *   bun scripts/url-inventory.ts                # reconciliation report
 *   bun scripts/url-inventory.ts seek/          # the URLs one module may harvest
 *   bun scripts/url-inventory.ts --json         # machine-readable, for the pipeline
 *
 * Exit 1 when a map source has no live page, or a published page is neither
 * claimed by a route nor on the kill list — either means the map has drifted from
 * the site and a migration would silently skip or invent a page.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASE = 'https://documentation.neuralseek.com/';
const SITEMAP = `${BASE}sitemap.xml`;

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const prefixes = args.filter((a) => !a.startsWith('--'));

type Route = { title?: string; sources?: string[]; action?: string; status?: string };
const map: { routes: Record<string, Route>; kill?: Record<string, string> } = JSON.parse(
	readFileSync(join(ROOT, 'scripts/migration-map.json'), 'utf8')
);

/** `ui/curate/index.md` -> `https://documentation.neuralseek.com/ui/curate/` */
function sourceToUrl(source: string): string {
	const path = source.replace(/\/?index\.md$/, '/').replace(/\.md$/, '/');
	return BASE + path.replace(/^\//, '');
}

const res = await fetch(SITEMAP);
if (!res.ok) {
	console.error(`Could not read ${SITEMAP} — HTTP ${res.status}`);
	process.exit(1);
}
const xml = await res.text();

/** url -> lastmod. lastmod is the only freshness signal the old site gives us. */
const live = new Map<string, string>();
for (const m of xml.matchAll(/<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>/gs)) {
	live.set(m[1].trim(), m[2].trim());
}

const claimed = new Set<string>();
const broken: { route: string; source: string; url: string }[] = [];
/** route -> the live URLs it is allowed to harvest, in `sources` order (first is primary). */
const allowed = new Map<string, string[]>();

for (const [route, info] of Object.entries(map.routes)) {
	for (const source of info.sources ?? []) {
		const url = sourceToUrl(source);
		if (live.has(url)) {
			claimed.add(url);
			allowed.set(route, [...(allowed.get(route) ?? []), url]);
		} else {
			broken.push({ route, source, url });
		}
	}
}

const killed = new Set(Object.keys(map.kill ?? {}).map(sourceToUrl));
const unclaimed = [...live.keys()].filter((u) => !claimed.has(u) && !killed.has(u));

// --- a module's allow-list -------------------------------------------------
if (prefixes.length) {
	const picked = [...allowed.entries()].filter(([route]) =>
		prefixes.some((p) => route === p || route.startsWith(p))
	);
	if (asJson) {
		console.log(JSON.stringify(Object.fromEntries(picked), null, 2));
	} else {
		for (const [route, urls] of picked) {
			console.log(`\n${route}  [${map.routes[route].action}]`);
			urls.forEach((u, i) =>
				console.log(`  ${i === 0 ? 'primary' : 'also   '}  ${u}   (updated ${live.get(u)})`)
			);
		}
		const noSource = Object.keys(map.routes).filter(
			(r) => prefixes.some((p) => r === p || r.startsWith(p)) && !allowed.has(r)
		);
		if (noSource.length) {
			console.log(`\nNothing to harvest — these routes must be written from the product:`);
			noSource.forEach((r) => console.log(`  ${r}`));
		}
	}
	process.exit(0);
}

// --- reconciliation --------------------------------------------------------
if (asJson) {
	console.log(
		JSON.stringify(
			{ published: live.size, claimed: claimed.size, killed: killed.size, broken, unclaimed },
			null,
			2
		)
	);
} else {
	console.log(`published pages   ${live.size}`);
	console.log(`claimed by routes ${claimed.size}`);
	console.log(`on the kill list  ${killed.size}`);

	if (broken.length) {
		console.log(`\nMap sources with no live page (${broken.length}) — the map has drifted:`);
		broken.forEach((b) => console.log(`  ${b.route}\n    ${b.source} -> ${b.url}`));
	}
	if (unclaimed.length) {
		console.log(`\nPublished but unaccounted for (${unclaimed.length}) — claim it or kill it:`);
		unclaimed.forEach((u) => console.log(`  ${u}   (updated ${live.get(u)})`));
	}
	if (!broken.length && !unclaimed.length) {
		console.log(`\nClean: every published page is either migrated or deliberately killed.`);
	}
}

process.exit(broken.length || unclaimed.length ? 1 : 0);
