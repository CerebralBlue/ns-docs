/**
 * Unbacked values on a written page (agentic v3.2) — evidence for the reviewer, a warning gate.
 *
 *   bun scripts/agentic/values.ts <run-id> <route> [--json]
 *
 * Every **bold label** and every `code value` on the page that (a) appears in NO snapshot of the
 * run's capture (states/*.yml — case-insensitive, `&` ≡ `and`, whitespace collapsed), (b) is
 * not a captured option value (states.json[].options[].values), and (c) has no
 * `<!-- UNCONFIRMED -->` marker within 2 lines above it. Prints { unbacked: [{line, text}] }.
 * The reviewer must rule on each: from the image (the a11y tree missed it), from the old prose
 * (mark it), or invented (remove it). Code spans that look like paths, URLs, JSON keys or
 * numbers are skipped — they are not screen labels.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { captureDir, DOCS_DIR, parseArgs, readJson } from './lib';

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
	let corpus = '';
	for (const f of readdirSync(statesDir))
		if (f.endsWith('.yml')) corpus += ' ' + readFileSync(join(statesDir, f), 'utf8');
	const states = readJson<Record<string, any>>(join(C, 'states.json')) ?? {};
	for (const st of Object.values(states))
		for (const o of Object.values((st as any).options ?? {}))
			corpus += ' ' + ((o as any).values ?? []).join(' ');
	const haystack = norm(corpus);
	const raw = readFileSync(pagePath, 'utf8');
	const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
	const offset =
		raw.length === body.length ? 0 : raw.slice(0, raw.length - body.length).split('\n').length - 1;
	const lines = body.split('\n');
	const unbacked: Unbacked[] = [];
	let checked = 0;
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (/^\s*(`{3,}|~{3,})/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence || /^#{1,6}\s/.test(line)) continue;
		const marked = lines.slice(Math.max(0, i - 2), i + 1).some((l) => /<!--\s*UNCONFIRMED/.test(l));
		const found: { text: string; kind: 'bold' | 'code' }[] = [];
		for (const m of line.matchAll(/\*\*([^*\n]{2,80})\*\*/g))
			found.push({ text: m[1].trim(), kind: 'bold' });
		for (const m of line.matchAll(/`([^`\n]{2,60})`/g)) {
			const t = m[1].trim();
			// paths, urls, json keys, numbers, code-ish tokens are not screen labels
			if (/[\/\\{}\[\]=<>|;]|^https?:|^\d[\d.,%]*$|^[a-z_]+[A-Z]|_\w|\.\w{2,4}$/.test(t)) continue;
			if (t.length < 3 || /^[a-z]+$/.test(t)) continue;
			found.push({ text: t, kind: 'code' });
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
			if (marked) continue;
			unbacked.push({ line: offset + i + 1, text: f.text, kind: f.kind });
		}
	}
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
