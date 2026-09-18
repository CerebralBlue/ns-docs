/**
 * Stage 3 of /docs-verify: turn the gather + verify outputs into what the writer and the IA
 * stage read. Deterministic; re-run after IA for routes it added.
 *
 *   bun scripts/agentic/compile.ts <run-id> [--routes-final] [--json]
 *
 * Per route (runs/<id>/<route>/):
 *   evidence.md    the verdict table, observed-but-undocumented controls, open questions,
 *                  config facts — the writer's brief, in prose-ready form
 * Section (runs/<id>/section/):
 *   coverage.json  per route: verdict counts, evidence integrity (every confirmed verdict's
 *                  snapshot exists, its sha1 matches, and its label greps), observed controls
 *                  no claim covers, and the page's h2s — what the IA stage decides on
 * Site-wide (_private/agentic-v2/index.json): route → the run that last compiled it, so a
 * later section can read an earlier section's evidence. That is what feeds the "Related
 * evidence" block in evidence.md: the confirmed/contradicted rows of every route sharing a
 * console area with this one (≤ 6 routes, ≤ 30 rows each) — a page's facts often live on a
 * screen another route owns (seek/caching's thresholds are Neural Config settings).
 *
 * Contracts it reads (written by the agents):
 *   docs.json      { route, claims[{id, kind, text, lines, area?, label?}], questions[],
 *                    stale_suspects[], faq_candidates[], needs_component{flag, what?, why?} }
 *   verdicts.json  { route, halt, navigations, verdicts[{id, verdict, tier, reason?, actual?,
 *                    evidence?{snapshot, sha1, label, label_found, screenshot?}}],
 *                    observed[{area, region, control, note?}], map_gaps[] }
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
	DOCS_DIR,
	loadMap,
	parseArgs,
	readJson,
	ROOT,
	routeDir,
	runDir,
	sha1,
	V2_DIR,
	writeJson,
} from './lib';

const args = parseArgs(process.argv.slice(2));
const runId = args.positional[0];
if (!runId) {
	console.error('Usage: bun scripts/agentic/compile.ts <run-id> [--routes-final] [--json]');
	process.exit(1);
}
const dir = runDir(runId);
const queue = readJson(join(dir, 'section/queue.json'));
if (!queue) {
	console.error(`no queue.json for run ${runId}`);
	process.exit(1);
}
const routesFinal = args.flags.has('routes-final')
	? readJson(join(dir, 'section/routes-final.json'))
	: null;
const routes: string[] = routesFinal
	? routesFinal.routes.map((r: any) => (typeof r === 'string' ? r : r.route))
	: queue.routes.map((r: any) => r.route);
const config = readJson(join(dir, 'section/config.json'));
const { map } = loadMap();
const INDEX = join(V2_DIR, 'index.json');
const index: Record<string, { runId: string; compiledAt: string }> = readJson(INDEX) ?? {};

/** Confirmed + contradicted rows of another route's latest verdicts, for the Related block. */
function relatedRows(other: string): { rows: string[]; runId: string } | null {
	const entry = index[other];
	if (!entry) return null;
	const rd = routeDir(entry.runId, other);
	const docs = readJson(join(rd, 'docs.json'));
	const ver = readJson(join(rd, 'verdicts.json'));
	const runner = readJson(join(rd, 'runner.json'));
	const byId = new Map<string, any>((docs?.claims ?? []).map((c: any) => [c.id, c]));
	const verdicts = [...(ver?.verdicts ?? []), ...(runner?.verdicts ?? [])].filter(
		(v: any) => v.verdict === 'confirmed' || v.verdict === 'contradicted' || v.verdict === 'missing'
	);
	if (!verdicts.length) return null;
	const rows = verdicts.slice(0, 30).map((v: any) => {
		const c = byId.get(v.id);
		const fact = v.verdict === 'confirmed' ? (c?.text ?? '') : (v.actual ?? c?.text ?? '');
		return `| ${other} | ${c?.kind ?? '?'} | **${v.verdict}** | ${String(fact).replace(/\|/g, '\\|').slice(0, 220)} |`;
	});
	return { rows, runId: entry.runId };
}
function relatedRoutes(route: string): string[] {
	const mine = new Set(map.routes[route]?.console ?? []);
	if (!mine.size) return [];
	return Object.entries(map.routes)
		.filter(([r, info]) => r !== route && (info.console ?? []).some((a) => mine.has(a)) && index[r])
		.map(([r, info]) => ({ r, shared: (info.console ?? []).filter((a) => mine.has(a)).length }))
		.sort((a, b) => b.shared - a.shared || a.r.localeCompare(b.r))
		.slice(0, 6)
		.map((x) => x.r);
}

const coverage: Record<string, any> = {};
let compiled = 0;

for (const route of routes) {
	const rd = routeDir(runId, route);
	const docs = readJson(join(rd, 'docs.json'));
	const ver = readJson(join(rd, 'verdicts.json'));
	// The runner (MCP probes) writes its own verdicts; they are merged with the verifier's by id,
	// the runner winning for a claim it settled (a run is stronger evidence than a screen).
	const runner = readJson(join(rd, 'runner.json'));
	if (runner?.verdicts?.length) {
		const byId = new Map<string, any>((ver?.verdicts ?? []).map((v: any) => [v.id, v]));
		for (const v of runner.verdicts)
			if (v.verdict !== 'unverifiable' || !byId.has(v.id)) byId.set(v.id, v);
		if (ver) ver.verdicts = [...byId.values()];
	}
	const merged =
		ver ??
		(runner?.verdicts?.length
			? { route, verdicts: runner.verdicts, observed: [], map_gaps: [] }
			: null);
	const page = join(DOCS_DIR, `${route}.md`);
	const body = existsSync(page) ? readFileSync(page, 'utf8') : '';
	const h2s = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);

	const counts = { confirmed: 0, contradicted: 0, missing: 0, unverifiable: 0 };
	const integrity: string[] = [];
	const byId = new Map<string, any>((docs?.claims ?? []).map((c: any) => [c.id, c]));
	const rows: string[] = [];
	const samples: { id: string; file: string; input: string; text: string }[] = [];
	for (const v of merged?.verdicts ?? []) {
		counts[v.verdict as keyof typeof counts] = (counts[v.verdict as keyof typeof counts] ?? 0) + 1;
		const claim = byId.get(v.id);
		let ev = '';
		if (v.evidence?.run) {
			const runFile = join(rd, v.evidence.run);
			if (!existsSync(runFile)) integrity.push(`${v.id}: run file missing (${v.evidence.run})`);
			else {
				const text = readFileSync(runFile, 'utf8');
				if (v.evidence.sha1 && sha1(text) !== v.evidence.sha1)
					integrity.push(`${v.id}: run file sha1 mismatch`);
				ev = `${v.evidence.run} ✓`;
				samples.push({ id: v.id, file: v.evidence.run, input: v.evidence.input ?? '', text });
			}
		} else if (v.evidence?.snapshot) {
			const snap = join(rd, v.evidence.snapshot);
			if (!existsSync(snap)) integrity.push(`${v.id}: snapshot missing (${v.evidence.snapshot})`);
			else {
				const text = readFileSync(snap, 'utf8');
				if (v.evidence.sha1 && sha1(text) !== v.evidence.sha1)
					integrity.push(`${v.id}: snapshot sha1 mismatch`);
				const found = v.evidence.label ? text.includes(v.evidence.label) : false;
				if (v.verdict === 'confirmed' && claim?.kind === 'ui' && !found)
					integrity.push(
						`${v.id}: label "${v.evidence.label}" not in snapshot — confirmed without evidence`
					);
				ev = `${v.evidence.snapshot}${found ? ' ✓' : ' ✗'}${v.evidence.screenshot ? ` · ${v.evidence.screenshot}` : ''}`;
			}
		} else if (v.verdict === 'confirmed' && claim?.kind === 'ui')
			integrity.push(`${v.id}: confirmed ui claim without a snapshot`);
		rows.push(
			`| ${v.id} | ${claim?.kind ?? '?'} | ${(claim?.text ?? '').replace(/\|/g, '\\|')} (L${claim?.lines?.join('–') ?? '?'}) | **${v.verdict}** | ${v.tier ?? ''} | ${ev} | ${(v.actual ?? v.reason ?? '').replace(/\|/g, '\\|')} |`
		);
	}
	const claimIds = new Set((merged?.verdicts ?? []).map((v: any) => v.id));
	const unverdicted = (docs?.claims ?? []).filter((c: any) => !claimIds.has(c.id));

	// Observed controls that no claim mentions by label.
	const claimText = (docs?.claims ?? [])
		.map((c: any) => `${c.text} ${c.label ?? ''}`)
		.join('\n')
		.toLowerCase();
	const uncovered = (ver?.observed ?? []).filter((o: any) => {
		const label = String(o.control ?? '')
			.replace(/^\w+\s+/, '')
			.toLowerCase();
		return label && !claimText.includes(label);
	});

	const configFacts = config?.keys
		? Object.entries(config.keys).filter(([k]) =>
				(merged?.verdicts ?? []).some((v: any) => v.tier === 'config' && v.config_key === k)
			)
		: [];

	const md = [
		`# ${route} — evidence`,
		'',
		`Run \`${runId}\` · ${docs ? `${docs.claims?.length ?? 0} claims` : 'no docs.json'} · ${merged ? `${merged.verdicts?.length ?? 0} verdicts, ${ver?.navigations ?? '?'} navigations${runner ? `, ${runner.probes ?? '?'} probes` : ''}${ver?.halt ? ` · HALT ${ver.halt}` : ''}` : 'no verdicts'}`,
		'',
		`## Verdicts — confirmed ${counts.confirmed} · contradicted ${counts.contradicted} · missing ${counts.missing} · unverifiable ${counts.unverifiable}`,
		'',
		'| id | kind | claim | verdict | tier | evidence | actual / reason |',
		'|---|---|---|---|---|---|---|',
		...rows,
		...(unverdicted.length
			? [
					'',
					`Not verified (${unverdicted.length}): ${unverdicted.map((c: any) => c.id).join(', ')}`,
				]
			: []),
		...(integrity.length
			? ['', '## Evidence integrity problems', '', ...integrity.map((s) => `- ${s}`)]
			: []),
		'',
		`## Observed on screen, not documented (${uncovered.length})`,
		'',
		...(uncovered.length
			? uncovered.map(
					(o: any) =>
						`- **${o.control}** — ${o.area}${o.region ? ` › ${o.region}` : ''}${o.note ? ` — ${o.note}` : ''}`
				)
			: ['- none']),
		'',
		...(() => {
			const rel = relatedRoutes(route)
				.map((r) => [r, relatedRows(r)] as const)
				.filter(([, x]) => x);
			if (!rel.length) return [];
			return [
				'',
				`## Related evidence — routes sharing a console area (${rel.length})`,
				'',
				'Facts verified for neighbouring pages. Use them; do not contradict them; link to the page that owns the surface instead of re-documenting it.',
				'',
				'| route | kind | verdict | fact |',
				'|---|---|---|---|',
				...rel.flatMap(([, x]) => x!.rows),
			];
		})(),
		'',
		'## Open questions',
		'',
		...[
			...(docs?.questions ?? []),
			...(merged?.verdicts ?? [])
				.filter((v: any) => v.verdict === 'unverifiable')
				.map((v: any) => `${v.id}: ${v.reason ?? 'unverifiable'}`),
		].map((q: string) => `- ${q}`),
		...(docs?.stale_suspects?.length
			? [
					'',
					'## Suspected stale (docs-agent)',
					'',
					...docs.stale_suspects.map(
						(s: any) => `- ${typeof s === 'string' ? s : `${s.claim} — ${s.why}`}`
					),
				]
			: []),
		...(docs?.faq_candidates?.length
			? ['', '## FAQ candidates', '', ...docs.faq_candidates.map((s: string) => `- ${s}`)]
			: []),
		...(configFacts.length
			? [
					'',
					'## Config facts (instance export)',
					'',
					...configFacts.map(([k, v]) => `- \`${k}\` = ${JSON.stringify(v)}`),
				]
			: []),
		...(docs?.needs_component?.flag
			? [
					'',
					`## Needs a page component: ${docs.needs_component.what ?? ''}`,
					'',
					docs.needs_component.why ?? '',
				]
			: []),
		'',
	].join('\n');
	require('node:fs').writeFileSync(join(rd, 'evidence.md'), md);
	if (ver || runner) index[route] = { runId, compiledAt: new Date().toISOString() };
	compiled++;

	coverage[route] = {
		claims: docs?.claims?.length ?? 0,
		verdicts: counts,
		unverdicted: unverdicted.length,
		integrityProblems: integrity,
		observedUncovered: uncovered.map((o: any) => o.control),
		mapGaps: ver?.map_gaps ?? [],
		halt: ver?.halt ?? null,
		needsComponent: !!docs?.needs_component?.flag,
		h2s,
		hasDocs: !!docs,
		hasVerdicts: !!merged,
		probes: runner?.probes ?? 0,
		created: runner?.created ?? [],
		configChanged: runner?.configChanged ?? [],
	};
}

writeJson(join(dir, 'section/coverage.json'), {
	runId,
	compiledAt: new Date().toISOString(),
	routes: coverage,
});
writeJson(INDEX, index);
if (args.flags.has('json'))
	console.log(
		JSON.stringify({
			compiled,
			routes: Object.fromEntries(
				Object.entries(coverage).map(([r, c]: any) => [
					r,
					{
						...c.verdicts,
						integrity: c.integrityProblems.length,
						uncovered: c.observedUncovered.length,
						halt: c.halt,
					},
				])
			),
		})
	);
else {
	for (const [r, c] of Object.entries<any>(coverage)) {
		console.log(
			`  ${r.padEnd(34)} claims ${String(c.claims).padStart(3)}  ✓${c.verdicts.confirmed} ✗${c.verdicts.contradicted} +${c.verdicts.missing} ?${c.verdicts.unverifiable}  uncovered ${c.observedUncovered.length}${c.integrityProblems.length ? `  INTEGRITY ${c.integrityProblems.length}` : ''}${c.halt ? `  HALT ${c.halt}` : ''}${!c.hasDocs ? '  (no docs.json)' : ''}${!c.hasVerdicts ? '  (no verdicts.json)' : ''}`
		);
	}
	console.log(`compiled ${compiled} route(s) → ${relative(ROOT, dir)}/section/coverage.json`);
}
