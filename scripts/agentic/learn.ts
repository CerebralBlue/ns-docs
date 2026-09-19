/**
 * Last stage of /docs-explore: harvest what an area run learned into the conventions file the
 * next run's agents read first. This is the only "memory" the pipeline has — agents themselves
 * start blank every time.
 *
 *   bun scripts/agentic/learn.ts <run-id> [--json]
 *
 * Only STRUCTURED fields are harvested, verbatim, with their source named — an agent never
 * free-writes into shared memory (a hallucination there becomes an instruction for every
 * future run). Sources:
 *   explore.json     → notes, skipped[] (what could not be opened and why)
 *   understand.json  → notes, questions[]
 *   runner.json      → notes, failed probes (reason)
 *   map result       → areas that changed (added/removed controls), from map-diff's diff files
 *   denials.log      → the reason text of each denial (what agents keep trying that is refused)
 *   config.json      → absent → "config export unavailable this run"
 * Lines already present in conventions.md are not repeated. The file keeps a dated block per
 * run; a human prunes it — the header says so.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { captureDir, COMPONENT_MAP_DIR, parseArgs, readJson, ROOT, runDir, V2_DIR } from './lib';

const args = parseArgs(process.argv.slice(2));
const runId = args.positional[0];
if (!runId) {
	console.error('Usage: bun scripts/agentic/learn.ts <run-id> [--json]');
	process.exit(1);
}
const dir = runDir(runId);
const queue = readJson(join(dir, 'area.json'));
if (!queue) {
	console.error(`no run ${runId}`);
	process.exit(1);
}
const FILE = join(V2_DIR, 'conventions.md');
const HEADER = `# Conventions the pipeline learned (read first by explorer, understand, runner, writer, consistency)

Harvested by \`scripts/agentic/learn.ts\` from each run's structured notes — never free text from
an agent. One dated block per run. Prune by hand when a line stops being true; keep it short,
it is prepended to five prompts.
`;
const existing = existsSync(FILE) ? readFileSync(FILE, 'utf8') : HEADER;
const known = new Set(
	existing
		.split('\n')
		.map((l) => l.replace(/^- /, '').trim())
		.filter(Boolean)
);

const lines: string[] = [];
const add = (source: string, text: string) => {
	let t = String(text ?? '')
		.replace(/\s+/g, ' ')
		.trim();
	// "same as c10" and friends carry nothing for the next run; long notes are cut, not kept.
	if (!t || /^same as c\d+/i.test(t)) return;
	if (t.length > 240) t = t.slice(0, 237).replace(/\s+\S*$/, '') + '…';
	const line = `${t} _(${source})_`;
	if (!known.has(line)) {
		known.add(line);
		lines.push(`- ${line}`);
	}
};

const explore = readJson(join(dir, 'explore.json'));
const exploreSummary = readJson(join(captureDir(runId), 'explore-summary.json'));
const plan = readJson(join(captureDir(runId), 'coverage-plan.json'));
const understand = readJson(join(dir, 'understand.json'));
const runner = readJson(join(dir, 'runner.json'));
if (explore?.notes) add(`explorer, ${queue.area}`, explore.notes);
for (const s of explore?.skipped ?? [])
	add(`explorer skipped, ${queue.area}`, typeof s === 'string' ? s : `${s.id}: ${s.why}`);
for (const e of exploreSummary?.excluded ?? [])
	add(`explorer excluded by policy, ${queue.area}`, String(e));
if (understand?.notes) add(`understand, ${queue.area}`, understand.notes);
for (const c of plan?.conflicts ?? [])
	add(`coverage conflict, ${queue.area}`, `"${c.label}" claimed by ${c.kept} and ${c.dropped}`);
for (const r of plan?.notInCapture ?? []) add(`not in capture, ${queue.area}`, r);

if (runner?.notes) add(`runner, ${queue.area}`, runner.notes);
for (const r of runner?.results ?? [])
	if (r.result === 'failed' && r.why) add(`probe failed, ${queue.area}`, `${r.id}: ${r.why}`);

// Map changes: the diff files map-diff.ts wrote during this run.
const cand = join(COMPONENT_MAP_DIR, '.candidates');
if (existsSync(cand)) {
	for (const f of readdirSync(cand).filter((f) => f.endsWith('.diff.json'))) {
		const d = readJson(join(cand, f));
		if (!d || d.status === 'unchanged' || !d.candidateAt || d.candidateAt < queue.createdAt)
			continue;
		add(
			`map ${d.area}`,
			`${d.status}: +${d.added.length} −${d.removed.length}${d.added.length ? ` added ${d.added.slice(0, 5).join('; ')}` : ''}`
		);
	}
}

// Hook denials and script refusals are pipeline defects (fixed in code), not facts about the
// product — they stay in denials.log and the report, never in the agents' memory. Questions
// for Fabio go to backlog.json now, not here.
if (!existsSync(join(dir, 'section/config.json')))
	add('config-export', 'config export unavailable this run — no restore point');

let out = existing;
if (lines.length)
	out =
		existing.trimEnd() +
		`\n\n## ${queue.createdAt.slice(0, 10)} · run ${runId} · ${queue.area}\n\n${lines.join('\n')}\n`;
// Prune: an area's dated blocks older than its newest one are exhaust — the newest capture
// re-learned whatever still held. Standing blocks (no run id in the heading) always stay.
{
	const parts = out.split(/\n(?=## )/);
	const head = parts.shift() ?? '';
	const dated = parts.map((p) => ({
		p,
		m: p.match(/^## (\d{4}-\d{2}-\d{2}) · run (\S+) · (\S+)/),
	}));
	const newestByArea = new Map<string, string>();
	for (const d of dated) if (d.m) newestByArea.set(d.m[3], d.m[2]);
	out = [
		head,
		...dated.filter((d) => !d.m || newestByArea.get(d.m[3]) === d.m[2]).map((d) => d.p),
	].join('\n');
}
writeFileSync(FILE, out);
if (args.flags.has('json'))
	console.log(JSON.stringify({ learned: lines.length, file: relative(ROOT, FILE) }));
else {
	console.log(`learned ${lines.length} new line(s) → ${relative(ROOT, FILE)}`);
	for (const l of lines) console.log(`  ${l}`);
}
