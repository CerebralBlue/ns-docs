/**
 * Check documentation pages against the things this repo can verify mechanically.
 *
 * This is the deterministic half of the page review. It does not read prose — it
 * catches the leftovers and mechanical regressions a human reviewer wastes time on,
 * so the human pass can be about whether the page is TRUE and CLEAR.
 *
 * Usage:
 *   bun scripts/doc-lint.ts seek/              # one module
 *   bun scripts/doc-lint.ts seek/overview      # one route
 *   bun scripts/doc-lint.ts --all              # every route in the map
 *   bun scripts/doc-lint.ts --all --strict     # hold drafts to the same bar
 *
 * Severity depends on the route's status in scripts/migration-map.json:
 *   adopted            -> a human called this done, so findings are ERRORS (exit 1)
 *   stub / auto        -> still a draft, so the same findings are warnings (exit 0)
 *   --strict           -> no downgrade; everything is an error
 *
 * That gate is why this is NOT wired into `bun run verify`: ~70 draft pages are
 * deliberately unfinished and would fail CI today. Run it by hand on the module
 * you are working on. Revisit before public launch.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MAP_PATH = join(ROOT, 'scripts/migration-map.json');

const args = process.argv.slice(2);
const all = args.includes('--all');
const strict = args.includes('--strict');
const prefixes = args.filter((a) => !a.startsWith('--'));

if (!all && prefixes.length === 0) {
	console.error(
		'Usage: bun scripts/doc-lint.ts <route-prefix> [...] [--strict]\n' +
			'       bun scripts/doc-lint.ts --all [--strict]\n\n' +
			'Examples:\n' +
			'  bun scripts/doc-lint.ts seek/\n' +
			'  bun scripts/doc-lint.ts governance/ --strict'
	);
	process.exit(1);
}

const map: { routes: Record<string, any> } = JSON.parse(readFileSync(MAP_PATH, 'utf8'));

/** The five sections of planning/templates/feature-page.md. */
const CONTRACT_SECTIONS = ['What is it', 'Why it matters', 'When to use it', 'How it works', 'FAQ'];

type Level = 'error' | 'warn';
type Finding = { level: Level; line: number; rule: string; message: string };

/**
 * Split frontmatter off, and report how many lines it occupied so every finding
 * can be reported at its real line number in the file (remark, by contrast,
 * reports body-relative lines — see CLAUDE.md).
 */
function splitFrontmatter(raw: string): { fm: string; body: string; offset: number } {
	const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) return { fm: '', body: raw, offset: 0 };
	return { fm: m[1], body: raw.slice(m[0].length), offset: m[0].split('\n').length - 1 };
}

function lintPage(status: string, raw: string, findings: Finding[]) {
	const { fm, body, offset } = splitFrontmatter(raw);

	if (!/^title:\s*\S/m.test(fm))
		findings.push({ level: 'error', line: 1, rule: 'frontmatter', message: 'no `title:`' });
	if (!/^description:\s*\S/m.test(fm))
		findings.push({
			level: 'error',
			line: 1,
			rule: 'frontmatter',
			message: 'no `description:` — the chatbot cites it and search shows it',
		});

	const lines = body.split('\n');
	const at = (i: number) => offset + i + 1;

	let inFence = false;
	const headings: { depth: number; text: string; line: number }[] = [];
	const images: { path: string; line: number }[] = [];
	// Open ns-*/aside containers, so a card that cannot close inside its grid is caught.
	const containers: { colons: number; name: string; line: number }[] = [];

	for (const [i, line] of lines.entries()) {
		const fence = line.match(/^\s*(`{3,}|~{3,})\s*([\w-]*)/);
		if (fence) {
			if (!inFence && /^ntl$/i.test(fence[2]))
				findings.push({
					level: 'error',
					line: at(i),
					rule: 'ntl-fence',
					message: '```ntl has no Shiki grammar — use ```text until one exists',
				});
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;

		if (line.startsWith('<!-- MERGE:'))
			findings.push({
				level: 'error',
				line: at(i),
				rule: 'merge-marker',
				message: 'unresolved MERGE marker — fold the sources together, then delete it',
			});

		if (line.startsWith('<!-- STILL TO DOCUMENT'))
			findings.push({
				level: 'error',
				line: at(i),
				rule: 'gap-list',
				message: 'gap list still present — work through it, then delete the comment',
			});

		const h = line.match(/^(#{1,6})\s+(.*)$/);
		if (h) {
			headings.push({ depth: h[1].length, text: h[2].trim(), line: at(i) });
			if (h[1].length === 1)
				findings.push({
					level: 'error',
					line: at(i),
					rule: 'in-body-h1',
					message: 'in-body H1 doubles with the frontmatter title Starlight renders',
				});
		}

		if (line.includes('](/ns-docs/'))
			findings.push({
				level: 'error',
				line: at(i),
				rule: 'base-prefix',
				message: 'author links without /ns-docs — remark-base-path.mjs adds it at build time',
			});

		if (/\]\(https?:\/\/documentation\.neuralseek\.com/.test(line))
			findings.push({
				level: 'error',
				line: at(i),
				rule: 'old-domain',
				message: 'link still points at the old MkDocs site — resolve it through the map',
			});

		if (/\]\((?:\.\.?\/|images\/)[^)]*\.(?:png|jpe?g|gif|svg|webp)/i.test(line))
			findings.push({
				level: 'error',
				line: at(i),
				rule: 'image-path',
				message: 'relative image path — converted pages reference /img/<route>/<file>',
			});

		if (/\]\((?:\.\.?\/)[^)]*\.mdx?[)#]/.test(line))
			findings.push({
				level: 'error',
				line: at(i),
				rule: 'mkdocs-link',
				message: 'relative .md link left over from MkDocs — use the new site route',
			});

		for (const m of line.matchAll(/!\[[^\]]*\]\((\/img\/[^)\s]+)/g))
			images.push({ path: m[1], line: at(i) });
		for (const m of line.matchAll(/<img[^>]*\ssrc="(\/img\/[^"]+)"/g))
			images.push({ path: m[1], line: at(i) });

		// Directive nesting: micromark closes a container on the FIRST matching run
		// length, so an inner container must use FEWER colons than its parent.
		const open = line.match(/^(:{3,})([a-zA-Z][\w-]*)/);
		const close = line.match(/^(:{3,})\s*$/);
		if (open) {
			const colons = open[1].length;
			const parent = containers[containers.length - 1];
			if (parent && colons >= parent.colons)
				findings.push({
					level: 'warn',
					line: at(i),
					rule: 'colon-nesting',
					message:
						`:${open[2]} opens with ${colons} colons inside :${parent.name} ` +
						`(${parent.colons}) — the outer container needs MORE colons or it closes here`,
				});
			containers.push({ colons, name: open[2], line: at(i) });
		} else if (close && containers.length) {
			const colons = close[1].length;
			for (let k = containers.length - 1; k >= 0; k--) {
				if (containers[k].colons <= colons) {
					containers.length = k;
					break;
				}
			}
		}

		for (const m of line.matchAll(/^:{2,}ns-[\w-]*[^{]*\{([^}]*)\}/g))
			if (/\b(href|src)=(?!["'])\S*\s/.test(m[1] + ' '))
				findings.push({
					level: 'warn',
					line: at(i),
					rule: 'unquoted-href',
					message: 'unquoted href/src — the value ends at the first space',
				});
	}

	for (const c of containers)
		findings.push({
			level: 'warn',
			line: c.line,
			rule: 'unclosed-directive',
			message: `:${c.name} (${c.colons} colons) is never closed`,
		});

	const shallowest = headings.length ? Math.min(...headings.map((h) => h.depth)) : 0;
	if (shallowest > 2)
		findings.push({
			level: 'error',
			line: headings[0].line,
			rule: 'heading-depth',
			message: `shallowest heading is h${shallowest} — promote to h2 or the TOC renders empty`,
		});

	for (const img of images)
		if (!existsSync(join(ROOT, 'public', img.path.replace(/^\//, ''))))
			findings.push({
				level: 'error',
				line: img.line,
				rule: 'missing-image',
				message: `public${img.path} does not exist`,
			});

	// A stub is a generated placeholder by definition — holding it to the page
	// contract would print the same warning on 121 routes and drown the real ones.
	if (status === 'stub') return;

	const present = new Set(headings.filter((h) => h.depth === 2).map((h) => h.text.toLowerCase()));
	const missing = CONTRACT_SECTIONS.filter((s) => !present.has(s.toLowerCase()));
	if (missing.length && missing.length < CONTRACT_SECTIONS.length)
		findings.push({
			level: 'warn',
			line: 1,
			rule: 'page-contract',
			message: `missing section(s): ${missing.join(', ')}`,
		});
	else if (missing.length === CONTRACT_SECTIONS.length)
		findings.push({
			level: 'warn',
			line: 1,
			rule: 'page-contract',
			message: 'follows none of the feature-page template sections',
		});
}

let errors = 0;
let warnings = 0;
let clean = 0;
const report: string[] = [];

for (const [route, info] of Object.entries<any>(map.routes)) {
	if (!all && !prefixes.some((p) => route === p || route.startsWith(p))) continue;

	const md = join(ROOT, 'src/content/docs', `${route}.md`);
	const mdx = join(ROOT, 'src/content/docs', `${route}.mdx`);
	const path = existsSync(md) ? md : existsSync(mdx) ? mdx : '';
	const rel = path ? path.slice(ROOT.length) : `src/content/docs/${route}.md`;

	const findings: Finding[] = [];
	if (!path) {
		findings.push({
			level: 'error',
			line: 1,
			rule: 'missing-page',
			message: 'no page file — run `bun run stubs` or `bun scripts/convert.ts`',
		});
	} else {
		lintPage(info.status, readFileSync(path, 'utf8'), findings);
	}

	// A draft is allowed to be unfinished; "adopted" means a human called it done.
	const adopted = info.status === 'adopted';
	const level = (f: Finding): Level => (adopted || strict ? f.level : 'warn');

	if (!findings.length) {
		clean++;
		continue;
	}
	const e = findings.filter((f) => level(f) === 'error').length;
	const w = findings.length - e;
	errors += e;
	warnings += w;

	report.push(`\n${rel}  [${info.status}${adopted ? '' : ' — draft, warnings only'}]`);
	for (const f of findings.sort((a, b) => a.line - b.line))
		report.push(
			`  ${level(f) === 'error' ? 'ERROR' : 'warn '} ${String(f.line).padStart(4)}  ${f.rule.padEnd(18)} ${f.message}`
		);
}

if (report.length) console.log(report.join('\n'));
console.log(
	`\nclean: ${clean}, errors: ${errors}, warnings: ${warnings}` +
		(errors
			? '\nErrors are on routes marked "adopted" — a human called those done.'
			: strict
				? ''
				: '\nDrafts report warnings only. Use --strict to hold them to the same bar.')
);

process.exit(errors ? 1 : 0);
