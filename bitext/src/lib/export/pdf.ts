import { jsPDF } from 'jspdf';
import { svgStringToCanvas } from './svg-raster.js';

/** Raster PDF (PNG page) — reliable in Vite; no svg2pdf.js / CJS interop. */
export async function svgStringToPdfBlob(svg: string): Promise<Blob> {
	const { canvas, cssWidth, cssHeight } = await svgStringToCanvas(svg, 2);
	const w = cssWidth;
	const h = cssHeight;
	const pngData = canvas.toDataURL('image/png');
	const pdf = new jsPDF({
		orientation: w > h ? 'landscape' : 'portrait',
		unit: 'pt',
		format: [w, h]
	});
	pdf.addImage(pngData, 'PNG', 0, 0, w, h);
	return pdf.output('blob');
}
