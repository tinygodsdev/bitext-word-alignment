/**
 * Decode SVG to a canvas (shared by PNG and PDF export). Avoids svg2pdf.js CJS/Vite issues.
 */
export async function svgStringToCanvas(
	svg: string,
	scale = 2
): Promise<{ canvas: HTMLCanvasElement; cssWidth: number; cssHeight: number }> {
	const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	try {
		const img = new Image();
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new Error('SVG image decode failed'));
			img.src = url;
		});
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
	} finally {
		URL.revokeObjectURL(url);
	}
}
