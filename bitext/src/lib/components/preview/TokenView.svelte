<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import { pendingAlignmentColor, primaryLinkForToken } from '$lib/domain/alignment.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';

	let {
		token,
		side,
		showNumber,
		index,
		interactive = false,
		joinTightStart = false,
		joinTightEnd = false
	}: {
		token: Token;
		side: 'source' | 'target';
		showNumber: boolean;
		index: number;
		interactive?: boolean;
		/** Strip inline padding on the start when `token.joinLeft` (alt. separator split). */
		joinTightStart?: boolean;
		/** Strip inline padding on the end when the next token is joined to this one. */
		joinTightEnd?: boolean;
	} = $props();

	let hovering = $state(false);

	const sz = $derived(
		side === 'source'
			? settingsStore.settings.sourceTextSizePx
			: settingsStore.settings.targetTextSizePx
	);
	const palette = $derived(settingsStore.settings.palette);

	const links = $derived(projectStore.links);
	const link = $derived.by(() => primaryLinkForToken(links, token.id));

	const textColor = $derived.by(() => {
		if (!settingsStore.settings.colorTokensByLink || !link?.color) return null;
		return link.color;
	});

	const selectedSource = $derived(selectionStore.selectedSource);
	const selectedTarget = $derived(selectionStore.selectedTarget);

	const isSelected = $derived.by(() =>
		side === 'source' ? selectedSource.has(token.id) : selectedTarget.has(token.id)
	);

	const accentColor = $derived.by(() => {
		if (!interactive) return null;
		const src = [...selectedSource];
		const tgt = [...selectedTarget];

		if (isSelected) {
			return pendingAlignmentColor(links, src, tgt, palette);
		}
		if (!hovering) return null;

		if (src.length && tgt.length === 0 && side === 'target') {
			return pendingAlignmentColor(links, src, [token.id], palette);
		}
		if (tgt.length && src.length === 0 && side === 'source') {
			return pendingAlignmentColor(links, [token.id], tgt, palette);
		}
		if (src.length === 0 && tgt.length === 0) {
			return side === 'source'
				? pendingAlignmentColor(links, [token.id], [], palette)
				: pendingAlignmentColor(links, [], [token.id], palette);
		}
		if (src.length && side === 'source') {
			return pendingAlignmentColor(links, [token.id], [], palette);
		}
		if (tgt.length && side === 'target') {
			return pendingAlignmentColor(links, [], [token.id], palette);
		}
		return null;
	});

	const displayColor = $derived(accentColor ?? textColor ?? undefined);

	function onClick() {
		if (!interactive) return;
		selectionStore.previewTokenClick(side, token.id);
	}
</script>

{#if interactive}
	<button
		type="button"
		class="token-view token-view--clickable"
		class:token-view--join-before={joinTightStart}
		class:token-view--join-after={joinTightEnd}
		class:token-view--colored={textColor && !accentColor}
		class:token-view--accent-sel={accentColor !== null && isSelected}
		class:token-view--accent-hover={accentColor !== null && !isSelected}
		data-token-id={token.id}
		data-side={side}
		style:font-size="{sz}px"
		style:--token-accent={accentColor ?? 'transparent'}
		style:color={displayColor}
		onclick={onClick}
		onmouseenter={() => {
			hovering = true;
		}}
		onmouseleave={() => {
			hovering = false;
		}}
	>
		{#if showNumber}
			<span class="token-view__num">{index + 1}</span>
		{/if}
		<span class="token-view__text">{token.text}</span>
	</button>
{:else}
	<span
		class="token-view"
		class:token-view--join-before={joinTightStart}
		class:token-view--join-after={joinTightEnd}
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
