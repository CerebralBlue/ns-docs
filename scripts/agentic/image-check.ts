/**
 * The deterministic half of the image review (2026-09-30): pixel checks on every image a page
 * places, so the image-reviewer agent looks first where something is measurably off.
 *
 *   bun scripts/agentic/image-check.ts <route> [--json]
 *
 * Per image (placeholders skipped): `missing` (not in public/ nor the capture library), `small`
 * (< 150 px wide or < 50 px tall — a lone checkbox or label), `neighbour-above` (an accordion header band sits well below
 * the top with another band above it — the dialog-wide shot that shows the previous section),
 * `header-at-bottom` (the only band is in the lower half: the section itself is cut off),
 * `blue-outside-footer` (Carbon primary blue outside the dialog's footer band — a text
 * selection highlight or a primary button; the reviewer decides), `no-alt` (empty alt text).
 * Flags are evidence, not verdicts: nothing here fails a page.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { footerTop } from './compose-panel';
import { DOCS_DIR, parseArgs, ROOT } from './lib';

const isBlue = (r: number, g: number, b: number) => r < 60 && g > 70 && g < 130 && b > 200;

async function bands(png: string) {
	const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const { width, height, channels } = info;
	const x0 = Math.floor(width * 0.55);
	const x1 = Math.floor(width * 0.9);
	const gray = (y: number) => {
		for (let x = x0; x < x1; x += 4) {
			const i = (y * width + x) * channels;
			const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
			if (!(r >= 220 && r <= 240 && Math.abs(r - g) < 6 && Math.abs(r - b) < 6)) return false;
		}
		return true;
	};
	const out: number[] = [];
	let start = -1;
	for (let y = 0; y < height; y++) {
		if (gray(y)) {
			if (start < 0) start = y;
		} else if (start >= 0) {
			if (y - start >= 40 && y - start <= 70) out.push(start);
			start = -1;
		}
	}
	let blue = 0;
	const foot = await footerTop(png);
	const limit = foot ?? height;
	for (let y = 0; y < limit; y++)
		for (let x = 0; x < width; x += 2) {
			const i = (y * width + x) * channels;
			if (isBlue(data[i], data[i + 1], data[i + 2])) blue++;
		}
	return { width, height, bands: out, blueOutsideFooter: blue, footer: foot !== null };
}

export async function checkPage(route: string) {
	const path = [join(DOCS_DIR, `${route}.md`), join(DOCS_DIR, route, 'index.md')].find(existsSync);
	if (!path) return { route, error: 'page missing', images: [] };
	const lines = readFileSync(path, 'utf8').split('\n');
	const images: { image: string; line: number; alt: string; flags: string[]; size?: string }[] = [];
	for (const [i, l] of lines.entries())
		for (const m of l.matchAll(/!\[([^\]]*)\]\((\/img\/[^)\s]+)\)/g)) {
			const [, alt, img] = m;
			if (img.endsWith('_placeholder.svg')) continue;
			const flags: string[] = [];
			if (!alt.trim()) flags.push('no-alt');
			const abs = join(ROOT, 'public', img);
			if (!existsSync(abs)) {
				flags.push('missing');
				images.push({ image: img, line: i + 1, alt, flags });
				continue;
			}
			const b = await bands(abs);
			if (b.width < 150 || b.height < 50) flags.push('small'); // a single checkbox or a label, not a section
			if (b.bands.length >= 2 && b.bands[b.bands.length - 1] > b.height * 0.25)
				flags.push('neighbour-above');
			if (b.bands.length === 1 && b.bands[0] > b.height * 0.5) flags.push('header-at-bottom');
			if (b.blueOutsideFooter > 150) flags.push('blue-outside-footer');
			images.push({ image: img, line: i + 1, alt, flags, size: `${b.width}x${b.height}` });
		}
	return { route, images, flagged: images.filter((x) => x.flags.length).length };
}

if (import.meta.main) {
	const args = parseArgs(process.argv.slice(2));
	const [route] = args.positional;
	if (!route) {
		console.error('Usage: bun scripts/agentic/image-check.ts <route> [--json]');
		process.exit(1);
	}
	const r = await checkPage(route);
	if (args.flags.has('json')) console.log(JSON.stringify(r));
	else {
		console.log(`${route}: ${r.images.length} image(s), ${r.flagged ?? 0} flagged`);
		for (const x of r.images)
			if (x.flags.length)
				console.log(`  line ${x.line}  ${x.image}  ${x.size ?? ''}  ${x.flags.join(', ')}`);
	}
}
