/**
 * ref-context.ts — the browser hook's click judge (called by .claude/hooks/pw-policy.sh).
 *
 *   bun scripts/agentic/ref-context.ts <snapshot.yml> <ref> <agent> [<allowlist.json> <run-id>]
 *
 * The allowlist (written only by `explore-plan.ts variant-on`, fenced from agents by
 * agent-paths.sh) is the one exception to "pipeline agents never pick an option": while it is live
 * — same run as current-run, not expired — an option click is allowed iff the dropdown's label and
 * the option's text are listed in it.
 *
 * Resolves a Playwright ref in a saved accessibility snapshot and prints one JSON line:
 *   {decision: "allow"|"deny", reason, kind, name, role}
 * Exit 0 in both cases; any crash exits non-zero and the hook denies (fail closed).
 *
 * Why a script: the snapshot's own names are unreliable for a regex in bash. Options render as
 * `generic [ref=…]: Pinecone` (no quotes), "Propose Changes" is a `button [ref=…]:` whose text sits
 * in its children, and the Change Log's Rollback is an `img` under `generic "Rollback"`. The name is
 * built here from the node, its text, its descendants and its named ancestor.
 *
 * Kinds (Carbon anatomy, spike 2026-09-26, _private/tools/playwright/output/spike-variants/):
 *   value-button  a button (or combobox) under a listbox — opens the dropdown; always openable
 *   option        an entry of an OPEN dropdown (listbox > listbox > …) — picking it changes a setting
 *   setting       checkbox / switch / radio / slider / spinbutton / option / menuitemradio|checkbox
 *   chip          a pointer `generic` outside the SVG tree ("Enable All", "Enabled", "Copy") — toggles
 *   svg-node      a pointer `generic` inside an `img` (Neural Config's routing tree) — opens a dialog
 *   control       everything else (buttons, tabs, links, imgs)
 *
 * Policy — the main session (agent "main") is supervised by Fabio and by auto mode, so only
 * DESTRUCTIVE is refused there (it may Save / Rollback named versions:
 * _private/agentic-v2/playground-versions.md). Every other caller is a pipeline agent and may only
 * LOOK: no option, setting, chip, unnamed button, or commit verb (lib.ts COMMIT_VERBS, openers
 * excepted — lib.ts isOpener).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	accordionOf,
	COMMIT_VERBS,
	DESTRUCTIVE,
	isOpener,
	nameOf,
	parseSnapshot,
	walkSnapshot,
	type SnapNode,
	type Versions,
} from './lib';

const argv = process.argv.slice(2);
const typeAt = argv.indexOf('--type');
const typed = typeAt >= 0 ? (argv[typeAt + 1] ?? '') : null;
const [snap, ref, agent = 'main', v2 = '', runId = ''] = typeAt >= 0 ? argv.slice(0, typeAt) : argv;
if (!snap || !ref) {
	console.error(
		'usage: ref-context.ts <snapshot.yml> <ref> <agent> [<v2-dir> <run-id>] [--type <text>]'
	);
	process.exit(2);
}
const readIf = <T>(f: string): T | null =>
	f && existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')) as T) : null;
type Allow = {
	section?: string;
	runId: string;
	controls: Record<string, string[]>;
	expires: string;
	variant?: string;
	id?: string;
	versionName?: string;
};
const runFolder = v2 && runId ? join(v2, 'runs', runId) : '';
const variantAllow = readIf<Allow>(runFolder && join(runFolder, 'variant-allowlist.json'));
const expAllow = readIf<Allow>(runFolder && join(runFolder, 'experiment-allowlist.json'));
const versions = readIf<Versions>(v2 && join(v2, 'playground-versions.json'));
const live = (a: Allow | null) => !!a && a.runId === runId && Date.parse(a.expires) > Date.now();
const pending = versions?.pending ?? null;
const isExperimenter = agent === 'experimenter';
// The undo path is open whenever an experiment is pending — never gated by run or TTL.
const mayUndo = agent === 'experimenter' && !!pending;

let node: SnapNode | null = null;
walkSnapshot(parseSnapshot(readFileSync(snap, 'utf8')), (n) => {
	if (!node && n.ref === ref) node = n;
});

const out = (decision: 'allow' | 'deny', reason: string, extra: Record<string, unknown> = {}) => {
	console.log(JSON.stringify({ decision, reason, ...extra }));
	process.exit(0);
};

if (!node) out('deny', `ref ${ref} is not in ${snap}`);
const n = node as unknown as SnapNode;

const ancestors = (x: SnapNode) => {
	const a: SnapNode[] = [];
	for (let p = x.parent; p; p = p.parent) a.push(p);
	return a;
};
const descText = (x: SnapNode, depth = 0): string[] => {
	if (depth > 4) return [];
	const parts: string[] = [];
	for (const c of x.children) {
		if (c.name) parts.push(c.name);
		if (c.text) parts.push(c.text);
		parts.push(...descText(c, depth + 1));
	}
	return parts;
};
const clean = (s: string) => s.replace(/^"|"$/g, '').replace(/\s+/g, ' ').trim();
const name = clean(n.name || n.text || descText(n).join(' ') || nameOf(n)).slice(0, 120);

const anc = ancestors(n);
const listboxes = anc.filter((a) => a.role === 'listbox').length;
const inImg = anc.some((a) => a.role === 'img');
const pointer = n.attrs.includes('cursor=pointer');
const SETTING = new Set([
	'checkbox',
	'switch',
	'radio',
	'slider',
	'spinbutton',
	'option',
	'menuitemradio',
	'menuitemcheckbox',
]);

let kind: string;
if (SETTING.has(n.role)) kind = 'setting';
else if (listboxes >= 2 || (listboxes === 1 && n.role === 'generic')) kind = 'option';
else if (listboxes === 1 || n.role === 'listbox' || n.role === 'combobox') kind = 'value-button';
else if (n.role === 'generic' && inImg) kind = 'svg-node';
else if (n.role === 'generic' && pointer) kind = 'chip';
else kind = 'control';

const info = { kind, name, role: n.role };

// The dialog a node sits in, named by its visible title text.
const dialogText = (): string => {
	for (const a of anc) {
		const t = descText(a).join(' ');
		if (/Save a new version/.test(t) && a.children.length) return 'version';
		if (/transaction has been processed/i.test(t)) return 'complete';
		if (a.role === 'dialog') return /Configuration:/.test(t) ? 'config' : 'other';
	}
	return 'page';
};
/** The "Save a new version" dialog around a node: its two textboxes (name, description). */
const versionBoxes = () => {
	for (const a of anc) {
		const boxes: SnapNode[] = [];
		walkSnapshot([a], (d) => {
			if (d.role === 'textbox') boxes.push(d);
		});
		if (boxes.length >= 2 && /Save a new version/.test(descText(a).join(' '))) return boxes;
	}
	return [];
};
/** What a textbox holds: its `- text:` child (the parser folds `/placeholder:` into .text — ignore it). */
const boxText = (b?: SnapNode) => {
	if (!b) return '';
	const typedText = b.children.filter((c) => c.role === 'text').map((c) => c.text ?? '');
	if (typedText.length) return clean(typedText.join(' '));
	return clean((b.text ?? '').replace(/\/placeholder:.*$/s, ''));
};
const rowDate = (): string | null => {
	for (const a of anc)
		if (a.role === 'row') {
			let d: string | null = null;
			walkSnapshot([a], (c) => {
				if (!d && c.role === 'cell' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(c.name)) d = c.name;
			});
			return d;
		}
	return null;
};

// ── typing (browser_type → --type) ────────────────────────────────────────────
if (typed !== null) {
	if (agent === 'main') out('allow', 'main session', info);
	if (!isExperimenter || !live(expAllow))
		out('deny', 'only the experimenter types, and only while an experiment is armed', info);
	const boxes = versionBoxes();
	if (!boxes.length || boxes[0].ref !== n.ref)
		out(
			'deny',
			'the experimenter types only into the "Name this version" box of "Save a new version"',
			info
		);
	if (typed !== expAllow!.versionName)
		out('deny', `the version name must be exactly "${expAllow!.versionName}"`, info);
	out('allow', `experiment ${expAllow!.id}: version name`, info);
}

if (DESTRUCTIVE.test(name))
	out('deny', `"${name}" is destructive — never clicked, by anyone`, info);
if (agent === 'main') out('allow', 'main session: only destructive controls are refused', info);

// ── the experimenter's commit path (and the undo path for experimenter + cleanup) ─────
if (/^rollback$/i.test(name)) {
	if (!mayUndo) out('deny', 'Rollback only undoes a pending experiment, by the experimenter', info);
	const d = rowDate();
	if (d !== pending!.baselineSavedAt)
		out(
			'deny',
			`Rollback only on the "${pending!.baselineVersion}" row (${pending!.baselineSavedAt}); this row is ${d ?? '?'}`,
			info
		);
	out('allow', `undo experiment ${pending!.id}: roll back to ${pending!.baselineVersion}`, info);
}
if (/^ok$/i.test(name) && mayUndo && dialogText() === 'complete')
	out('allow', 'the "Complete" dialog after a rollback', info);
if (/^save$/i.test(name) && isExperimenter) {
	if (!live(expAllow) || pending?.id !== expAllow!.id)
		out('deny', "Save only while this run's experiment is armed and pending", info);
	const where = dialogText();
	if (where === 'config')
		out('allow', `experiment ${expAllow!.id}: Save (opens "Save a new version")`, info);
	if (where !== 'version')
		out(
			'deny',
			`Save only in Edit Configuration or "Save a new version" (this is: ${where})`,
			info
		);
	const [nameBox, descBox] = versionBoxes();
	if (boxText(nameBox) !== expAllow!.versionName)
		out(
			'deny',
			`type the version name "${expAllow!.versionName}" first (the box shows "${boxText(nameBox)}")`,
			info
		);
	const keys = (boxText(descBox).match(/following fields:\s*(.*)$/)?.[1] ?? '')
		.split(',')
		.map((k) => k.trim())
		.filter(Boolean);
	const extra = keys.filter((k) => !(versions?.normalisedOnLoad ?? []).includes(k));
	if (!keys.length || extra.length !== 1)
		out(
			'deny',
			`the version would save ${keys.length} field(s), ${extra.length} beyond the load-normalised ones (${extra.join(', ') || 'none'}) — exactly one is allowed; Cancel`,
			info
		);
	out('allow', `experiment ${expAllow!.id}: saves ${extra[0]}`, info);
}

if (kind === 'option') {
	// The dropdown's label: the widget listbox (outermost listbox ancestor) sits beside a
	// `generic: <label>` (spike: KnowledgeBase Type, Elastic Query Type, Platform).
	const widget = anc.filter((a) => a.role === 'listbox').pop();
	const label = clean(
		widget?.parent?.children.find((c) => c.role === 'generic' && !c.children.length && c.text)
			?.text ?? ''
	);
	const allow =
		isExperimenter && live(expAllow) ? expAllow : live(variantAllow) ? variantAllow : null;
	if (!allow)
		out(
			'deny',
			variantAllow || expAllow
				? 'the allowlist is stale (another run, or expired)'
				: `"${name}" is a dropdown option — picking it changes a setting; open the dropdown, photograph it, Escape`,
			{ ...info, label }
		);
	if (!label) out('deny', `"${name}" is an option of a dropdown whose label cannot be read`, info);
	// An experiment names the accordion too: the same label elsewhere (a logging toggle) is not it.
	if (allow!.section && accordionOf(widget!) !== allow!.section)
		out(
			'deny',
			`the armed experiment is in "${allow!.section}", this dropdown is in "${accordionOf(widget!) || '?'}"`,
			{ ...info, label }
		);
	if (allow!.controls[label]?.includes(name))
		out(
			'allow',
			`${allow!.variant ? `variant ${allow!.variant}` : `experiment ${allow!.id}`}: ${label} = ${name} is allowlisted`,
			{ ...info, label }
		);
	out(
		'deny',
		`the armed ${allow!.variant ? 'variant' : 'experiment'} does not allow ${label} = ${name}`,
		{ ...info, label }
	);
}
if (kind === 'setting' || kind === 'chip')
	out('deny', `"${name}" (${n.role}) changes a setting — pipeline agents only look`, info);
if (n.role === 'button' && !name)
	out('deny', 'an unnamed button — cannot tell whether it commits', info);
if (COMMIT_VERBS.test(name) && !isOpener(name))
	out(
		'deny',
		`"${name}" commits (Save/Propose/Rollback/Add/Generate…) — pipeline agents never commit`,
		info
	);
out('allow', 'looks only', info);
