<script lang="ts">
	import { settingsStore } from '$lib/state/settings.svelte.js';

	type Side = 'source' | 'target';

	let {
		id,
		text,
		side,
		selected,
		linked,
		highlighted,
		linkHex,
		onclick
	}: {
		id: string;
		text: string;
		side: Side;
		selected: boolean;
		linked: boolean;
		highlighted: boolean;
		/** Line color when colorTokensByLink */
		linkHex: string | null;
		onclick?: (id: string, side: Side) => void;
	} = $props();

	const useLinkTint = $derived(settingsStore.settings.colorTokensByLink && linkHex);

	const chipClass = $derived.by(() => {
		const base =
			'inline-flex items-center rounded-none border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900';
		if (selected) {
			return `${base} border-transparent bg-primary-600 text-white dark:bg-primary-500`;
		}
		if (useLinkTint) {
			return `${base} border-gray-300 bg-white/80 dark:border-gray-600 dark:bg-gray-800/80`;
		}
		if (linked) {
			return `${base} border-primary-400 bg-white dark:border-primary-500 dark:bg-gray-800`;
		}
		return `${base} border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800`;
	});

	const hiClass = 'outline outline-2 outline-primary-500 outline-offset-2';
</script>

{#if onclick}
	<button
		type="button"
		class="{chipClass} {highlighted ? hiClass : ''}"
		style:border-color={useLinkTint && linkHex ? linkHex : undefined}
		style:color={useLinkTint && linkHex ? linkHex : undefined}
		style:background={useLinkTint && linkHex
			? `color-mix(in srgb, ${linkHex} 18%, transparent)`
			: undefined}
		data-token-id={id}
		data-side={side}
		aria-pressed={selected}
		onclick={() => onclick(id, side)}
	>
		{text}
	</button>
{:else}
	<span
		class="{chipClass} {highlighted ? hiClass : ''}"
		style:border-color={useLinkTint && linkHex ? linkHex : undefined}
		style:color={useLinkTint && linkHex ? linkHex : undefined}
		style:background={useLinkTint && linkHex
			? `color-mix(in srgb, ${linkHex} 18%, transparent)`
			: undefined}
		data-token-id={id}
		data-side={side}
	>
		{text}
	</span>
{/if}
