// The per-type page contract (scripts/agentic/contract.ts).
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contractProblems, PAGE_TYPES, skeleton } from './contract';

const FM = 'title: "X"\ndescription: "Y"';
const INTRO = 'This page explains what the feature is and who needs it in practice.';
const fill = (s: string) => s.replace(/<intro[^>]*>/, INTRO).replace('1. \n', '1. Do it.\n');

describe('contract', () => {
	for (const t of PAGE_TYPES) {
		test(`${t}: its own skeleton passes`, () => {
			expect(contractProblems(FM, fill(skeleton(t)), t)).toEqual([]);
		});
		test(`${t}: its planning template passes`, () => {
			const raw = readFileSync(join(import.meta.dir, '../../planning/templates', `${t}.md`), 'utf8')
				.replace(/^---\n[\s\S]*?\n---\n?/, '')
				.replace(/^<Intro[^\n]*/m, INTRO);
			expect(contractProblems(FM, raw, t)).toEqual([]);
		});
	}
	test('the old five headings fail a reference page', () => {
		const p = contractProblems(
			FM,
			'## What is it\n\n## Why it matters\n\n## When to use it\n\n## How it works\n\n## FAQ\n',
			'reference'
		);
		expect(p.join(' ')).toContain('missing h2 (reference)');
		expect(p.join(' ')).toContain('Related');
	});
	test('a one-question FAQ fails; no FAQ is fine', () => {
		const base = `${INTRO}\n\n## How it works\n\n## When to use it\n\n`;
		expect(
			contractProblems(FM, `${base}## FAQ\n\n### Only one?\n\n## Related\n`, 'concept').join(' ')
		).toContain('FAQ has 1');
		expect(contractProblems(FM, `${base}## Related\n`, 'concept')).toEqual([]);
	});
});
