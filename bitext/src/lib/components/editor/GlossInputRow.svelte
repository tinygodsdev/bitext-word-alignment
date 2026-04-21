<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import type { Token } from '$lib/domain/tokens.js';

	const inputClass =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';

	let {
		tokens,
		onGloss
	}: {
		tokens: Token[];
		onGloss: (tokenId: string, value: string) => void;
	} = $props();
</script>

<div class="flex flex-wrap items-start gap-2" aria-label="Gloss inputs">
	{#each tokens as t (t.id)}
		<div class="flex min-w-16 max-w-32 flex-col gap-0.5">
			<Label class="text-xs text-gray-600 dark:text-gray-400" for="gloss-input-{t.id}">
				{t.text}
			</Label>
			<input
				id="gloss-input-{t.id}"
				type="text"
				class={inputClass}
				placeholder=" "
				value={t.gloss ?? ''}
				oninput={(e) => onGloss(t.id, (e.currentTarget as HTMLInputElement).value)}
			/>
		</div>
	{/each}
</div>
