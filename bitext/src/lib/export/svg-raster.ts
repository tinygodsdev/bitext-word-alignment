/**
 * Decode SVG to a canvas (shared by PNG and PDF export).
 *
 * Delivery: `data:image/svg+xml;charset=utf-8,…` with encoded contents — reliably
 * re-parses styles on load and keeps the embedded `@font-face` (Google fonts as
 * woff2 data URLs) intact. Custom TTFs are handled separately by converting
 * `<text>` to `<path>` upstream, so this path no longer has to race async font loads.
 */
export async function svgStringToCanvas(
	svg: string,
	scale = 2
): Promise<{ canvas: HTMLCanvasElement; cssWidth: number; cssHeight: number }> {
	const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	const img = new Image();
	await new Promise<void>((resolve, reject) => {
		img.onload = () => resolve();
		img.onerror = () => reject(new Error('SVG image decode failed'));
		img.src = dataUrl;
	});

	/** Two rAFs — let any late-binding style / font apply step settle before rasterizing. */
	await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

	const cssWidth = img.naturalWidth || img.width;
	const cssHeight = img.naturalHeight || img.height;
	const canvas = document.createElement('canvas');
	canvas.width = Math.ceil(cssWidth * scale);
	canvas.height = Math.ceil(cssHeight * scale);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('no 2d context');
	ctx.scale(scale, scale);
	ctx.drawImage(img, 0, 0);
	return { canvas, cssWidth, cssHeight };
}
