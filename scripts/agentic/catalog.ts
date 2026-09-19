/**
 * The tool catalog the orchestrator plans with (agentic v3.3) — GENERATED, never hand-written.
 *
 *   bun scripts/agentic/catalog.ts [--json]      → _private/agentic-v2/catalog.json
 *
 * agents   from every .claude/agents/*.md frontmatter: name, description, model, maxTurns,
 *          tools, the JSON shape under "## Output" (first fenced json block after it), and the
 *          ledger paths the body mentions (R/…, C/…, RD/…)
 * scripts  from every scripts/agentic/*.ts header comment: the usage lines and the first line
 * workflow the stages of the docs-explore Workflow script (meta.phases) with their agents
 * limits   LIMITS from lib.ts — what the planner may ask for, verbatim
 * queue.ts regenerates it at the start of every run, so the planner never plans against a
 * stale picture of the pipeline.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	BACKLOG_TARGETS,
	DECISIONS,
	LIMITS,
	parseArgs,
	ROOT,
	SUBTASK_KINDS,
	V2_DIR,
	writeJson,
} from './lib';

export const CATALOG_FILE = join(V2_DIR, 'catalog.json');

export function buildCatalog() {
	const agentsDir = join(ROOT, '.claude/agents');
	const agents = readdirSync(agentsDir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => {
			const text = readFileSync(join(agentsDir, f), 'utf8');
			const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
			const get = (k: string) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? '';
			const body = text.slice((text.match(/^---\n[\s\S]*?\n---\n?/)?.[0] ?? '').length);
			const outIdx = body.search(/^## Output/m);
			let output: any = null;
			if (outIdx >= 0) {
				const fence = body.slice(outIdx).match(/```json\n([\s\S]*?)```/);
				if (fence) {
					try {
						output = JSON.parse(fence[1].replace(/\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1'));
					} catch {
						output = { raw: fence[1].slice(0, 400) };
					}
				}
			}
			const paths = [
				...new Set([...body.matchAll(/`((?:R|C|RD)\/[A-Za-z0-9_<>./*-]+)`/g)].map((m) => m[1])),
			];
			return {
				name: get('name') || f.replace(/\.md$/, ''),
				description: get('description').slice(0, 400),
				model: get('model') || 'inherit',
				maxTurns: Number(get('maxTurns')) || null,
				tools: get('tools')
					.split(/,\s*(?![^()]*\))/)
					.map((t) => t.trim())
					.filter(Boolean),
				outputShape: output ? Object.keys(output) : [],
				ledgerPaths: paths.slice(0, 20),
			};
		});
	const scriptsDir = join(ROOT, 'scripts/agentic');
	const scripts = readdirSync(scriptsDir)
		.filter((f) => f.endsWith('.ts') && f !== 'lib.ts')
		.map((f) => {
			const text = readFileSync(join(scriptsDir, f), 'utf8');
			const header = text.match(/^\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';
			const lines = header.split('\n').map((l) => l.replace(/^\s*\*\s?/, ''));
			const usage = lines.filter((l) => /^\s*bun scripts\/agentic\//.test(l)).map((l) => l.trim());
			return {
				file: `scripts/agentic/${f}`,
				purpose: (lines.find((l) => l.trim()) ?? '').trim().slice(0, 200),
				usage,
			};
		});
	// The Workflow's stages, from the docs-explore script's meta.phases (parsed as text).
	const skill = join(ROOT, '.claude/skills/docs-explore/SKILL.md');
	const phases: { title: string; detail: string }[] = [];
	if (existsSync(skill)) {
		const js = readFileSync(skill, 'utf8').match(/```js\n([\s\S]*?)```/)?.[1] ?? '';
		for (const m of js.matchAll(/\{\s*title:\s*'([^']+)',\s*detail:\s*'([^']+)'\s*\}/g))
			phases.push({ title: m[1], detail: m[2] });
		for (const m of js.matchAll(/\{\s*title:\s*'([^']+)',\s*detail:\s*\n?\s*'([^']+)',?\s*\}/g))
			if (!phases.some((p) => p.title === m[1])) phases.push({ title: m[1], detail: m[2] });
	}
	return {
		generatedAt: new Date().toISOString(),
		agents,
		scripts,
		workflow: {
			skill: relative(ROOT, skill),
			stages: phases,
			decisions: DECISIONS,
			subtaskKinds: SUBTASK_KINDS,
			backlogTargets: BACKLOG_TARGETS,
			modes: ['explore', 'capture-only', 'write-only'],
		},
		limits: LIMITS,
	};
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const c = buildCatalog();
	writeJson(CATALOG_FILE, c);
	if (args.flags.has('json'))
		console.log(
			JSON.stringify({
				file: relative(ROOT, CATALOG_FILE),
				agents: c.agents.length,
				scripts: c.scripts.length,
				stages: c.workflow.stages.length,
			})
		);
	else {
		console.log(
			`${relative(ROOT, CATALOG_FILE)}: ${c.agents.length} agents, ${c.scripts.length} scripts, ${c.workflow.stages.length} stages`
		);
		for (const a of c.agents)
			console.log(
				`  ${a.name.padEnd(14)} ${a.model.padEnd(8)} turns=${String(a.maxTurns ?? '-').padEnd(4)} tools=${a.tools.length}  out=[${a.outputShape.slice(0, 6).join(', ')}]`
			);
	}
}
