/**
 * Stage 7 of /docs-verify: the promotion gates for one written route. Deterministic, no model.
 * Lifted from the v1 gate runner (_private/archive/agentic-v1/scripts/migrate-gates.ts) with the
 * ledger moved to runs/<id>/<route>/ and the diff-containment gate dropped — v2 writers
 * reshape a page into the contract, so "only flagged lines changed" no longer applies.
 *
 *   bun scripts/agentic/gates.ts <run-id> <route> [--json]
 *
 * Every gate returns PASS, FAIL or ABSENT (its input does not exist). ABSENT is a park,
 * never a pass. Exit 1 unless every gate is PASS (with --json always 0: the JSON says `ok`).
 * Result → runs/<id>/<route>/gates.json.
 *
 *   lint       bun scripts/doc-lint.ts <route> --strict — any ERROR fails
 *   contract   the five h2s in order, title + description present
 *   links      every internal ](/…) link resolves to a route, a renamed key, or a file
 *   images     every image exists, is not an old-docs carry-over, and a placeholder is
 *              followed by a SCREENSHOT marker within 3 lines
 *   evidence   every non-prose claim has a verdict; no unverifiable param/default claim;
 *              every confirmed ui/behaviour claim rests on a saved snapshot (label greps) or
 *              a run file (the probe's raw output) whose sha1 still matches — re-checked
 *              here, the agents' own flags are not trusted; every contradicted/missing
 *              verdict the writer says it applied has its `actual` text present in the page
 *   write      write.json exists and lists no `left_unresolved` load-bearing claim
 *
 * `bun run verify` (the build) is not here: it runs once per pipeline run, after the last
 * writer, from the skill.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DOCS_DIR, loadMap, parseArgs, readJson, ROOT, routeDir, sha1, writeJson } from './lib';

const args = parseArgs(process.argv.slice(2));
const [runId, route] = args.positional;
if (!runId || !route) {
	console.error('Usage: bun scripts/agentic/gates.ts <run-id> <route> [--json]');
	process.exit(1);
}
type Status = 'PASS' | 'FAIL' | 'ABSENT';
const gates: Record<string, { status: Status; detail: string[] }> = {};
const gate = (name: string, status: Status, detail: string[] = []) =>
	(gates[name] = { status, detail });
const { map } = loadMap();
const rd = routeDir(runId, route);
const pagePath = join(DOCS_DIR, `${route}.md`);

if (!existsSync(pagePath)) {
	gate('lint', 'ABSENT', [`${pagePath} does not exist`]);
	finish();
}
const raw = readFileSync(pagePath, 'utf8');
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
const fm = fmMatch ? fmMatch[1] : '';
const body = fmMatch ? raw.slice(fmMatch[0].length) : raw;
const offset = fmMatch ? fmMatch[0].split('\n').length - 1 : 0;
const lines = body.split('\n');
const at = (i: number) => offset + i + 1;
const outsideFences = (fn: (line: string, i: number) => void) => {
	let inFence = false;
	for (const [i, line] of lines.entries()) {
		if (/^\s*(`{3,}|~{3,})/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (!inFence) fn(line, i);
	}
};

// ── lint ──────────────────────────────────────────────────────────────────────
{
	const r = spawnSync('bun', ['scripts/doc-lint.ts', route, '--strict'], {
		cwd: ROOT,
		encoding: 'utf8',
	});
	const out = (r.stdout || '') + (r.stderr || '');
	const findings = [...out.matchAll(/^\s+(ERROR|warn )\s+(\d+)\s+(\S+)\s+(.*)$/gm)].map((m) => ({
		level: m[1].trim(),
		line: Number(m[2]),
		rule: m[3],
		message: m[4],
	}));
	const errors = findings.filter((f) => f.level === 'ERROR');
	if (r.error) gate('lint', 'ABSENT', [String(r.error)]);
	else
		gate(
			'lint',
			errors.length ? 'FAIL' : 'PASS',
			findings.map((f) => `${f.level} ${f.line} ${f.rule} — ${f.message}`)
		);
}
// ── contract ──────────────────────────────────────────────────────────────────
{
	const CONTRACT = ['What is it', 'Why it matters', 'When to use it', 'How it works', 'FAQ'];
	const detail: string[] = [];
	if (!/^title:\s*\S/m.test(fm)) detail.push('frontmatter: no title');
	if (!/^description:\s*\S/m.test(fm)) detail.push('frontmatter: no description');
	const h2: string[] = [];
	outsideFences((line) => {
		const m = line.match(/^##\s+(.+?)\s*$/);
		if (m) h2.push(m[1].toLowerCase());
	});
	const positions = CONTRACT.map((s) => h2.indexOf(s.toLowerCase()));
	// FAQ may be omitted rather than padded (page-contract.md); the other four are required.
	const missing = CONTRACT.filter((s, i) => positions[i] < 0 && s !== 'FAQ');
	if (missing.length) detail.push(`missing h2: ${missing.join(', ')}`);
	const present = positions.filter((p) => p >= 0);
	if (present.some((p, i) => i > 0 && p < present[i - 1]))
		detail.push('contract sections out of order');
	if (/^#\s/m.test(body)) detail.push('in-body H1');
	gate('contract', detail.length ? 'FAIL' : 'PASS', detail);
}
// ── links ─────────────────────────────────────────────────────────────────────
{
	const detail: string[] = [];
	outsideFences((line, i) => {
		for (const m of line.matchAll(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g)) {
			const target = m[1];
			if (target.startsWith('/img/') || target.startsWith('/files/')) continue;
			const key = target.replace(/^\//, '').replace(/\/$/, '');
			const ok =
				key in map.routes ||
				(map.renamed && key in map.renamed) ||
				existsSync(join(DOCS_DIR, `${key}.md`)) ||
				existsSync(join(DOCS_DIR, `${key}.mdx`)) ||
				existsSync(join(DOCS_DIR, key, 'index.md')) ||
				existsSync(join(DOCS_DIR, key, 'index.mdx'));
			if (!ok) detail.push(`line ${at(i)}: ${target} is not a route`);
		}
	});
	gate('links', detail.length ? 'FAIL' : 'PASS', detail);
}
// ── images ────────────────────────────────────────────────────────────────────
{
	const PLACEHOLDER = '/img/_placeholder.svg';
	const detail: string[] = [];
	let stale = new Set<string>();
	try {
		stale = new Set(
			Object.keys(
				JSON.parse(readFileSync(join(ROOT, 'scripts/old-docs-image-hashes.json'), 'utf8')).hashes
			)
		);
	} catch {
		detail.push('note: scripts/old-docs-image-hashes.json missing — stale-image check inert');
	}
	outsideFences((line, i) => {
		for (const m of line.matchAll(/!\[[^\]]*\]\((\/img\/[^)\s]+)\)/g)) {
			const p = m[1];
			if (p === PLACEHOLDER) {
				if (!/<!--\s*SCREENSHOT:/.test(lines.slice(i + 1, i + 4).join('\n')))
					detail.push(`line ${at(i)}: placeholder without a SCREENSHOT marker within 3 lines`);
				continue;
			}
			const abs = join(ROOT, 'public', p.replace(/^\//, ''));
			if (!existsSync(abs)) detail.push(`line ${at(i)}: ${p} does not exist under public/`);
			else if (stale.has(sha1(readFileSync(abs))))
				detail.push(`line ${at(i)}: ${p} is byte-identical to an old-docs image (stale)`);
		}
	});
	gate('images', detail.filter((d) => !d.startsWith('note:')).length ? 'FAIL' : 'PASS', detail);
}
// ── evidence ──────────────────────────────────────────────────────────────────
const docs = readJson(join(rd, 'docs.json'));
const verdicts = readJson(join(rd, 'verdicts.json'));
const runner = readJson(join(rd, 'runner.json'));
if (runner?.verdicts?.length) {
	// Same merge rule as compile.ts: a run settles a claim over a screen.
	const byId = new Map<string, any>((verdicts?.verdicts ?? []).map((v: any) => [v.id, v]));
	for (const v of runner.verdicts)
		if (v.verdict !== 'unverifiable' || !byId.has(v.id)) byId.set(v.id, v);
	if (verdicts) verdicts.verdicts = [...byId.values()];
}
const write = readJson(join(rd, 'write.json'));
{
	if (!docs || !verdicts)
		gate('evidence', 'ABSENT', [!docs ? 'docs.json missing' : 'verdicts.json missing']);
	else {
		const detail: string[] = [];
		const byId = new Map<string, any>((verdicts.verdicts ?? []).map((v: any) => [v.id, v]));
		const checkable = (docs.claims ?? []).filter((c: any) => c.kind !== 'prose');
		for (const c of checkable)
			if (!byId.has(c.id)) detail.push(`${c.id} (${c.kind}) has no verdict`);
		for (const c of checkable) {
			const v = byId.get(c.id);
			if (!v) continue;
			if (v.verdict === 'unverifiable' && (c.kind === 'param' || c.kind === 'default'))
				detail.push(`${c.id} (${c.kind}) is unverifiable: ${v.reason ?? ''}`.trim());
			// A confirmed ui/behaviour claim rests on a saved snapshot (label greps) or a run
			// file (the probe's raw output), each with a matching sha1; param/default too when
			// the verifier settled them on screen or by a run.
			const needsFile =
				c.kind === 'ui' ||
				c.kind === 'behaviour' ||
				((c.kind === 'param' || c.kind === 'default') &&
					v.tier !== 'config' &&
					v.tier !== 'portal');
			if (v.verdict === 'confirmed' && needsFile) {
				const runFile = v.evidence?.run ? join(rd, v.evidence.run) : '';
				const snap = v.evidence?.snapshot ? join(rd, v.evidence.snapshot) : '';
				if (runFile) {
					if (!existsSync(runFile)) detail.push(`${c.id}: run file missing (${v.evidence.run})`);
					else if (v.evidence.sha1 && sha1(readFileSync(runFile, 'utf8')) !== v.evidence.sha1)
						detail.push(`${c.id}: run file sha1 mismatch — evidence changed after the verdict`);
				} else if (!snap || !existsSync(snap))
					detail.push(`${c.id}: confirmed ${c.kind} claim without a saved snapshot or run file`);
				else {
					const text = readFileSync(snap, 'utf8');
					if (v.evidence.sha1 && sha1(text) !== v.evidence.sha1)
						detail.push(`${c.id}: snapshot sha1 mismatch — evidence changed after the verdict`);
					if (c.kind !== 'behaviour' && (!v.evidence.label || !text.includes(v.evidence.label)))
						detail.push(
							`${c.id}: label "${v.evidence?.label ?? ''}" is not in ${v.evidence.snapshot}`
						);
				}
			}
		}
		// What the writer says it applied must be visible on the page.
		for (const e of write?.edits ?? []) {
			const v = byId.get(e.id);
			if (!v || !(v.verdict === 'contradicted' || v.verdict === 'missing')) continue;
			const needle = (e.applied_text ?? v.actual ?? '').trim();
			if (needle && !raw.includes(needle.slice(0, 60)))
				detail.push(`${e.id}: applied text not found on the page ("${needle.slice(0, 40)}…")`);
		}
		gate('evidence', detail.length ? 'FAIL' : 'PASS', detail);
	}
}
// ── write ─────────────────────────────────────────────────────────────────────
{
	if (!write) gate('write', 'ABSENT', ['write.json missing']);
	else {
		const detail: string[] = [];
		const loadBearing = new Set(['param', 'default', 'endpoint']);
		const byId = new Map<string, any>((docs?.claims ?? []).map((c: any) => [c.id, c]));
		for (const id of write.left_unresolved ?? []) {
			const c = byId.get(typeof id === 'string' ? id : id?.id);
			if (c && loadBearing.has(c.kind)) detail.push(`${c.id} (${c.kind}) left unresolved`);
		}
		if (/<!--\s*(MERGE|STILL TO DOCUMENT|ASK):/.test(body))
			detail.push('a MERGE / STILL TO DOCUMENT / ASK marker is still on the page');
		gate('write', detail.length ? 'FAIL' : 'PASS', detail);
	}
}
finish();

function finish(): never {
	const ok = Object.values(gates).every((g) => g.status === 'PASS');
	const result = { runId, route, ok, gates, checkedAt: new Date().toISOString() };
	writeJson(join(rd, 'gates.json'), result);
	if (args.flags.has('json')) console.log(JSON.stringify(result));
	else {
		console.log(`${route}  ${ok ? 'PASS' : 'PARKED'}`);
		for (const [name, g] of Object.entries(gates)) {
			console.log(`  ${g.status.padEnd(6)} ${name}`);
			for (const d of g.detail) console.log(`         ${d}`);
		}
	}
	// A parked route is a result the workflow reads from the JSON, not a script failure.
	process.exit(args.flags.has('json') ? 0 : ok ? 0 : 1);
}
