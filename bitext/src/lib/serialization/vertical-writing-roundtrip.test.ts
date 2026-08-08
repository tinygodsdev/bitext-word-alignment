import { describe, expect, it } from 'vitest';
import { COMPACT_SCHEMA_VERSION, fromCompactWire, toCompactJSON } from './compact-v4.js';
import {
	defaultAppStateV2,
	defaultVisualSettingsV2,
	type AppStateV2,
	type LineV2
} from './schema.js';

function line(id: string, overrides: Partial<LineV2> = {}): LineV2 {
	return {
		id,
		rawText: 'one two',
		font: { family: 'Inter', source: 'google' },
		textSizePx: 36,
		gapWordPx: 14,
		...overrides
	};
}

function roundtrip(state: AppStateV2): AppStateV2 {
	return fromCompactWire(JSON.parse(toCompactJSON(state)));
}

describe('vertical writing — compact v4 roundtrip', () => {
	it('carries the layout axis', () => {
		const state = defaultAppStateV2();
		state.settings = { ...state.settings, layoutAxis: 'columns' };
		const out = roundtrip(state);
		expect(out.settings.layoutAxis).toBe('columns');
	});

	it('carries per-line text orientation', () => {
		const state = defaultAppStateV2();
		state.project = {
			...state.project,
			lines: [
				line('ja', { rawText: '私 は 猫', textOrientation: 'vertical' }),
				line('en', { rawText: 'I am a cat' }),
				line('sp', { rawText: 'spine', textOrientation: 'sideways' })
			]
		};
		const out = roundtrip(state);
		expect(out.project.lines[0].textOrientation).toBe('vertical');
		expect(out.project.lines[1].textOrientation).toBeUndefined();
		expect(out.project.lines[2].textOrientation).toBe('sideways');
	});

	it('keeps rtl and orientation independent on the same line', () => {
		const state = defaultAppStateV2();
		state.project = {
			...state.project,
			lines: [line('a', { rtl: true, textOrientation: 'vertical' }), line('b')]
		};
		const out = roundtrip(state);
		expect(out.project.lines[0].rtl).toBe(true);
		expect(out.project.lines[0].textOrientation).toBe('vertical');
	});

	it('omits the axis key from the wire when it is default', () => {
		const state = defaultAppStateV2();
		state.settings = { ...state.settings, palette: 'vivid' };
		const wire = JSON.parse(toCompactJSON(state));
		expect(wire.s.ax).toBeUndefined();
	});

	it('drops the trailing orientation column when the line is upright', () => {
		const state = defaultAppStateV2();
		state.project = { ...state.project, lines: [line('a'), line('b', { rtl: true })] };
		const wire = JSON.parse(toCompactJSON(state));
		const rows = String(wire.p.ln).split('|');
		expect(rows[0].split('\t')).toHaveLength(7);
		expect(rows[1].split('\t')).toHaveLength(8);
	});

	it('defaults to rows for a payload written before the setting existed', () => {
		const out = fromCompactWire({
			v: COMPACT_SCHEMA_VERSION,
			p: { ln: `a\t${encodeURIComponent('one two')}\tInter\t0\t\t36\t14` }
		});
		expect(out.settings.layoutAxis).toBe('rows');
		expect(out.project.lines[0].textOrientation).toBeUndefined();
	});

	it('normalizes an unknown orientation back to upright', () => {
		const out = fromCompactWire({
			v: COMPACT_SCHEMA_VERSION,
			p: { ln: `a\t${encodeURIComponent('one two')}\tInter\t0\t\t36\t14\t\tzzz` }
		});
		expect(out.project.lines[0].textOrientation).toBeUndefined();
	});
});

describe('vertical writing — defaults', () => {
	it('ships rows so existing projects render unchanged', () => {
		const d = defaultVisualSettingsV2();
		expect(d.layoutAxis).toBe('rows');
	});
});
