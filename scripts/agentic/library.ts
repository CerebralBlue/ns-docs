/**
 * The capture library (2026-09-30): every screenshot the explorer ever took, filed by screen and
 * section with a generated README, so a page section is fixed from what we already have instead
 * of re-shooting it. Private by design — captures show live instance ids and URLs.
 *
 *   _private/capture-library/<area>/<state>/
 *       README.md                what the screen is, how to reach it, the labels on it, the run
 *       viewport.png · panel.png the state's images (panel = the state's own container)
 *       sections/<id>/           image.png + README.md (the section's label and visible names)
 *       options/<id>/            image.png + README.md (the dropdown and every option value)
 *   _private/capture-library/_legacy/…   unreferenced images moved out of public/ by the cleanup
 *
 *   bun scripts/agentic/library.ts build [--run <id>] [--json]
 *       file every recorded state of every run (or one run) into the library; a later run of
 *       the same area/state updates its README and images, and earlier section/dropdown crops
 *       it did not re-shoot stay (each item's README names the run it came from)
 *   bun scripts/agentic/library.ts find <route> [<section heading or label>] [--json]
 *       the library folders a page's images came from, or the folders whose labels match
 *   bun scripts/agentic/library.ts publish <route> [--json]
 *       copy every /img/… the page references and public/ lacks from the library into public/
 *   bun scripts/agentic/library.ts prune-public [--apply] [--json]
 *       list (or, with --apply, delete) capture images in public/img/<area>/ that no page
 *       references AND that the library holds — public/ keeps only what the site uses
 *
 * READMEs are generated from states.json and the snapshots — never free-written.
 */
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import {
	DOCS_DIR,
	loadMap,
	parseArgs,
	parseSnapshot,
	readJson,
	ROOT,
	RUNS_DIR,
	walkSnapshot,
	type SnapNode,
} from './lib';

export const LIBRARY_DIR = join(ROOT, '_private/capture-library');
const PUBLIC = join(ROOT, 'public');
const args = parseArgs(process.argv.slice(2));
const [verb, a1, a2] = args.positional;
const asJson = args.flags.has('json');

/** every /img/… path each page references (route → paths) */
function pageImages(): Map<string, string[]> {
	const out = new Map<string, string[]>();
	const walk = (dir: string) => {
		for (const f of readdirSync(dir, { withFileTypes: true })) {
			const p = join(dir, f.name);
			if (f.isDirectory()) walk(p);
			else if (/\.mdx?$/.test(f.name)) {
				const route = relative(DOCS_DIR, p)
					.replace(/\.mdx?$/, '')
					.replace(/\/index$/, '');
				const imgs = [...readFileSync(p, 'utf8').matchAll(/\(\/img\/[^)\s"']+\)/g)].map((m) =>
					m[0].slice(1, -1)
				);
				if (imgs.length) out.set(route, [...new Set(imgs)]);
			}
		}
	};
	walk(DOCS_DIR);
	return out;
}
const usedBy = (img: string, pages: Map<string, string[]>) =>
	[...pages.entries()].filter(([, l]) => l.includes(img)).map(([r]) => r);

/** names of every named node under the node with this ref (or the whole tree) */
function namesUnder(tree: SnapNode[], ref?: string): string[] {
	let root: SnapNode[] = tree;
	if (ref) {
		let hit: SnapNode | null = null;
		walkSnapshot(tree, (n) => {
			if (!hit && n.ref === ref) hit = n;
		});
		if (hit) root = [hit];
	}
	const names: string[] = [];
	walkSnapshot(root, (n) => {
		if (n.name && n.name.length < 120 && !names.includes(n.name))
			names.push(`${n.role} "${n.name}"`);
	});
	return names.slice(0, 80);
}

function copyImg(src: string | null | undefined, dest: string): string | null {
	if (!src) return null;
	const abs = join(PUBLIC, src);
	// public/ only keeps what pages use (prune-public); the library copy is then the source
	if (!existsSync(abs)) return existsSync(dest) ? src : null;
	mkdirSync(dirname(dest), { recursive: true });
	copyFileSync(abs, dest);
	return src;
}

function build(onlyRun?: string) {
	const pages = pageImages();
	const runs = readdirSync(RUNS_DIR)
		.filter((r) => /^\d{12}-/.test(r) && (!onlyRun || r === onlyRun))
		.sort(); // chronological: a later run of the same state wins
	let filed = 0;
	const areas = new Set<string>();
	for (const run of runs) {
		const states = readJson<Record<string, any>>(join(RUNS_DIR, run, 'states.json'));
		const area = readJson<any>(join(RUNS_DIR, run, 'area.json'))?.area ?? run.replace(/^\d+-/, '');
		if (!states) continue;
		for (const st of Object.values<any>(states)) {
			if (st.noChange) continue;
			const dir = join(LIBRARY_DIR, area, st.id);
			// merge, never wipe: a later run that recorded fewer sections must not drop earlier crops
			const snapPath = join(ROOT, st.snapshot ?? '');
			const tree = existsSync(snapPath) ? parseSnapshot(readFileSync(snapPath, 'utf8')) : [];
			const viewport = copyImg(st.viewport, join(dir, 'viewport.png'));
			const panel = copyImg(st.panel, join(dir, 'panel.png'));
			const dialog = st.panel
				? copyImg(st.panel.replace(/-panel\.png$/, '-dialog.png'), join(dir, 'dialog.png'))
				: null;
			const lines = [
				`# ${area} · ${st.id}`,
				'',
				`Generated by \`scripts/agentic/library.ts\` from run \`${run}\` (${st.capturedAt ?? '?'}). Do not edit.`,
				'',
				`- **Reach it:** ${(st.reach ?? []).join(' → ') || "(the area's landing screen)"}`,
				`- **URL:** ${st.url ?? '?'}`,
				st.variant
					? `- **Variant of** \`${st.variant.base}\`: ${st.variant.when ?? JSON.stringify(st.variant)}`
					: null,
				`- **Snapshot:** \`${st.snapshot}\``,
				`- **Images:** ${[viewport && `viewport.png (\`${viewport}\`)`, panel && `panel.png (\`${panel}\`)`, dialog && 'dialog.png'].filter(Boolean).join(' · ') || 'none'}`,
				`- **Used by pages:** ${
					[viewport, panel]
						.filter(Boolean)
						.flatMap((i) => usedBy(i!, pages))
						.join(', ') || 'none'
				}`,
				'',
				'## Sections',
				'',
				...Object.entries<any>(st.sections ?? {}).map(
					([id, s]) => `- \`${id}\` — ${String(s.label).slice(0, 140)}`
				),
				'',
				'## Dropdowns',
				'',
				...Object.entries<any>(st.options ?? {}).map(
					([id, o]) => `- \`${id}\` — ${o.label}: ${(o.values ?? []).length} option(s)`
				),
				'',
				'## Named elements on the screen',
				'',
				...namesUnder(tree).map((n) => `- ${n}`),
				'',
			].filter((l, i, a) => l !== null && (l !== '' || a[i - 1] !== ''));
			mkdirSync(dir, { recursive: true });
			writeFileSync(join(dir, 'README.md'), lines.join('\n'));
			for (const [id, s] of Object.entries<any>(st.sections ?? {})) {
				const sd = join(dir, 'sections', id);
				mkdirSync(sd, { recursive: true });
				const img = copyImg(s.image, join(sd, 'image.png'));
				writeFileSync(
					join(sd, 'README.md'),
					[
						`# ${area} · ${st.id} · section \`${id}\``,
						'',
						`Generated from run \`${run}\`. Do not edit.`,
						'',
						`- **Shows:** ${s.label}`,
						`- **Image:** ${img ? `image.png (\`${img}\`)` : 'missing'}`,
						`- **Used by pages:** ${img ? usedBy(img, pages).join(', ') || 'none' : 'none'}`,
						`- **Screen:** ../../README.md`,
						'',
					].join('\n')
				);
				filed++;
			}
			for (const [id, o] of Object.entries<any>(st.options ?? {})) {
				const od = join(dir, 'options', id);
				mkdirSync(od, { recursive: true });
				const img = copyImg(o.image, join(od, 'image.png'));
				writeFileSync(
					join(od, 'README.md'),
					[
						`# ${area} · ${st.id} · dropdown \`${id}\``,
						'',
						`Generated from run \`${run}\`. Do not edit.`,
						'',
						`- **Dropdown:** ${o.label} (value when captured: ${o.value ?? '?'})`,
						`- **Options:** ${(o.values ?? []).join(' · ') || '(not in the a11y tree — read the image)'}`,
						`- **Image:** ${img ? `image.png (\`${img}\`)` : 'missing'}`,
						`- **Used by pages:** ${img ? usedBy(img, pages).join(', ') || 'none' : 'none'}`,
						'',
					].join('\n')
				);
				filed++;
			}
			filed++;
			areas.add(area);
		}
	}
	// Capture images no states.json records (a noChange state's shot, a crop attached under
	// another id, a hand recrop) — filed under _unfiled so nothing in public/ is library-less.
	let unfiled = 0;
	if (!onlyRun) {
		const idx = libraryIndex();
		for (const area of areas) {
			const dir = join(PUBLIC, 'img', area);
			if (!existsSync(dir)) continue;
			for (const f of readdirSync(dir)) {
				const img = `/img/${area}/${f}`;
				if (!f.endsWith('.png') || idx.has(img)) continue;
				const ud = join(LIBRARY_DIR, area, '_unfiled', f.replace(/\.png$/, ''));
				mkdirSync(ud, { recursive: true });
				copyImg(img, join(ud, 'image.png'));
				writeFileSync(
					join(ud, 'README.md'),
					`# ${area} · unfiled \`${f}\`\n\nGenerated. Not recorded in any run's states.json (a no-change state, or a crop attached under another id). Do not edit.\n\n- **Image:** image.png (\`${img}\`)\n- **Used by pages:** ${usedBy(img, pages).join(', ') || 'none'}\n`
				);
				unfiled++;
			}
		}
	}
	return { runs: runs.length, areas: [...areas], filed, unfiled };
}

/** library file for a public /img path, found by the README's recorded source path */
function libraryIndex(): Map<string, string> {
	const idx = new Map<string, string>();
	const walk = (dir: string) => {
		if (!existsSync(dir)) return;
		for (const f of readdirSync(dir, { withFileTypes: true })) {
			const p = join(dir, f.name);
			if (f.isDirectory()) walk(p);
			else if (f.name === 'README.md')
				for (const m of readFileSync(p, 'utf8').matchAll(/(\w+\.png) \(`(\/img\/[^`]+)`\)/g))
					idx.set(m[2], join(dir, m[1]));
		}
	};
	walk(LIBRARY_DIR);
	// the _legacy tree mirrors public/img paths directly
	const legacy = join(LIBRARY_DIR, '_legacy');
	const walkLegacy = (dir: string) => {
		if (!existsSync(dir)) return;
		for (const f of readdirSync(dir, { withFileTypes: true })) {
			const p = join(dir, f.name);
			if (f.isDirectory()) walkLegacy(p);
			else idx.set('/img/' + relative(legacy, p), p);
		}
	};
	walkLegacy(legacy);
	return idx;
}

if (verb === 'build') {
	const r = build(args.get('run'));
	console.log(
		asJson
			? JSON.stringify(r)
			: `library: ${r.filed} item(s) + ${r.unfiled} unfiled from ${r.runs} run(s), areas ${r.areas.join(', ')} → ${relative(ROOT, LIBRARY_DIR)}`
	);
} else if (verb === 'find') {
	const route = a1;
	if (!route) {
		console.error('find needs <route> [<section or label>]');
		process.exit(1);
	}
	const idx = libraryIndex();
	const imgs = pageImages().get(route) ?? [];
	const q = (a2 ?? '').toLowerCase();
	const hits: { image: string; library: string | null; readme: string | null }[] = [];
	for (const img of imgs) {
		const lib = idx.get(img) ?? null;
		hits.push({
			image: img,
			library: lib && relative(ROOT, lib),
			readme: lib && relative(ROOT, join(dirname(lib), 'README.md')),
		});
	}
	// a free-text query also searches every README for the label
	const matches: string[] = [];
	if (q) {
		const walk = (dir: string) => {
			if (!existsSync(dir)) return;
			for (const f of readdirSync(dir, { withFileTypes: true })) {
				const p = join(dir, f.name);
				if (f.isDirectory()) walk(p);
				else if (f.name === 'README.md' && readFileSync(p, 'utf8').toLowerCase().includes(q))
					matches.push(relative(ROOT, dirname(p)));
			}
		};
		const areas = loadMap().map.routes[route]?.console ?? [];
		for (const a of areas.length ? areas : readdirSync(LIBRARY_DIR)) walk(join(LIBRARY_DIR, a));
	}
	if (asJson) console.log(JSON.stringify({ route, images: hits, matches }));
	else {
		console.log(`${route}: ${hits.length} image(s) on the page`);
		for (const h of hits) console.log(`  ${h.image}\n      ${h.library ?? 'NOT IN LIBRARY'}`);
		if (q) {
			console.log(`folders mentioning "${a2}":`);
			for (const m of matches.slice(0, 30)) console.log(`  ${m}`);
		}
	}
} else if (verb === 'publish') {
	const route = a1;
	if (!route) {
		console.error('publish needs <route>');
		process.exit(1);
	}
	const idx = libraryIndex();
	const done: string[] = [];
	const missing: string[] = [];
	for (const img of pageImages().get(route) ?? []) {
		const dest = join(PUBLIC, img);
		if (existsSync(dest) || img.endsWith('_placeholder.svg')) continue;
		const src = idx.get(img);
		if (!src) {
			missing.push(img);
			continue;
		}
		mkdirSync(dirname(dest), { recursive: true });
		copyFileSync(src, dest);
		done.push(img);
	}
	console.log(
		asJson
			? JSON.stringify({ route, published: done, missing })
			: `${route}: published ${done.length}, missing ${missing.length}${missing.length ? ` (${missing.join(', ')})` : ''}`
	);
} else if (verb === 'prune-public') {
	const apply = args.flags.has('apply');
	const idx = libraryIndex();
	const used = new Set([...pageImages().values()].flat());
	const candidates: string[] = [];
	const imgRoot = join(PUBLIC, 'img');
	const walk = (dir: string) => {
		for (const f of readdirSync(dir, { withFileTypes: true })) {
			const p = join(dir, f.name);
			if (f.isDirectory()) walk(p);
			else {
				const img = '/' + relative(PUBLIC, p);
				if (!used.has(img) && idx.has(img) && !img.endsWith('_placeholder.svg'))
					candidates.push(img);
			}
		}
	};
	walk(imgRoot);
	if (apply) for (const img of candidates) rmSync(join(PUBLIC, img));
	console.log(
		asJson
			? JSON.stringify({ applied: apply, count: candidates.length, images: candidates })
			: `${apply ? 'deleted' : 'would delete'} ${candidates.length} unreferenced capture image(s) from public/ (all kept in the library)`
	);
} else {
	console.error(
		'Usage: library.ts build [--run <id>] | find <route> [<label>] | publish <route> | prune-public [--apply]  [--json]'
	);
	process.exit(1);
}
