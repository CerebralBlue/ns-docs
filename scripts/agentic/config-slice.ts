/**
 * Turn the instance config export into the pipeline's config evidence.
 *
 *   bun scripts/agentic/config-slice.ts <run-id> [--fetch] [--file <export>] [--json]
 *
 * Input: the newest `backups/*.nsconfig`, or --file, or --fetch — which POSTs
 * `<consoleApiUrl>/packConfig` from `.neuralseekrc.json` itself and saves the reply as
 * `backups/<instance>_<ts>.nsconfig`. (--fetch exists because the MCP's `backup_instance`
 * derives the console host from `baseUrl` and ignores `consoleApiUrl`, so on the partners plane
 * it posts to the UI and gets a 401/302 — verified 2026-09-17.)
 *
 * Output: runs/<id>/section/config.json. When the export is JSON:
 *   keys   every dotted path → scalar value, secrets stripped, sorted — what the understand step reads
 *   tree   the export minus secrets, for a writer who needs the shape
 * When it is the packed blob packConfig actually returns (opaque hex, not JSON — the normal
 * case), config.json carries only {source, sha1, packed: true}: the file is a RESTORE point for
 * the runner/cleanup, and the config tier is ABSENT — defaults are verified on the Neural Config
 * screens instead. Exit 1 only when no export exists at all.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
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
if (!file && args.flags.has('fetch')) {
	const rc = JSON.parse(readFileSync(join(ROOT, '.neuralseekrc.json'), 'utf8'));
	const consoleApiUrl = String(rc.consoleApiUrl ?? '').replace(/\/$/, '');
	const instanceId = String(rc.baseUrl ?? '')
		.split('/')
		.pop();
	if (!consoleApiUrl || !rc.apiKey) {
		console.error('.neuralseekrc.json needs consoleApiUrl and apiKey for --fetch');
		process.exit(1);
	}
	const res = await fetch(`${consoleApiUrl}/packConfig`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: '*/*', apikey: rc.apiKey },
		body: '{}',
	});
	if (!res.ok) {
		console.error(`packConfig failed: HTTP ${res.status} from ${consoleApiUrl}/packConfig`);
		process.exit(1);
	}
	const body = await res.text();
	const dir = join(ROOT, 'backups');
	mkdirSync(dir, { recursive: true });
	file = join(dir, `${instanceId}_${new Date().toISOString().replace(/[:.]/g, '-')}.nsconfig`);
	writeFileSync(file, body);
}
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
	// The packed export: a restore point, not evidence. Not an error.
	const out = {
		source: relative(ROOT, file),
		exportedAt: statSync(file).mtime.toISOString(),
		sha1: sha1(raw),
		packed: true,
		bytes: raw.length,
		keyCount: 0,
		keys: {},
		tree: null,
		note: 'packConfig returns a packed blob, not JSON — config tier ABSENT; defaults are verified on the Neural Config screens',
	};
	writeJson(join(runDir(runId), 'section/config.json'), out);
	if (args.flags.has('json'))
		console.log(
			JSON.stringify({ source: out.source, packed: true, bytes: out.bytes, sha1: out.sha1 })
		);
	else
		console.log(
			`config: packed export (${out.bytes} bytes) saved as a restore point → runs/${runId}/section/config.json (no keys)`
		);
	process.exit(0);
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
