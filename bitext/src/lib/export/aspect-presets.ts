/**
 * Fixed-canvas export presets for social platforms. `auto` (no preset) keeps the
 * dynamic, content-sized export. Each preset gives an exact pixel canvas that the
 * diagram is fitted into, centered with padding.
 */
export type AspectPreset = {
	id: string;
	label: string;
	ratio: string;
	width: number;
	height: number;
	/** Platforms this size suits — shown as a hint. */
	note: string;
};

export const ASPECT_PRESETS: AspectPreset[] = [
	{
		id: 'square',
		label: 'Square',
		ratio: '1:1',
		width: 1080,
		height: 1080,
		note: 'Instagram post'
	},
	{
		id: 'portrait',
		label: 'Portrait',
		ratio: '4:5',
		width: 1080,
		height: 1350,
		note: 'Instagram portrait'
	},
	{
		id: 'story',
		label: 'Story / Reel',
		ratio: '9:16',
		width: 1080,
		height: 1920,
		note: 'Stories, Reels, TikTok'
	},
	{ id: 'wide', label: 'Wide', ratio: '16:9', width: 1600, height: 900, note: 'X, YouTube' },
	{
		id: 'link',
		label: 'Link / OG',
		ratio: '1.91:1',
		width: 1200,
		height: 630,
		note: 'LinkedIn, Facebook, link preview'
	}
];

/** Fraction of the shorter side kept as a safe margin around the diagram. */
export const ASPECT_PADDING_RATIO = 0.06;

export function presetPadding(preset: AspectPreset): number {
	return Math.round(Math.min(preset.width, preset.height) * ASPECT_PADDING_RATIO);
}

export function findAspectPreset(id: string | null | undefined): AspectPreset | undefined {
	return ASPECT_PRESETS.find((p) => p.id === id);
}
