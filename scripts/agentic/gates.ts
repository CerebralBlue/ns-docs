/**
 * Stage 6 of /docs-explore (agentic v3): the promotion gates for one written route.
 * Deterministic, no model.
 *
 *   bun scripts/agentic/gates.ts <run-id> <route> [--json]
 *
 * Every gate returns PASS, FAIL or ABSENT (its input does not exist). ABSENT is a park,
 * never a pass. Exit 1 unless every gate is PASS (with --json always 0: the JSON says `ok`).
 * Result → runs/<id>/<route>/gates.json.
 *
 *   lint       bun scripts/doc-lint.ts <route> --strict — any ERROR fails
 *   contract   the five h2s in order incl. a FAQ with ≥ 3 entries, title + description present,
 *              no leftover MERGE / STILL TO DOCUMENT / ASK marker
 *   links      every internal ](/…) link resolves to a route, a renamed key, or a file; a link
 *              whose sentence names a **topic** the (unwritten) target page does not mention is
 *              a warning line, never a FAIL
 *   images     every image exists, is not an old-docs carry-over, and a placeholder is
 *              followed by a SCREENSHOT marker within 3 lines
 *   coverage   the page names ≥ 90 % of the controls coverage-plan.json assigns to it — owned
 *              plus the shared ones naming the route; zero on a console route FAILs
 *              (coverage.ts — the writer's own check, re-run here)
 *   section-image  every ### section that names an assigned control carries a real image
 *              (the capture has a crop per section; a placeholder there is a writer omission)
 *   values     WARN: bold labels / code values on the page that no snapshot of the capture
 *              contains and no UNCONFIRMED marker covers (values.ts) — the reviewer rules on each
 *   facts      ≤ 4 `<!-- UNCONFIRMED: … -->` markers; more means the page is old prose with a
 *              new coat and Fabio should look at it. Reference-kind routes are exempt.
 *
 * `bun run verify` (the build) is not here: it runs once per area run, after the last writer.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { coverageOf } from './coverage';
import { unbackedValues } from './values';
import {
	captureDir,
	DOCS_DIR,
	loadMap,
	parseArgs,
	readJson,
	ROOT,
	routeDir,
	runDir,
	sha1,
	writeJson,
} from './lib';

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
	const missing = CONTRACT.filter((s, i) => positions[i] < 0);
	if (missing.length) detail.push(`missing h2: ${missing.join(', ')}`);
	const present = positions.filter((p) => p >= 0);
	if (present.some((p, i) => i > 0 && p < present[i - 1]))
		detail.push('contract sections out of order');
	if (/^#\s/m.test(body)) detail.push('in-body H1');
	// FAQ: every page ends with ≥ 3 questions (a `### Q` heading or a bold/`**Q**` line ending in `?`).
	const faqStart = lines.findIndex((l) => /^##\s+FAQ\s*$/i.test(l));
	if (faqStart >= 0) {
		const faq = lines.slice(faqStart + 1).join('\n');
		const questions = (
			faq.match(/^(###\s+.+\?|\*\*[^*]+\?\*\*|-\s+\*\*Q:?\*\*.+|<details>)\s*$/gm) ?? []
		).length;
		if (questions < 3) detail.push(`FAQ has ${questions} question(s); 3 or more required`);
	}
	if (/<!--\s*(MERGE|STILL TO DOCUMENT|ASK):/.test(body))
		detail.push('a MERGE / STILL TO DOCUMENT / ASK marker is still on the page');
	gate('contract', detail.length ? 'FAIL' : 'PASS', detail);
}
// ── links ─────────────────────────────────────────────────────────────────────
{
	const detail: string[] = [];
	const warnings: string[] = [];
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
			if (!ok) {
				detail.push(`line ${at(i)}: ${target} is not a route`);
				continue;
			}
			// A link that promises content ("Rollback is described on …") to a page that is still
			// a stub or verbatim old prose is a WARNING, never a fail — the target may be written
			// later tonight; the report counts these and the consistency pass re-checks them.
			const targetInfo = map.routes[key];
			if (targetInfo && targetInfo.status !== 'adopted') {
				const targetPage = [`${key}.md`, `${key}/index.md`]
					.map((f) => join(DOCS_DIR, f))
					.find((f) => existsSync(f));
				// the bold label just before the link (≤ 70 chars back) is what the link promises
				const topic = (
					line.slice(Math.max(0, m.index! - 70), m.index).match(/\*\*([^*]{3,60})\*\*/g) ?? []
				)
					.map((t) => t.replace(/\*\*/g, ''))
					.pop();
				if (
					targetPage &&
					topic &&
					!readFileSync(targetPage, 'utf8')
						.replace(/<!--[\s\S]*?-->/g, '')
						.toLowerCase()
						.includes(topic.toLowerCase())
				)
					warnings.push(
						`line ${at(i)}: link to unwritten content — ${target} (${targetInfo.status}) does not mention "${topic}"`
					);
			}
		}
	});
	gate('links', detail.length ? 'FAIL' : 'PASS', [...detail, ...warnings]);
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
// ── coverage ──────────────────────────────────────────────────────────────────
const area = readJson<any>(join(runDir(runId), 'area.json'));
const routeInfo = area?.routes?.find((r: any) => r.route === route);
const isReference = area?.kind === 'reference' || (routeInfo && !(routeInfo.console ?? []).length);
{
	const c = coverageOf(runId, route);
	gate(
		'coverage',
		c.status,
		c.status === 'ABSENT'
			? [c.detail ?? '']
			: [
					`${c.covered}/${c.total} controls named (${c.percent}%)`,
					...c.missing.map((m) => `missing: ${m}`),
				]
	);
}
// ── section-image ─────────────────────────────────────────────────────────
{
	const c = coverageOf(runId, route);
	const plan = readJson<Record<string, any>>(join(captureDir(runId), 'coverage-plan.json')) ?? {};
	const owned: string[] = Array.isArray(plan[route]) ? plan[route] : [];
	const shared: string[] = Object.entries(plan.shared ?? {})
		.filter(([, r]) => Array.isArray(r) && (r as string[]).includes(route))
		.map(([l]) => l);
	const labels = [...new Set([...owned, ...shared])].map((l) =>
		l
			.toLowerCase()
			.replace(/&/g, ' and ')
			.replace(/[^a-z0-9]+/g, ' ')
			.trim()
	);
	if (c.status === 'ABSENT' || isReference)
		gate('section-image', c.status === 'ABSENT' ? 'ABSENT' : 'PASS', [
			c.status === 'ABSENT' ? (c.detail ?? '') : 'reference kind',
		]);
	else {
		const detail: string[] = [];
		// split the body into ### sections (outside fences)
		// Only the ### sections under "How it works" are illustrated sections; the FAQ and the
		// contract's first three h2s are prose. A section passes with its own real image, or when
		// every control it names is already illustrated by a crop elsewhere on the page (a
		// "Staleness" paragraph about a slider shown two sections up needs no second picture).
		let cur: { title: string; start: number; text: string[] } | null = null;
		const sections: { title: string; start: number; text: string[] }[] = [];
		let inHow = false;
		outsideFences((line, i) => {
			const h2 = line.match(/^##\s+(.+?)\s*$/);
			if (h2) {
				inHow = /^how it works$/i.test(h2[1]);
				cur = null;
				return;
			}
			const m = line.match(/^###\s+(.+?)\s*$/);
			if (m && inHow) {
				cur = { title: m[1], start: at(i), text: [] };
				sections.push(cur);
			} else if (cur) cur.text.push(line);
		});
		const normT = (t: string) =>
			t
				.toLowerCase()
				.replace(/&/g, ' and ')
				.replace(/[^a-z0-9]+/g, ' ');
		// every real image on the page: its path slug + alt text, normalised
		const illustrated = [
			...body.matchAll(/!\[([^\]]*)\]\((\/img\/(?!_placeholder\.svg)[^)\s]+)\)/g),
		].map((m) => normT(`${m[1]} ${m[2].replace(/[-_/.]/g, ' ')}`));
		const isIllustrated = (label: string) => illustrated.some((t) => t.includes(label));
		for (const sec of sections) {
			const text = normT(sec.title + '\n' + sec.text.join('\n'));
			const names = labels.filter((l) => l && text.includes(l));
			if (!names.length) continue;
			const hasImage = sec.text.some((l) =>
				/!\[[^\]]*\]\(\/img\/(?!_placeholder\.svg)[^)\s]+\)/.test(l)
			);
			if (hasImage) continue;
			const missing = names.filter((l) => !isIllustrated(l));
			if (missing.length)
				detail.push(
					`line ${sec.start}: "${sec.title}" names ${names.length} control(s), has no image, and ${missing.length} of them (${missing.slice(0, 3).join(', ')}) is illustrated nowhere on the page`
				);
		}
		gate(
			'section-image',
			detail.length ? 'FAIL' : 'PASS',
			detail.length ? detail : [`${sections.length} section(s) checked`]
		);
	}
}
// ── facts ─────────────────────────────────────────────────────────────────
{
	const marks = [...raw.matchAll(/<!--\s*UNCONFIRMED:([^]*?)-->/g)].map((m) =>
		m[1].trim().slice(0, 80)
	);
	const limit = isReference ? Infinity : 4;
	gate('facts', marks.length > limit ? 'FAIL' : 'PASS', [
		`${marks.length} unconfirmed fact(s)${isReference ? ' (reference kind — no limit)' : ''}`,
		...marks.map((m) => `unconfirmed: ${m}`),
	]);
}
// ── values (WARN — never parks; the reviewer rules on each) ───────────────
{
	const v = unbackedValues(runId, route);
	gate('values', v.status === 'ABSENT' ? 'ABSENT' : 'PASS', [
		v.status === 'ABSENT'
			? (v.detail ?? '')
			: `${v.unbacked.length} unbacked of ${v.checked} checked`,
		...v.unbacked.map(
			(u) =>
				`line ${u.line}: ${u.kind} "${u.text}" is in no snapshot and carries no UNCONFIRMED marker`
		),
	]);
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
