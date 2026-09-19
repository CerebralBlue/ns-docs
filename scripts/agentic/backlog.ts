/**
 * The cross-run feedback loop (agentic v3.3): findings that cannot be fixed on the page they
 * were found on are routed to whoever CAN act on them, instead of dying with the run's report.
 *
 *   bun scripts/agentic/backlog.ts add <run> [<route>]          harvest a run's (or one route's)
 *        non-fixable review findings, reviewer questions and writer left_unresolved that carry a
 *        `needs` → _private/agentic-v2/backlog.json
 *   bun scripts/agentic/backlog.ts list [--target <t>] [--json]  open entries (all, or one target)
 *   bun scripts/agentic/backlog.ts resolve <run> <route>          close the entries the route's
 *        review.json names in `resolvedBacklog[]` (and every open entry of target route:<route>
 *        when the review verdict is `ready`)
 *   bun scripts/agentic/backlog.ts prune                          drop entries closed > 30 days
 *
 * Targets — who acts:
 *   capture:<area>   a screen/state/interaction the next EXPLORER of that area must capture
 *                    (e.g. "Seek tab after a repeated question: the Cached badge")
 *   route:<route>    a topic the next WRITER of that page must cover (e.g. seek/curation must
 *                    say how edited answers feed the Edited answer cache)
 *   probe:<area>     a behaviour the next RUNNER should probe
 *   fabio            a decision only Fabio can make (surfaced in every report)
 * Entries are deduplicated by (target, first 80 chars of `what`). An entry records where it came
 * from (run, route, kind, line) so the report can show it and a later review can close it.
 */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseArgs, readJson, ROOT, routeDir, runDir, sha1, V2_DIR, writeJson } from './lib';

export const BACKLOG_FILE = join(V2_DIR, 'backlog.json');
export type Entry = {
	id: string;
	target: string; // capture:<area> | route:<route> | probe:<area> | fabio
	what: string;
	from: { run: string; route: string; kind: string; line?: number };
	openedAt: string;
	closedAt?: string;
	closedBy?: string;
};
export type Backlog = { entries: Entry[] };
export const loadBacklog = (): Backlog => readJson<Backlog>(BACKLOG_FILE) ?? { entries: [] };
export const openEntries = (b: Backlog, target?: string) =>
	b.entries.filter((e) => !e.closedAt && (!target || e.target === target));

const TARGET = /^(capture|route|probe):[a-z0-9/._-]+$|^fabio$/i;
const normTarget = (needs: any, fallbackRoute: string): string | null => {
	if (!needs) return null;
	if (typeof needs === 'string') return TARGET.test(needs) ? needs.toLowerCase() : null;
	const kind = String(needs.kind ?? '').toLowerCase();
	const target = String(needs.target ?? '').trim();
	if (kind === 'fabio') return 'fabio';
	if (!['capture', 'route', 'probe'].includes(kind)) return null;
	if (!target) return kind === 'route' ? `route:${fallbackRoute}` : null;
	return `${kind}:${target}`;
};

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const verb = args.positional[0];
	const asJson = args.flags.has('json');
	const backlog = loadBacklog();
	const key = (t: string, w: string) => `${t}|${w.trim().toLowerCase().slice(0, 80)}`;
	const known = new Set(backlog.entries.map((e) => key(e.target, e.what)));

	if (verb === 'add') {
		const run = args.positional[1];
		const only = args.positional[2];
		if (!run || !existsSync(runDir(run))) {
			console.error('add needs <run> [<route>]');
			process.exit(1);
		}
		const area = readJson<any>(join(runDir(run), 'area.json'));
		const routes: string[] = only ? [only] : (area?.routes ?? []).map((r: any) => r.route);
		const added: Entry[] = [];
		const push = (
			route: string,
			target: string | null,
			what: string,
			kind: string,
			line?: number
		) => {
			if (!target || !what) return;
			const k = key(target, what);
			if (known.has(k)) return;
			known.add(k);
			const e: Entry = {
				id: sha1(k).slice(0, 10),
				target,
				what: what.trim().replace(/\s+/g, ' ').slice(0, 400),
				from: { run, route, kind, line },
				openedAt: new Date().toISOString(),
			};
			backlog.entries.push(e);
			added.push(e);
		};
		for (const route of routes) {
			const rd = routeDir(run, route);
			const review = readJson<any>(join(rd, 'review.json'));
			for (const f of review?.findings ?? []) {
				if (f?.fixable) continue;
				push(route, normTarget(f.needs, route), f.what, f.kind ?? 'finding', f.line);
			}
			for (const q of review?.questions ?? []) {
				const text = typeof q === 'string' ? q : (q?.what ?? q?.question ?? '');
				push(
					route,
					normTarget(typeof q === 'object' ? q.needs : null, route) ?? 'fabio',
					text,
					'question'
				);
			}
			const write = readJson<any>(join(rd, 'write.json'));
			for (const u of write?.left_unresolved ?? []) {
				const text = typeof u === 'string' ? u : [u?.control, u?.why].filter(Boolean).join(' — ');
				const t = normTarget(typeof u === 'object' ? u.needs : null, route);
				if (t) push(route, t, text, 'left_unresolved');
			}
		}
		writeJson(BACKLOG_FILE, backlog);
		if (asJson)
			console.log(
				JSON.stringify({
					run,
					added: added.length,
					open: openEntries(backlog).length,
					entries: added,
				})
			);
		else {
			console.log(
				`${added.length} new backlog entr${added.length === 1 ? 'y' : 'ies'} (${openEntries(backlog).length} open) → ${relative(ROOT, BACKLOG_FILE)}`
			);
			for (const e of added)
				console.log(`  ${e.id}  ${e.target.padEnd(40)} ${e.what.slice(0, 90)}`);
		}
		process.exit(0);
	}

	if (verb === 'list') {
		const target = args.get('target');
		const open = openEntries(backlog, target);
		if (asJson) console.log(JSON.stringify({ open: open.length, entries: open }));
		else {
			console.log(
				`${open.length} open backlog entr${open.length === 1 ? 'y' : 'ies'}${target ? ` for ${target}` : ''}`
			);
			for (const e of open)
				console.log(
					`  ${e.id}  ${e.target.padEnd(40)} ${e.what.slice(0, 100)}  _(${e.from.route}, ${e.from.run})_`
				);
		}
		process.exit(0);
	}

	if (verb === 'resolve') {
		const run = args.positional[1];
		const route = args.positional[2];
		if (!run || !route) {
			console.error('resolve needs <run> <route>');
			process.exit(1);
		}
		const review = readJson<any>(join(routeDir(run, route), 'review.json'));
		const ids = new Set<string>((review?.resolvedBacklog ?? []).map(String));
		let closed = 0;
		for (const e of backlog.entries) {
			if (e.closedAt) continue;
			const routeReady = e.target === `route:${route}` && review?.verdict === 'ready';
			if (ids.has(e.id) || routeReady) {
				e.closedAt = new Date().toISOString();
				e.closedBy = run;
				closed++;
			}
		}
		writeJson(BACKLOG_FILE, backlog);
		console.log(
			asJson
				? JSON.stringify({ run, route, closed, open: openEntries(backlog).length })
				: `${closed} closed, ${openEntries(backlog).length} open`
		);
		process.exit(0);
	}

	if (verb === 'prune') {
		const cutoff = Date.now() - 30 * 86400000;
		const before = backlog.entries.length;
		backlog.entries = backlog.entries.filter(
			(e) => !e.closedAt || new Date(e.closedAt).getTime() > cutoff
		);
		writeJson(BACKLOG_FILE, backlog);
		console.log(`${before - backlog.entries.length} pruned, ${backlog.entries.length} kept`);
		process.exit(0);
	}
	console.error(
		'Usage: backlog.ts add <run> [<route>] | list [--target t] | resolve <run> <route> | prune'
	);
	process.exit(1);
}
