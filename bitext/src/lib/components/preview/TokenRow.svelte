<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import TokenView from './TokenView.svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	let {
		tokens,
		side,
		showNumbers,
		interactive = false
	}: {
		tokens: Token[];
		side: 'source' | 'target';
		showNumbers: boolean;
		interactive?: boolean;
	} = $props();

	const gap = $derived(settingsStore.settings.gapWordPx);
</script>

<div class="token-row" data-row={side} role="group">
	{#each tokens as t, i (t.id)}
		<span
			class="token-row__item"
			style:margin-inline-start="{i === 0 ? 0 : t.joinLeft ? 0 : gap}px"
		>
			<TokenView token={t} {side} showNumber={showNumbers} index={i} {interactive} />
		</span>
	{/each}
</div>
