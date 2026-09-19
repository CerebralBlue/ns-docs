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
 *   bun scripts/agentic/explore-plan.ts crops  <run> --state <id> [--snapshot <abs.yml>] [--json]
 *       what to photograph in a recorded state: the panel (dialog / tabpanel / expanded
 *       accordion item), one crop per SECTION (a field group with a heading, or a labelled
 *       row), and every dropdown (listbox) whose option list must be opened. `record` prints
 *       this list itself; the explorer shoots each `ref` and attaches the files.
 *   bun scripts/agentic/explore-plan.ts attach <run> --state <id> [--section <id>=<abs.png>]…
 *       [--options <id>=<abs.yml>:<abs.png>]… [--json]
 *       the section crops and option captures of a state → states.json (option values parsed
 *       from the options snapshot when the a11y tree exposes the open menu)
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
import { existsSync, readFileSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import {
	CAPTURES_FILE,
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

const MAX_STATES = 40; // openable states; section crops and option captures are not counted
const MAX_SECTIONS = 20;
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
type Section = { label: string; image: string };
type OptionCapture = {
	label: string;
	value: string;
	snapshot: string;
	image: string | null;
	values: string[];
};
type State = {
	id: string;
	reach: string[];
	snapshot: string;
	sha1: string;
	noChange?: boolean;
	viewport: string | null;
	panel: string | null;
	sections?: Record<string, Section>;
	options?: Record<string, OptionCapture>;
	url?: string;
	adds?: { role: string; name: string }[];
	capturedAt: string;
};

const args = parseArgs(process.argv.slice(2));
const verb = args.positional[0];
const run = args.positional[1];
const asJson = args.flags.has('json');
if (!verb || !run) {
	console.error('Usage: explore-plan.ts plan|diff|record|crops|attach|finish <run> …');
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

/** What one snapshot exposes that is worth opening; appends to states-todo.json + excluded.json. */
function planFrom(snap: string, from: string) {
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
	// What looked openable but was skipped by policy — the report shows it, so a screen the
	// walk never opened (Save-guarded dialogs, feedback…) is visible instead of silent.
	const excludedPath = join(dir, 'excluded.json');
	const excluded: { label: string; role: string; why: string; from: string }[] =
		readJson(excludedPath) ?? [];
	const exclude = (c: { role: string; name: string }, why: string) => {
		if (!excluded.some((e) => e.label === c.name && e.role === c.role))
			excluded.push({ label: c.name, role: c.role, why, from });
	};
	const pages = todos.filter((t) => t.kind === 'page').length;
	let pageBudget = MAX_PAGES - pages;
	// A focused capture (area.json.states): only the listed state ids are walked. Ancestors on
	// the path must be listed too (queue.ts --states default-config-answer-generation,edit-configuration-edit,…).
	const filter: string[] | null =
		Array.isArray(area.states) && area.states.length ? area.states : null;
	for (const c of controlsOf(parseSnapshot(readFileSync(snap, 'utf8')))) {
		if (todos.length + added.length >= MAX_STATES) break;
		if (!c.name || NAV_REGIONS.test(c.region)) continue;
		// "Edit Configuration", "Add a Category", "Create…" OPEN something; the commit happens on
		// the Save inside, which the plan never lists. So an opener wins over COMMIT_VERBS.
		const opener = /^(edit|add|create|new|configure|manage|view|show|open)\b/i.test(c.name.trim());
		if (DESTRUCTIVE.test(c.name)) {
			if (c.role === 'button' || c.role === 'generic') exclude(c, 'destructive');
			continue;
		}
		if (NEVER.test(c.name)) {
			if (c.role === 'button') exclude(c, 'never list (feedback/download/close…)');
			continue;
		}
		if (!opener && COMMIT_VERBS.test(c.name)) {
			if (c.role === 'button' || c.role === 'generic') exclude(c, 'commit verb (Save/Run/Test…)');
			continue;
		}
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
		if (filter && !filter.some((f) => id === f || id.startsWith(f) || f.startsWith(id))) continue;
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
	writeJson(excludedPath, excluded);
	return { added, excluded };
}

/**
 * What to photograph in one state. The Carbon console has a stable anatomy:
 *   accordion item   listitem > button "<name>" [expanded] + generic (content)
 *   field group      generic > generic(heading level=5 + text) + generic(slider | listbox …)
 *   labelled row     generic > listbox/textbox/slider + generic: "<label>" (+ status)
 *   dropdown         listbox [cursor=pointer] > button "<current value>"
 * A SECTION is the outermost node (with a ref) that holds exactly one heading and ≥ 1 control,
 * or — where there are no headings — a labelled row. Outer wins: once a node is a section the
 * walk does not descend into it. Every dropdown inside the panel is an OPTION target.
 */
type CropTarget = { id: string; ref: string; label: string; kind: 'panel' | 'section' };
type OptionTarget = { id: string; ref: string; listboxRef: string; label: string; value: string }; // listboxRef = the crop target (the group)
const VALUE_LIKE = /^("?\d+(\.\d+)?"?|disabled|enabled|true|false|yes|no|none|-)$/i;
const hasControl = (n: SnapNode): boolean => INTERACTIVE.has(n.role) || n.children.some(hasControl);
const headingsIn = (n: SnapNode): SnapNode[] => {
	const out: SnapNode[] = [];
	walkSnapshot(n.children, (d) => {
		if (d.role === 'heading') out.push(d);
	});
	return out;
};
const labelOf = (n: SnapNode): string => {
	if (n.name && !VALUE_LIKE.test(n.name) && n.name !== 'Slider value') return n.name;
	for (const c of n.children) {
		if (c.role === 'generic' && c.text && !c.ref && !VALUE_LIKE.test(c.text)) return c.text;
		if (c.role === 'generic' && c.text && !VALUE_LIKE.test(c.text) && !hasControl(c)) return c.text;
	}
	return '';
};
function cropsOf(snapshotYaml: string, stateId: string, stateLabel: string) {
	const tree = parseSnapshot(snapshotYaml);
	// 1. the panel
	// Several accordion items can be [expanded] at once (the walk does not collapse the previous
	// one): the state's own item is the one whose button name matches the state, else the last
	// expanded item in document order (the most recently opened).
	let panel: SnapNode | null = null;
	const expanded: SnapNode[] = [];
	walkSnapshot(tree, (n) => {
		if (
			n.role === 'button' &&
			n.attrs.includes('expanded') &&
			n.parent?.role === 'listitem' &&
			n.parent.ref
		)
			expanded.push(n);
	});
	const want = slug(stateLabel);
	const match =
		expanded.find((b) => slug(b.name) === want || slug(b.name) === stateId) ??
		expanded.find(
			(b) =>
				want.startsWith(slug(b.name).slice(0, 12)) || slug(b.name).startsWith(want.slice(0, 12))
		);
	if (match) panel = match.parent;
	else if (expanded.length) panel = expanded[expanded.length - 1].parent;
	if (!panel)
		walkSnapshot(tree, (n) => {
			if (panel) return;
			if ((n.role === 'tabpanel' || n.role === 'dialog' || n.role === 'alertdialog') && n.ref)
				panel = n;
		});
	const root: SnapNode[] = panel ? [panel] : tree;
	// 2. sections, outer wins
	const sections: CropTarget[] = [];
	const usedIds = new Set<string>();
	const uniq = (base: string) => {
		let id = slug(base);
		for (let n = 2; usedIds.has(id); n++) id = `${slug(base)}-${n}`;
		usedIds.add(id);
		return id;
	};
	// A row's own box is often just the 200px widget (the label sits under it): the image a
	// reader needs is the GROUP — the nearest ancestor that also holds a paragraph/heading or
	// sibling rows, without being the whole panel. Count controls to stay below "the form".
	const countControls = (n: SnapNode) => {
		let c = 0;
		walkSnapshot([n], (d) => {
			if (INTERACTIVE.has(d.role)) c++;
		});
		return c;
	};
	const contextOf = (n: SnapNode): SnapNode => {
		let best = n;
		// Carbon wraps rows in ref-less generics; the context (a paragraph beside the row) often
		// sits in such a wrapper, and the photograph must target its nearest ref'd ancestor.
		let pendingContext = false;
		for (let p = n.parent; p && p !== panel; p = p.parent) {
			const kids = p.children;
			const hasContext =
				pendingContext ||
				kids.some(
					(k) =>
						k.role === 'paragraph' ||
						k.role === 'heading' ||
						(k.role === 'text' && (k.text ?? '').length > 40)
				);
			if (!p.ref) {
				pendingContext = hasContext;
				continue;
			}
			const controls = countControls(p);
			if (controls > 14) break;
			if (hasContext || kids.length >= 2) {
				best = p;
				if (hasContext) break;
			}
			pendingContext = false;
		}
		return best;
	};
	const visit = (n: SnapNode, depth: number) => {
		if (sections.length >= MAX_SECTIONS) return;
		if (n === panel) {
			for (const c of n.children) visit(c, depth + 1);
			return;
		}
		if (LANDMARKS.has(n.role) && n.role !== 'region' && n.role !== 'group') {
			for (const c of n.children) visit(c, depth + 1);
			return;
		}
		const isBox =
			n.role === 'generic' || n.role === 'group' || n.role === 'region' || n.role === 'listitem';
		if (isBox && n.ref && hasControl(n) && !INTERACTIVE.has(n.role)) {
			const hs = headingsIn(n);
			if (hs.length === 1) {
				const label = hs[0].name || labelOf(n);
				if (label) {
					sections.push({ id: uniq(label), ref: n.ref, label, kind: 'section' });
					return;
				}
			}
			if (hs.length === 0) {
				const label = labelOf(n);
				if (label && !NEVER.test(label)) {
					const ctx = contextOf(n);
					// several rows sharing one context box collapse into one section (their labels joined)
					const dup = sections.find((x) => x.ref === ctx.ref);
					if (dup) {
						dup.label = `${dup.label} · ${label}`;
						return;
					}
					sections.push({ id: uniq(label), ref: ctx.ref, label, kind: 'section' });
					return;
				}
			}
		}
		for (const c of n.children) visit(c, depth + 1);
	};
	for (const r of root) visit(r, 0);
	// 3. dropdowns
	const options: OptionTarget[] = [];
	walkSnapshot(root, (n) => {
		if (n.role !== 'listbox' || !n.ref) return;
		const btn = n.children.find((c) => c.role === 'button');
		if (!btn || !btn.ref) return;
		let label = '';
		if (n.parent) label = labelOf(n.parent);
		if (!label) {
			const sec = sections.find((s) => s.ref === (n.parent?.ref ?? ''));
			label = sec?.label ?? '';
		}
		if (!label || NEVER.test(label)) return;
		const ctx = n.parent ? contextOf(n.parent) : n;
		options.push({
			id: `options-${slug(label)}`,
			ref: btn.ref,
			listboxRef: ctx.ref || n.ref, // what to photograph with the menu open: the group, not the widget
			label,
			value: btn.name,
		});
	});
	const seen = new Set<string>();
	const dedupOptions = options.filter((o) => !seen.has(o.id) && seen.add(o.id));
	return {
		state: stateId,
		panel: panel
			? {
					id: stateId,
					ref: (panel as SnapNode).ref,
					label: (panel as SnapNode).name || stateLabel,
					kind: 'panel' as const,
				}
			: null,
		sections,
		options: dedupOptions,
	};
}

if (verb === 'plan') {
	const snap = args.get('snapshot');
	if (!snap || !existsSync(snap)) {
		console.error('plan needs --snapshot <abs.yml>');
		process.exit(1);
	}
	const { added, excluded } = planFrom(snap, args.get('state') ?? 'default');
	const pending = todos.filter((t) => !t.done);
	if (asJson)
		console.log(
			JSON.stringify({
				added: added.length,
				pending,
				total: todos.length,
				cap: MAX_STATES,
				excluded: excluded.length,
			})
		);
	else {
		console.log(
			`+${added.length} from ${args.get('state') ?? 'default'} → ${pending.length} pending of ${todos.length} (cap ${MAX_STATES})`
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
	const noChange =
		args.flags.has('no-change') || (adds !== undefined && adds.length === 0 && !panel);
	states[id] = {
		id,
		reach,
		snapshot: relative(ROOT, snap),
		sha1: sha1(readFileSync(snap)),
		noChange,
		viewport: viewport ? '/' + relative(join(ROOT, 'public'), viewport) : null,
		panel: panel ? '/' + relative(join(ROOT, 'public'), panel) : null,
		url: args.get('url'),
		adds,
		capturedAt: new Date().toISOString(),
	};
	if (todo) todo.done = true;
	writeJson(statesPath, states);
	writeJson(todoPath, todos);
	// Look deeper automatically: what this state exposes (accordions in a dialog, tabs in a
	// panel) joins the todo list now — the agent does not have to remember to plan.
	const deeper = noChange ? { added: [] as Todo[] } : planFrom(snap, id);
	const pendingList = todos.filter((t) => !t.done);
	// What to photograph in THIS state before moving on: the panel, one crop per section,
	// every dropdown's option list. The agent shoots each ref and calls `attach`.
	const crops = noChange
		? { panel: null, sections: [], options: [] }
		: cropsOf(readFileSync(snap, 'utf8'), id, todo?.label ?? id);
	if (asJson)
		console.log(
			JSON.stringify({
				recorded: id,
				adds: adds?.length ?? null,
				deeper: deeper.added.map((t) => t.id),
				crops,
				pending: pendingList.map((t) => ({ id: t.id, reach: t.reach })),
				states: Object.keys(states).length,
			})
		);
	else {
		console.log(
			`recorded ${id} (${adds?.length ?? '?'} new controls, +${deeper.added.length} deeper) — ${pendingList.length} pending, ${Object.keys(states).length} states`
		);
		if (crops.panel || crops.sections.length || crops.options.length) {
			console.log(
				`  PHOTOGRAPH NOW (target=ref → public/img/<area>/${id}--<id>.png), then: explore-plan.ts attach ${run} --state ${id} --section <id>=<png> … --options <id>=<yml>:<png> …`
			);
			if (crops.panel)
				console.log(
					`    panel    ${id.padEnd(40)} ${crops.panel.ref.padEnd(12)} ${crops.panel.label}`
				);
			for (const x of crops.sections)
				console.log(`    section  ${x.id.padEnd(40)} ${x.ref.padEnd(12)} ${x.label}`);
			for (const o of crops.options)
				console.log(
					`    options  ${o.id.padEnd(40)} click ${o.ref.padEnd(12)} ${o.label} = ${o.value}  (snapshot + crop listbox ${o.listboxRef}, then Escape)`
				);
		}
		console.log('  PENDING STATES:');
		for (const t of pendingList)
			console.log(`  ${t.id.padEnd(32)} ${t.kind.padEnd(7)} ${t.reach.join(' → ')}`);
	}
	process.exit(0);
}

if (verb === 'crops') {
	const id = args.get('state');
	const snap =
		args.get('snapshot') ?? (id && states[id] ? join(ROOT, states[id].snapshot) : undefined);
	if (!id || !snap || !existsSync(snap)) {
		console.error(
			'crops needs --state <id> [--snapshot <abs.yml>] (a recorded state, or a snapshot file)'
		);
		process.exit(1);
	}
	const todo = todos.find((t) => t.id === id);
	const c = cropsOf(readFileSync(snap, 'utf8'), id, todo?.label ?? id);
	if (asJson) console.log(JSON.stringify(c));
	else {
		console.log(
			`${id}: panel ${c.panel ? `${c.panel.ref} (${c.panel.label})` : 'none'}, ${c.sections.length} section(s), ${c.options.length} dropdown(s)`
		);
		for (const x of c.sections)
			console.log(`  section  ${x.id.padEnd(40)} ${x.ref.padEnd(12)} ${x.label}`);
		for (const o of c.options)
			console.log(
				`  options  ${o.id.padEnd(40)} click ${o.ref.padEnd(12)} crop ${o.listboxRef.padEnd(12)} ${o.label} = ${o.value}`
			);
	}
	process.exit(0);
}

if (verb === 'attach') {
	const id = args.get('state');
	if (!id || !states[id]) {
		console.error('attach needs --state <recorded id>');
		process.exit(1);
	}
	const st = states[id];
	st.sections ??= {};
	st.options ??= {};
	const c = cropsOf(readFileSync(join(ROOT, st.snapshot), 'utf8'), id, id);
	const kv = (x: string) => {
		const i = x.indexOf('=');
		return [x.slice(0, i), x.slice(i + 1)] as const;
	};
	for (const spec of args.values.section ?? []) {
		const [sid, png] = kv(spec);
		if (!existsSync(png)) {
			console.error(`missing section image ${png}`);
			process.exit(1);
		}
		const t = c.sections.find((x) => x.id === sid);
		st.sections[sid] = { label: t?.label ?? sid, image: '/' + relative(join(ROOT, 'public'), png) };
	}
	for (const spec of args.values.options ?? []) {
		const [oid, rest] = kv(spec);
		const [yml, png] = rest.split(':');
		if (!yml || !existsSync(yml)) {
			console.error(`missing options snapshot for ${oid}: ${yml}`);
			process.exit(1);
		}
		const t = c.options.find((x) => x.id === oid);
		// The open menu, when the a11y tree exposes it: `option` roles, or a listbox/menu with
		// several short-named children. Empty means the image is the only evidence.
		// Carbon's open menu (verified 2026-09-19): under the widget's `listbox` a second `listbox`
		// appears holding `generic: <option>` items (one wrapper generic deep), next to the
		// `button "<value>" [expanded]`. Read it from the expanded button's parent; fall back
		// to `option` roles or any listbox/menu whose children are all short texts.
		const otree = parseSnapshot(readFileSync(yml, 'utf8'));
		let values: string[] = [];
		const textsOf = (n: SnapNode): string[] => {
			const out: string[] = [];
			walkSnapshot([n], (d) => {
				if (
					d !== n &&
					(d.role === 'generic' || d.role === 'option' || d.role === 'listitem') &&
					(d.name || d.text) &&
					!d.children.length
				)
					out.push((d.name || d.text || '').trim().replace(/^"(.*)"$/, '$1')); // the tree quotes "Yes"/"5"
			});
			return out.filter((x) => x && x.length <= 60);
		};
		walkSnapshot(otree, (n) => {
			if (values.length) return;
			if (n.role === 'button' && n.attrs.includes('expanded') && n.parent?.role === 'listbox') {
				const menu = n.parent.children.find(
					(k) => k !== n && (k.role === 'listbox' || k.role === 'menu' || k.role === 'list')
				);
				if (menu) values = textsOf(menu);
			}
		});
		if (!values.length)
			walkSnapshot(otree, (n) => {
				if (n.role === 'option' && n.name) values.push(n.name);
			});
		if (!values.length)
			walkSnapshot(otree, (n) => {
				if (values.length) return;
				if ((n.role === 'listbox' || n.role === 'menu') && n.children.length >= 1) {
					const names = textsOf(n);
					if (names.length >= 2) values = names;
				}
			});
		st.options[oid] = {
			label: t?.label ?? oid,
			value: t?.value ?? '',
			snapshot: relative(ROOT, yml),
			image: png && existsSync(png) ? '/' + relative(join(ROOT, 'public'), png) : null,
			values: [...new Set(values)],
		};
	}
	writeJson(statesPath, states);
	const summary = {
		state: id,
		sections: Object.keys(st.sections).length,
		options: Object.fromEntries(
			Object.entries(st.options).map(([k, v]) => [
				k,
				v.values.length ? v.values : `(no a11y values — image ${v.image ? 'kept' : 'missing'})`,
			])
		),
		missingSections: c.sections.filter((x) => !st.sections![x.id]).map((x) => x.id),
		missingOptions: c.options.filter((x) => !st.options![x.id]).map((x) => x.id),
	};
	console.log(
		asJson
			? JSON.stringify(summary)
			: `${id}: ${summary.sections} section crop(s), ${Object.keys(st.options).length} option capture(s); still missing: ${[...summary.missingSections, ...summary.missingOptions].join(', ') || 'none'}`
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
		for (const o of Object.values(states[id].options ?? {}))
			if (o.values.length) argv.push('--options', `${o.label}=${o.values.join('|')}`);
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
	const imgDir = join(ROOT, 'public/img', area.area);
	const imagesOnDisk = existsSync(imgDir)
		? readdirSync(imgDir).filter((f) => f.endsWith('.png')).length
		: 0;
	const excluded = readJson<any[]>(join(dir, 'excluded.json')) ?? [];
	const summary = {
		area: area.area,
		states: ids.length,
		pendingTodos: todos.filter((t) => !t.done).map((t) => t.id),
		noChange: ids.filter((i) => states[i].noChange),
		excluded: excluded.map((e) => `${e.label} (${e.why})`),
		images: imagesOnDisk,
		map: diff,
	};
	writeJson(join(dir, 'explore-summary.json'), summary);
	// The capture index: the latest explore of each area, which write-only runs read from.
	const captures = readJson<Record<string, any>>(CAPTURES_FILE) ?? {};
	captures[area.area] = {
		runId: run,
		capturedAt: new Date().toISOString(),
		states: ids.length,
		images: imagesOnDisk,
		mapHash: diff?.hash?.candidate ?? diff?.hash?.cached ?? null,
		notOpened: summary.pendingTodos,
	};
	writeJson(CAPTURES_FILE, captures);
	console.log(
		asJson
			? JSON.stringify(summary)
			: `${ids.length} states, ${summary.images} images, ${summary.pendingTodos.length} not opened, ${summary.excluded.length} excluded by policy; map ${diff?.status ?? '?'}; capture indexed`
	);
	process.exit(0);
}
console.error('Usage: explore-plan.ts plan|diff|record|crops|attach|finish <run> …');
process.exit(1);
