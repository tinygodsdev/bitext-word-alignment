import { ALIGNER_SITE_HOST, ALIGNER_SITE_URL } from '$lib/brand.js';
import { escapeXml } from './xml.js';

const GOOGLE_SANS_STYLESHEET =
	'https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap';

/**
 * @param visualizationFontHrefs Google Fonts CSS URLs for the families used inside the SVG (source/target). Required so metrics match the preview when the file is opened elsewhere.
 */
export function wrapSvgInHtml(
	svg: string,
	title: string,
	visualizationFontHrefs: string[]
): string {
	const hrefs = [...new Set([...visualizationFontHrefs, GOOGLE_SANS_STYLESHEET])];
	const fontLinks = hrefs.map((h) => `<link href="${escapeXml(h)}" rel="stylesheet"/>`).join('\n');
	const attrLine = `Created with <a href="${escapeXml(ALIGNER_SITE_URL)}" target="_blank" rel="noopener noreferrer">${escapeXml(ALIGNER_SITE_HOST)}</a>`;
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeXml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
${fontLinks}
<style>html,body{margin:0;background:#fff;}svg{display:block;max-width:100%;height:auto;}.export-attribution{margin:0;padding:10px 12px 14px;font-family:"Google Sans",sans-serif;font-size:12px;line-height:1.4;color:#64748b;text-align:center;}.export-attribution a{color:#475569;text-decoration:underline;}</style>
</head>
<body>
${svg}
<p class="export-attribution">${attrLine}</p>
</body>
</html>`;
}
