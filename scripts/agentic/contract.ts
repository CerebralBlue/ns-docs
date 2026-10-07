/**
 * The page contract, per page type (2026-09-30) — the one definition gates.ts, doc-lint.ts and
 * prepare-write.ts share. Replaces the fixed five headings (What is it / Why it matters / When to
 * use it / How it works / FAQ), which read unlike strong public docs and forced invented FAQs.
 *
 * Every type: `title` + `description` frontmatter, an intro paragraph before the first `##` (no
 * heading — the page's first words say what it is and who it is for), no in-body H1, a closing
 * `## Related`. `## FAQ` is optional; when present it has ≥ 2 real questions and sits before
 * Related. The type lives in scripts/migration-map.json (`routes[route].type`).
 *
 *   concept     what a feature is and when to use it     How it works · When to use it
 *   task        doing one job, in numbered steps         one ## per task (with steps) · Verify | Troubleshooting
 *   reference   a settings screen, control by control    Where to find it · Settings
 *   quickstart  first success, start to finish           Before you begin · Step … · Next steps
 *
 * Headings match by keyword (case-insensitive, "contains"), so "How Seek caching works" counts
 * as How it works. Order is enforced only for quickstarts and for FAQ/Related at the end.
 */

export const PAGE_TYPES = ['concept', 'task', 'reference', 'quickstart'] as const;
export type PageType = (typeof PAGE_TYPES)[number];

/** Required h2s per type: each entry is a list of accepted keywords (any one matches). */
export const REQUIRED: Record<PageType, { name: string; any: string[] }[]> = {
	concept: [
		{ name: 'How it works', any: ['how it works', 'how '] },
		{ name: 'When to use it', any: ['when to use'] },
	],
	task: [{ name: 'Verify or Troubleshooting', any: ['verify', 'troubleshoot'] }],
	reference: [
		{ name: 'Where to find it', any: ['where to find'] },
		{ name: 'Settings', any: ['settings'] },
	],
	quickstart: [
		{ name: 'Before you begin', any: ['before you begin'] },
		{ name: 'Step', any: ['step '] },
		{ name: 'Next steps', any: ['next steps'] },
	],
};

/** The h2 under which section images are required (section-image gate). null = any h2. */
export const IMAGE_SECTION: Record<PageType, string | null> = {
	concept: 'how',
	task: null,
	reference: 'settings',
	quickstart: 'step',
};

export const isPageType = (t: unknown): t is PageType =>
	typeof t === 'string' && (PAGE_TYPES as readonly string[]).includes(t);

/**
 * Check a page body (frontmatter stripped) against its type. Returns human-readable problems;
 * an empty list means the page follows the contract.
 */
export function contractProblems(fm: string, body: string, type: PageType): string[] {
	const detail: string[] = [];
	if (!/^title:\s*\S/m.test(fm)) detail.push('frontmatter: no title');
	if (!/^description:\s*\S/m.test(fm)) detail.push('frontmatter: no description');
	const lines = body.split('\n');
	let inFence = false;
	const h2: { text: string; i: number }[] = [];
	let firstH2 = -1;
	let introWords = 0;
	lines.forEach((line, i) => {
		if (/^\s*(`{3,}|~{3,})/.test(line)) inFence = !inFence;
		if (inFence) return;
		if (/^#\s/.test(line)) detail.push('in-body H1');
		const m = line.match(/^##\s+(.+?)\s*$/);
		if (m) {
			h2.push({ text: m[1].toLowerCase(), i });
			if (firstH2 < 0) firstH2 = i;
		} else if (firstH2 < 0 && !/^\s*(<!--|:::|!\[|import )/.test(line))
			introWords += line.split(/\s+/).filter(Boolean).length;
	});
	if (introWords < 8)
		detail.push('no intro paragraph before the first ## (say what this is and who it is for)');
	const has = (keys: string[]) => h2.findIndex((h) => keys.some((k) => h.text.includes(k)));
	const positions = REQUIRED[type].map((r) => has(r.any));
	const missing = REQUIRED[type].filter((_, i) => positions[i] < 0).map((r) => r.name);
	if (missing.length) detail.push(`missing h2 (${type}): ${missing.join(', ')}`);
	if (type === 'quickstart') {
		const present = positions.filter((p) => p >= 0);
		if (present.some((p, i) => i > 0 && p < present[i - 1]))
			detail.push('quickstart sections out of order (Before you begin → Step … → Next steps)');
	}
	if (type === 'task') {
		// at least one ## (other than Before you begin / Verify / Troubleshooting / FAQ / Related)
		// holds a numbered list
		const taskH2 = h2.filter(
			(h) => !/before you begin|verify|troubleshoot|faq|related/.test(h.text)
		);
		const hasSteps = taskH2.some((h) => {
			const end = h2[h2.indexOf(h) + 1]?.i ?? lines.length;
			return lines.slice(h.i, end).some((l) => /^\s*\d+\.\s/.test(l));
		});
		if (!hasSteps) detail.push('task page: no ## section with numbered steps');
	}
	const related = has(['related']);
	if (related < 0) detail.push('missing h2: Related');
	else if (related !== h2.length - 1) detail.push('Related must be the last h2');
	const faq = has(['faq']);
	if (faq >= 0) {
		if (related >= 0 && faq > related) detail.push('FAQ must come before Related');
		const end = h2[faq + 1]?.i ?? lines.length;
		const block = lines.slice(h2[faq].i + 1, end).join('\n');
		const questions = (
			block.match(/^(###\s+.+\?|\*\*[^*]+\?\*\*|-\s+\*\*Q:?\*\*.+|<details>)\s*$/gm) ?? []
		).length;
		if (questions < 2) detail.push(`FAQ has ${questions} question(s); 2 or more when present`);
	}
	if (/<!--\s*(MERGE|STILL TO DOCUMENT|ASK):/.test(body))
		detail.push('a MERGE / STILL TO DOCUMENT / ASK marker is still on the page');
	return detail;
}

/** The skeleton prepare-write.ts seeds for an empty page of this type. */
export function skeleton(type: PageType): string {
	const tail = '\n## Related\n\n- \n';
	switch (type) {
		case 'concept':
			return `<intro: what it is, who it is for>\n\n## How it works\n\n## When to use it\n${tail}`;
		case 'task':
			return `<intro: what you will get done>\n\n## Before you begin\n\n## <Task>\n\n1. \n\n## Verify\n${tail}`;
		case 'reference':
			return `<intro: what these settings control>\n\n## Where to find it\n\n## Settings\n\n### <Control group>\n\n## Limits and interactions\n${tail}`;
		case 'quickstart':
			return `<intro: what you will have at the end>\n\n## Before you begin\n\n## Step 1: <…>\n\n## Next steps\n${tail}`;
	}
}
