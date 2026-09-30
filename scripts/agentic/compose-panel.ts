/**
 * Compose an accordion section's panel image: the section itself, a 1px hairline, and the
 * dialog's footer (Propose Changes / Save) underneath — so the reader sees the section and how
 * to commit it, without the previous section the dialog-wide shot used to show (2026-09-30).
 *
 *   bun scripts/agentic/compose-panel.ts <run-id> --state <id> [--json]
 *       item   = states.json[<id>].panel            (the expanded item, tight)
 *       dialog = public/img/<area>/<id>-dialog.png  (the whole dialog, as the explorer shot it)
 *       out    = overwrites the item image; the dialog shot stays as <id>-dialog.png
 *   bun scripts/agentic/compose-panel.ts --item <png> --dialog <png> --out <png> [--json]
 *       the same on explicit files (the stopgap recrop, /docs-verify)
 *
 * The footer is found, not assumed: the bottom rows of the dialog shot that contain Carbon's
 * primary blue (the Save button) — the band's top is where the footer starts. No blue band →
 * the item is written alone and the result says `footer: false`.
 */
import { existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { parseArgs, readJson, ROOT, runDir, writeJson } from './lib';

const isBlue = (r: number, g: number, b: number) => r < 60 && g > 70 && g < 130 && b > 200;

/** y where the dialog's footer band starts, or null. */
export async function footerTop(dialogPng: string): Promise<number | null> {
	const { data, info } = await sharp(dialogPng)
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const { width, height, channels } = info;
	const rowBlue = (y: number) => {
		let n = 0;
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * channels;
			if (isBlue(data[i], data[i + 1], data[i + 2])) n++;
		}
		return n / width;
	};
	// Walk up from the bottom while rows carry the blue Save band (≥ 20 % of the width).
	let y = height - 1;
	while (y > 0 && rowBlue(y) < 0.2 && height - y < 40) y--; // skip a thin bottom margin
	if (rowBlue(y) < 0.2) return null;
	while (y > 0 && rowBlue(y - 1) >= 0.2) y--;
	return height - y > 200 ? null : y; // a "footer" taller than 200px is not a footer
}

export async function compose(itemPng: string, dialogPng: string, outPng: string) {
	const top = existsSync(dialogPng) ? await footerTop(dialogPng) : null;
	const item = sharp(itemPng);
	const im = await item.metadata();
	if (top === null) {
		if (outPng !== itemPng) await sharp(itemPng).toFile(outPng);
		return { out: outPng, footer: false, width: im.width, height: im.height };
	}
	const dm = await sharp(dialogPng).metadata();
	const footer = await sharp(dialogPng)
		.extract({ left: 0, top, width: dm.width!, height: dm.height! - top })
		.toBuffer();
	const width = Math.max(im.width!, dm.width!);
	const hair = 1;
	const height = im.height! + hair + (dm.height! - top);
	const bg = { r: 244, g: 244, b: 244, alpha: 1 }; // Carbon gray-10, the dialog background
	const buf = await sharp({ create: { width, height, channels: 4, background: bg } })
		.composite([
			{ input: await sharp(itemPng).toBuffer(), left: 0, top: 0 },
			{
				input: {
					create: {
						width,
						height: hair,
						channels: 4,
						background: { r: 224, g: 224, b: 224, alpha: 1 },
					},
				},
				left: 0,
				top: im.height!,
			},
			{ input: footer, left: 0, top: im.height! + hair },
		])
		.png()
		.toBuffer();
	await sharp(buf).toFile(outPng + '.tmp.png');
	renameSync(outPng + '.tmp.png', outPng);
	return { out: outPng, footer: true, width, height };
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const asJson = args.flags.has('json');
	let item = args.get('item');
	let dialog = args.get('dialog');
	let out = args.get('out');
	const [runId] = args.positional;
	const state = args.get('state');
	if (runId && state) {
		const states = readJson<Record<string, any>>(join(runDir(runId), 'states.json')) ?? {};
		const st = states[state];
		if (!st?.panel) {
			console.error(`state ${state} has no panel in ${runId}/states.json`);
			process.exit(1);
		}
		item = join(ROOT, 'public', st.panel);
		dialog = item.replace(/-panel\.png$/, '-dialog.png');
		out = item;
		const r = await compose(item, dialog, out);
		st.panelComposed = r.footer;
		writeJson(join(runDir(runId), 'states.json'), states);
		console.log(
			asJson
				? JSON.stringify(r)
				: `${state}: ${r.footer ? 'footer added' : 'no footer found — item only'} → ${r.out}`
		);
		process.exit(0);
	}
	if (!item || !dialog || !out) {
		console.error(
			'Usage: compose-panel.ts <run-id> --state <id> | --item <png> --dialog <png> --out <png> [--json]'
		);
		process.exit(1);
	}
	const r = await compose(item, dialog, out);
	console.log(
		asJson
			? JSON.stringify(r)
			: `${r.footer ? 'footer added' : 'no footer found — item only'} → ${r.out}`
	);
}
