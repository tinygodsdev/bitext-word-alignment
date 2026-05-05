import { createConnectionId, type Connection } from '$lib/domain/alignment.js';
import { tokenize } from '$lib/domain/tokens.js';
import {
	DEFAULT_TOKEN_SPLIT_CHARS,
	SCHEMA_VERSION,
	defaultProjectSnapshotV2,
	defaultVisualSettingsV2,
	normalizeVisualSettingsV2,
	type AppStateV2,
	type LineV2,
	type PairControlV2,
	type ProjectSnapshotV2,
	type VisualSettingsV2
} from './schema.js';

export const COMPACT_SCHEMA_VERSION = 3 as const;

type CompactSettings3 = Record<string, string | number>;
type CompactProject3 = Record<string, string>;

export type CompactV3Wire = {
	v: typeof COMPACT_SCHEMA_VERSION;
	s?: CompactSettings3;
	p?: CompactProject3;
};

function sortKeys<T extends Record<string, unknown>>(obj: T): T {
	const keys = Object.keys(obj).sort() as (keyof T)[];
	const out = {} as T;
	for (const k of keys) {
		out[k] = obj[k];
	}
	return out;
}

function roundVisualSettings(s: VisualSettingsV2): VisualSettingsV2 {
	return {
		...s,
		lineThickness: Math.round(s.lineThickness * 10) / 10,
		lineOpacity: Math.round(s.lineOpacity * 100) / 100
	};
}

function settingsToCompact(rounded: VisualSettingsV2): CompactSettings3 | undefined {
	const def = roundVisualSettings(defaultVisualSettingsV2());
	const o: CompactSettings3 = {};
	if (rounded.theme !== def.theme) o.th = rounded.theme === 'dark' ? 1 : 0;
	if (rounded.gapWordPx !== def.gapWordPx) o.gw = rounded.gapWordPx;
	if (rounded.gapLinePx !== def.gapLinePx) o.gl = rounded.gapLinePx;
	if (rounded.lineThickness !== def.lineThickness) o.lt = rounded.lineThickness;
	if (rounded.lineOpacity !== def.lineOpacity) o.lo = rounded.lineOpacity;
	if (rounded.lineStyle !== def.lineStyle) o.ls = rounded.lineStyle === 'straight' ? 0 : 1;
	if (rounded.palette !== def.palette) o.pl = rounded.palette;
	if (rounded.showNumbers !== def.showNumbers) o.sn = rounded.showNumbers ? 1 : 0;
	if (rounded.colorTokensByLink !== def.colorTokensByLink) o.ct = rounded.colorTokensByLink ? 1 : 0;
	if (rounded.tokenSplitChars !== def.tokenSplitChars) o.sp = rounded.tokenSplitChars;
	if (rounded.background !== def.background) {
		o.bg = rounded.background === 'light' ? 0 : rounded.background === 'dark' ? 1 : 2;
	}
	return Object.keys(o).length ? sortKeys(o) : undefined;
}

function compactToVisualSettings(s: CompactSettings3 | undefined): VisualSettingsV2 {
	if (!s) return defaultVisualSettingsV2();
	const raw: Record<string, unknown> = {};
	if (s.th !== undefined) raw.theme = Number(s.th) === 1 ? 'dark' : 'light';
	if (s.gw !== undefined) raw.gapWordPx = Number(s.gw);
	if (s.gl !== undefined) raw.gapLinePx = Number(s.gl);
	if (s.lt !== undefined) raw.lineThickness = Number(s.lt);
	if (s.lo !== undefined) raw.lineOpacity = Number(s.lo);
	if (s.ls !== undefined) raw.lineStyle = Number(s.ls) === 0 ? 'straight' : 'curved';
	if (s.pl !== undefined) raw.palette = String(s.pl);
	if (s.sn !== undefined) raw.showNumbers = Number(s.sn) === 1;
	if (s.ct !== undefined) raw.colorTokensByLink = Number(s.ct) === 1;
	if (s.sp !== undefined) raw.tokenSplitChars = String(s.sp);
	if (s.bg !== undefined) {
		const n = Number(s.bg);
		raw.background = n === 1 ? 'dark' : n === 2 ? 'image' : 'light';
	}
	return normalizeVisualSettingsV2(raw);
}

function encodeLines(lines: LineV2[]): string {
	return lines
		.map((l) =>
			[
				l.id,
				encodeURIComponent(l.rawText),
				l.font.family,
				l.font.source === 'custom' ? 1 : 0,
				l.font.customName ? encodeURIComponent(l.font.customName) : '',
				String(l.textSizePx)
			].join('\t')
		)
		.join('|');
}

function decodeLines(encoded: string): LineV2[] {
	const out: LineV2[] = [];
	for (const seg of encoded.split('|')) {
		if (!seg) continue;
		const parts = seg.split('\t');
		const id = parts[0]!;
		const rawEnc = parts[1]!;
		const family = parts[2]!;
		const fs = parts[3];
		const cnEnc = parts[4];
		const sz = parts[5];
		if (!id || !family) continue;
		const customName = cnEnc ? decodeURIComponent(cnEnc) : undefined;
		out.push({
			id,
			rawText: decodeURIComponent(rawEnc ?? ''),
			font: {
				family,
				source: Number(fs) === 1 ? 'custom' : 'google',
				...(customName ? { customName } : {})
			},
			textSizePx: Math.max(12, Math.min(64, Number(sz) || 36))
		});
	}
	return out;
}

function encodeConnections(conns: Connection[]): string {
	return conns
		.map((c) => {
			const hex = c.color?.replace(/^#/u, '').replace(/[^0-9a-fA-F]/gu, '') ?? '';
			if (hex.length >= 3) {
				return `${c.upperTokenId},${c.lowerTokenId},${hex}`;
			}
			return `${c.upperTokenId},${c.lowerTokenId}`;
		})
		.join(';');
}

function decodeConnections(s: string): Connection[] {
	const out: Connection[] = [];
	for (const seg of s.split(';')) {
		if (!seg) continue;
		const parts = seg.split(',');
		const u = parts[0];
		const lo = parts[1];
		if (!u || !lo) continue;
		const colorHex = parts[2];
		const color = colorHex && /^[0-9a-fA-F]{3,8}$/u.test(colorHex) ? `#${colorHex}` : undefined;
		out.push({ id: createConnectionId(), upperTokenId: u, lowerTokenId: lo, color });
	}
	return out;
}

function encodePairControls(pc: PairControlV2[]): string | undefined {
	const hidden = pc.filter((p) => !p.showConnectors);
	if (hidden.length === 0) return undefined;
	/** `\t` between line ids, `|` between pairs — line ids may contain `-`. */
	return hidden.map((p) => `${p.upperLineId}\t${p.lowerLineId}`).join('|');
}

function decodePairControls(s: string | undefined): PairControlV2[] {
	if (!s) return [];
	const out: PairControlV2[] = [];
	for (const seg of s.split('|')) {
		if (!seg) continue;
		const tab = seg.indexOf('\t');
		if (tab === -1) continue;
		const upper = seg.slice(0, tab);
		const lower = seg.slice(tab + 1);
		if (upper && lower) out.push({ upperLineId: upper, lowerLineId: lower, showConnectors: false });
	}
	return out;
}

function lineEquals(a: LineV2 | undefined, b: LineV2 | undefined): boolean {
	if (!a || !b) return false;
	return (
		a.id === b.id &&
		a.rawText === b.rawText &&
		a.textSizePx === b.textSizePx &&
		a.font.family === b.font.family &&
		a.font.source === b.font.source &&
		a.font.customName === b.font.customName
	);
}

function projectToCompact(project: ProjectSnapshotV2): CompactProject3 | undefined {
	const def = defaultProjectSnapshotV2();
	const linesMatch =
		project.lines.length === def.lines.length &&
		project.lines.every((l, i) => lineEquals(l, def.lines[i]));
	const extrasEmpty = project.connections.length === 0 && project.pairControls.length === 0;
	if (linesMatch && extrasEmpty) return undefined;

	const o: CompactProject3 = {};
	o.ln = encodeLines(project.lines);
	if (project.connections.length) o.cn = encodeConnections(project.connections);
	const pcEnc = encodePairControls(project.pairControls);
	if (pcEnc) o.pc = pcEnc;
	return sortKeys(o);
}

function compactToProject(p: CompactProject3 | undefined): ProjectSnapshotV2 {
	const def = defaultProjectSnapshotV2();
	if (!p?.ln) return { ...def };
	const lines = decodeLines(p.ln);
	const connections = p.cn ? decodeConnections(p.cn) : [];
	const pairControls = decodePairControls(p.pc);
	return { lines, pairControls, connections };
}

/** Drop connections that are not between adjacent lines in stack order. */
function pruneConnections(
	project: ProjectSnapshotV2,
	settings: VisualSettingsV2
): ProjectSnapshotV2 {
	const lineOrder = project.lines.map((l) => l.id);
	const tokenToLine = new Map<string, string>();
	const split = settings.tokenSplitChars ?? DEFAULT_TOKEN_SPLIT_CHARS;
	for (const line of project.lines) {
		for (const t of tokenize(line.rawText, line.id, split)) {
			tokenToLine.set(t.id, line.id);
		}
	}
	const adj = new Set<string>();
	for (let i = 0; i < lineOrder.length - 1; i++) {
		adj.add(`${lineOrder[i]}\0${lineOrder[i + 1]!}`);
		adj.add(`${lineOrder[i + 1]!}\0${lineOrder[i]!}`);
	}
	const tok = new Set(tokenToLine.keys());
	const connections = project.connections.filter((c) => {
		if (!tok.has(c.upperTokenId) || !tok.has(c.lowerTokenId)) return false;
		const lu = tokenToLine.get(c.upperTokenId)!;
		const ll = tokenToLine.get(c.lowerTokenId)!;
		return adj.has(`${lu}\0${ll}`);
	});
	return { ...project, connections };
}

export function toCompactJSON(state: AppStateV2): string {
	const slimSettings = { ...state.settings };
	delete slimSettings.backgroundImageDataUrl;
	const rounded = roundVisualSettings(slimSettings);
	const sCompact = settingsToCompact(rounded);
	const pCompact = projectToCompact(state.project);
	const wire: CompactV3Wire = { v: COMPACT_SCHEMA_VERSION };
	if (sCompact) wire.s = sCompact;
	if (pCompact) wire.p = pCompact;
	return JSON.stringify(wire);
}

export function fromCompactWire(wire: CompactV3Wire): AppStateV2 {
	if (wire.v !== COMPACT_SCHEMA_VERSION) {
		throw new Error(`compact: expected v:${COMPACT_SCHEMA_VERSION}`);
	}
	const settings = compactToVisualSettings(wire.s);
	let project = compactToProject(wire.p);
	project = pruneConnections(project, settings);
	return { v: SCHEMA_VERSION, project, settings };
}
