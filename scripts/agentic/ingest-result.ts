/**
 * After a /docs-explore Workflow finishes: write the data that only the workflow held — agent
 * return values, the partial/integrity ledger, subtask results — into the run folder, by code
 * (2026-10-01). The workflow cannot write files, and having an LLM wrapper retype JSON into a file
 * is exactly what lost 25 routes; so the workflow RETURNS it and this script extracts it from the
 * result the runtime saved.
 *
 *   bun scripts/agentic/ingest-result.ts <run> <task-output-file> [--json]
 *
 * The task output file is the JSON the Workflow tool's completion notification points at
 * (`<output-file>`): {summary, logs, result, …}. From `result.artifacts` it writes, only where the
 * producing agent did not already write the file itself:
 *   plan → plan.json · explore → explore.json · understood → understand.json · probed →
 *   runner.json · ia → ia.json · subtasksProposed.subtasks → subtasks.json
 * and always: failures → agent-failures.json · subtaskResults → subtasks.results.json ·
 * the whole result → workflow-result.json · logs → run.log (appended). Then re-runs report.ts.
 */
import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs, ROOT, runDir } from './lib';

const args = parseArgs(process.argv.slice(2));
const [runId, outFile] = args.positional;
if (!runId || !outFile || !existsSync(outFile)) {
	console.error('Usage: ingest-result.ts <run> <task-output-file> [--json]');
	process.exit(1);
}
const R = runDir(runId);
const out = JSON.parse(readFileSync(outFile, 'utf8'));
const result = out.result ?? {};
if (result.runId && result.runId !== runId) {
	console.error(`the output file is for run ${result.runId}, not ${runId}`);
	process.exit(1);
}
const a = result.artifacts ?? {};
const written: string[] = [];
const kept: string[] = [];
const put = (file: string, data: unknown, always = false) => {
	if (data === undefined || data === null) return;
	const p = join(R, file);
	if (!always && existsSync(p)) {
		kept.push(file); // the agent wrote it itself — its own file wins
		return;
	}
	writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
	written.push(file);
};
put('plan.json', a.plan);
put('explore.json', a.explore);
put('understand.json', a.understood);
put('runner.json', a.probed);
put('ia.json', a.ia);
put('subtasks.json', a.subtasksProposed && a.subtasksProposed.subtasks);
put('agent-failures.json', a.failures ?? [], true);
put('subtasks.results.json', a.subtaskResults ?? [], true);
put('workflow-result.json', result, true);
if (Array.isArray(out.logs) && out.logs.length) {
	appendFileSync(
		join(R, 'run.log'),
		out.logs.map((l: string) => `workflow\t${l}`).join('\n') + '\n'
	);
	written.push('run.log (appended)');
}
const rep = spawnSync('bun', ['scripts/agentic/report.ts', runId, '--json'], {
	cwd: ROOT,
	encoding: 'utf8',
});
const summary = {
	runId,
	written,
	kept,
	integrity: result.integrity ?? null,
	partial: (a.failures ?? []).length,
	report: rep.status === 0 ? 'regenerated' : `report.ts exited ${rep.status}`,
};
console.log(
	args.flags.has('json')
		? JSON.stringify(summary)
		: `${runId}: wrote ${written.join(', ') || 'nothing'}; kept ${kept.join(', ') || 'none'}; ${summary.partial} partial agent(s)${summary.integrity ? `; INTEGRITY HALT ${JSON.stringify(summary.integrity)}` : ''}; report ${summary.report}`
);
