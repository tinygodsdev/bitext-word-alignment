import { createLinkId, type Link } from '$lib/domain/alignment.js';
import type { PaletteName } from '$lib/domain/palettes.js';

export const SCHEMA_VERSION = 1 as const;

export type LineStyle = 'straight' | 'curved';
export type BackgroundMode = 'light' | 'dark' | 'image';
export type UiTheme = 'light' | 'dark';
export const MIN_LINE_GAP_PX = 40;
/** Previous cap was 120px; +30% headroom for large layouts */
export const MAX_LINE_GAP_PX = 156;

export const MIN_TEXT_SIZE_PX = 12;
/** Was 36→47; allow large on-screen preview (e.g. demos) */
export const MAX_TEXT_SIZE_PX = 64;
export const MIN_GLOSS_LINE_GAP_PX = 0;
export const MAX_GLOSS_LINE_GAP_PX = 80;
export const DEFAULT_TOKEN_SPLIT_CHARS = '.-';

/** Scales with the smaller of the two line sizes (same rule as in-app gloss preview). */
export function defaultGlossFontSizePx(s: {
	sourceTextSizePx: number;
	targetTextSizePx: number;
}): number {
	return Math.max(12, Math.round(0.75 * Math.min(s.sourceTextSizePx, s.targetTextSizePx)));
}

/** Normalize theme from shared `?data=` payloads to BeerCSS body class `light` | `dark`. */
export function normalizeUiTheme(theme: string): UiTheme {
	const t = theme.toLowerCase();
	// Older snapshots used extra strings that always meant a dark UI.
	if (t === 'dark' || t === 'synthwave' || t === 'dracula' || t === 'night') return 'dark';
	return 'light';
}

export interface VisualSettingsV1 {
	theme: UiTheme;
	sourceTextSizePx: number;
	targetTextSizePx: number;
	gapWordPx: number;
	gapLinePx: number;
	/** Vertical gap between a gloss row and its sentence line (preview + export layout). */
	glossLineGapPx: number;
	lineThickness: number;
	lineOpacity: number;
	lineStyle: LineStyle;
	palette: PaletteName;
	showGloss: boolean;
	showNumbers: boolean;
	/** Visualization font for the source line */
	sourceFontFamily: string;
	/** Visualization font for the target line */
	targetFontFamily: string;
	sourceFontSource: 'google' | 'custom';
	targetFontSource: 'google' | 'custom';
	/** Interlinear glosses (independent of source/target line script fonts) */
	glossFontFamily: string;
	glossFontSource: 'google' | 'custom';
	sourceCustomFontName?: string;
	targetCustomFontName?: string;
	glossCustomFontName?: string;
	/** Tint token text (preview + editor chips) with link colors */
	colorTokensByLink: boolean;
	/** Extra one-char separators besides whitespace for tokenization. */
	tokenSplitChars: string;
	background: BackgroundMode;
	/** Client-only; omitted when encoding share URL */
	backgroundImageDataUrl?: string;
}

export interface ProjectSnapshotV1 {
	sourceText: string;
	targetText: string;
	/** Parallel arrays aligned with tokenize order — optional gloss per index */
	sourceGlosses: (string | null)[];
	targetGlosses: (string | null)[];
	links: Link[];
}

export interface AppStateV1 {
	v: typeof SCHEMA_VERSION;
	project: ProjectSnapshotV1;
	settings: VisualSettingsV1;
}

export function defaultVisualSettings(): VisualSettingsV1 {
	const size = 36;
	return {
		theme: 'light',
		sourceTextSizePx: size,
		targetTextSizePx: size,
		gapWordPx: 14,
		gapLinePx: 120,
		glossLineGapPx: MIN_GLOSS_LINE_GAP_PX,
		lineThickness: 3,
		lineOpacity: 1,
		lineStyle: 'curved',
		palette: 'pastel',
		showGloss: false,
		showNumbers: false,
		sourceFontFamily: 'Inter',
		targetFontFamily: 'Inter',
		glossFontFamily: 'Inter',
		sourceFontSource: 'google',
		targetFontSource: 'google',
		glossFontSource: 'google',
		colorTokensByLink: true,
		tokenSplitChars: DEFAULT_TOKEN_SPLIT_CHARS,
		background: 'light'
	};
}

export function defaultProjectSnapshot(): ProjectSnapshotV1 {
	return {
		sourceText: 'Hello world',
		targetText: 'Bonjour le monde',
		sourceGlosses: [],
		targetGlosses: [],
		links: []
	};
}

/** Merge decoded JSON into VisualSettingsV1 (handles legacy single-font fields). */
export function normalizeVisualSettings(
	raw: Record<string, unknown> | undefined
): VisualSettingsV1 {
	const d = defaultVisualSettings();
	if (!raw || typeof raw !== 'object') return d;
	const legacyFamily = typeof raw.fontFamily === 'string' ? raw.fontFamily : undefined;
	const legacySource =
		raw.fontSource === 'google' || raw.fontSource === 'custom' ? raw.fontSource : undefined;
	const legacyCustom = typeof raw.customFontName === 'string' ? raw.customFontName : undefined;
	const normalizedSplitChars = (() => {
		const input = typeof raw.tokenSplitChars === 'string' ? raw.tokenSplitChars : d.tokenSplitChars;
		const uniq: string[] = [];
		const seen = new Set<string>();
		for (const ch of input) {
			if (/\s/u.test(ch)) continue;
			if (seen.has(ch)) continue;
			seen.add(ch);
			uniq.push(ch);
		}
		return uniq.join('').slice(0, 24);
	})();

	const { textSizePx: _legacyTextSize, ...rawRest } = raw;

	const legacyLineSize =
		typeof _legacyTextSize === 'number' && Number.isFinite(_legacyTextSize)
			? Math.max(MIN_TEXT_SIZE_PX, Math.min(MAX_TEXT_SIZE_PX, _legacyTextSize))
			: undefined;

	const pickTextSize = (v: unknown, fallback: number) =>
		typeof v === 'number' && Number.isFinite(v)
			? Math.max(MIN_TEXT_SIZE_PX, Math.min(MAX_TEXT_SIZE_PX, v))
			: fallback;

	const sourceTextSizePx = pickTextSize(
		rawRest.sourceTextSizePx,
		legacyLineSize !== undefined ? legacyLineSize : d.sourceTextSizePx
	);
	const targetTextSizePx = pickTextSize(
		rawRest.targetTextSizePx,
		legacyLineSize !== undefined ? legacyLineSize : d.targetTextSizePx
	);

	return {
		...d,
		...rawRest,
		sourceTextSizePx,
		targetTextSizePx,
		theme: normalizeUiTheme(String(rawRest.theme ?? d.theme)),
		sourceFontFamily:
			typeof rawRest.sourceFontFamily === 'string'
				? rawRest.sourceFontFamily
				: (legacyFamily ?? d.sourceFontFamily),
		targetFontFamily:
			typeof rawRest.targetFontFamily === 'string'
				? rawRest.targetFontFamily
				: (legacyFamily ?? d.targetFontFamily),
		glossFontFamily:
			typeof rawRest.glossFontFamily === 'string' ? rawRest.glossFontFamily : d.glossFontFamily,
		sourceFontSource:
			rawRest.sourceFontSource === 'google' || rawRest.sourceFontSource === 'custom'
				? rawRest.sourceFontSource
				: (legacySource ?? d.sourceFontSource),
		targetFontSource:
			rawRest.targetFontSource === 'google' || rawRest.targetFontSource === 'custom'
				? rawRest.targetFontSource
				: (legacySource ?? d.targetFontSource),
		glossFontSource:
			rawRest.glossFontSource === 'google' || rawRest.glossFontSource === 'custom'
				? rawRest.glossFontSource
				: d.glossFontSource,
		sourceCustomFontName:
			typeof rawRest.sourceCustomFontName === 'string'
				? rawRest.sourceCustomFontName
				: legacyCustom,
		targetCustomFontName:
			typeof rawRest.targetCustomFontName === 'string'
				? rawRest.targetCustomFontName
				: legacyCustom,
		glossCustomFontName:
			typeof rawRest.glossCustomFontName === 'string'
				? rawRest.glossCustomFontName
				: d.glossCustomFontName,
		colorTokensByLink:
			typeof rawRest.colorTokensByLink === 'boolean' ? rawRest.colorTokensByLink : true,
		tokenSplitChars: normalizedSplitChars,
		gapLinePx:
			typeof rawRest.gapLinePx === 'number'
				? Math.max(MIN_LINE_GAP_PX, Math.min(MAX_LINE_GAP_PX, rawRest.gapLinePx))
				: d.gapLinePx,
		glossLineGapPx:
			typeof rawRest.glossLineGapPx === 'number'
				? Math.max(MIN_GLOSS_LINE_GAP_PX, Math.min(MAX_GLOSS_LINE_GAP_PX, rawRest.glossLineGapPx))
				: d.glossLineGapPx
	} as VisualSettingsV1;
}

/** Decode `links` from share URLs: atomic pairs, or legacy bipartite `{ sourceIds, targetIds }`. */
export function normalizeProjectLinks(raw: unknown): Link[] {
	if (!Array.isArray(raw)) return [];
	const out: Link[] = [];
	for (const item of raw) {
		if (!item || typeof item !== 'object') continue;
		const o = item as Record<string, unknown>;
		if (
			typeof o.id === 'string' &&
			typeof o.sourceId === 'string' &&
			typeof o.targetId === 'string'
		) {
			out.push({
				id: o.id,
				sourceId: o.sourceId,
				targetId: o.targetId,
				color: typeof o.color === 'string' ? o.color : undefined
			});
			continue;
		}
		const sIds = o.sourceIds;
		const tIds = o.targetIds;
		if (Array.isArray(sIds) && Array.isArray(tIds)) {
			const color = typeof o.color === 'string' ? o.color : '#94a3b8';
			for (const s of sIds) {
				for (const t of tIds) {
					out.push({
						id: createLinkId(),
						sourceId: String(s),
						targetId: String(t),
						color
					});
				}
			}
		}
	}
	return out;
}

export function migrate(raw: unknown): AppStateV1 {
	if (!raw || typeof raw !== 'object') {
		return {
			v: SCHEMA_VERSION,
			project: defaultProjectSnapshot(),
			settings: defaultVisualSettings()
		};
	}
	const o = raw as Record<string, unknown>;
	const v = o.v;
	if (v !== 1) {
		return {
			v: SCHEMA_VERSION,
			project: defaultProjectSnapshot(),
			settings: defaultVisualSettings()
		};
	}
	const project = o.project as ProjectSnapshotV1 | undefined;
	const settingsRaw = o.settings as Record<string, unknown> | undefined;
	return {
		v: SCHEMA_VERSION,
		project: project
			? {
					sourceText: String(project.sourceText ?? ''),
					targetText: String(project.targetText ?? ''),
					sourceGlosses: Array.isArray(project.sourceGlosses)
						? project.sourceGlosses.map((g) => (g == null ? null : String(g)))
						: [],
					targetGlosses: Array.isArray(project.targetGlosses)
						? project.targetGlosses.map((g) => (g == null ? null : String(g)))
						: [],
					links: Array.isArray(project.links) ? normalizeProjectLinks(project.links) : []
				}
			: defaultProjectSnapshot(),
		settings: normalizeVisualSettings(settingsRaw)
	};
}
