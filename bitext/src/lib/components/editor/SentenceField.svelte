<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import TokenChip from './TokenChip.svelte';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { linkHover } from '$lib/state/linkHover.svelte.js';
	import { linkForId, primaryLinkForToken } from '$lib/domain/alignment.js';

	type Side = 'source' | 'target';

	let {
		label,
		side,
		rawText,
		tokens,
		onText
	}: {
		label: string;
		side: Side;
		rawText: string;
		tokens: Token[];
		onText: (v: string) => void;
	} = $props();

	const links = $derived(projectStore.links);

	function tokenLinked(id: string): boolean {
		return links.some((l) => l.sourceId === id || l.targetId === id);
	}

	function tokenLinkColor(id: string): string | null {
		const link = primaryLinkForToken(links, id);
		return link?.color ?? null;
	}

	function tokenHighlighted(id: string): boolean {
		const hid = linkHover.id;
		if (!hid) return false;
		const link = linkForId(links, hid);
		if (!link) return false;
		return (
			(side === 'source' && link.sourceId === id) || (side === 'target' && link.targetId === id)
		);
	}

	function onTokenClick(id: string, s: Side) {
		selectionStore.toggleToken(s, id);
	}
</script>

<div>
	<div class="field label border">
		<textarea
			id="sentence-{side}"
			rows="2"
			placeholder=" "
			value={rawText}
			oninput={(e) => onText((e.currentTarget as HTMLTextAreaElement).value)}
		></textarea>
		<label class="active" for="sentence-{side}">{label}</label>
	</div>
	<div class="editor-token-row top-margin" role="group" aria-label="Word tokens">
		{#each tokens as t (t.id)}
			<TokenChip
				id={t.id}
				text={t.text}
				{side}
				selected={(side === 'source'
					? selectionStore.selectedSource
					: selectionStore.selectedTarget
				).has(t.id)}
				linked={tokenLinked(t.id)}
				linkHex={tokenLinkColor(t.id)}
				highlighted={tokenHighlighted(t.id)}
				onclick={onTokenClick}
			/>
		{/each}
	</div>
</div>
