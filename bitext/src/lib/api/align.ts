import { encodeState } from '$lib/serialization/encode.js';
import { tokenize, tokenizeOptionsFromVisualSettings } from '$lib/domain/tokens.js';
import { createConnectionId, pendingAlignmentColor, type Connection } from '$lib/domain/alignment.js';
import {
	defaultVisualSettingsV2,
	SCHEMA_VERSION,
	type AppStateV2,
	type LinePairGapV2,
	type LineV2,
	type PairControlV2,
	type VisualSettingsV2
} from '$lib/serialization/schema.js';

const DEFAULT_FONT_FAMILY = 'Inter';
const DEFAULT_TEXT_SIZE_PX = 36;
const DEFAULT_WORD_GAP_PX = 14;

export type AlignmentTuple = [number, number, number, number];

/** Per-line visual options (all optional). */
export interface LineInput {
	text: string;
	/** Google Fonts family name. Defaults to Inter. */
	font?: string;
	/** Text size in px (12–64). Defaults to 36. */
	sizePx?: number;
	/** Horizontal gap between word tokens in px (0–56). Defaults to 14. */
	gapPx?: number;
	/** Right-to-left layout (Hebrew, Arabic, etc.). Defaults to false. */
	rtl?: boolean;
}

/** Global visual settings overrides. All fields optional; unset fields inherit defaults. */
export interface SettingsInput {
	/** Color palette for connection lines. */
	palette?: 'pastel' | 'vivid' | 'academic';
	/** Connection line shape. */
	lineStyle?: 'straight' | 'curved';
	/** Connection line thickness (1–8). */
	lineThickness?: number;
	/** Connection line opacity (0.2–1). */
	lineOpacity?: number;
	/** Preview background color. */
	background?: 'light' | 'dark';
	/** UI theme (affects token chip color). */
	theme?: 'light' | 'dark';
	/** Show line numbers next to lines. */
	showNumbers?: boolean;
	/** Tint word tokens in the color of their connection. */
	colorTokensByLink?: boolean;
	/**
	 * Characters (besides whitespace) that split text into separate word tokens.
	 * Default is ".-|". For Leipzig glosses, set "-|" so periods stay inside a token
	 * (e.g. "go.PST.IPFV" is one token instead of three). The split character itself is
	 * not drawn, so any character you keep here disappears from the rendered text.
	 */
	tokenSplitChars?: string;
	/**
	 * Single character that joins parts into one alignment token while rendering as a space
	 * (e.g. "is+playing" shows "is playing" but counts as one word). Default is "+".
	 */
	tokenMergeChar?: string;
}

/** Per-adjacent-pair controls. `upper` and `lower` are 0-based line indices (lower = upper + 1). */
export interface PairInput {
	upper: number;
	lower: number;
	/** Vertical gap between the two lines in px (12–156). Defaults to 120. */
	gapPx?: number;
	/** Draw connector lines between this pair. Defaults to true. */
	showConnectors?: boolean;
}

export interface AlignRequest {
	lines: (string | LineInput)[];
	alignments?: AlignmentTuple[];
	settings?: SettingsInput;
	pairs?: PairInput[];
}

export type AlignResult = { url: string } | { err: string };

// ── Validation helpers ────────────────────────────────────────────────────────

function parseLineEntry(val: unknown, idx: number): LineInput | { err: string } {
	if (typeof val === 'string') return { text: val };
	if (!val || typeof val !== 'object') return { err: `lines[${idx}] must be a string or object` };
	const v = val as Record<string, unknown>;
	if (typeof v.text !== 'string' || v.text === '')
		return { err: `lines[${idx}].text must be a non-empty string` };
	if (v.font !== undefined && typeof v.font !== 'string')
		return { err: `lines[${idx}].font must be a string` };
	if (v.sizePx !== undefined && (typeof v.sizePx !== 'number' || !Number.isFinite(v.sizePx)))
		return { err: `lines[${idx}].sizePx must be a number` };
	if (v.gapPx !== undefined && (typeof v.gapPx !== 'number' || !Number.isFinite(v.gapPx)))
		return { err: `lines[${idx}].gapPx must be a number` };
	if (v.rtl !== undefined && typeof v.rtl !== 'boolean')
		return { err: `lines[${idx}].rtl must be a boolean` };
	return {
		text: v.text,
		font: typeof v.font === 'string' ? v.font : undefined,
		sizePx: typeof v.sizePx === 'number' ? v.sizePx : undefined,
		gapPx: typeof v.gapPx === 'number' ? v.gapPx : undefined,
		rtl: typeof v.rtl === 'boolean' ? v.rtl : undefined
	};
}

function parseSettingsInput(val: unknown): { ok: SettingsInput } | { err: string } {
	if (!val || typeof val !== 'object') return { err: '"settings" must be an object' };
	const v = val as Record<string, unknown>;

	const PALETTES = new Set(['pastel', 'vivid', 'academic']);
	const STYLES = new Set(['straight', 'curved']);
	const THEMES = new Set(['light', 'dark']);
	const BKGS = new Set(['light', 'dark']);

	if (v.palette !== undefined && !PALETTES.has(v.palette as string))
		return { err: `settings.palette must be one of: ${[...PALETTES].join(', ')}` };
	if (v.lineStyle !== undefined && !STYLES.has(v.lineStyle as string))
		return { err: `settings.lineStyle must be one of: ${[...STYLES].join(', ')}` };
	if (v.theme !== undefined && !THEMES.has(v.theme as string))
		return { err: `settings.theme must be one of: ${[...THEMES].join(', ')}` };
	if (v.background !== undefined && !BKGS.has(v.background as string))
		return { err: `settings.background must be one of: ${[...BKGS].join(', ')}` };
	if (v.lineThickness !== undefined && (typeof v.lineThickness !== 'number' || !Number.isFinite(v.lineThickness)))
		return { err: 'settings.lineThickness must be a number' };
	if (v.lineOpacity !== undefined && (typeof v.lineOpacity !== 'number' || !Number.isFinite(v.lineOpacity)))
		return { err: 'settings.lineOpacity must be a number' };
	if (v.showNumbers !== undefined && typeof v.showNumbers !== 'boolean')
		return { err: 'settings.showNumbers must be a boolean' };
	if (v.colorTokensByLink !== undefined && typeof v.colorTokensByLink !== 'boolean')
		return { err: 'settings.colorTokensByLink must be a boolean' };
	if (v.tokenSplitChars !== undefined && typeof v.tokenSplitChars !== 'string')
		return { err: 'settings.tokenSplitChars must be a string' };
	if (v.tokenMergeChar !== undefined && (typeof v.tokenMergeChar !== 'string' || v.tokenMergeChar.length > 1))
		return { err: 'settings.tokenMergeChar must be a single character' };

	return {
		ok: {
			palette: v.palette as SettingsInput['palette'],
			lineStyle: v.lineStyle as SettingsInput['lineStyle'],
			theme: v.theme as SettingsInput['theme'],
			background: v.background as SettingsInput['background'],
			lineThickness: typeof v.lineThickness === 'number' ? v.lineThickness : undefined,
			lineOpacity: typeof v.lineOpacity === 'number' ? v.lineOpacity : undefined,
			showNumbers: typeof v.showNumbers === 'boolean' ? v.showNumbers : undefined,
			colorTokensByLink: typeof v.colorTokensByLink === 'boolean' ? v.colorTokensByLink : undefined,
			tokenSplitChars: typeof v.tokenSplitChars === 'string' ? v.tokenSplitChars : undefined,
			tokenMergeChar: typeof v.tokenMergeChar === 'string' ? v.tokenMergeChar : undefined
		}
	};
}

function parsePairsInput(val: unknown, lineCount: number): { ok: PairInput[] } | { err: string } {
	if (!Array.isArray(val)) return { err: '"pairs" must be an array' };
	const result: PairInput[] = [];
	for (let i = 0; i < val.length; i++) {
		const p = val[i];
		if (!p || typeof p !== 'object') return { err: `pairs[${i}] must be an object` };
		const pv = p as Record<string, unknown>;
		if (!Number.isInteger(pv.upper) || !Number.isInteger(pv.lower))
			return { err: `pairs[${i}]: "upper" and "lower" must be integers` };
		const upper = pv.upper as number;
		const lower = pv.lower as number;
		if (upper < 0 || upper >= lineCount) return { err: `pairs[${i}].upper=${upper} out of range` };
		if (lower !== upper + 1) return { err: `pairs[${i}]: lower must equal upper + 1 (got upper=${upper}, lower=${lower})` };
		if (pv.gapPx !== undefined && (typeof pv.gapPx !== 'number' || !Number.isFinite(pv.gapPx)))
			return { err: `pairs[${i}].gapPx must be a number` };
		if (pv.showConnectors !== undefined && typeof pv.showConnectors !== 'boolean')
			return { err: `pairs[${i}].showConnectors must be a boolean` };
		result.push({
			upper,
			lower,
			gapPx: typeof pv.gapPx === 'number' ? pv.gapPx : undefined,
			showConnectors: typeof pv.showConnectors === 'boolean' ? pv.showConnectors : undefined
		});
	}
	return { ok: result };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function parseAlignBody(body: unknown): { ok: AlignRequest } | { err: string } {
	if (!body || typeof body !== 'object') return { err: 'Body must be a JSON object' };
	const b = body as Record<string, unknown>;

	if (!Array.isArray(b.lines) || b.lines.length === 0)
		return { err: '"lines" must be a non-empty array' };
	if (b.lines.length > 8) return { err: 'Maximum 8 lines allowed' };

	const lines: LineInput[] = [];
	for (let i = 0; i < b.lines.length; i++) {
		const parsed = parseLineEntry(b.lines[i], i);
		if ('err' in parsed) return { err: parsed.err };
		lines.push(parsed);
	}

	const alignments: AlignmentTuple[] = [];
	if (b.alignments !== undefined) {
		if (!Array.isArray(b.alignments)) return { err: '"alignments" must be an array' };
		for (const a of b.alignments) {
			if (
				!Array.isArray(a) ||
				a.length !== 4 ||
				a.some((x) => typeof x !== 'number' || !Number.isInteger(x))
			)
				return { err: 'Each alignment must be [lineA, wordA, lineB, wordB] (integers)' };
			alignments.push(a as AlignmentTuple);
		}
	}

	let settings: SettingsInput | undefined;
	if (b.settings !== undefined) {
		const parsed = parseSettingsInput(b.settings);
		if ('err' in parsed) return { err: parsed.err };
		settings = parsed.ok;
	}

	let pairs: PairInput[] | undefined;
	if (b.pairs !== undefined) {
		const parsed = parsePairsInput(b.pairs, b.lines.length);
		if ('err' in parsed) return { err: parsed.err };
		pairs = parsed.ok;
	}

	return { ok: { lines, alignments, settings, pairs } };
}

export function buildAlignUrl(origin: string, req: AlignRequest): AlignResult {
	const defaults = defaultVisualSettingsV2();

	// Merge settings overrides
	const visualSettings: VisualSettingsV2 = {
		...defaults,
		...(req.settings
			? Object.fromEntries(
					Object.entries(req.settings).filter(([, v]) => v !== undefined)
				)
			: {})
	};
	// Clamp numeric settings to valid ranges
	visualSettings.lineThickness = Math.min(8, Math.max(1, visualSettings.lineThickness));
	visualSettings.lineOpacity = Math.min(1, Math.max(0.2, visualSettings.lineOpacity));

	const tzOpts = tokenizeOptionsFromVisualSettings(visualSettings);

	const rawLines = req.lines.map((l) => (typeof l === 'string' ? l : l.text));

	const lineObjects: LineV2[] = req.lines.map((entry, i) => {
		const inp: Partial<LineInput> = typeof entry === 'string' ? {} : entry;
		return {
			id: `l${i}`,
			rawText: rawLines[i]!,
			font: { family: inp.font ?? DEFAULT_FONT_FAMILY, source: 'google' as const },
			textSizePx: Math.min(64, Math.max(12, inp.sizePx ?? DEFAULT_TEXT_SIZE_PX)),
			gapWordPx: Math.min(56, Math.max(0, inp.gapPx ?? DEFAULT_WORD_GAP_PX)),
			...(inp.rtl ? { rtl: true } : {})
		};
	});

	const tokensByLine = lineObjects.map((line) => tokenize(line.rawText, line.id, tzOpts));

	const connections: Connection[] = [];
	const { alignments = [] } = req;
	for (let idx = 0; idx < alignments.length; idx++) {
		const [lineA, wordA, lineB, wordB] = alignments[idx]!;

		if (lineA < 0 || lineA >= rawLines.length)
			return { err: `alignments[${idx}]: lineA=${lineA} out of range (0–${rawLines.length - 1})` };
		if (lineB < 0 || lineB >= rawLines.length)
			return { err: `alignments[${idx}]: lineB=${lineB} out of range (0–${rawLines.length - 1})` };
		if (Math.abs(lineA - lineB) !== 1)
			return {
				err: `alignments[${idx}]: lines ${lineA} and ${lineB} are not adjacent (connections only allowed between adjacent lines)`
			};

		const upperIdx = Math.min(lineA, lineB);
		const lowerIdx = Math.max(lineA, lineB);
		const upperWordIdx = lineA < lineB ? wordA : wordB;
		const lowerWordIdx = lineA < lineB ? wordB : wordA;

		const upperTokens = tokensByLine[upperIdx]!;
		const lowerTokens = tokensByLine[lowerIdx]!;

		if (upperWordIdx < 0 || upperWordIdx >= upperTokens.length)
			return {
				err: `alignments[${idx}]: word ${upperWordIdx} out of range for line ${upperIdx} ("${rawLines[upperIdx]}" has ${upperTokens.length} word(s))`
			};
		if (lowerWordIdx < 0 || lowerWordIdx >= lowerTokens.length)
			return {
				err: `alignments[${idx}]: word ${lowerWordIdx} out of range for line ${lowerIdx} ("${rawLines[lowerIdx]}" has ${lowerTokens.length} word(s))`
			};

		const upperTokenId = upperTokens[upperWordIdx]!.id;
		const lowerTokenId = lowerTokens[lowerWordIdx]!.id;
		const color = pendingAlignmentColor(connections, [upperTokenId], [lowerTokenId], visualSettings.palette);
		connections.push({ id: createConnectionId(), upperTokenId, lowerTokenId, color });
	}

	// Build pair controls and gaps
	const pairControls: PairControlV2[] = [];
	const linePairGaps: LinePairGapV2[] = [];
	const DEFAULT_LINE_GAP_PX = 120;

	for (const pair of req.pairs ?? []) {
		const upperLineId = `l${pair.upper}`;
		const lowerLineId = `l${pair.lower}`;
		if (pair.showConnectors === false) {
			pairControls.push({ upperLineId, lowerLineId, showConnectors: false });
		}
		if (pair.gapPx !== undefined) {
			const gapPx = Math.min(156, Math.max(12, pair.gapPx));
			if (gapPx !== DEFAULT_LINE_GAP_PX) {
				linePairGaps.push({ upperLineId, lowerLineId, gapPx });
			}
		}
	}

	const state: AppStateV2 = {
		v: SCHEMA_VERSION,
		project: { lines: lineObjects, pairControls, linePairGaps, connections },
		settings: visualSettings
	};

	const dataParam = encodeState(state);
	const u = new URL('/', origin);
	u.searchParams.set('data', dataParam);
	return { url: u.toString() };
}
