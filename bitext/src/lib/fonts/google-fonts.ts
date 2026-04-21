/** Curated Google Fonts for the picker (family slug → display name). */
export const GOOGLE_FONT_OPTIONS: { family: string; label: string }[] = [
	{ family: 'Inter', label: 'Inter' },
	{ family: 'Space Grotesk', label: 'Space Grotesk' },
	{ family: 'Lora', label: 'Lora' },
	{ family: 'Merriweather', label: 'Merriweather' },
	{ family: 'Open+Sans', label: 'Open Sans' },
	{ family: 'Roboto', label: 'Roboto' },
	{ family: 'Source+Serif+4', label: 'Source Serif 4' },
	{ family: 'IBM+Plex+Sans', label: 'IBM Plex Sans' },
	{ family: 'Noto+Sans', label: 'Noto Sans' },
	{ family: 'Noto+Serif', label: 'Noto Serif' },
	{ family: 'Playfair+Display', label: 'Playfair Display' },
	{ family: 'Fira+Sans', label: 'Fira Sans' },
	{ family: 'JetBrains+Mono', label: 'JetBrains Mono' },
	{ family: 'Literata', label: 'Literata' },
	{ family: 'Crimson+Pro', label: 'Crimson Pro' },
	{ family: 'Libre+Baskerville', label: 'Libre Baskerville' }
];

export function googleFontStylesheetUrl(familyCss: string): string {
	const f = familyCss.replace(/ /g, '+');
	/* Include 500 — token text uses font-weight 500 in preview and SVG export */
	return `https://fonts.googleapis.com/css2?family=${f}:wght@400;500;600;700&display=swap`;
}
