/**
 * Last stage of /docs-verify: harvest what a run learned into the conventions file the next
 * run's agents read first. This is the only "memory" the pipeline has — agents themselves
 * start blank every time.
 *
 *   bun scripts/agentic/learn.ts <run-id> [--json]
 *
 * Only STRUCTURED fields are harvested, verbatim, with their source named — an agent never
 * free-writes into shared memory (a hallucination there becomes an instruction for every
 * future run). Sources:
 *   verdicts.json → notes, map_gaps[], unverifiable reasons (counted)
 *   runner.json   → notes
 *   map result    → areas that changed (added/removed controls), from map-diff's diff files
 *   denials.log   → the reason text of each denial (what agents keep trying that is refused)
 *   config.json   → absent → "config export unavailable this run"
 * Lines already present in conventions.md are not repeated. The file keeps a dated block per
 * run; a human prunes it — the header says so.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { COMPONENT_MAP_DIR, parseArgs, readJson, ROOT, runDir, V2_DIR } from './lib';

const args = parseArgs(process.argv.slice(2));
const runId = args.positional[0];
if (!runId) {
	console.error('Usage: bun scripts/agentic/learn.ts <run-id> [--json]');
	process.exit(1);
}
const dir = runDir(runId);
const queue = readJson(join(dir, 'section/queue.json'));
if (!queue) {
	console.error(`no run ${runId}`);
	process.exit(1);
}
const FILE = join(V2_DIR, 'conventions.md');
const HEADER = `# Conventions the pipeline learned (read first by map-agent, verifier, runner, docs-agent, writer)

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
	const t = String(text ?? '')
		.replace(/\s+/g, ' ')
		.trim();
	if (!t) return;
	const line = `${t} _(${source})_`;
	if (!known.has(line)) {
		known.add(line);
		lines.push(`- ${line}`);
	}
};

const routes: string[] = queue.routes.map((r: any) => r.route);
const reasons = new Map<string, number>();
for (const r of routes) {
	const rd = join(dir, r.replace(/\//g, '-'));
	const ver = readJson(join(rd, 'verdicts.json'));
	const runner = readJson(join(rd, 'runner.json'));
	if (ver?.notes) add(`verifier, ${r}`, ver.notes);
	for (const g of ver?.map_gaps ?? [])
		add(
			`verifier map gap, ${r}`,
			typeof g === 'string' ? g : `${g.area ?? ''}: ${g.what ?? JSON.stringify(g)}`
		);
	for (const v of [...(ver?.verdicts ?? []), ...(runner?.verdicts ?? [])]) {
		if (v.verdict === 'unverifiable' && v.reason)
			reasons.set(v.reason, (reasons.get(v.reason) ?? 0) + 1);
	}
	if (runner?.notes) add(`runner, ${r}`, runner.notes);
}
for (const [reason, n] of reasons) add('unverifiable reason', `${reason}${n > 1 ? ` ×${n}` : ''}`);

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

const denials = existsSync(join(dir, 'denials.log'))
	? readFileSync(join(dir, 'denials.log'), 'utf8').trim().split('\n').filter(Boolean)
	: [];
const seenDenial = new Set<string>();
for (const l of denials) {
	const [, agent, tool, reason] = l.split('\t');
	const key = `${agent}|${tool}|${(reason ?? '').slice(0, 60)}`;
	if (seenDenial.has(key)) continue;
	seenDenial.add(key);
	add(
		`hook denied ${agent}`,
		`${tool.replace(/^mcp__neuralseek-(ui|node)__/, '')}: ${(reason ?? '').replace(/\(got '.*'\)/, '').trim()}`
	);
}
if (!existsSync(join(dir, 'section/config.json')))
	add(
		'config-export',
		'config export unavailable this run (backup_instance failed or was not run) — config tier ABSENT'
	);

let out = existing;
if (lines.length)
	out =
		existing.trimEnd() +
		`\n\n## ${queue.createdAt.slice(0, 10)} · run ${runId} · ${queue.prefix}\n\n${lines.join('\n')}\n`;
writeFileSync(FILE, out);
if (args.flags.has('json'))
	console.log(JSON.stringify({ learned: lines.length, file: relative(ROOT, FILE) }));
else {
	console.log(`learned ${lines.length} new line(s) → ${relative(ROOT, FILE)}`);
	for (const l of lines) console.log(`  ${l}`);
}
