import { describe, expect, it } from 'vitest';
import { exportBaseName, firstNonEmptyText } from './filename.js';

describe('exportBaseName', () => {
	it('slugifies a plain Latin phrase', () => {
		expect(exportBaseName('Hello world')).toBe('al-hello-world');
	});

	it('collapses punctuation and extra spaces into single dashes', () => {
		expect(exportBaseName('  The quick, brown  fox! ')).toBe('al-the-quick-brown-fox');
	});

	it('keeps Cyrillic letters readable', () => {
		expect(exportBaseName('Привет мир')).toBe('al-привет-мир');
	});

	it('keeps CJK characters', () => {
		expect(exportBaseName('你好 世界')).toBe('al-你好-世界');
	});

	it('falls back on empty string', () => {
		expect(exportBaseName('')).toBe('alignment');
	});

	it('falls back on whitespace only', () => {
		expect(exportBaseName('   \t\n')).toBe('alignment');
	});

	it('falls back on punctuation only', () => {
		expect(exportBaseName('!!! ... ??? —')).toBe('alignment');
	});

	it('falls back on emoji only', () => {
		expect(exportBaseName('😀🎉👍')).toBe('alignment');
	});

	it('drops emoji but keeps surrounding words', () => {
		expect(exportBaseName('hi 😀 there')).toBe('al-hi-there');
	});

	it('caps length without leaving a trailing dash', () => {
		const out = exportBaseName('a'.repeat(100));
		expect(out).toBe(`al-${'a'.repeat(40)}`);
		expect(out.endsWith('-')).toBe(false);
	});

	it('does not split a multi-unit character at the length cap', () => {
		// 40 astral CJK extension-B chars then more; slicing must not leave a lone surrogate.
		const out = exportBaseName('𠀀'.repeat(50), { maxLen: 40 });
		expect(out.startsWith('al-')).toBe(true);
		expect([...out].every((ch) => ch !== '�')).toBe(true);
		// Array-from length: 'al-' is 3 code points + 40 kept chars.
		expect(Array.from(out).length).toBe(43);
	});

	it('produces no filesystem-unsafe characters', () => {
		const out = exportBaseName('a/b\\c:d*e?f"g<h>i|j');
		expect(/[/\\:*?"<>|]/.test(out)).toBe(false);
	});

	it('honors a custom fallback and prefix', () => {
		expect(exportBaseName('', { fallback: 'diagram' })).toBe('diagram');
		expect(exportBaseName('Hi', { prefix: 'wa' })).toBe('wa-hi');
	});
});

describe('firstNonEmptyText', () => {
	it('returns the first line with visible text', () => {
		expect(firstNonEmptyText([{ rawText: '  ' }, { rawText: 'second' }])).toBe('second');
	});

	it('returns empty string when all lines are blank', () => {
		expect(firstNonEmptyText([{ rawText: '' }, { rawText: '  \t' }])).toBe('');
	});
});
