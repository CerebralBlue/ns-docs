/**
 * The coverage check for one written route (agentic v3): does the page name every control the
 * understand step assigned to it? Deterministic — a label grep over the page text, the same
 * check gates.ts runs, exposed so the writer can iterate on it before the gate.
 *
 *   bun scripts/agentic/coverage.ts <run-id> <route> [--outline] [--json]
 *       --outline checks runs/<id>/<route>/outline.md (the writer's plan) instead of the page
 *
 * Reads the run's CAPTURE's coverage-plan.json ({ "<route>": [labels…], unowned, shared }) — a
 * write-only run points at an earlier explore run via area.json.captureRun — and the page.
 * A label counts as covered when the page contains it (case-insensitive, whitespace-collapsed,
 * `&` and `and` interchangeable) outside code fences and HTML comments. Prints
 * { total, covered, missing[], percent }. ABSENT (no plan or no page) is reported, not an error.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { captureDir, DOCS_DIR, parseArgs, readJson, routeDir } from './lib';

export type Coverage = {
	status: 'PASS' | 'FAIL' | 'ABSENT';
	total: number;
	covered: number;
	missing: string[];
	percent: number;
	detail?: string;
};
export function coverageOf(
	runId: string,
	route: string,
	threshold = 90,
	outline = false
): Coverage {
	const plan = readJson<Record<string, any>>(join(captureDir(runId), 'coverage-plan.json'));
	const pagePath = outline
		? join(routeDir(runId, route), 'outline.md')
		: join(DOCS_DIR, `${route}.md`);
	if (!plan)
		return {
			status: 'ABSENT',
			total: 0,
			covered: 0,
			missing: [],
			percent: 0,
			detail: 'coverage-plan.json missing',
		};
	if (!existsSync(pagePath))
		return {
			status: 'ABSENT',
			total: 0,
			covered: 0,
			missing: [],
			percent: 0,
			detail: outline ? 'outline.md missing' : 'page missing',
		};
	const labels: string[] = Array.isArray(plan[route]) ? plan[route] : [];
	if (!labels.length)
		return {
			status: 'PASS',
			total: 0,
			covered: 0,
			missing: [],
			percent: 100,
			detail: 'no controls assigned',
		};
	const norm = (s: string) =>
		s
			.toLowerCase()
			.replace(/&/g, ' and ')
			.replace(/[^a-z0-9]+/g, ' ')
			.trim();
	const raw = readFileSync(pagePath, 'utf8')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/^\s*(`{3,}|~{3,})[\s\S]*?^\s*\1\s*$/gm, ' ');
	const text = norm(raw);
	const missing = labels.filter((l) => !text.includes(norm(l)));
	const covered = labels.length - missing.length;
	const percent = Math.round((covered / labels.length) * 100);
	return {
		status: percent >= threshold ? 'PASS' : 'FAIL',
		total: labels.length,
		covered,
		missing,
		percent,
	};
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const [runId, route] = args.positional;
	if (!runId || !route) {
		console.error('Usage: bun scripts/agentic/coverage.ts <run-id> <route> [--json]');
		process.exit(1);
	}
	const c = coverageOf(runId, route, 90, args.flags.has('outline'));
	if (args.flags.has('json'))
		console.log(JSON.stringify({ runId, route, outline: args.flags.has('outline'), ...c }));
	else {
		console.log(
			`${route}  ${c.status}  ${c.covered}/${c.total} (${c.percent}%)${c.detail ? `  — ${c.detail}` : ''}`
		);
		for (const m of c.missing) console.log(`  missing: ${m}`);
	}
	process.exit(0);
}
