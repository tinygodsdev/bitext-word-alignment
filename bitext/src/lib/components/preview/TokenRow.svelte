<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
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
</script>

<div
	class="token-row"
	class:token-row--columns={columns}
	data-line={lineId}
	role="group"
	dir={rowDir}
>
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
</div>
