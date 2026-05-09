<script lang="ts">
	import { browser } from '$app/environment';
	import { Label } from 'flowbite-svelte';
	import {
		saveCustomFontBlob,
		listStoredCustomFontNames,
		removeCustomFont
	} from '$lib/fonts/custom-fonts.js';

	const fileClass =
		'block w-full cursor-pointer rounded-none border border-gray-300 bg-gray-50 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400';

	let customNames = $state<string[]>([]);
	let status = $state<string | null>(null);

	async function refresh() {
		if (!browser) return;
		customNames = await listStoredCustomFontNames();
	}

	$effect(() => {
		void refresh();
	});

	async function onUpload(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const name = file.name.replace(/\.[^.]+$/, '') || 'CustomFont';
		await saveCustomFontBlob(name, file);
		const buf = await file.arrayBuffer();
		if (browser) {
			const ff = new FontFace(name, buf);
			await ff.load();
			document.fonts.add(ff);
		}
		status = `Uploaded “${name}”. Select it from a line’s font settings in the editor.`;
		input.value = '';
		await refresh();
	}

	async function onRemove(name: string) {
		if (typeof window !== 'undefined' && !window.confirm(`Remove stored font “${name}”?`)) return;
		await removeCustomFont(name);
		status = `Removed “${name}”.`;
		await refresh();
	}
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-12">
		<h3 class="font-heading text-sm font-semibold text-gray-900 dark:text-white">
			Custom fonts library
		</h3>
		<p class="mt-1 text-base text-gray-600 dark:text-gray-400">
			Upload font files once; they are stored in your browser. In the editor, set each line to
			<strong>Custom</strong> and pick the family name here.
		</p>
	</div>
	<div class="col-span-12">
		<Label for="settings-global-font-upload" class="mb-2">Upload font file</Label>
		<input
			id="settings-global-font-upload"
			type="file"
			accept=".woff2,.ttf,.otf,.woff"
			class={fileClass}
			onchange={onUpload}
		/>
	</div>
	{#if status}
		<div class="col-span-12 text-sm text-gray-600 dark:text-gray-400">
			{status}
		</div>
	{/if}
	<div class="col-span-12">
		<h4 class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
			Stored fonts
		</h4>
		{#if customNames.length === 0}
			<p class="text-sm text-gray-500 dark:text-gray-400">No custom fonts uploaded yet.</p>
		{:else}
			<ul class="space-y-2">
				{#each customNames as name (name)}
					<li
						class="flex flex-wrap items-center justify-between gap-2 border border-gray-200 px-3 py-2 dark:border-gray-600"
					>
						<span class="font-medium text-gray-900 dark:text-white">{name}</span>
						<button
							type="button"
							class="text-sm text-red-600 hover:underline dark:text-red-400"
							onclick={() => onRemove(name)}
						>
							Remove
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
