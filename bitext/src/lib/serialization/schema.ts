import {
	addAtomicConnections,
	createConnectionId,
	type Connection
} from '$lib/domain/alignment.js';
import { tokenize } from '$lib/domain/tokens.js';
import { PALETTES, type PaletteName } from '$lib/domain/palettes.js';

export const SCHEMA_VERSION = 2 as const;
/** @deprecated Legacy share payloads only */
export const SCHEMA_VERSION_V1 = 1 as const;

export const MAX_LINES = 8;

/** Initial text for lines created with “Add line” (prompts editing; user can replace). */
export const NEW_LINE_HINT_TEXT = 'Type your text here';

export type LineStyle = 'straight' | 'curved';
export type BackgroundMode = 'light' | 'dark' | 'image';
export type UiTheme = 'light' | 'dark';
export const MIN_LINE_GAP_PX = 40;
export const MAX_LINE_GAP_PX = 156;

export const MIN_TEXT_SIZE_PX = 12;
export const MAX_TEXT_SIZE_PX = 64;
export const DEFAULT_TOKEN_SPLIT_CHARS = '.-';

function normalizeTokenSplitCharsField(input: unknown, fallback: string): string {
	const raw = typeof input === 'string' ? input : fallback;
	const uniq: string[] = [];
	const seen = new Set<string>();
	for (const ch of raw) {
		if (/\s/u.test(ch)) continue;
		if (seen.has(ch)) continue;
		seen.add(ch);
		uniq.push(ch);
	}
	return uniq.join('').slice(0, 24);
}

export interface LineFontV2 {
	family: string;
	source: 'google' | 'custom';
	customName?: string;
}

export interface LineV2 {
	id: string;
	rawText: string;
	font: LineFontV2;
	textSizePx: number;
}

export interface PairControlV2 {
	upperLineId: string;
	lowerLineId: string;
	/** When false, connector paths are not drawn between this adjacent pair (data + coloring unchanged). */
	showConnectors: boolean;
}

export interface ProjectSnapshotV2 {
	lines: LineV2[];
	pairControls: PairControlV2[];
	connections: Connection[];
}

export interface VisualSettingsV2 {
	theme: UiTheme;
	gapWordPx: number;
	gapLinePx: number;
	lineThickness: number;
	lineOpacity: number;
	lineStyle: LineStyle;
	palette: PaletteName;
	showNumbers: boolean;
	colorTokensByLink: boolean;
	tokenSplitChars: string;
	background: BackgroundMode;
	backgroundImageDataUrl?: string;
}

export interface AppStateV2 {
	v: typeof SCHEMA_VERSION;
	project: ProjectSnapshotV2;
	settings: VisualSettingsV2;
}

/** @deprecated v1 — for compact-v2 decode bridge only */
export interface VisualSettingsV1 {
	theme: UiTheme;
	sourceTextSizePx: number;
	targetTextSizePx: number;
	glossTextSizePx: number;
	gapWordPx: number;
	gapLinePx: number;
	glossLineGapPx: number;
	lineThickness: number;
	lineOpacity: number;
	lineStyle: LineStyle;
	palette: PaletteName;
	showGloss: boolean;
	showNumbers: boolean;
	sourceFontFamily: string;
	targetFontFamily: string;
	sourceFontSource: 'google' | 'custom';
	targetFontSource: 'google' | 'custom';
	glossFontFamily: string;
	glossFontSource: 'google' | 'custom';
	sourceCustomFontName?: string;
	targetCustomFontName?: string;
	glossCustomFontName?: string;
	colorTokensByLink: boolean;
	tokenSplitChars: string;
	background: BackgroundMode;
	backgroundImageDataUrl?: string;
}

/** @deprecated v1 */
export interface ProjectSnapshotV1 {
	sourceText: string;
	targetText: string;
	sourceGlosses: (string | null)[];
	targetGlosses: (string | null)[];
	/** Decoded connections (upper/lower); legacy JSON may use sourceId/targetId until normalized */
	links: Connection[];
}

/** @deprecated v1 */
export interface AppStateV1 {
	v: typeof SCHEMA_VERSION_V1;
	project: ProjectSnapshotV1;
	settings: VisualSettingsV1;
}

export function normalizeUiTheme(theme: string): UiTheme {
	const t = theme.toLowerCase();
	if (t === 'dark' || t === 'synthwave' || t === 'dracula' || t === 'night') return 'dark';
	return 'light';
}

export function defaultVisualSettingsV2(): VisualSettingsV2 {
	return {
		theme: 'light',
		gapWordPx: 14,
		gapLinePx: 120,
		lineThickness: 3,
		lineOpacity: 1,
		lineStyle: 'curved',
		palette: 'pastel',
		showNumbers: false,
		colorTokensByLink: true,
		tokenSplitChars: DEFAULT_TOKEN_SPLIT_CHARS,
		background: 'light'
	};
}

export function defaultProjectSnapshotV2(): ProjectSnapshotV2 {
	return migrateV1ToV2(defaultProjectSnapshotV1(), defaultVisualSettingsV1()).project;
}

export function defaultAppStateV2(): AppStateV2 {
	return {
		v: SCHEMA_VERSION,
		project: defaultProjectSnapshotV2(),
		settings: defaultVisualSettingsV2()
	};
}

/** v1 defaults (for migration input only) */
export function defaultVisualSettingsV1(): VisualSettingsV1 {
	const size = 36;
	return {
		theme: 'light',
		sourceTextSizePx: size,
		targetTextSizePx: size,
		glossTextSizePx: Math.max(12, Math.round(0.75 * size)),
		gapWordPx: 14,
		gapLinePx: 120,
		glossLineGapPx: 0,
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

export function defaultProjectSnapshotV1(): ProjectSnapshotV1 {
	return {
		sourceText: 'Hello world',
		targetText: 'Bonjour le monde',
		sourceGlosses: [],
		targetGlosses: [],
		links: []
	};
}

/** @deprecated use defaultVisualSettingsV1 */
export const defaultVisualSettings = defaultVisualSettingsV1;
/** @deprecated use defaultProjectSnapshotV1 */
export const defaultProjectSnapshot = defaultProjectSnapshotV1;

export function visualSettingsV1ToV2(v1: VisualSettingsV1): VisualSettingsV2 {
	return {
		theme: normalizeUiTheme(String(v1.theme)),
		gapWordPx: v1.gapWordPx,
		gapLinePx: v1.gapLinePx,
		lineThickness: v1.lineThickness,
		lineOpacity: v1.lineOpacity,
		lineStyle: v1.lineStyle,
		palette: v1.palette,
		showNumbers: v1.showNumbers,
		colorTokensByLink: v1.colorTokensByLink,
		tokenSplitChars: v1.tokenSplitChars,
		background: v1.background,
		backgroundImageDataUrl: v1.backgroundImageDataUrl
	};
}

/**
 * Build v2 project + settings from legacy v1 snapshot.
 * Preserves token ids `s-*` and `t-*` for source/target lines. Optional gloss lines `gs` / `gt`.
 */
export function migrateV1ToV2(
	project: ProjectSnapshotV1,
	settingsV1: VisualSettingsV1
): { project: ProjectSnapshotV2; settings: VisualSettingsV2 } {
	const settings = visualSettingsV1ToV2(settingsV1);
	const splitChars = settings.tokenSplitChars;
	const glossColor = PALETTES[settingsV1.palette][0] ?? '#94a3b8';

	const sourceTokens = tokenize(project.sourceText, 's', splitChars);
	const targetTokens = tokenize(project.targetText, 't', splitChars);

	const lines: LineV2[] = [];
	/** Only non-default entries (`showConnectors === false`). */
	const pairControls: PairControlV2[] = [];
	let connections = normalizeProjectConnections(project.links);

	const srcLine: LineV2 = {
		id: 's',
		rawText: project.sourceText,
		font: {
			family: settingsV1.sourceFontFamily,
			source: settingsV1.sourceFontSource,
			customName: settingsV1.sourceCustomFontName
		},
		textSizePx: settingsV1.sourceTextSizePx
	};
	const tgtLine: LineV2 = {
		id: 't',
		rawText: project.targetText,
		font: {
			family: settingsV1.targetFontFamily,
			source: settingsV1.targetFontSource,
			customName: settingsV1.targetCustomFontName
		},
		textSizePx: settingsV1.targetTextSizePx
	};

	const hasSourceGloss =
		settingsV1.showGloss && project.sourceGlosses.some((g) => (g?.trim() ?? '').length > 0);
	const hasTargetGloss =
		settingsV1.showGloss && project.targetGlosses.some((g) => (g?.trim() ?? '').length > 0);

	if (hasSourceGloss) {
		const parts: string[] = [];
		const srcIndices: number[] = [];
		for (let i = 0; i < sourceTokens.length; i++) {
			const g = project.sourceGlosses[i]?.trim() ?? '';
			if (g) {
				srcIndices.push(i);
				parts.push(g);
			}
		}
		const gsLine: LineV2 = {
			id: 'gs',
			rawText: parts.join(' '),
			font: {
				family: settingsV1.glossFontFamily,
				source: settingsV1.glossFontSource,
				customName: settingsV1.glossCustomFontName
			},
			textSizePx: settingsV1.glossTextSizePx
		};
		lines.push(gsLine);
		pairControls.push({ upperLineId: 'gs', lowerLineId: 's', showConnectors: false });
		const glossTokens = tokenize(gsLine.rawText, 'gs', splitChars);
		const pairs: { upperTokenId: string; lowerTokenId: string }[] = [];
		const n = Math.min(glossTokens.length, srcIndices.length);
		for (let i = 0; i < n; i++) {
			pairs.push({
				upperTokenId: glossTokens[i]!.id,
				lowerTokenId: sourceTokens[srcIndices[i]!]!.id
			});
		}
		connections = addAtomicConnections(connections, pairs, glossColor);
	}

	lines.push(srcLine);
	lines.push(tgtLine);

	if (hasTargetGloss) {
		const parts: string[] = [];
		const tgtIndices: number[] = [];
		for (let i = 0; i < targetTokens.length; i++) {
			const g = project.targetGlosses[i]?.trim() ?? '';
			if (g) {
				tgtIndices.push(i);
				parts.push(g);
			}
		}
		const gtLine: LineV2 = {
			id: 'gt',
			rawText: parts.join(' '),
			font: {
				family: settingsV1.glossFontFamily,
				source: settingsV1.glossFontSource,
				customName: settingsV1.glossCustomFontName
			},
			textSizePx: settingsV1.glossTextSizePx
		};
		lines.push(gtLine);
		pairControls.push({ upperLineId: 't', lowerLineId: 'gt', showConnectors: false });
		const glossTokens = tokenize(gtLine.rawText, 'gt', splitChars);
		const pairs: { upperTokenId: string; lowerTokenId: string }[] = [];
		const n = Math.min(glossTokens.length, tgtIndices.length);
		for (let i = 0; i < n; i++) {
			pairs.push({
				upperTokenId: targetTokens[tgtIndices[i]!]!.id,
				lowerTokenId: glossTokens[i]!.id
			});
		}
		connections = addAtomicConnections(connections, pairs, glossColor);
	}

	return {
		project: { lines, pairControls, connections },
		settings
	};
}

/** Decode connections from share URLs / snapshots: upper/lower or legacy source/target. */
export function normalizeProjectConnections(raw: unknown): Connection[] {
	if (!Array.isArray(raw)) return [];
	const out: Connection[] = [];
	for (const item of raw) {
		if (!item || typeof item !== 'object') continue;
		const o = item as Record<string, unknown>;
		const upper =
			(typeof o.upperTokenId === 'string' && o.upperTokenId) ||
			(typeof o.sourceId === 'string' && o.sourceId) ||
			null;
		const lower =
			(typeof o.lowerTokenId === 'string' && o.lowerTokenId) ||
			(typeof o.targetId === 'string' && o.targetId) ||
			null;
		if (typeof o.id === 'string' && upper && lower) {
			out.push({
				id: o.id,
				upperTokenId: upper,
				lowerTokenId: lower,
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
						id: createConnectionId(),
						upperTokenId: String(s),
						lowerTokenId: String(t),
						color
					});
				}
			}
		}
	}
	return out;
}

/** Merge decoded JSON into VisualSettingsV1 (handles legacy single-font fields). */
export function normalizeVisualSettings(
	raw: Record<string, unknown> | undefined
): VisualSettingsV1 {
	const d = defaultVisualSettingsV1();
	if (!raw || typeof raw !== 'object') return d;
	const legacyFamily = typeof raw.fontFamily === 'string' ? raw.fontFamily : undefined;
	const legacySource =
		raw.fontSource === 'google' || raw.fontSource === 'custom' ? raw.fontSource : undefined;
	const legacyCustom = typeof raw.customFontName === 'string' ? raw.customFontName : undefined;
	const normalizedSplitChars = normalizeTokenSplitCharsField(
		raw.tokenSplitChars,
		d.tokenSplitChars
	);

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

	const pickGlossTextSize = (v: unknown, fallback: number) =>
		typeof v === 'number' && Number.isFinite(v)
			? Math.max(MIN_TEXT_SIZE_PX, Math.min(MAX_TEXT_SIZE_PX, v))
			: fallback;

	const glossTextSizePx = pickGlossTextSize(
		rawRest.glossTextSizePx,
		Math.max(
			MIN_TEXT_SIZE_PX,
			Math.min(MAX_TEXT_SIZE_PX, Math.round(0.75 * Math.min(sourceTextSizePx, targetTextSizePx)))
		)
	);

	return {
		...d,
		...rawRest,
		sourceTextSizePx,
		targetTextSizePx,
		glossTextSizePx,
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
				? Math.max(0, Math.min(80, rawRest.glossLineGapPx))
				: d.glossLineGapPx
	} as VisualSettingsV1;
}

export function appStateV2FromV1(state: AppStateV1): AppStateV2 {
	const migrated = migrateV1ToV2(state.project, state.settings);
	return { v: SCHEMA_VERSION, project: migrated.project, settings: migrated.settings };
}

export function migrate(raw: unknown): AppStateV2 {
	if (!raw || typeof raw !== 'object') {
		return defaultAppStateV2();
	}
	const o = raw as Record<string, unknown>;
	const v = o.v;
	if (v === SCHEMA_VERSION) {
		const project = o.project as ProjectSnapshotV2 | undefined;
		const settingsRaw = o.settings as Record<string, unknown> | undefined;
		if (project?.lines && Array.isArray(project.lines) && settingsRaw) {
			return {
				v: SCHEMA_VERSION,
				project: project as ProjectSnapshotV2,
				settings: normalizeVisualSettingsV2(settingsRaw)
			};
		}
	}
	if (v === SCHEMA_VERSION_V1) {
		const project = o.project as ProjectSnapshotV1 | undefined;
		const settingsRaw = o.settings as Record<string, unknown> | undefined;
		if (project) {
			const links = normalizeProjectConnections(project.links);
			return appStateV2FromV1({
				v: SCHEMA_VERSION_V1,
				project: {
					sourceText: String(project.sourceText ?? ''),
					targetText: String(project.targetText ?? ''),
					sourceGlosses: Array.isArray(project.sourceGlosses)
						? project.sourceGlosses.map((g) => (g == null ? null : String(g)))
						: [],
					targetGlosses: Array.isArray(project.targetGlosses)
						? project.targetGlosses.map((g) => (g == null ? null : String(g)))
						: [],
					links
				},
				settings: normalizeVisualSettings(settingsRaw)
			});
		}
	}
	return defaultAppStateV2();
}

function clampOpacity(o: number): number {
	return Math.max(0.2, Math.min(1, o));
}

export function normalizeVisualSettingsV2(
	raw: Record<string, unknown> | undefined
): VisualSettingsV2 {
	const d = defaultVisualSettingsV2();
	if (!raw || typeof raw !== 'object') return d;
	const gapLinePx =
		typeof raw.gapLinePx === 'number'
			? Math.max(MIN_LINE_GAP_PX, Math.min(MAX_LINE_GAP_PX, raw.gapLinePx))
			: d.gapLinePx;
	return {
		theme: normalizeUiTheme(String(raw.theme ?? d.theme)),
		gapWordPx:
			typeof raw.gapWordPx === 'number' && Number.isFinite(raw.gapWordPx)
				? raw.gapWordPx
				: d.gapWordPx,
		gapLinePx,
		lineThickness:
			typeof raw.lineThickness === 'number' && Number.isFinite(raw.lineThickness)
				? Math.max(1, Math.min(8, Math.round(raw.lineThickness)))
				: d.lineThickness,
		lineOpacity:
			typeof raw.lineOpacity === 'number' && Number.isFinite(raw.lineOpacity)
				? clampOpacity(raw.lineOpacity)
				: d.lineOpacity,
		lineStyle:
			raw.lineStyle === 'straight' || raw.lineStyle === 'curved' ? raw.lineStyle : d.lineStyle,
		palette:
			raw.palette === 'pastel' || raw.palette === 'vivid' || raw.palette === 'academic'
				? raw.palette
				: d.palette,
		showNumbers: typeof raw.showNumbers === 'boolean' ? raw.showNumbers : d.showNumbers,
		colorTokensByLink:
			typeof raw.colorTokensByLink === 'boolean' ? raw.colorTokensByLink : d.colorTokensByLink,
		tokenSplitChars: normalizeTokenSplitCharsField(raw.tokenSplitChars, d.tokenSplitChars),
		background:
			raw.background === 'light' || raw.background === 'dark' || raw.background === 'image'
				? raw.background
				: d.background,
		backgroundImageDataUrl:
			typeof raw.backgroundImageDataUrl === 'string'
				? raw.backgroundImageDataUrl
				: d.backgroundImageDataUrl
	};
}
