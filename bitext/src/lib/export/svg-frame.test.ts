import { describe, expect, it } from 'vitest';
import { buildStandaloneSvgString } from './svg.js';

/** Minimal valid args; empty tokenLayout makes the crop fall back to the content width/height. */
function baseArgs() {
	return {
		width: 400,
		height: 200,
		backgroundColor: '#ffffff',
		defaultTextColor: '#000000',
		colorTokensByLink: false,
		lineStyle: 'curved' as const,
		lineThickness: 3,
		lineOpacity: 1,
		lineOrder: [] as string[],
		lines: [],
		tokenLayout: {},
		connections: [],
		pairControls: [],
		includeAttributionFooter: false
	};
}

describe('buildStandaloneSvgString framing', () => {
	it('does not wrap content in a frame when no frame is given', () => {
		const svg = buildStandaloneSvgString(baseArgs());
		expect(svg).toMatch(/^<\?xml[^\n]*\n<svg /);
		expect(svg).not.toContain('<g transform="translate(');
	});

	it('emits the exact preset canvas and wraps content in a transform', () => {
		const svg = buildStandaloneSvgString({
			...baseArgs(),
			frame: { width: 1080, height: 1080, padding: 64, background: '#ffffff' }
		});
		expect(svg).toMatch(/<svg[^>]*width="1080"[^>]*height="1080"/);
		expect(svg).toContain('viewBox="0 0 1080 1080"');
		expect(svg).toContain('<g transform="translate(');
		// A full-canvas background rect is drawn behind the fitted diagram.
		expect(svg).toContain('width="1080" height="1080" fill="#ffffff"');
	});

	it('uses the frame background when it differs from the content background', () => {
		const svg = buildStandaloneSvgString({
			...baseArgs(),
			frame: { width: 1200, height: 630, background: '#1e1e1e' }
		});
		expect(svg).toContain('width="1200" height="630" fill="#1e1e1e"');
	});
});
