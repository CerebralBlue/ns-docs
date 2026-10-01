export const meta = {
	name: 'docs-night-consistency',
	description:
		'Cross-page consistency pass over every route written tonight — one bounded fix per page, no commits',
	phases: [
		{ title: 'Neighbours', detail: 'neighbours.ts per route' },
		{ title: 'Compare', detail: 'consistency agent per route' },
		{ title: 'Fix', detail: 'writer (own page only) + gates, only when needs-fix' },
	],
};
const A = (prompt, opts) =>
	agent(prompt, opts).catch((e) => {
		log(
			`agent failed (${(opts && opts.label) || '?'}): ${String(e && e.message ? e.message : e).slice(0, 160)}`
		);
		return null;
	});
const REPO = args.repo;
const NIGHT = args.nightId;
const CD = (r) => `${REPO}/_private/agentic-v2/night/${NIGHT}/consistency/${r.replace(/\//g, '-')}`;
const RD = (r) => `${REPO}/_private/agentic-v2/runs/${args.runIds[r]}/${r.replace(/\//g, '-')}`;
const CAP = (r) =>
	`${REPO}/_private/agentic-v2/runs/${(args.captureRuns && args.captureRuns[r]) || args.runIds[r]}`;

// Script calls: code moves data, LLMs move pointers — the same receipt contract as
// .claude/skills/docs-explore/workflow.js (see scripts/agentic/call.ts). Keep the two copies of
// fnv1a/canonical identical; scripts/agentic/call.test.ts checks both against call.ts.
const fnv1a = (s) => {
	let h = 0x811c9dc5;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h.toString(16).padStart(8, '0');
};
const canonical = (v) =>
	Array.isArray(v)
		? `[${v.map(canonical).join(',')}]`
		: v && typeof v === 'object'
			? `{${Object.keys(v)
					.sort()
					.map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`)
					.join(',')}}`
			: JSON.stringify(v === undefined ? null : v);
const RECEIPT = {
	type: 'object',
	properties: {
		ok: { type: 'boolean' },
		exit: { type: 'number' },
		ref: { type: ['string', 'null'] },
		bytes: { type: 'number' },
		sha: { type: 'string' },
		summary: { type: 'object' },
		summarySha: { type: 'string' },
	},
	required: ['ok', 'exit', 'ref', 'bytes', 'sha', 'summary', 'summarySha'],
	additionalProperties: false,
};
class IntegrityError extends Error {}
const LEDGER = `night-${NIGHT}`; // call.ts writes the full outputs to runs/<LEDGER>/io/
const run = async (label, phase, kind, cmd) => {
	const line = `bun scripts/agentic/call.ts ${LEDGER} ${label.replace(/[^A-Za-z0-9._:-]+/g, '_')} --as ${kind} -- ${cmd}`;
	for (let attempt = 1; attempt <= 2; attempt++) {
		const r = await A(
			`From ${REPO}, run exactly this one command with the Bash tool and nothing else:\n\n${line}\n\nIt prints one line of JSON (a receipt). Return that JSON object exactly as printed — same fields, same values, no wrapping, no edits.`,
			{
				label: attempt > 1 ? `${label}:again` : label,
				phase,
				schema: RECEIPT,
				model: 'haiku',
				effort: 'low',
				agentType: 'general-purpose',
			}
		);
		if (r && fnv1a(canonical(r.summary)) === r.summarySha)
			return { ok: r.ok, ref: r.ref, json: r.summary };
		log(
			`integrity: ${label} — ${r ? 'summarySha mismatch' : 'no receipt'}${attempt === 1 ? ' — retrying' : ''}`
		);
	}
	throw new IntegrityError(label);
};
const CONSISTENCY = {
	type: 'object',
	properties: {
		route: { type: 'string' },
		contradictions: { type: 'array' },
		duplicates: { type: 'array' },
		missing_links: { type: 'array' },
		sidebar: { type: 'array' },
		verdict: { type: 'string', enum: ['consistent', 'needs-fix'] },
	},
	required: ['route', 'verdict'],
};
const WRITE = {
	type: 'object',
	properties: {
		route: { type: 'string' },
		edits: { type: 'array' },
		left_unresolved: { type: 'array' },
		asks: { type: 'array' },
		lint: { type: 'string' },
	},
	required: ['route', 'edits'],
};

try {
	const results = await pipeline(
		args.routes,
		(r) =>
			run(
				`neighbours:${r}`,
				'Neighbours',
				'none',
				`bun scripts/agentic/neighbours.ts ${r} --night ${NIGHT} --json`
			),
		(n, r) =>
			n && n.ok
				? A(
						`nightId: ${NIGHT}. route: ${r}. Compare this page with its neighbours per your instructions and write ${CD(r)}/consistency.json.`,
						{
							agentType: 'consistency',
							label: `compare:${r}`,
							phase: 'Compare',
							schema: CONSISTENCY,
						}
					)
				: null,
		async (c, r) => {
			if (!c) return null;
			if (c.verdict !== 'needs-fix') return { route: r, verdict: c.verdict, fixed: false };
			if (!args.runIds[r]) {
				log(`${r}: needs-fix but no run to write against — skipped`);
				return { route: r, verdict: c.verdict, fixed: false };
			}
			const w = await A(
				`runId: ${args.runIds[r]}. route: ${r}. Capture folder C: ${CAP(r)}. Apply the consistency fixes in ${CD(r)}/consistency.json to your page only, per your instructions, and update ${RD(r)}/write.json.`,
				{ agentType: 'writer', label: `fix:${r}`, phase: 'Fix', schema: WRITE }
			);
			const g = w
				? await run(
						`gates:${r}`,
						'Fix',
						'gates',
						`bun scripts/agentic/gates.ts ${args.runIds[r]} ${r} --json`
					)
				: null;
			return { route: r, verdict: c.verdict, fixed: !!w, gatesOk: !!(g && g.json.ok) };
		}
	);
	const fixed = results
		.filter(Boolean)
		.filter((x) => x.fixed)
		.map((x) => x.route);
	log(`consistency: ${results.filter(Boolean).length} compared, ${fixed.length} fixed`);
	return {
		nightId: NIGHT,
		compared: results.filter(Boolean).length,
		fixed,
		results: results.filter(Boolean),
	};
} catch (e) {
	if (e instanceof IntegrityError) {
		log(`HALT (integrity): ${e.message} — a receipt could not be trusted after a retry`);
		return { nightId: NIGHT, integrity: e.message };
	}
	throw e;
}
