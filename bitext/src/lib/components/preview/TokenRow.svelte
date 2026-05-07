<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import TokenView from './TokenView.svelte';

	let {
		tokens,
		lineId,
		textSizePx,
		gapWordPx,
		showNumbers,
		interactive = false
	}: {
		tokens: Token[];
		lineId: string;
		textSizePx: number;
		gapWordPx: number;
		showNumbers: boolean;
		interactive?: boolean;
	} = $props();
</script>

<div class="token-row" data-line={lineId} role="group">
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
				joinTightStart={Boolean(t.joinLeft)}
				joinTightEnd={Boolean(nextTok?.joinLeft)}
			/>
		</span>
	{/each}
</div>
