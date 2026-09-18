/**
 * The explorer's brain (agentic v3). The explorer agent only navigates, clicks and captures;
 * every decision about WHAT to open, what changed, and what the walk produced is made here.
 *
 *   bun scripts/agentic/explore-plan.ts plan   <run> --snapshot <abs.yml> [--state <id>] [--json]
 *       from one saved snapshot, append the things worth opening to states-todo.json
 *       (dedupe by role+name across the whole run; depth and count caps) and print what is
 *       still to do
 *   bun scripts/agentic/explore-plan.ts diff   <run> --before <abs.yml> --after <abs.yml> [--json]
 *       what a click added: the new container (dialog / tabpanel / region → the element to crop)
 *       and the new controls; `nothing` when the snapshots are the same
 *   bun scripts/agentic/explore-plan.ts record <run> --state <id> --snapshot <abs.yml>
 *       --viewport <abs.png> [--panel <abs.png>] [--reach "<step>" …] [--url <landed url>] [--json]
 *       one captured state → states.json (sha1s recorded), the todo marked done
 *   bun scripts/agentic/explore-plan.ts finish <run> [--json]
 *       states.json → map-build.ts (candidate) → map-diff.ts --apply; prints the summary
 *
 * Openable = tab, menuitem, combobox (its options are documentation), a named button that does
 * not commit or destroy (accordion headers, "Edit Configuration", "Filter", "Statistical
 * Details" — the kind is only known once it is opened), and at depth 0 a same-instance link
 * outside the top navigation (a page of the area). Never: the top nav, banner, the NEVER list
 * (feedback, download, copy, close…), anything the browser hook would refuse anyway.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import {
	COMMIT_VERBS,
	COMPONENT_MAP_DIR,
	DESTRUCTIVE,
	INTERACTIVE,
	LANDMARKS,
	nameOf,
	parseArgs,
	parseSnapshot,
	regionOf,
	ROOT,
	readJson,
	runDir,
	sha1,
	walkSnapshot,
	writeJson,
	type SnapNode,
} from './lib';

const MAX_STATES = 30;
const MAX_PAGES = 10;
const MAX_DEPTH = 3;
/** Opening these documents nothing or has a side effect the walk must not cause. */
const NEVER =
	/\b(thumbs?|feedback|like|dislike|download|copy|upload|print|refresh|reload|close|cancel|back|previous|next|prev|toggle|theme|profile|avatar|sign|log ?in|search|notifications?|help|docs?|documentation|support|expand all|collapse all|yes|no|choose file|browse)\b/i;
const NAV_REGIONS = /^(banner|navigation|list:NeuralSeek)/;

type Todo = {
	id: string;
	label: string;
	role: string;
	kind: 'tab' | 'menu' | 'select' | 'button' | 'page';
	region: string;
	from: string;
	depth: number;
	reach: string[];
	url?: string;
	done?: boolean;
};
type State = {
	id: string;
	reach: string[];
	snapshot: string;
	sha1: string;
	viewport: string | null;
	panel: string | null;
	url?: string;
	adds?: { role: string; name: string }[];
	capturedAt: string;
};

const args = parseArgs(process.argv.slice(2));
const verb = args.positional[0];
const run = args.positional[1];
const asJson = args.flags.has('json');
if (!verb || !run) {
	console.error('Usage: explore-plan.ts plan|diff|record|finish <run> …');
	process.exit(1);
}
const dir = runDir(run);
const area = readJson<any>(join(dir, 'area.json'));
if (!area) {
	console.error(`no ${relative(ROOT, join(dir, 'area.json'))} — run queue.ts first`);
	process.exit(2);
}
const todoPath = join(dir, 'states-todo.json');
const statesPath = join(dir, 'states.json');
const todos: Todo[] = readJson(todoPath) ?? [];
const states: Record<string, State> = readJson(statesPath) ?? {};
// "Answers (1)" and "Answers (16)" are the same control on different tree nodes.
const key = (role: string, name: string) =>
	`${role}|${name
		.trim()
		.toLowerCase()
		.replace(/\(\d+\)/g, '(n)')}`;
const slug = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 40) || 'item';
/** Text of a node and its descendants, for the click targets that are plain `generic [cursor=pointer]` boxes (the Neural Config routing tree). */
const textOf = (n: SnapNode): string => {
	const parts: string[] = [];
	if (n.text) parts.push(n.text);
	for (const c of n.children) if (!INTERACTIVE.has(c.role)) parts.push(textOf(c));
	return parts.filter(Boolean).join(' / ').slice(0, 60);
};
// Only inside an `img` (an SVG diagram such as the Neural Config routing tree): elsewhere a
// pointer generic is a chip or a toggle, and clicking one changes a setting.
const inSvg = (n: SnapNode) => {
	for (let p = n.parent; p; p = p.parent) if (p.role === 'img') return true;
	return false;
};
const isPointer = (n: SnapNode) =>
	n.role === 'generic' && n.attrs.includes('cursor=pointer') && inSvg(n);
const controlsOf = (nodes: SnapNode[]) => {
	const out: { role: string; name: string; region: string; node: SnapNode }[] = [];
	walkSnapshot(nodes, (n) => {
		if (INTERACTIVE.has(n.role))
			out.push({ role: n.role, name: nameOf(n), region: regionOf(n), node: n });
		else if (isPointer(n) && !(n.parent && isPointer(n.parent)))
			out.push({ role: 'generic', name: textOf(n), region: regionOf(n), node: n });
	});
	return out;
};

if (verb === 'plan') {
	const snap = args.get('snapshot');
	if (!snap || !existsSync(snap)) {
		console.error('plan needs --snapshot <abs.yml>');
		process.exit(1);
	}
	const from = args.get('state') ?? 'default';
	const parent =
		from === 'default'
			? { reach: [] as string[], depth: 0 }
			: {
					reach: states[from]?.reach ?? todos.find((t) => t.id === from)?.reach ?? [],
					depth: (states[from]?.reach ?? []).length,
				};
	const seen = new Set<string>([...todos.map((t) => key(t.role, t.label)), ...Object.keys(states)]);
	const ids = new Set<string>([...todos.map((t) => t.id), ...Object.keys(states)]);
	const added: Todo[] = [];
	const pages = todos.filter((t) => t.kind === 'page').length;
	let pageBudget = MAX_PAGES - pages;
	for (const c of controlsOf(parseSnapshot(readFileSync(snap, 'utf8')))) {
		if (todos.length + added.length >= MAX_STATES) break;
		if (!c.name || NAV_REGIONS.test(c.region)) continue;
		// "Edit Configuration", "Add a Category", "Create…" OPEN something; the commit happens on
		// the Save inside, which the plan never lists. So an opener wins over COMMIT_VERBS.
		const opener = /^(edit|add|create|new|configure|manage|view|show|open)\b/i.test(c.name.trim());
		if (DESTRUCTIVE.test(c.name) || NEVER.test(c.name)) continue;
		if (!opener && COMMIT_VERBS.test(c.name)) continue;
		let kind: Todo['kind'] | null = null;
		if (c.role === 'tab') kind = 'tab';
		else if (c.role === 'menuitem' || c.role === 'menuitemradio' || c.role === 'menuitemcheckbox')
			kind = 'menu';
		else if (c.role === 'combobox' || c.role === 'listbox') kind = 'select';
		else if (c.role === 'button' || c.role === 'generic') kind = 'button';
		else if (c.role === 'link' && parent.depth === 0 && pageBudget > 0) {
			const u = c.node.url ?? '';
			if (!u || /^(https?:)?\/\//.test(u) || u.startsWith('mailto:')) continue; // off-instance links are not our pages
			kind = 'page';
			pageBudget--;
		}
		if (!kind || parent.depth >= MAX_DEPTH) continue;
		const k = key(c.role, c.name);
		if (seen.has(k)) continue;
		seen.add(k);
		let id = slug(c.name);
		for (let n = 2; ids.has(id); n++) id = `${slug(c.name)}-${n}`;
		ids.add(id);
		added.push({
			id,
			label: c.name,
			role: c.role,
			kind,
			region: c.region,
			from,
			depth: parent.depth + 1,
			reach: [...parent.reach, `click ${c.role} "${c.name}"`],
			url: c.node.url,
		});
	}
	todos.push(...added);
	writeJson(todoPath, todos);
	const pending = todos.filter((t) => !t.done);
	if (asJson)
		console.log(
			JSON.stringify({ added: added.length, pending, total: todos.length, cap: MAX_STATES })
		);
	else {
		console.log(
			`+${added.length} from ${from} → ${pending.length} pending of ${todos.length} (cap ${MAX_STATES})`
		);
		for (const t of pending)
			console.log(`  ${t.id.padEnd(32)} ${t.kind.padEnd(7)} ${t.reach.join(' → ')}`);
	}
	process.exit(0);
}

if (verb === 'diff') {
	const before = args.get('before');
	const after = args.get('after');
	if (!before || !after || !existsSync(before) || !existsSync(after)) {
		console.error('diff needs --before <abs.yml> --after <abs.yml>');
		process.exit(1);
	}
	const b = parseSnapshot(readFileSync(before, 'utf8'));
	const a = parseSnapshot(readFileSync(after, 'utf8'));
	const had = new Set(controlsOf(b).map((c) => key(c.role, c.name)));
	const adds = controlsOf(a)
		.filter((c) => c.name && !had.has(key(c.role, c.name)))
		.map((c) => ({ role: c.role, name: c.name, region: c.region }));
	// The container to crop: the outermost NEW landmark (dialog, tabpanel, region…) — the
	// first one in document order whose role+name was not in the previous snapshot.
	const hadLand = new Set<string>();
	walkSnapshot(b, (n) => {
		if (LANDMARKS.has(n.role)) hadLand.add(key(n.role, n.name));
	});
	type Container = { role: string; name: string; ref: string };
	const found: Container[] = [];
	walkSnapshot(a, (n) => {
		if (
			!found.length &&
			LANDMARKS.has(n.role) &&
			n.ref &&
			!hadLand.has(key(n.role, n.name)) &&
			n.role !== 'list'
		)
			found.push({ role: n.role, name: n.name, ref: n.ref });
	});
	const container: Container | null = found[0] ?? null;
	const same = !adds.length && !container;
	if (asJson) console.log(JSON.stringify({ nothing: same, container, adds }));
	else if (same) console.log('nothing changed');
	else {
		console.log(
			container
				? `container: ${container.role} "${container.name}" [ref=${container.ref}]`
				: 'container: none (crop the viewport)'
		);
		for (const c of adds) console.log(`  + ${c.role} "${c.name}"  (${c.region})`);
	}
	process.exit(0);
}

if (verb === 'record') {
	const id = args.get('state');
	const snap = args.get('snapshot');
	const viewport = args.get('viewport') ?? null;
	const panel = args.get('panel') ?? null;
	if (!id || !snap || !existsSync(snap)) {
		console.error(
			'record needs --state <id> --snapshot <abs.yml> [--viewport <abs.png>] [--panel <abs.png>]'
		);
		process.exit(1);
	}
	for (const f of [viewport, panel])
		if (f && !existsSync(f)) {
			console.error(`missing image ${f}`);
			process.exit(1);
		}
	const todo = todos.find((t) => t.id === id);
	const reach = args.values.reach ?? todo?.reach ?? [];
	const prev = states[todo?.from ?? 'default'];
	let adds: State['adds'] | undefined;
	if (prev && existsSync(join(ROOT, prev.snapshot))) {
		const had = new Set(
			controlsOf(parseSnapshot(readFileSync(join(ROOT, prev.snapshot), 'utf8'))).map((c) =>
				key(c.role, c.name)
			)
		);
		adds = controlsOf(parseSnapshot(readFileSync(snap, 'utf8')))
			.filter((c) => c.name && !had.has(key(c.role, c.name)))
			.map((c) => ({ role: c.role, name: c.name }));
	}
	states[id] = {
		id,
		reach,
		snapshot: relative(ROOT, snap),
		sha1: sha1(readFileSync(snap)),
		viewport: viewport ? '/' + relative(join(ROOT, 'public'), viewport) : null,
		panel: panel ? '/' + relative(join(ROOT, 'public'), panel) : null,
		url: args.get('url'),
		adds,
		capturedAt: new Date().toISOString(),
	};
	if (todo) todo.done = true;
	writeJson(statesPath, states);
	writeJson(todoPath, todos);
	const pending = todos.filter((t) => !t.done).length;
	if (asJson)
		console.log(
			JSON.stringify({
				recorded: id,
				adds: adds?.length ?? null,
				pending,
				states: Object.keys(states).length,
			})
		);
	else
		console.log(
			`recorded ${id} (${adds?.length ?? '?'} new controls) — ${pending} pending, ${Object.keys(states).length} states`
		);
	process.exit(0);
}

if (verb === 'finish') {
	const ids = Object.keys(states);
	if (!ids.includes('default')) {
		console.error('no default state recorded — nothing to build');
		process.exit(1);
	}
	const inst = readJson<any>(join(ROOT, '_private/agentic-v2/instances.json'));
	const url = area.url ? `https://${inst?.host}/${inst?.playground}${area.url}` : '';
	const argv = [
		'bun',
		'scripts/agentic/map-build.ts',
		'--area',
		area.area,
		'--url',
		url,
		'--nav',
		area.navPath.join(' > '),
	];
	for (const id of ids) {
		argv.push('--state', `${id}=${join(ROOT, states[id].snapshot)}`);
		if (states[id].reach.length) argv.push('--reach', `${id}=${states[id].reach.join(' → ')}`);
		if (states[id].viewport)
			argv.push('--screenshot', `${id}=${join(ROOT, 'public', states[id].viewport!)}`);
	}
	mkdirSync(join(COMPONENT_MAP_DIR, '.candidates'), { recursive: true });
	const b = spawnSync(argv[0], argv.slice(1), { cwd: ROOT, encoding: 'utf8' });
	if (b.status !== 0) {
		console.error(b.stderr);
		process.exit(1);
	}
	const d = spawnSync('bun', ['scripts/agentic/map-diff.ts', area.area, '--apply', '--json'], {
		cwd: ROOT,
		encoding: 'utf8',
	});
	let diff: any = null;
	try {
		diff = JSON.parse((d.stdout || '').trim().split('\n').pop()!);
	} catch {
		diff = { raw: (d.stdout || '') + (d.stderr || '') };
	}
	const summary = {
		area: area.area,
		states: ids.length,
		pendingTodos: todos.filter((t) => !t.done).map((t) => t.id),
		images:
			ids.filter((i) => states[i].viewport).length + ids.filter((i) => states[i].panel).length,
		map: diff,
	};
	writeJson(join(dir, 'explore-summary.json'), summary);
	console.log(
		asJson
			? JSON.stringify(summary)
			: `${ids.length} states, ${summary.images} images, ${summary.pendingTodos.length} not opened; map ${diff?.status ?? '?'}`
	);
	process.exit(0);
}
console.error('Usage: explore-plan.ts plan|diff|record|finish <run> …');
process.exit(1);
