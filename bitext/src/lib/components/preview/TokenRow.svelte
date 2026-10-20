<script lang="ts">
	import { groupJoinedTokens, type Token } from '$lib/domain/tokens.js';
	import type { LayoutAxis, TextOrientation } from '$lib/types/layout.js';
	import TokenView from './TokenView.svelte';

	let {
		tokens,
		lineId,
		textSizePx,
		gapWordPx,
		showNumbers,
		interactive = false,
		rtl = false,
		axis = 'rows',
		orientation = 'upright'
	}: {
		tokens: Token[];
		lineId: string;
		textSizePx: number;
		gapWordPx: number;
		showNumbers: boolean;
		interactive?: boolean;
		/** Visual row direction; token order and ids stay logical LTR. */
		rtl?: boolean;
		axis?: LayoutAxis;
		orientation?: TextOrientation;
	} = $props();

	const columns = $derived(axis === 'columns');
	/**
	 * In column mode the row itself is set vertically, so flex direction and the logical
	 * `margin-inline-start` between tokens map to the block axis without any extra branching.
	 * `dir` then moves onto each token: on a vertical row it would reverse token flow rather
	 * than the text inside a word.
	 */
	const rowDir = $derived(columns ? 'ltr' : rtl ? 'rtl' : 'ltr');
	const tokenDir = $derived(columns && rtl ? 'rtl' : undefined);
	/**
	 * Upright words in a column would put a joined morpheme on its own row, where it reads as a
	 * separate word. Each word becomes a staircase instead: every piece keeps its own row, so
	 * connectors still reach both sides of it, and starts where the previous piece ends.
	 * Vertical and sideways glyphs already continue the word along the column.
	 */
	const staircase = $derived(columns && orientation === 'upright');
	const words = $derived(staircase ? groupJoinedTokens(tokens) : []);
</script>

<div
	class="token-row"
	class:token-row--columns={columns}
	data-line={lineId}
	role="group"
	dir={rowDir}
>
	{#if staircase}
		{#each words as word, wi (word[0]!.token.id)}
			<!-- The word sets its own text horizontally, so a logical margin would land on its side;
			     the column always runs top to bottom. -->
			<span
				class="token-row__item token-row__word"
				dir={tokenDir}
				style:margin-top="{wi === 0 ? 0 : gapWordPx}px"
			>
				{#each word as { token, index }, k (token.id)}
					<span style:grid-row={k + 1} style:grid-column={k + 1}>
						<TokenView
							{token}
							{lineId}
							{textSizePx}
							showNumber={showNumbers}
							{index}
							{interactive}
							{orientation}
							dir={tokenDir}
							joinTightStart={k > 0}
							joinTightEnd={k < word.length - 1}
						/>
					</span>
				{/each}
			</span>
		{/each}
	{:else}
		{#each tokens as t, i (t.id)}
			{@const nextTok = tokens[i + 1]}
			<span
				class="token-row__item"
				style:margin-inline-start="{i === 0 ? 0 : t.joinLeft ? 0 : gapWordPx}px"
			>
				<TokenView
					token={t}
					{lineId}
					{textSizePx}
					showNumber={showNumbers}
					index={i}
					{interactive}
					{orientation}
					dir={tokenDir}
					joinTightStart={Boolean(t.joinLeft)}
					joinTightEnd={Boolean(nextTok?.joinLeft)}
				/>
			</span>
		{/each}
	{/if}
</div>
