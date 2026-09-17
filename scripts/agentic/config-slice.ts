/**
 * Turn the instance config export into the pipeline's config evidence.
 *
 *   bun scripts/agentic/config-slice.ts <run-id> [--file <export>] [--json]
 *
 * Input: the newest `backups/*.nsconfig` (written by the neuralseek-node MCP's `backup_instance`
 * — the only read-only way to the console config, since consoleData is 403 from outside), or
 * --file. Output: runs/<id>/section/config.json with
 *   keys   every dotted path → scalar value, secrets stripped, sorted — what the verifier greps
 *   tree   the export minus secrets, for a writer who needs the shape
 * Anything under a key named secrets/apiKey/password/token/credential(s) is dropped, whatever
 * its depth. Exit 1 when no export exists — ABSENT config is a parked route, never a guess.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseArgs, ROOT, runDir, sha1, writeJson } from './lib';

const args = parseArgs(process.argv.slice(2));
const runId = args.positional[0];
if (!runId) {
	console.error(
		'Usage: bun scripts/agentic/config-slice.ts <run-id> [--file <export.nsconfig>] [--json]'
	);
	process.exit(1);
}
let file = args.get('file');
if (!file) {
	const dir = join(ROOT, 'backups');
	const candidates = existsSync(dir)
		? readdirSync(dir)
				.filter((f) => f.endsWith('.nsconfig'))
				.map((f) => join(dir, f))
		: [];
	candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
	file = candidates[0];
}
if (!file || !existsSync(file)) {
	console.error(
		'no config export found — run backup_instance (neuralseek-node MCP) first, or pass --file'
	);
	process.exit(1);
}
const raw = readFileSync(file, 'utf8');
let data: unknown;
try {
	data = JSON.parse(raw);
} catch {
	console.error(`${file} is not JSON — cannot slice; keeping a hash only`);
	writeJson(join(runDir(runId), 'section/config.json'), {
		source: relative(ROOT, file),
		sha1: sha1(raw),
		keys: {},
		tree: null,
		note: 'export was not JSON',
	});
	process.exit(1);
}

const SECRET =
	/^(secrets?|apikey|api_key|password|passwd|token|credentials?|privatekey|private_key)$/i;
function strip(v: unknown): unknown {
	if (Array.isArray(v)) return v.map(strip);
	if (v && typeof v === 'object') {
		const out: Record<string, unknown> = {};
		for (const [k, x] of Object.entries(v as Record<string, unknown>))
			if (!SECRET.test(k)) out[k] = strip(x);
		return out;
	}
	return v;
}
const tree = strip(data);
const keys: Record<string, string | number | boolean | null> = {};
function flatten(v: unknown, path: string) {
	if (Array.isArray(v)) {
		if (v.every((x) => x === null || typeof x !== 'object')) keys[path] = v.map(String).join(' | ');
		else v.forEach((x, i) => flatten(x, `${path}[${i}]`));
	} else if (v && typeof v === 'object') {
		for (const [k, x] of Object.entries(v as Record<string, unknown>))
			flatten(x, path ? `${path}.${k}` : k);
	} else if (path) keys[path] = v as string | number | boolean | null;
}
flatten(tree, '');
const sorted = Object.fromEntries(Object.entries(keys).sort(([a], [b]) => a.localeCompare(b)));
const out = {
	source: relative(ROOT, file),
	exportedAt: statSync(file).mtime.toISOString(),
	sha1: sha1(raw),
	keyCount: Object.keys(sorted).length,
	keys: sorted,
	tree,
};
writeJson(join(runDir(runId), 'section/config.json'), out);
if (args.flags.has('json'))
	console.log(JSON.stringify({ source: out.source, keyCount: out.keyCount, sha1: out.sha1 }));
else
	console.log(
		`config: ${out.keyCount} keys from ${out.source} → runs/${runId}/section/config.json`
	);
