<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import type { Token } from '$lib/domain/tokens.js';
	import TokenChip from './TokenChip.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { linkHover } from '$lib/state/linkHover.svelte.js';
	import { linkForId, primaryLinkForToken } from '$lib/domain/alignment.js';

	type Side = 'source' | 'target';

	const areaClass =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500';

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
</script>

<div>
	<Label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="sentence-{side}">
		{label}
	</Label>
	<textarea
		id="sentence-{side}"
		class="{areaClass} mb-3"
		rows={2}
		placeholder=" "
		value={rawText}
		oninput={(e) => onText((e.currentTarget as HTMLTextAreaElement).value)}
	></textarea>
	<div class="flex flex-wrap items-center gap-x-2 gap-y-1.5" role="group" aria-label="Word tokens">
		{#each tokens as t (t.id)}
			<TokenChip
				id={t.id}
				text={t.text}
				{side}
				selected={false}
				linked={tokenLinked(t.id)}
				linkHex={tokenLinkColor(t.id)}
				highlighted={tokenHighlighted(t.id)}
			/>
		{/each}
	</div>
</div>
