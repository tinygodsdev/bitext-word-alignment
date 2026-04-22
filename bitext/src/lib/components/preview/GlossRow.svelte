<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import { primaryLinkForToken } from '$lib/domain/alignment.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';

	let { tokens, side }: { tokens: Token[]; side: 'source' | 'target' } = $props();

	const gap = $derived(settingsStore.settings.gapWordPx);
	const sz = $derived(settingsStore.settings.glossTextSizePx);
	const links = $derived(projectStore.links);
	const colorByLink = $derived(settingsStore.settings.colorTokensByLink);

	function textColorForToken(tokenId: string): string | undefined {
		if (!colorByLink) return undefined;
		const link = primaryLinkForToken(links, tokenId);
		return link?.color ?? undefined;
	}
</script>

<!-- Same horizontal rhythm as TokenRow so glosses line up with tokens -->
<div class="gloss-row token-row" style:font-size="{sz}px" role="presentation">
	{#each tokens as t, i (t.id)}
		{@const nextTok = tokens[i + 1]}
		<span
			class="token-row__item"
			style:margin-inline-start="{i === 0 ? 0 : t.joinLeft ? 0 : gap}px"
		>
			<span
				class="gloss-cell"
				class:gloss-cell--join-before={Boolean(t.joinLeft)}
				class:gloss-cell--join-after={Boolean(nextTok?.joinLeft)}
				data-token-id={`gloss-${t.id}`}
				data-gloss-for={t.id}
				data-side={side}
				style:color={textColorForToken(t.id)}
			>
				{t.gloss?.trim() ?? ''}
			</span>
		</span>
	{/each}
</div>
