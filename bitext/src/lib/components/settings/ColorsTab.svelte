<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import type { PaletteName } from '$lib/domain/palettes.js';
	import { PALETTES } from '$lib/domain/palettes.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	function setPalette(name: PaletteName) {
		settingsStore.patch({ palette: name });
		projectStore.recolorAllLinks(name);
	}

	const s = $derived(settingsStore.settings);

	const names: PaletteName[] = ['pastel', 'vivid', 'academic'];

	const chk =
		'peer h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600';

	const paletteBtnBase =
		'rounded-none border-2 px-3 py-1.5 text-sm font-medium capitalize transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

	function paletteBtnClass(name: PaletteName): string {
		const on = s.palette === name;
		if (on) {
			return `${paletteBtnBase} border-primary-600 bg-primary-600 text-white shadow-sm dark:border-primary-500 dark:bg-primary-600`;
		}
		return `${paletteBtnBase} border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/80`;
	}
</script>

<div>
	<div class="mb-4 flex flex-wrap items-start justify-between gap-3">
		<div>
			<h3 class="font-heading text-sm font-semibold text-gray-900 dark:text-white">
				Match token color to links
			</h3>
			<p class="text-base text-gray-600 dark:text-gray-400">
				Preview, editor chips, and exports when enabled
			</p>
		</div>
		<Label class="inline-flex cursor-pointer items-center gap-2">
			<input
				type="checkbox"
				class={chk}
				checked={s.colorTokensByLink}
				onchange={(e) =>
					settingsStore.patch({
						colorTokensByLink: (e.currentTarget as HTMLInputElement).checked
					})}
			/>
			<span class="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
		</Label>
	</div>
	<p class="mb-4 text-base text-gray-600 dark:text-gray-400">
		New links pick the next color from the palette. Remove a link in the preview by clicking its
		line.
	</p>
	<div class="mb-4 flex flex-wrap gap-2">
		{#each names as name (name)}
			<button type="button" class={paletteBtnClass(name)} onclick={() => setPalette(name)}>
				{name}
			</button>
		{/each}
	</div>
	<div class="flex flex-wrap items-center gap-2">
		{#each PALETTES[s.palette] as color, i (i)}
			<span
				class="h-8 w-8 rounded-none border border-gray-200 shadow-sm dark:border-gray-600"
				style:background={color}
				title={color}
			></span>
		{/each}
	</div>
</div>
