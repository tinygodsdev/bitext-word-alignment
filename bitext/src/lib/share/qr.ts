import { browser } from '$app/environment';
import { ALIGNER_SITE_URL } from '$lib/brand.js';

const QR_WIDTH = 280;

/** Raster size for the small “site only” QR embedded in PNG/SVG/PDF/HTML exports. */
const SITE_LANDING_QR_WIDTH = 48;

/**
 * PNG data URL for a QR code that encodes the full share URL (including `?data=…` payload).
 * Uses low error correction to maximize capacity; very long URLs may still exceed QR limits.
 */
export async function shareUrlToQrDataUrl(url: string): Promise<string> {
	if (!browser) {
		throw new Error('QR codes can only be generated in the browser');
	}
	if (!url.trim()) {
		throw new Error('Nothing to encode');
	}
	const QRCode = (await import('qrcode')).default;
	return QRCode.toDataURL(url, {
		width: QR_WIDTH,
		margin: 2,
		errorCorrectionLevel: 'L',
		color: { dark: '#000000', light: '#ffffff' }
	});
}

/** PNG data URL for a tiny QR that opens the app site (no `?data=` payload). Encodes exactly {@link ALIGNER_SITE_URL}. */
export async function siteLandingQrDataUrl(): Promise<string> {
	if (!browser) {
		throw new Error('QR codes can only be generated in the browser');
	}
	const QRCode = (await import('qrcode')).default;
	// `L` + small margin → smallest practical symbol (byte mode because of lowercase in `https://`).
	return QRCode.toDataURL(ALIGNER_SITE_URL, {
		width: SITE_LANDING_QR_WIDTH,
		margin: 1,
		errorCorrectionLevel: 'L',
		color: { dark: '#000000', light: '#ffffff' }
	});
}
