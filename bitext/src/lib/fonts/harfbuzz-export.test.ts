import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getHarfBuzz } from './harfbuzz-loader.js';

const DEJAVU = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

describe('harfbuzz export shaping', () => {
	it('collapses ffi to a single ligature glyph with DejaVu when the font is present', async () => {
		if (!fs.existsSync(DEJAVU)) return;

		const hb = await getHarfBuzz();
		const buf = fs.readFileSync(DEJAVU);
		const blob = hb.createBlob(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
		const face = hb.createFace(blob, 0);
		const font = hb.createFont(face);
		font.setScale(48, 48);

		const buffer = hb.createBuffer();
		buffer.addText('ffi');
		buffer.guessSegmentProperties();
		hb.shape(font, buffer, 'kern,liga,rlig,clig,calt,ccmp');

		const glyphs = buffer.json();
		buffer.destroy();
		font.destroy();
		face.destroy();
		blob.destroy();

		expect(glyphs.length).toBe(1);
	});

	it('detects RTL cluster order for Arabic sample when Noto Arabic is present', async () => {
		const noto = fileURLToPath(
			new URL(
				'../../../node_modules/harfbuzzjs/test/fonts/noto/NotoSansArabic-Variable.ttf',
				import.meta.url
			)
		);
		if (!fs.existsSync(noto)) return;

		const hb = await getHarfBuzz();
		const buf = fs.readFileSync(noto);
		const blob = hb.createBlob(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
		const face = hb.createFace(blob, 0);
		const font = hb.createFont(face);
		font.setScale(48, 48);

		const buffer = hb.createBuffer();
		buffer.addText('أبجد');
		buffer.guessSegmentProperties();
		hb.shape(font, buffer);

		const glyphs = buffer.json();
		buffer.destroy();
		font.destroy();
		face.destroy();
		blob.destroy();

		expect(glyphs.length).toBeGreaterThan(1);
		expect(glyphs[0].cl).toBeGreaterThan(glyphs[glyphs.length - 1].cl);
	});
});
