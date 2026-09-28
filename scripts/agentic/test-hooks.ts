/**
 * test-hooks.ts — unit tests for the pipeline's PreToolUse hooks. No browser, no network.
 *
 *   bun scripts/agentic/test-hooks.ts
 *
 * Builds a throw-away project root in the OS temp dir (symlinks to the real hooks and scripts, a
 * fake _private/ with instances.json, browser-state, a run and one saved snapshot) and pipes tool
 * calls into each hook the way Claude Code does. The snapshot fixture is hand-written but mirrors the
 * real anatomy seen in the 2026-09-26 spike: Carbon dropdowns (listbox > button = value,
 * listbox > listbox > generic = option), an unnamed "Propose Changes" button whose text is in its
 * children, the Change Log's `generic "Rollback" > img`, and the SVG routing-tree nodes.
 * Plain node:assert on purpose — `astro check` type-checks scripts/ and there are no bun:test types.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from './lib';

const PLAY = '0123456789abcdef01234567';
const LOCKED = 'fedcba9876543210fedcba98';
const HOST = 'console.example.test';
const RUN = 'test-run';

const tmp = mkdtempSync(join(tmpdir(), 'ns-hooks-'));
const V2 = join(tmp, '_private/agentic-v2');
const OUT = join(tmp, '_private/tools/playwright/output');
mkdirSync(join(V2, 'runs', RUN), { recursive: true });
mkdirSync(OUT, { recursive: true });
mkdirSync(join(tmp, '.claude'), { recursive: true });
symlinkSync(join(ROOT, '.claude/hooks'), join(tmp, '.claude/hooks'));
symlinkSync(join(ROOT, 'scripts'), join(tmp, 'scripts'));
writeFileSync(
	join(V2, 'instances.json'),
	JSON.stringify({ host: HOST, playground: PLAY, locked: [LOCKED], agentPrefix: 'docs-' })
);
writeFileSync(join(V2, 'current-run'), RUN);
writeFileSync(join(V2, 'browser-state'), `${PLAY}\thttps://${HOST}/${PLAY}/configure\n`);
writeFileSync(
	join(V2, 'runs', RUN, 'area.json'),
	JSON.stringify({ area: 'seek', entry: { type: 'seek', input: 'What is NeuralSeek?' } })
);

const SNAPSHOT = `- generic [ref=e1]:
  - img [ref=e2]:
    - generic [ref=e3] [cursor=pointer]:
      - generic [ref=e4]: Default Config
  - dialog [ref=e10]:
    - listitem [ref=e11]:
      - button "KnowledgeBase Connection" [expanded] [ref=e12] [cursor=pointer]
      - listbox [ref=e13] [cursor=pointer]:
        - button "NeuralSeek KB" [expanded] [ref=e14]
        - listbox [ref=e15]:
          - generic:
            - generic [ref=e16]: Pinecone
            - generic [ref=e17]: Virtual KB
      - generic [ref=e18]: KnowledgeBase Type
      - listbox [ref=e19] [cursor=pointer]:
        - button [ref=e20]:
          - button "187" [ref=e21]
    - generic "Enable All" [ref=e22] [cursor=pointer]
    - checkbox "Seek" [ref=e23]
    - button "Add an LLM" [ref=e24] [cursor=pointer]
    - button "Add" [ref=e25] [cursor=pointer]
    - generic "Generate Key" [ref=e26]:
      - button [ref=e27] [cursor=pointer]
    - button [ref=e28] [cursor=pointer]:
      - generic: Propose Changes
      - img "Propose Changes" [ref=e29]
    - button "Save" [ref=e30] [cursor=pointer]
    - button "Edit Configuration Edit" [ref=e31] [cursor=pointer]
    - button [ref=e32] [cursor=pointer]
    - tab "Semantic Scoring" [ref=e33]
    - button "Delete Category" [ref=e34] [cursor=pointer]
    - button "Ok" [ref=e35] [cursor=pointer]
  - table [ref=e40]:
    - row [ref=e41]:
      - cell "docs-baseline" [ref=e42]
      - cell [ref=e43]:
        - generic "Rollback" [ref=e44]:
          - img [ref=e45] [cursor=pointer]
`;
const snapFile = join(OUT, 'page-fixture.yml');
writeFileSync(snapFile, SNAPSHOT);

type Verdict = 'allow' | 'deny' | 'block';
function run(hook: string, tool: string, input: Record<string, unknown>, agent?: string): Verdict {
	const payload = JSON.stringify({
		tool_name: tool,
		tool_input: input,
		...(agent ? { agent_type: agent } : {}),
	});
	const r = spawnSync('bash', [join(tmp, '.claude/hooks', hook)], {
		input: payload,
		env: { ...process.env, CLAUDE_PROJECT_DIR: tmp },
		encoding: 'utf8',
	});
	if (r.status === 2) return 'block';
	if (r.status !== 0) throw new Error(`${hook} exited ${r.status}: ${r.stderr}`);
	if (!r.stdout.trim()) return 'allow';
	return JSON.parse(r.stdout).hookSpecificOutput?.permissionDecision === 'deny' ? 'deny' : 'allow';
}
const ui = (t: string) => `mcp__neuralseek-ui__browser_${t}`;
const click = (ref: string, agent?: string) =>
	run('pw-policy.sh', ui('click'), { target: ref }, agent);

let failures = 0;
function check(label: string, got: Verdict, want: Verdict) {
	try {
		assert.equal(got, want);
		console.log(`  ok    ${label}`);
	} catch {
		failures++;
		console.log(`  FAIL  ${label}: got ${got}, want ${want}`);
	}
}

try {
	console.log('pw-policy.sh — clicks, pipeline agent (explorer)');
	check('svg tree node "Default Config"', click('e4', 'explorer'), 'allow');
	check('accordion button', click('e12', 'explorer'), 'allow');
	check('dropdown value button opens the list', click('e14', 'explorer'), 'allow');
	check('nested value button "187"', click('e21', 'explorer'), 'allow');
	check('dropdown option "Pinecone" (picks a setting)', click('e16', 'explorer'), 'deny');
	check('chip "Enable All"', click('e22', 'explorer'), 'deny');
	check('checkbox "Seek"', click('e23', 'explorer'), 'deny');
	check('opener "Add an LLM"', click('e24', 'explorer'), 'allow');
	check('bare "Add" (commits the dialog)', click('e25', 'explorer'), 'deny');
	check('"Generate Key" (name from ancestor)', click('e27', 'explorer'), 'deny');
	check('unnamed "Propose Changes" (text in children)', click('e28', 'explorer'), 'deny');
	check('"Save"', click('e30', 'explorer'), 'deny');
	check('opener "Edit Configuration"', click('e31', 'explorer'), 'allow');
	check('button with no name at all', click('e32', 'explorer'), 'deny');
	check('tab', click('e33', 'explorer'), 'allow');
	check('"Ok" confirm', click('e35', 'explorer'), 'deny');
	check('Change Log "Rollback" icon', click('e45', 'explorer'), 'deny');
	check('ref not in the snapshot', click('e999', 'explorer'), 'deny');

	console.log('pw-policy.sh — clicks, main session');
	check('Save', click('e30'), 'allow');
	check('Rollback', click('e45'), 'allow');
	check('dropdown option', click('e16'), 'allow');
	check('destructive "Delete Category"', click('e34'), 'deny');
	check('destructive, explorer', click('e34', 'explorer'), 'deny');

	console.log('pw-policy.sh — keys, typing, forms, tabs');
	check(
		'explorer Escape',
		run('pw-policy.sh', ui('press_key'), { key: 'Escape' }, 'explorer'),
		'allow'
	);
	check(
		'explorer Enter',
		run('pw-policy.sh', ui('press_key'), { key: 'Enter' }, 'explorer'),
		'deny'
	);
	check(
		'explorer ArrowDown',
		run('pw-policy.sh', ui('press_key'), { key: 'ArrowDown' }, 'explorer'),
		'deny'
	);
	check('main Enter', run('pw-policy.sh', ui('press_key'), { key: 'Enter' }), 'allow');
	check(
		'explorer types the entry text',
		run(
			'pw-policy.sh',
			ui('type'),
			{ target: 'e1', text: 'What is NeuralSeek?', submit: true },
			'explorer'
		),
		'allow'
	);
	check(
		'explorer types anything else',
		run('pw-policy.sh', ui('type'), { target: 'e1', text: 'x' }, 'explorer'),
		'deny'
	);
	check('main types', run('pw-policy.sh', ui('type'), { target: 'e1', text: 'x' }), 'allow');
	check(
		'explorer fill_form',
		run('pw-policy.sh', ui('fill_form'), { fields: [] }, 'explorer'),
		'deny'
	);
	check(
		'explorer select_option',
		run('pw-policy.sh', ui('select_option'), { target: 'e13', values: ['Pinecone'] }, 'explorer'),
		'deny'
	);
	check(
		'explorer file_upload',
		run('pw-policy.sh', ui('file_upload'), { paths: [] }, 'explorer'),
		'deny'
	);
	check(
		'explorer accepts a dialog',
		run('pw-policy.sh', ui('handle_dialog'), { accept: true }, 'explorer'),
		'deny'
	);
	check(
		'explorer dismisses a dialog',
		run('pw-policy.sh', ui('handle_dialog'), { accept: false }, 'explorer'),
		'allow'
	);
	check(
		'tabs new (escapes the lock)',
		run('pw-policy.sh', ui('tabs'), { action: 'new', url: `https://${HOST}/${LOCKED}/configure` }),
		'deny'
	);
	check('tabs select', run('pw-policy.sh', ui('tabs'), { action: 'select', index: 1 }), 'deny');
	check('tabs list', run('pw-policy.sh', ui('tabs'), { action: 'list' }), 'allow');
	check('evaluate', run('pw-policy.sh', ui('evaluate'), { function: '() => 1' }), 'deny');

	console.log('pw-policy.sh — navigation and snapshots');
	check(
		'navigate to production id',
		run('pw-policy.sh', ui('navigate'), { url: `https://${HOST}/${LOCKED}/configure` }),
		'deny'
	);
	check(
		'navigate to playground',
		run('pw-policy.sh', ui('navigate'), { url: `https://${HOST}/${PLAY}/configure` }),
		'allow'
	);
	const partial = join(OUT, 'zz-partial.yml');
	check(
		'partial snapshot is recorded',
		run('pw-policy.sh', ui('snapshot'), { filename: partial, target: 'e13' }, 'explorer'),
		'allow'
	);
	writeFileSync(partial, '- listbox [ref=e13]:\n  - generic [ref=e99]: Pinecone\n');
	check('a ref only in a partial snapshot is not evidence', click('e99', 'explorer'), 'deny');
	check('the full snapshot still counts', click('e12', 'explorer'), 'allow');

	console.log('pw-policy.sh — variant allowlist (explore-plan.ts variant-on)');
	const allowFile = join(V2, 'runs', RUN, 'variant-allowlist.json');
	const arm = (runId: string, minutes: number) =>
		writeFileSync(
			allowFile,
			JSON.stringify({
				runId,
				variant: 'kb-pinecone',
				controls: { 'KnowledgeBase Type': ['Pinecone', 'NeuralSeek KB'] },
				expires: new Date(Date.now() + minutes * 60_000).toISOString(),
			})
		);
	arm(RUN, 30);
	check('allowlisted option "Pinecone"', click('e16', 'explorer'), 'allow');
	check('option not in the allowlist ("Virtual KB")', click('e17', 'explorer'), 'deny');
	check('Save while a variant is armed', click('e30', 'explorer'), 'deny');
	check(
		'Enter while a variant is armed',
		run('pw-policy.sh', ui('press_key'), { key: 'Enter' }, 'explorer'),
		'deny'
	);
	arm('another-run', 30);
	check('allowlist from another run', click('e16', 'explorer'), 'deny');
	arm(RUN, -1);
	check('expired allowlist', click('e16', 'explorer'), 'deny');
	rmSync(allowFile);
	check('after variant-off', click('e16', 'explorer'), 'deny');

	console.log('pw-policy.sh — experimenter (experiments.ts on)');
	// Mirrors spike 72/73.yml + 83-changelog.yml: the config dialog, the separate "Save a new
	// version" dialog, the "Complete" dialog after a rollback, and Change Log rows.
	const EXP_SNAP = (fields: string, name: string) => `- generic [ref=x1]:
  - dialog [ref=x2]:
    - generic [ref=x3]: "Configuration: Default Config"
    - listitem [ref=x4]:
      - button "KnowledgeBase Tuning" [expanded] [ref=x5] [cursor=pointer]
      - generic [ref=x6]:
        - listbox [ref=x7] [cursor=pointer]:
          - button "Normal" [expanded] [ref=x8]
          - listbox [ref=x9]:
            - generic:
              - generic [ref=x10]: Strict
              - generic [ref=x11]: Loose
        - generic [ref=x12]: Semantic Match Strictness
    - button "Save" [ref=x13] [cursor=pointer]
  - dialog [ref=v1]:
    - generic [ref=v2]: Save a new version
    - generic [ref=v3]:
      - generic [ref=v4]:
        - textbox [ref=v5]:
          - /placeholder: Fixes for document problems XYZ....
          - text: ${name}
        - generic [ref=v6]: Name this version of the configuration
      - generic [ref=v7]:
        - textbox [ref=v8]:
          - /placeholder: We updated the minimum confidence...
          - text: "Updated settings for the following fields: ${fields}"
        - generic [ref=v9]: Version Description
      - generic [ref=v10]: Endpoint
      - textbox [ref=v11]
    - button "Cancel" [ref=v12] [cursor=pointer]
    - button "Save" [ref=v13] [cursor=pointer]
  - dialog [ref=c1]:
    - generic [ref=c2]: Complete
    - paragraph [ref=c3]: Your transaction has been processed. Click Ok to refresh the page.
    - button "Ok" [ref=c4] [cursor=pointer]
  - table [ref=t1]:
    - row [ref=r1]:
      - generic:
        - cell "2026-09-26T23:30:00.000Z" [ref=r2]
        - cell "someone" [ref=r3]
        - cell "docs-exp-test-run-e01" [ref=r4]
        - cell [ref=r5]:
          - generic "Rollback" [ref=r6]:
            - img [ref=r7] [cursor=pointer]
    - row [ref=r8]:
      - generic:
        - cell "2026-09-26T22:57:21.989Z" [ref=r9]
        - cell "someone" [ref=r10]
        - cell "docs-baseline" [ref=r11]
        - cell [ref=r12]:
          - generic "Rollback" [ref=r13]:
            - img [ref=r14] [cursor=pointer]
`;
	const NORM = 'piiTraining, username, authURL, nativeEmbedding, queryType, usingElser';
	const VNAME = 'docs-exp-test-run-e01';
	const expFile = join(OUT, 'page-fixture-exp.yml');
	const setSnap = (fields: string, name: string) => writeFileSync(expFile, EXP_SNAP(fields, name));
	const versionsFile = join(V2, 'playground-versions.json');
	const setVersions = (pending: boolean) =>
		writeFileSync(
			versionsFile,
			JSON.stringify({
				current: 'docs-baseline',
				versions: [{ name: 'docs-baseline', savedAt: '2026-09-26T22:57:21.989Z' }],
				normalisedOnLoad: NORM.split(', '),
				pending: pending
					? {
							run: RUN,
							id: 'e01',
							versionName: VNAME,
							control: 'Semantic Match Strictness',
							value: 'Strict',
							baseline: 'Normal',
							since: new Date().toISOString(),
							baselineVersion: 'docs-baseline',
							baselineSavedAt: '2026-09-26T22:57:21.989Z',
						}
					: null,
			})
		);
	const expAllowFile = join(V2, 'runs', RUN, 'experiment-allowlist.json');
	const armExp = (minutes: number, runId = RUN) =>
		writeFileSync(
			expAllowFile,
			JSON.stringify({
				runId,
				id: 'e01',
				controls: { 'Semantic Match Strictness': ['Strict', 'Normal'] },
				versionName: VNAME,
				expires: new Date(Date.now() + minutes * 60_000).toISOString(),
			})
		);
	const exp = (ref: string, agent = 'experimenter') => click(ref, agent);
	const typeAs = (ref: string, text: string, agent = 'experimenter', submit = false) =>
		run('pw-policy.sh', ui('type'), { target: ref, text, submit }, agent);

	setSnap(`${NORM}, semanticStrictness`, VNAME);
	setVersions(false);
	check('experimenter Save with nothing armed', exp('x13'), 'deny');
	check('explorer Save (never)', exp('x13', 'explorer'), 'deny');
	setVersions(true);
	armExp(30);
	check('declared option "Strict"', exp('x10'), 'allow');
	writeFileSync(
		expAllowFile,
		JSON.stringify({
			runId: RUN,
			id: 'e01',
			section: 'Corporate Logging',
			controls: { 'Semantic Match Strictness': ['Strict', 'Normal'] },
			versionName: VNAME,
			expires: new Date(Date.now() + 30 * 60_000).toISOString(),
		})
	);
	check('declared option but in another section', exp('x10'), 'deny');
	armExp(30);
	check('undeclared option "Loose"', exp('x11'), 'deny');
	check('explorer picks the experiment option', exp('x10', 'explorer'), 'deny');
	check('config-dialog Save (opens the version dialog)', exp('x13'), 'allow');
	check('version Save: one field beyond the normalised ones', exp('v13'), 'allow');
	setSnap(`${NORM}, semanticStrictness, corporateLogging`, VNAME);
	check('version Save: two extra fields', exp('v13'), 'deny');
	setSnap(NORM, VNAME);
	check('version Save: no extra field (control is itself normalised)', exp('v13'), 'deny');
	setSnap(`${NORM}, semanticStrictness`, 'Updated 7 settings');
	check('version Save before the name is typed', exp('v13'), 'deny');
	check('type the version name into the name box', typeAs('v5', VNAME), 'allow');
	check('type the version name into the description box', typeAs('v8', VNAME), 'deny');
	check('type the version name into another box', typeAs('v11', VNAME), 'deny');
	check('type another name', typeAs('v5', 'my-version'), 'deny');
	check('type with submit', typeAs('v5', VNAME, 'experimenter', true), 'deny');
	check('Rollback on the baseline row', exp('r14'), 'allow');
	check('Rollback on the experiment row', exp('r7'), 'deny');
	check('cleanup may not roll back (the main session does)', exp('r14', 'cleanup'), 'deny');
	check('explorer Rollback', exp('r14', 'explorer'), 'deny');
	check('Ok on the Complete dialog', exp('c4'), 'allow');
	armExp(-1);
	check('Save after the allowlist expired', exp('x13'), 'deny');
	check('Rollback after expiry while pending (undo stays open)', exp('r14'), 'allow');
	armExp(30, 'another-run');
	check("Save with another run's allowlist", exp('x13'), 'deny');
	setVersions(false);
	check('Rollback with nothing pending', exp('r14'), 'deny');
	check('Ok with nothing pending', exp('c4'), 'deny');
	rmSync(expAllowFile);
	rmSync(expFile);

	console.log('agent-paths.sh / bash-policy.sh');
	check(
		'experimenter writes its allowlist',
		run('agent-paths.sh', 'Write', { file_path: expAllowFile }, 'experimenter'),
		'deny'
	);
	const allow = join(V2, 'runs', RUN, 'variant-allowlist.json');
	check(
		'explorer writes a variant allowlist',
		run('agent-paths.sh', 'Write', { file_path: allow }, 'explorer'),
		'deny'
	);
	check(
		'explorer writes its own state file',
		run(
			'agent-paths.sh',
			'Write',
			{ file_path: join(V2, 'runs', RUN, 'explore.json') },
			'explorer'
		),
		'allow'
	);
	const sh = (command: string, agent = 'explorer') =>
		run('bash-policy.sh', 'Bash', { command }, agent);
	// The fresh review's bypasses (2026-09-26): each must stay closed.
	const W = (file: string, agent: string) =>
		run('agent-paths.sh', 'Write', { file_path: file }, agent);
	check(
		'explorer forges a snapshot (runs/*.yml)',
		W(join(V2, 'runs', RUN, 'fake.yml'), 'explorer'),
		'deny'
	);
	check(
		'experimenter forges restore evidence',
		W(join(V2, 'runs', RUN, 'restore', 'after.yml'), 'experimenter'),
		'deny'
	);
	check('explorer forges playwright output', W(join(OUT, 'page-x.yml'), 'explorer'), 'deny');
	check(
		'experimenter rewrites states.json',
		W(join(V2, 'runs', RUN, 'states.json'), 'experimenter'),
		'deny'
	);
	check(
		'experimenter rewrites experiments.json',
		W(join(V2, 'runs', RUN, 'experiments.json'), 'experimenter'),
		'deny'
	);
	check(
		'experimenter writes its notes',
		W(join(V2, 'runs', RUN, 'experiments.md'), 'experimenter'),
		'allow'
	);
	check(
		'experimenter writes the registry',
		W(join(V2, 'playground-versions.json'), 'experimenter'),
		'deny'
	);
	check('cleanup writes astro.config.mjs', W(join(tmp, 'astro.config.mjs'), 'cleanup'), 'deny');
	check(
		'experimenter re-writes a reference',
		sh(
			'bun scripts/agentic/verify-restore.ts reference --area x --snapshot a --changelog b',
			'experimenter'
		),
		'deny'
	);
	check(
		'explorer re-writes a reference',
		sh('bun scripts/agentic/verify-restore.ts reference --area x'),
		'deny'
	);
	check(
		'experimenter runs validate itself',
		sh(`bun scripts/agentic/experiments.ts validate ${RUN}`, 'experimenter'),
		'deny'
	);
	check(
		'experimenter runs a check',
		sh(
			`bun scripts/agentic/verify-restore.ts check ${RUN} --snapshot a --changelog b`,
			'experimenter'
		),
		'allow'
	);
	check('xargs runs a shell', sh(`echo x | xargs sh -c 'echo hi > /tmp/x'`), 'deny');
	check('sed w command writes a file', sh(`sed -E 's/a/b/w out.txt' f`), 'deny');
	check('navigate_back', run('pw-policy.sh', ui('navigate_back'), {}, 'explorer'), 'deny');
	check('sed -E -i', sh(`sed -E -i 's/a/b/' ${allow}`), 'deny');
	check('awk writing inside its program', sh(`awk '{print > "x.json"}' a.txt`), 'deny');
	check('find -delete', sh('find _private -name x -delete'), 'deny');
	check('sed -n (read)', sh("sed -n '1,5p' a.txt"), 'allow');
	check('explore-plan.ts', sh('bun scripts/agentic/explore-plan.ts plan test-run'), 'allow');

	console.log('fail closed');
	rmSync(join(V2, 'instances.json'));
	check('no instances.json', click('e12', 'explorer'), 'deny');
} finally {
	rmSync(tmp, { recursive: true, force: true });
}

console.log(failures ? `\n${failures} FAILED` : '\nall passed');
process.exit(failures ? 1 : 0);
