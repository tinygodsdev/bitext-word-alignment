import { escapeXml } from './xml.js';

export function wrapSvgInHtml(svg: string, title: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeXml(title)}</title>
<style>html,body{margin:0;background:#fff;}svg{display:block;max-width:100%;height:auto;}</style>
</head>
<body>
${svg}
</body>
</html>`;
}
