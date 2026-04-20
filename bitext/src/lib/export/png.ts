import { svgStringToCanvas } from './svg-raster.js';

export async function svgStringToPngBlob(svg: string, scale = 2): Promise<Blob> {
	const { canvas } = await svgStringToCanvas(svg, scale);
	return await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
	});
}

export function downloadBlob(filename: string, blob: Blob) {
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	a.click();
	URL.revokeObjectURL(a.href);
}
