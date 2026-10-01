// Tests for the receipt executor (call.ts) and the workflow's integrity check — the fix for the
// 2026-10-01 run where an LLM wrapper retyped a 29-route plan as 4 routes.
import { describe, expect, test, afterAll } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { canonical, fnv1a, PROJECT, receipt } from './call';
import { ROOT, RUNS_DIR } from './lib';

const FIX = join(import.meta.dir, '__fixtures__', 'plan-29-routes.json');
const RUN = 'test-call-receipts';
afterAll(() => rmSync(join(RUNS_DIR, RUN), { recursive: true, force: true }));

const call = (...a: string[]) => {
	const r = spawnSync('bun', ['scripts/agentic/call.ts', RUN, ...a], {
		cwd: ROOT,
		encoding: 'utf8',
	});
	return { status: r.status, out: r.stdout, rc: r.stdout.trim() ? JSON.parse(r.stdout) : null };
};

// The workflow script carries its own copy of fnv1a/canonical (it cannot import). Evaluate that
// copy so a drift between the two sides fails here, not in a night run.
const wf = readFileSync(join(ROOT, '.claude/skills/docs-explore/workflow.js'), 'utf8');
const grab = (name: string) => {
	const m = wf.match(new RegExp(`const ${name} = [\\s\\S]*?\\n};?\\n`));
	if (!m) throw new Error(`${name} not found in workflow.js`);
	return m[0];
};
const wfHash = new Function(
	`${grab('fnv1a')}\n${grab('canonical')}\nreturn (v) => fnv1a(canonical(v));`
)();

const nightJs = readFileSync(join(ROOT, '.claude/skills/docs-night/consistency.js'), 'utf8');
const grabFrom = (src: string, name: string) => {
	const m = src.match(new RegExp(`const ${name} = [\\s\\S]*?\\n};?\\n`));
	if (!m) throw new Error(`${name} not found`);
	return m[0];
};
const nightHash = new Function(
	`${grabFrom(nightJs, 'fnv1a')}\n${grabFrom(nightJs, 'canonical')}\nreturn (v) => fnv1a(canonical(v));`
)();

describe('hashing', () => {
	test('the night consistency copy hashes exactly like call.ts', () => {
		for (const v of [{}, { a: [1, { b: 2 }] }, { ok: true, failing: [] }])
			expect(nightHash(v)).toBe(fnv1a(canonical(v)));
	});
	test('canonical is key-order independent', () => {
		expect(canonical({ b: 1, a: [{ y: 2, x: 1 }] })).toBe(canonical({ a: [{ x: 1, y: 2 }], b: 1 }));
	});
	test('fnv1a is stable and 8 hex chars', () => {
		expect(fnv1a('')).toBe('811c9dc5');
		expect(fnv1a('abc')).toMatch(/^[0-9a-f]{8}$/);
	});
	test('the workflow copy hashes exactly like call.ts', () => {
		for (const v of [
			{},
			{ a: 1 },
			{ routes: [{ route: 'x/y', action: 'write' }], n: null },
			[1, 'two', { z: true }],
		])
			expect(wfHash(v)).toBe(fnv1a(canonical(v)));
	});
});

describe('receipts', () => {
	test('a 29-route plan arrives as 29 routes, in a small receipt', () => {
		const { status, out, rc } = call('plan-read', '--as', 'plan', '--', FIX);
		expect(status).toBe(0);
		expect(rc.ok).toBe(true);
		expect(rc.summary.routes).toHaveLength(29);
		expect(Buffer.byteLength(out)).toBeLessThan(4096);
		expect(fnv1a(canonical(rc.summary))).toBe(rc.summarySha);
		// the full file is kept by reference, byte for byte
		expect(readFileSync(join(ROOT, rc.ref), 'utf8')).toBe(readFileSync(FIX, 'utf8'));
	});
	test('the 2026-10-01 failure — a summary abridged to 4 routes — is rejected', () => {
		const { rc } = call('plan-read', '--as', 'plan', '--', FIX);
		const abridged = { ...rc.summary, routes: rc.summary.routes.slice(0, 4) };
		expect(wfHash(abridged)).not.toBe(rc.summarySha);
	});
	test('a re-nested receipt does not verify', () => {
		const { rc } = call('plan-read', '--as', 'plan', '--', FIX);
		expect(wfHash({ ok: true, json: rc.summary })).not.toBe(rc.summarySha);
	});
	test('a missing file is ok:false with exit 2, not an integrity failure', () => {
		const { rc } = call('missing', '--as', 'count', '--', '/nonexistent/probes.json');
		expect(rc.ok).toBe(false);
		expect(rc.exit).toBe(2);
		expect(fnv1a(canonical(rc.summary))).toBe(rc.summarySha);
	});
	test('a command with plain-text output gets an empty summary', () => {
		const { rc } = call('echo', '--as', 'none', '--', 'echo', 'hello');
		expect(rc.ok).toBe(true);
		expect(rc.summary).toEqual({});
		expect(rc.ref).toMatch(/io\/echo\.txt$/);
	});
	test('exists / same are answered by code', () => {
		expect(call('e1', '--as', 'exists', '--', FIX).rc.summary).toEqual({ exists: true });
		expect(call('s1', '--as', 'same', '--', FIX, FIX).rc.summary).toEqual({ same: true });
	});
});

describe('projections', () => {
	test('gates → ok + failing names only', () => {
		expect(
			PROJECT.gates({
				ok: false,
				gates: { lint: { status: 'PASS' }, images: { status: 'FAIL', detail: ['x'] } },
			})
		).toEqual({ ok: false, failing: ['images'] });
	});
	test('subtasks → index, kind, route; the instructions stay in the file', () => {
		const s = PROJECT.subtasks({
			subtasks: [{ kind: 'fix-page', route: 'a/b', instructions: 'long text' }],
			dropped: ['x'],
		});
		expect(s).toEqual({ items: [{ i: 0, kind: 'fix-page', route: 'a/b' }], dropped: 1 });
	});
	test('receipt() hashes the canonical summary', () => {
		const r = receipt(true, 0, 'x', '{}', { b: 2, a: 1 });
		expect(r.summarySha).toBe(fnv1a('{"a":1,"b":2}'));
	});
});
