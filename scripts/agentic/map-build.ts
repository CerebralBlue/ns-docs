/**
 * Build one console area's component map from saved accessibility snapshots.
 *
 *   bun scripts/agentic/map-build.ts --area seek --url https://…/seek --nav "Seek" \
 *       --state default=<abs>.yml [--state advanced=<abs>.yml --reach advanced="click Show Advanced Options"] \
 *       [--screenshot default=<abs>.png] [--options "<label>=<v1>|<v2>|…"]… [--json]
 *
 * Writes _private/component-map/.candidates/<area>.json — a CANDIDATE. map-diff.ts compares it
 * with the cached map and promotes it (or reports `unchanged`). Deterministic: the same
 * snapshots always produce the same candidate, and the structural hash ignores everything
 * that changes between visits (counts, dates, the signed-in user, table rows, refs).
 *
 * The map stores `role + name` per control, never a Playwright ref — refs are regenerated on
 * every snapshot. `commits` marks controls that save/run/submit (click deliberately, keep the
 * run small); `destructive` marks the ones the browser hook will never let anyone click.
 */
import { existsSync, readFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import {
	COMMIT_VERBS,
	COMPONENT_MAP_DIR,
	DESTRUCTIVE,
	INTERACTIVE,
	nameOf,
	parseArgs,
	parseSnapshot,
	regionOf,
	ROOT,
	sha1,
	walkSnapshot,
	writeJson,
	type SnapNode,
} from './lib';

const args = parseArgs(process.argv.slice(2));
const area = args.get('area');
if (!area || !args.values.state?.length) {
	console.error(
		'Usage: bun scripts/agentic/map-build.ts --area <name> --url <url> --nav "<Nav > Path>" --state <id>=<file.yml> [...] [--reach <id>="how to get there"] [--screenshot <id>=<file.png>] [--json]'
	);
	process.exit(1);
}

type Control = {
	role: string;
	name: string;
	kind: string;
	commits: boolean;
	destructive: boolean;
	opens?: string;
	options?: string[];
	columns?: string[];
	states: string[];
	count: number;
};
type Region = { name: string; controls: Control[] };

const kv = (s: string) => {
	const i = s.indexOf('=');
	return [s.slice(0, i), s.slice(i + 1)] as const;
};
const reach = Object.fromEntries((args.values.reach ?? []).map(kv));
const screenshots = Object.fromEntries((args.values.screenshot ?? []).map(kv));
// Captured option lists (agentic v3.2): label → values, attached to the matching listbox control.
const optionLists = Object.fromEntries(
	(args.values.options ?? []).map(kv).map(([k, v]) => [
		k.toLowerCase(),
		v
			.split('|')
			.map((x) => x.trim())
			.filter(Boolean),
	])
);

const regions = new Map<string, Map<string, Control>>();
const states: { id: string; file: string; reach: string[]; controls: number }[] = [];

let unnamedDropped = 0;
for (const spec of args.values.state) {
	const [id, file] = kv(spec);
	if (!existsSync(file)) {
		console.error(`state ${id}: snapshot not found: ${file}`);
		process.exit(1);
	}
	const tree = parseSnapshot(readFileSync(file, 'utf8'));
	let n = 0;
	// Repeated structures (one list item per source document, one row per intent) are DATA,
	// not UI: they change with every answer and would make the hash useless. A group of ≥ 4
	// same-role siblings collapses — every control inside becomes one "*" control per role —
	// when it LOOKS like data: a name carries a URL, a percentage or a date, or there are
	// twelve or more of them. A nav list of eight short links stays a list of eight links.
	const collapsed = new Set<SnapNode>();
	const hasControl = (n: SnapNode): boolean =>
		INTERACTIVE.has(n.role) || n.children.some(hasControl);
	const DATA_LIKE = /https?:\/\/|\d+\s*%|\d{4}-\d{2}-\d{2}/;
	walkSnapshot(tree, (parent: SnapNode) => {
		const byRole = new Map<string, SnapNode[]>();
		for (const c of parent.children)
			if (hasControl(c)) (byRole.get(c.role) ?? byRole.set(c.role, []).get(c.role)!).push(c);
		for (const group of byRole.values()) {
			if (group.length < 4) continue;
			const names: string[] = [];
			for (const c of group)
				walkSnapshot([c], (d) => {
					if (INTERACTIVE.has(d.role)) names.push(nameOf(d));
				});
			if (group.length < 12 && !names.some((n) => DATA_LIKE.test(n))) continue;
			for (const c of group)
				walkSnapshot([c], (d) => {
					if (INTERACTIVE.has(d.role)) collapsed.add(d);
				});
		}
	});
	walkSnapshot(tree, (node: SnapNode) => {
		const isTable = node.role === 'table' && node.children.length > 0;
		if (!INTERACTIVE.has(node.role) && !isTable) return;
		// A table nested in a table (the console wraps them) — keep the inner one only.
		if (isTable && node.children.some((c) => c.role === 'table')) return;
		const region = regionOf(node);
		const name = isTable ? node.name || 'table' : collapsed.has(node) ? '*' : nameOf(node);
		// An unnamed control (an icon button with no accessible name and no tooltip parent)
		// cannot be documented by label and only inflates the map; keep it when it at least
		// navigates somewhere (a link with a url), else drop it. The unnamed count is still
		// reported in `summary.unnamed`.
		if (!isTable && !name && !node.url) {
			unnamedDropped++;
			return;
		}
		let columns: string[] | undefined;
		if (isTable) {
			columns = [];
			walkSnapshot(node.children, (c) => {
				if (c.role === 'columnheader') {
					const label = c.name || c.children.find((x) => x.name)?.name || '';
					if (label) columns!.push(label);
				}
			});
		}
		const key = `${node.role}|${name}|${columns?.join(',') ?? ''}`;
		const bucket = regions.get(region) ?? new Map<string, Control>();
		regions.set(region, bucket);
		const existing = bucket.get(key);
		if (existing) {
			existing.count++;
			if (!existing.states.includes(id)) existing.states.push(id);
		} else {
			bucket.set(key, {
				role: node.role,
				name,
				kind: isTable ? 'table' : collapsed.has(node) ? 'repeated' : node.role,
				// Links navigate (fenced by host in the hook); only non-link controls can commit.
				commits: !isTable && node.role !== 'link' && COMMIT_VERBS.test(name),
				destructive: !isTable && DESTRUCTIVE.test(name),
				opens: node.url,
				// a listbox's captured option list, keyed by the label beside it (its parent's label text)
				options:
					node.role === 'listbox'
						? optionLists[
								(
									node.parent?.children.find(
										(c) => c.role === 'generic' && c.text && !c.children.length
									)?.text ?? ''
								).toLowerCase()
							]
						: undefined,
				columns,
				states: [id],
				count: 1,
			});
		}
		n++;
	});
	states.push({ id, file: relative(ROOT, file), reach: reach[id] ? [reach[id]] : [], controls: n });
}

const regionList: Region[] = [...regions].map(([name, m]) => ({
	name,
	controls: [...m.values()].sort(
		(a, b) => a.name.localeCompare(b.name) || a.role.localeCompare(b.role)
	),
}));
regionList.sort((a, b) => a.name.localeCompare(b.name));

const structural = regionList
	.flatMap((r) =>
		r.controls.map((c) => `${r.name}|${c.role}|${c.name}|${c.columns?.join(',') ?? ''}`)
	)
	.sort()
	.join('\n');

const candidate = {
	area,
	url: args.get('url') ?? '',
	navPath: (args.get('nav') ?? '')
		.split('>')
		.map((s) => s.trim())
		.filter(Boolean),
	capturedAt: new Date().toISOString(),
	structuralHash: sha1(structural),
	states,
	regions: regionList,
	screenshots,
	summary: {
		regions: regionList.length,
		controls: regionList.reduce((n, r) => n + r.controls.length, 0),
		commits: regionList.reduce((n, r) => n + r.controls.filter((c) => c.commits).length, 0),
		tables: regionList.reduce((n, r) => n + r.controls.filter((c) => c.kind === 'table').length, 0),
		unnamed:
			unnamedDropped + regionList.reduce((n, r) => n + r.controls.filter((c) => !c.name).length, 0),
	},
};

const out = join(COMPONENT_MAP_DIR, '.candidates', `${area}.json`);
writeJson(out, candidate);
if (args.flags.has('json'))
	console.log(
		JSON.stringify({
			candidate: relative(ROOT, out),
			...candidate.summary,
			structuralHash: candidate.structuralHash,
		})
	);
else {
	console.log(
		`area ${area}: ${candidate.summary.controls} controls in ${candidate.summary.regions} regions (${candidate.summary.commits} commit controls, ${candidate.summary.tables} tables, ${candidate.summary.unnamed} unnamed) from ${states.length} state(s)`
	);
	console.log(`hash ${candidate.structuralHash.slice(0, 12)} → ${relative(ROOT, out)}`);
	console.log(`next: bun scripts/agentic/map-diff.ts ${area} [--apply]`);
}
void basename;
