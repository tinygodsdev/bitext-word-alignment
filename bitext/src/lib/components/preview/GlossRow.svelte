<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	let { tokens, side }: { tokens: Token[]; side: 'source' | 'target' } = $props();

	const sz = $derived(Math.max(12, settingsStore.settings.textSizePx * 0.75));
</script>

<div
	class="gloss-row"
	style:gap="{settingsStore.settings.gapWordPx}px"
	style:font-size="{sz}px"
	aria-hidden="true"
>
	{#each tokens as t (t.id)}
		<span class="gloss-cell" data-token-id={`gloss-${t.id}`} data-gloss-for={t.id} data-side={side}>
			{t.gloss ?? '·'}
		</span>
	{/each}
</div>
