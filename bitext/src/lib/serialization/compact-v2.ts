import { addAtomicLinks, type Connection } from '$lib/domain/alignment.js';
import { connectedConnectionIds } from '$lib/domain/link-graph.js';
import { pickUnusedPaletteColor, type PaletteName } from '$lib/domain/palettes.js';
import { tokenize } from '$lib/domain/tokens.js';
import {
	DEFAULT_TOKEN_SPLIT_CHARS,
	defaultProjectSnapshot,
	defaultVisualSettings,
	normalizeVisualSettings,
	type AppStateV1,
	type ProjectSnapshotV1,
	type VisualSettingsV1
} from './schema.js';

export const COMPACT_SCHEMA_VERSION = 2 as const;

type CompactSettings = Record<string, string | number>;
type CompactProject = Record<string, string>;

export type CompactV2Wire = {
	v: typeof COMPACT_SCHEMA_VERSION;
	s?: CompactSettings;
	p?: CompactProject;
};

function sortKeys<T extends Record<string, unknown>>(obj: T): T {
	const keys = Object.keys(obj).sort() as (keyof T)[];
	const out = {} as T;
	for (const k of keys) {
		out[k] = obj[k];
	}
	return out;
}

/** Round only non-layout fields so share links preserve preview geometry (font size, gaps). */
function roundVisualSettings(s: VisualSettingsV1): VisualSettingsV1 {
	return {
		...s,
		lineThickness: Math.round(s.lineThickness * 10) / 10,
		lineOpacity: Math.round(s.lineOpacity * 100) / 100
	};
}

function normalizeHex(color: string | undefined): string {
	if (!color) return '';
	let c = color.trim().replace('#', '').toLowerCase();
	if (c.length === 3)
		c = c
			.split('')
			.map((x) => x + x)
			.join('');
	if (c.length >= 6) c = c.slice(0, 6);
	return c;
}

function addAlignmentStep(
	links: Connection[],
	sourceIds: string[],
	targetIds: string[],
	palette: PaletteName
): Connection[] {
	const seedTokens = new Set<string>([...sourceIds, ...targetIds]);
	const componentBefore = connectedConnectionIds(links, seedTokens);
	const used = new Set(links.map((l) => l.color).filter((c): c is string => Boolean(c)));
	const inherited = links.find((l) => componentBefore.has(l.id) && l.color)?.color;
	const color = inherited ?? pickUnusedPaletteColor(palette, used);
	const pairs: { sourceId: string; targetId: string }[] = [];
	for (const s of sourceIds) {
		for (const t of targetIds) {
			pairs.push({ sourceId: s, targetId: t });
		}
	}
	const merged = addAtomicLinks(links, pairs, color);
	const componentAfter = connectedConnectionIds(merged, seedTokens);
	return merged.map((l) => (componentAfter.has(l.id) ? { ...l, color } : l));
}

/** Replay one atomic pair at a time (order matches `project.links` append order). */
export function replayLinksFromPairIndices(
	pairs: readonly [number, number][],
	palette: PaletteName
): Connection[] {
	let links: Connection[] = [];
	for (const [si, ti] of pairs) {
		links = addAlignmentStep(links, [`s-${si}`], [`t-${ti}`], palette);
	}
	return links;
}

function parseTokenIndex(id: string, side: 's' | 't'): number | null {
	const m = id.match(new RegExp(`^${side}-(\\d+)$`));
	if (!m) return null;
	return parseInt(m[1]!, 10);
}

function encodeSparseGlosses(glosses: (string | null)[]): string | undefined {
	const parts: string[] = [];
	glosses.forEach((g, i) => {
		if (g != null && g !== '') {
			parts.push(`${i}:${encodeURIComponent(g)}`);
		}
	});
	return parts.length ? parts.join(';') : undefined;
}

function parseSparseGlosses(sg: string | undefined, len: number): (string | null)[] {
	const out: (string | null)[] = Array.from({ length: len }, () => null);
	if (!sg) return out;
	for (const part of sg.split(';')) {
		if (!part) continue;
		const colon = part.indexOf(':');
		if (colon === -1) continue;
		const idx = parseInt(part.slice(0, colon), 10);
		if (!Number.isFinite(idx) || idx < 0 || idx >= len) continue;
		try {
			out[idx] = decodeURIComponent(part.slice(colon + 1)) || null;
		} catch {
			out[idx] = part.slice(colon + 1) || null;
		}
	}
	return out;
}

function parseLk(lk: string): [number, number][] {
	const pairs: [number, number][] = [];
	for (const seg of lk.split(';')) {
		if (!seg) continue;
		const [a, b] = seg.split(',');
		const si = parseInt(a!, 10);
		const ti = parseInt(b!, 10);
		if (!Number.isFinite(si) || !Number.isFinite(ti)) continue;
		pairs.push([si, ti]);
	}
	return pairs;
}

function computeLcString(
	originalLinks: Connection[],
	pairs: [number, number][],
	palette: PaletteName
): string | undefined {
	const replayed = replayLinksFromPairIndices(pairs, palette);
	if (replayed.length !== originalLinks.length) {
		const parts: string[] = [];
		for (let i = 0; i < originalLinks.length; i++) {
			const hex = normalizeHex(originalLinks[i]?.color) || '94a3b8';
			parts.push(`${i}:${hex}`);
		}
		return parts.join(';');
	}
	const parts: string[] = [];
	for (let i = 0; i < originalLinks.length; i++) {
		const o = originalLinks[i]!;
		const r = replayed[i]!;
		const oh = normalizeHex(o.color);
		const rh = normalizeHex(r.color);
		if (oh !== rh) {
			parts.push(`${i}:${oh || normalizeHex(r.color)}`);
		}
	}
	return parts.length ? parts.join(';') : undefined;
}

function applyLc(links: Connection[], lc: string): Connection[] {
	const overrides = new Map<number, string>();
	for (const part of lc.split(';')) {
		if (!part) continue;
		const colon = part.indexOf(':');
		if (colon === -1) continue;
		const idx = parseInt(part.slice(0, colon), 10);
		let hex = part
			.slice(colon + 1)
			.trim()
			.toLowerCase();
		if (!Number.isFinite(idx)) continue;
		if (hex.length === 3)
			hex = hex
				.split('')
				.map((c) => c + c)
				.join('');
		if (hex.length >= 6) hex = hex.slice(0, 6);
		overrides.set(idx, `#${hex}`);
	}
	return links.map((l, i) => {
		const c = overrides.get(i);
		return c ? { ...l, color: c } : l;
	});
}

function settingsToCompact(rounded: VisualSettingsV1): CompactSettings | undefined {
	const def = roundVisualSettings(defaultVisualSettings());
	const o: CompactSettings = {};

	if (rounded.theme !== def.theme) o.th = rounded.theme === 'dark' ? 1 : 0;
	if (rounded.sourceTextSizePx === rounded.targetTextSizePx) {
		if (rounded.sourceTextSizePx !== def.sourceTextSizePx) o.ts = rounded.sourceTextSizePx;
	} else {
		if (rounded.sourceTextSizePx !== def.sourceTextSizePx) o.sts = rounded.sourceTextSizePx;
		if (rounded.targetTextSizePx !== def.targetTextSizePx) o.tts = rounded.targetTextSizePx;
	}
	if (rounded.gapWordPx !== def.gapWordPx) o.gw = rounded.gapWordPx;
	if (rounded.gapLinePx !== def.gapLinePx) o.gl = rounded.gapLinePx;
	if (rounded.glossLineGapPx !== def.glossLineGapPx) o.gg = rounded.glossLineGapPx;
	if (rounded.glossTextSizePx !== def.glossTextSizePx) o.gtx = rounded.glossTextSizePx;
	if (rounded.lineThickness !== def.lineThickness) o.lt = rounded.lineThickness;
	if (rounded.lineOpacity !== def.lineOpacity) o.lo = rounded.lineOpacity;
	if (rounded.lineStyle !== def.lineStyle) o.ls = rounded.lineStyle === 'straight' ? 0 : 1;
	if (rounded.palette !== def.palette) o.pl = rounded.palette;
	if (rounded.showGloss !== def.showGloss) o.sg = rounded.showGloss ? 1 : 0;
	if (rounded.showNumbers !== def.showNumbers) o.sn = rounded.showNumbers ? 1 : 0;
	if (rounded.colorTokensByLink !== def.colorTokensByLink) o.ct = rounded.colorTokensByLink ? 1 : 0;

	if (rounded.sourceFontFamily !== def.sourceFontFamily) o.sff = rounded.sourceFontFamily;
	if (rounded.targetFontFamily !== def.targetFontFamily) o.tff = rounded.targetFontFamily;
	if (rounded.sourceFontSource !== def.sourceFontSource)
		o.sfs = rounded.sourceFontSource === 'custom' ? 1 : 0;
	if (rounded.targetFontSource !== def.targetFontSource)
		o.tfs = rounded.targetFontSource === 'custom' ? 1 : 0;

	if (rounded.sourceFontSource === 'custom' && rounded.sourceCustomFontName) {
		o.scn = rounded.sourceCustomFontName;
	}
	if (rounded.targetFontSource === 'custom' && rounded.targetCustomFontName) {
		o.tcn = rounded.targetCustomFontName;
	}

	if (rounded.glossFontFamily !== def.glossFontFamily) o.gff = rounded.glossFontFamily;
	if (rounded.glossFontSource !== def.glossFontSource)
		o.gfs = rounded.glossFontSource === 'custom' ? 1 : 0;
	if (rounded.glossFontSource === 'custom' && rounded.glossCustomFontName) {
		o.gcn = rounded.glossCustomFontName;
	}

	if (rounded.tokenSplitChars !== def.tokenSplitChars) o.sp = rounded.tokenSplitChars;

	if (rounded.background !== def.background) {
		o.bg = rounded.background === 'light' ? 0 : rounded.background === 'dark' ? 1 : 2;
	}

	return Object.keys(o).length ? sortKeys(o) : undefined;
}

function compactToVisualSettings(s: CompactSettings | undefined): VisualSettingsV1 {
	if (!s) return defaultVisualSettings();
	const raw: Record<string, unknown> = {};
	if (s.th !== undefined) raw.theme = Number(s.th) === 1 ? 'dark' : 'light';
	if (s.ts !== undefined) raw.textSizePx = Number(s.ts);
	if (s.sts !== undefined) raw.sourceTextSizePx = Number(s.sts);
	if (s.tts !== undefined) raw.targetTextSizePx = Number(s.tts);
	if (s.gw !== undefined) raw.gapWordPx = Number(s.gw);
	if (s.gl !== undefined) raw.gapLinePx = Number(s.gl);
	if (s.gg !== undefined) raw.glossLineGapPx = Number(s.gg);
	if (s.gtx !== undefined) raw.glossTextSizePx = Number(s.gtx);
	if (s.lt !== undefined) raw.lineThickness = Number(s.lt);
	if (s.lo !== undefined) raw.lineOpacity = Number(s.lo);
	if (s.ls !== undefined) raw.lineStyle = Number(s.ls) === 0 ? 'straight' : 'curved';
	if (s.pl !== undefined) raw.palette = String(s.pl);
	if (s.sg !== undefined) raw.showGloss = Number(s.sg) === 1;
	if (s.sn !== undefined) raw.showNumbers = Number(s.sn) === 1;
	if (s.ct !== undefined) raw.colorTokensByLink = Number(s.ct) === 1;
	if (s.sff !== undefined) raw.sourceFontFamily = String(s.sff);
	if (s.tff !== undefined) raw.targetFontFamily = String(s.tff);
	if (s.sfs !== undefined) raw.sourceFontSource = Number(s.sfs) === 1 ? 'custom' : 'google';
	if (s.tfs !== undefined) raw.targetFontSource = Number(s.tfs) === 1 ? 'custom' : 'google';
	if (s.scn !== undefined) raw.sourceCustomFontName = String(s.scn);
	if (s.tcn !== undefined) raw.targetCustomFontName = String(s.tcn);
	if (s.gff !== undefined) raw.glossFontFamily = String(s.gff);
	if (s.gfs !== undefined) raw.glossFontSource = Number(s.gfs) === 1 ? 'custom' : 'google';
	if (s.gcn !== undefined) raw.glossCustomFontName = String(s.gcn);
	if (s.sp !== undefined) raw.tokenSplitChars = String(s.sp);
	if (s.bg !== undefined) {
		const n = Number(s.bg);
		raw.background = n === 1 ? 'dark' : n === 2 ? 'image' : 'light';
	}
	return normalizeVisualSettings(raw);
}

function projectToCompact(
	project: ProjectSnapshotV1,
	settingsRounded: VisualSettingsV1
): CompactProject | undefined {
	const def = defaultProjectSnapshot();
	const hasSourceGloss = project.sourceGlosses.some((g) => g != null && g !== '');
	const hasTargetGloss = project.targetGlosses.some((g) => g != null && g !== '');
	const hasGloss = hasSourceGloss || hasTargetGloss;
	const hasLinks = project.links.length > 0;
	const textsDiffer =
		project.sourceText !== def.sourceText || project.targetText !== def.targetText;

	if (!hasGloss && !hasLinks && !textsDiffer) return undefined;

	const o: CompactProject = {};
	if (hasLinks || project.sourceText !== def.sourceText) o.st = project.sourceText;
	if (hasLinks || project.targetText !== def.targetText) o.tt = project.targetText;

	const sg = encodeSparseGlosses(project.sourceGlosses);
	const tg = encodeSparseGlosses(project.targetGlosses);
	if (sg) o.sg = sg;
	if (tg) o.tg = tg;

	if (hasLinks) {
		const pairs: [number, number][] = [];
		for (const link of project.links) {
			const si = parseTokenIndex(link.upperTokenId, 's');
			const ti = parseTokenIndex(link.lowerTokenId, 't');
			if (si === null || ti === null) continue;
			pairs.push([si, ti]);
		}
		o.lk = pairs.map(([a, b]) => `${a},${b}`).join(';');
		const lc = computeLcString(project.links, pairs, settingsRounded.palette);
		if (lc) o.lc = lc;
	}

	return Object.keys(o).length ? sortKeys(o) : undefined;
}

function compactToProject(
	p: CompactProject | undefined,
	settings: VisualSettingsV1
): ProjectSnapshotV1 {
	const def = defaultProjectSnapshot();
	if (!p) {
		return { ...def };
	}
	const sourceText = p.st ?? def.sourceText;
	const targetText = p.tt ?? def.targetText;
	const splitChars = settings.tokenSplitChars ?? DEFAULT_TOKEN_SPLIT_CHARS;
	const stoks = tokenize(sourceText, 's', splitChars);
	const ttoks = tokenize(targetText, 't', splitChars);

	const sourceGlosses = parseSparseGlosses(p.sg, stoks.length);
	const targetGlosses = parseSparseGlosses(p.tg, ttoks.length);

	let links: Connection[] = [];
	if (p.lk) {
		const pairs = parseLk(p.lk);
		links = replayLinksFromPairIndices(pairs, settings.palette);
		if (p.lc) links = applyLc(links, p.lc);
	}

	return {
		sourceText,
		targetText,
		sourceGlosses,
		targetGlosses,
		links
	};
}

export function toCompactJSON(state: AppStateV1): string {
	const slimSettings = { ...state.settings };
	delete slimSettings.backgroundImageDataUrl;

	const rounded = roundVisualSettings(slimSettings);
	const sCompact = settingsToCompact(rounded);
	const pCompact = projectToCompact(state.project, rounded);

	const wire: CompactV2Wire = { v: COMPACT_SCHEMA_VERSION };
	if (sCompact) wire.s = sCompact;
	if (pCompact) wire.p = pCompact;

	return JSON.stringify(wire);
}

export function fromCompactWire(wire: CompactV2Wire): AppStateV1 {
	if (wire.v !== COMPACT_SCHEMA_VERSION) {
		throw new Error(`compact: expected v:${COMPACT_SCHEMA_VERSION}`);
	}
	const settings = compactToVisualSettings(wire.s);
	const project = compactToProject(wire.p, settings);
	return {
		v: 1,
		project,
		settings
	};
}

/** For tests: compare snapshots without unstable link ids. */
export function projectContentEquals(a: ProjectSnapshotV1, b: ProjectSnapshotV1): boolean {
	if (a.sourceText !== b.sourceText || a.targetText !== b.targetText) return false;
	if (a.sourceGlosses.length !== b.sourceGlosses.length) return false;
	if (a.targetGlosses.length !== b.targetGlosses.length) return false;
	for (let i = 0; i < a.sourceGlosses.length; i++) {
		if (a.sourceGlosses[i] !== b.sourceGlosses[i]) return false;
	}
	for (let i = 0; i < a.targetGlosses.length; i++) {
		if (a.targetGlosses[i] !== b.targetGlosses[i]) return false;
	}
	if (a.links.length !== b.links.length) return false;
	const norm = (links: Connection[]) =>
		links
			.map((l) => ({
				upperTokenId: l.upperTokenId,
				lowerTokenId: l.lowerTokenId,
				color: normalizeHex(l.color)
			}))
			.sort((x, y) => {
				const c = x.upperTokenId.localeCompare(y.upperTokenId);
				return c !== 0 ? c : x.lowerTokenId.localeCompare(y.lowerTokenId);
			});
	const na = norm(a.links);
	const nb = norm(b.links);
	for (let i = 0; i < na.length; i++) {
		if (na[i]!.upperTokenId !== nb[i]!.upperTokenId || na[i]!.lowerTokenId !== nb[i]!.lowerTokenId)
			return false;
		if (na[i]!.color !== nb[i]!.color) return false;
	}
	return true;
}

export function appStateContentEquals(a: AppStateV1, b: AppStateV1): boolean {
	if (!projectContentEquals(a.project, b.project)) return false;
	const ra = roundVisualSettings(a.settings);
	const rb = roundVisualSettings(b.settings);
	const keys = new Set([...Object.keys(ra), ...Object.keys(rb)]) as Set<keyof VisualSettingsV1>;
	for (const k of keys) {
		if (ra[k] !== rb[k]) return false;
	}
	return true;
}
