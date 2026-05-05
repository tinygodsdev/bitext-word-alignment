<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import TokenView from './TokenView.svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	let {
		tokens,
		lineId,
		textSizePx,
		showNumbers,
		interactive = false
	}: {
		tokens: Token[];
		lineId: string;
		textSizePx: number;
		showNumbers: boolean;
		interactive?: boolean;
	} = $props();

	const gap = $derived(settingsStore.settings.gapWordPx);
</script>

<div class="token-row" data-line={lineId} role="group">
	{#each tokens as t, i (t.id)}
		{@const nextTok = tokens[i + 1]}
		<span
			class="token-row__item"
			style:margin-inline-start="{i === 0 ? 0 : t.joinLeft ? 0 : gap}px"
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
