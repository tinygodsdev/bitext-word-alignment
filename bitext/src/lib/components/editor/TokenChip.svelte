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
		onclick: (id: string, side: Side) => void;
	} = $props();

	const useLinkTint = $derived(settingsStore.settings.colorTokensByLink && linkHex);

	const chipClass = $derived(
		selected
			? 'chip small fill primary'
			: useLinkTint
				? 'chip small border'
				: linked
					? 'chip small border primary'
					: 'chip small border'
	);
</script>

<button
	type="button"
	class="{chipClass} {highlighted ? 'token-chip--hi' : ''}"
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
