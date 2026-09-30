/**
 * Unbacked values on a written page (agentic v3.2) — evidence for the reviewer, a warning gate.
 *
 *   bun scripts/agentic/values.ts <run-id> <route> [--json]
 *
 * Every **bold label** and every `code value` on the page that (a) appears in NO snapshot of the
 * evidence corpus (states/*.yml — case-insensitive, `&` ≡ `and`, whitespace collapsed), (b) is
 * not a captured option value (states.json[].options[].values), (c) is not quoted in a probe
 * answer (answers.md, probes/*.run.json), and (d) has no `<!-- UNCONFIRMED -->` marker within
 * 2 lines above it. The corpus (2026-09-30) is the run's capture PLUS the latest capture
 * (captures.json) of every area in the route's `console` and every area whose `/img/<area>/`
 * images the page embeds — a page citing another screen's labels is backed by that screen.
 * Spans are matched over whole paragraphs, so a bold/code span wrapped across a line break is
 * read as one span, and a stray `**` on one line cannot pair with the next line's. Prints { unbacked: [{line, text}] }.
 * The reviewer must rule on each: from the image (the a11y tree missed it), from the old prose
 * (mark it), or invented (remove it). Code spans that look like paths, URLs, JSON keys or
 * numbers are skipped — they are not screen labels.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { captureDir, DOCS_DIR, MAP_PATH, parseArgs, readJson, RUNS_DIR, V2_DIR } from './lib';

export type Unbacked = { line: number; text: string; kind: 'bold' | 'code' };
export function unbackedValues(
	runId: string,
	route: string
): { status: 'PASS' | 'WARN' | 'ABSENT'; unbacked: Unbacked[]; checked: number; detail?: string } {
	const C = captureDir(runId);
	const statesDir = join(C, 'states');
	const pagePath = join(DOCS_DIR, `${route}.md`);
	if (!existsSync(statesDir))
		return { status: 'ABSENT', unbacked: [], checked: 0, detail: 'no states/ in the capture' };
	if (!existsSync(pagePath))
		return { status: 'ABSENT', unbacked: [], checked: 0, detail: 'page missing' };
	const norm = (s: string) =>
		s
			.toLowerCase()
			.replace(/&/g, ' and ')
			.replace(/[^a-z0-9]+/g, ' ')
			.trim();
	const raw = readFileSync(pagePath, 'utf8');
	// The evidence corpus: this capture + the latest capture of every related area.
	const captures =
		readJson<Record<string, { runId?: string }>>(join(V2_DIR, 'captures.json')) ?? {};
	const map = readJson<{ routes: Record<string, any> }>(MAP_PATH);
	const areas = new Set<string>(map?.routes?.[route]?.console ?? []);
	for (const m of raw.matchAll(/\/img\/([a-z0-9:-]+)\//g)) areas.add(m[1]);
	const dirs = new Set<string>([C]);
	for (const a of areas) {
		const id = captures[a]?.runId;
		if (id && existsSync(join(RUNS_DIR, id))) dirs.add(join(RUNS_DIR, id));
	}
	const runDir = join(RUNS_DIR, runId);
	let corpus = '';
	for (const d of dirs) {
		const sd = join(d, 'states');
		if (existsSync(sd))
			for (const f of readdirSync(sd))
				if (f.endsWith('.yml')) corpus += ' ' + readFileSync(join(sd, f), 'utf8');
		const states = readJson<Record<string, any>>(join(d, 'states.json')) ?? {};
		for (const st of Object.values(states))
			for (const o of Object.values((st as any).options ?? {}))
				corpus += ' ' + ((o as any).values ?? []).join(' ');
	}
	// Probe answers: what the product returned is evidence too.
	for (const d of new Set([runDir, C])) {
		if (existsSync(join(d, 'answers.md')))
			corpus += ' ' + readFileSync(join(d, 'answers.md'), 'utf8');
		const pd = join(d, 'probes');
		if (existsSync(pd))
			for (const f of readdirSync(pd))
				if (f.endsWith('.json')) corpus += ' ' + readFileSync(join(pd, f), 'utf8');
	}
	const haystack = norm(corpus);
	const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
	const offset =
		raw.length === body.length ? 0 : raw.slice(0, raw.length - body.length).split('\n').length - 1;
	const lines = body.split('\n');
	// Blank out fences and headings (keeping line count), then match spans over the whole text so
	// a span wrapped across one line break is one span; a blank line ends any span.
	let inFence = false;
	const text = lines
		.map((line) => {
			if (/^\s*(`{3,}|~{3,})/.test(line)) {
				inFence = !inFence;
				return '';
			}
			return inFence || /^#{1,6}\s/.test(line) ? '' : line;
		})
		.join('\n');
	const lineOf = (idx: number) => text.slice(0, idx).split('\n').length - 1;
	const unbacked: Unbacked[] = [];
	let checked = 0;
	const found: { text: string; kind: 'bold' | 'code'; i: number }[] = [];
	for (const m of text.matchAll(/\*\*((?:[^*\n]|\n(?!\s*\n)){2,80}?)\*\*/g))
		found.push({ text: m[1].replace(/\s+/g, ' ').trim(), kind: 'bold', i: lineOf(m.index!) });
	for (const m of text.matchAll(/`((?:[^`\n]|\n(?!\s*\n)){2,60}?)`/g)) {
		const t = m[1].replace(/\s+/g, ' ').trim();
		// paths, urls, json keys, numbers, code-ish tokens are not screen labels
		if (/[\/\\{}\[\]=<>|;]|^https?:|^\d[\d.,%]*$|^[a-z_]+[A-Z]|_\w|\.\w{2,4}$/.test(t)) continue;
		if (t.length < 3 || /^[a-z]+$/.test(t)) continue;
		found.push({ text: t, kind: 'code', i: lineOf(m.index!) });
	}
	for (const f of found) {
		// bold used for emphasis (a sentence, a lead-in) is not a label
		if (f.kind === 'bold' && (f.text.split(/\s+/).length > 6 || /[.!?:]$/.test(f.text))) continue;
		checked++;
		const n = norm(f.text).replace(/^(the|a|an) /, '');
		if (!n || n.length < 3) continue;
		if (haystack.includes(n)) continue;
		// "Default Config / Answer Generation" — a path of labels: every part must be on screen
		const parts = f.text
			.split(/\s*[\/›>→]\s*/)
			.map(norm)
			.filter((x) => x.length >= 3);
		if (parts.length > 1 && parts.every((x) => haystack.includes(x))) continue;
		const marked = lines
			.slice(Math.max(0, f.i - 2), f.i + 1)
			.some((l) => /<!--\s*UNCONFIRMED/.test(l));
		if (marked) continue;
		unbacked.push({ line: offset + f.i + 1, text: f.text, kind: f.kind });
	}
	unbacked.sort((x, y) => x.line - y.line);
	return { status: unbacked.length ? 'WARN' : 'PASS', unbacked, checked };
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const [runId, route] = args.positional;
	if (!runId || !route) {
		console.error('Usage: bun scripts/agentic/values.ts <run-id> <route> [--json]');
		process.exit(1);
	}
	const r = unbackedValues(runId, route);
	if (args.flags.has('json')) console.log(JSON.stringify({ runId, route, ...r }));
	else {
		console.log(
			`${route}  ${r.status}  ${r.unbacked.length} unbacked of ${r.checked} checked${r.detail ? ` — ${r.detail}` : ''}`
		);
		for (const u of r.unbacked) console.log(`  line ${u.line}: ${u.kind} "${u.text}"`);
	}
	process.exit(0);
}
