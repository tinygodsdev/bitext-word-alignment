import { describe, expect, it } from 'vitest';
import { tokenize, tokenizeOptionsFromVisualSettings } from './tokens.js';

const base = () =>
	tokenizeOptionsFromVisualSettings({
		tokenSplitChars: '',
		tokenMergeChar: '',
		tokenSplitPunctuation: false,
		tokenPunctuationChars: ''
	});

describe('tokenize', () => {
	it('splits on whitespace', () => {
		const t = tokenize('  a bb  ', 'L', base());
		expect(t.map((x) => x.text)).toEqual(['a', 'bb']);
	});

	it('splits on splitChars with joinLeft on following token', () => {
		const o = tokenizeOptionsFromVisualSettings({
			tokenSplitChars: '.-',
			tokenMergeChar: '',
			tokenSplitPunctuation: false,
			tokenPunctuationChars: ''
		});
		const t = tokenize('a.b-c', 'L', o);
		expect(t.map((x) => [x.text, x.joinLeft])).toEqual([
			['a', false],
			['b', true],
			['c', true]
		]);
	});

	it('joins with merge char and shows spaces in text', () => {
		const o = tokenizeOptionsFromVisualSettings({
			tokenSplitChars: '',
			tokenMergeChar: '+',
			tokenSplitPunctuation: false,
			tokenPunctuationChars: ''
		});
		const t = tokenize('hello+world x', 'L', o);
		expect(t.map((x) => x.text)).toEqual(['hello world', 'x']);
		expect(t[0]!.joinLeft).toBe(false);
		expect(t[1]!.joinLeft).toBe(false);
	});

	it('does not treat merge char as split when also in split list (merge removed in settings)', () => {
		const o = tokenizeOptionsFromVisualSettings({
			tokenSplitChars: '.',
			tokenMergeChar: '+',
			tokenSplitPunctuation: false,
			tokenPunctuationChars: ''
		});
		const t = tokenize('a+b.c', 'L', o);
		expect(t.map((x) => x.text)).toEqual(['a b', 'c']);
	});

	it('splits punctuation when enabled', () => {
		const o = tokenizeOptionsFromVisualSettings({
			tokenSplitChars: '',
			tokenMergeChar: '',
			tokenSplitPunctuation: true,
			tokenPunctuationChars: ''
		});
		const t = tokenize('Hi, there!', 'L', o);
		expect(t.map((x) => x.text)).toEqual(['Hi', ',', 'there', '!']);
	});

	it('keeps apostrophe inside Latin letters', () => {
		const o = tokenizeOptionsFromVisualSettings({
			tokenSplitChars: '',
			tokenMergeChar: '',
			tokenSplitPunctuation: true,
			tokenPunctuationChars: ''
		});
		const t = tokenize("don't", 'L', o);
		expect(t.map((x) => x.text)).toEqual(["don't"]);
	});

	it('combines merge and punctuation split', () => {
		const o = tokenizeOptionsFromVisualSettings({
			tokenSplitChars: '',
			tokenMergeChar: '+',
			tokenSplitPunctuation: true,
			tokenPunctuationChars: ''
		});
		const t = tokenize('foo+bar,baz', 'L', o);
		expect(t.map((x) => x.text)).toEqual(['foo bar', ',', 'baz']);
	});

	it('custom punctuation list only splits listed characters', () => {
		const o = tokenizeOptionsFromVisualSettings({
			tokenSplitChars: '',
			tokenMergeChar: '',
			tokenSplitPunctuation: true,
			tokenPunctuationChars: ',.'
		});
		const t = tokenize('Hi, a.', 'L', o);
		expect(t.map((x) => x.text)).toEqual(['Hi', ',', 'a', '.']);
		const t2 = tokenize('Hi!there', 'L', o);
		expect(t2.map((x) => x.text)).toEqual(['Hi!there']);
		const t3 = tokenize('Hi,there', 'L', o);
		expect(t3.map((x) => x.text)).toEqual(['Hi', ',', 'there']);
	});
});
