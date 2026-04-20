<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { primaryLinkForToken } from '$lib/domain/alignment.js';

	let {
		token,
		side,
		showNumber,
		index,
		interactive = false
	}: {
		token: Token;
		side: 'source' | 'target';
		showNumber: boolean;
		index: number;
		interactive?: boolean;
	} = $props();

	const sz = $derived(settingsStore.settings.textSizePx);

	const links = $derived(projectStore.links);
	const link = $derived.by(() => primaryLinkForToken(links, token.id));

	const textColor = $derived.by(() => {
		if (!settingsStore.settings.colorTokensByLink || !link?.color) return null;
		return link.color;
	});

	function onClick() {
		if (!interactive) return;
		selectionStore.previewTokenClick(side, token.id);
	}
</script>

{#if interactive}
	<button
		type="button"
		class="token-view token-view--clickable"
		class:token-view--colored={textColor}
		data-token-id={token.id}
		data-side={side}
		style:font-size="{sz}px"
		style:color={textColor ?? undefined}
		onclick={onClick}
	>
		{#if showNumber}
			<span class="token-view__num">{index + 1}</span>
		{/if}
		<span class="token-view__text">{token.text}</span>
	</button>
{:else}
	<span
		class="token-view"
		class:token-view--colored={textColor}
		data-token-id={token.id}
		data-side={side}
		style:font-size="{sz}px"
		style:color={textColor ?? undefined}
	>
		{#if showNumber}
			<span class="token-view__num">{index + 1}</span>
		{/if}
		<span class="token-view__text">{token.text}</span>
	</span>
{/if}
