<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import { GOOGLE_FONT_OPTIONS } from '$lib/fonts/google-fonts.js';
	import { saveCustomFontBlob } from '$lib/fonts/custom-fonts.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	const s = $derived(settingsStore.settings);

	const sel =
		'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';

	const fileClass =
		'block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400';

	async function onCustomFile(side: 'source' | 'target', e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const name = file.name.replace(/\.[^.]+$/, '') || 'CustomFont';
		await saveCustomFontBlob(name, file);
		const buf = await file.arrayBuffer();
		const ff = new FontFace(name, buf);
		await ff.load();
		document.fonts.add(ff);
		if (side === 'source') {
			settingsStore.patch({ sourceFontSource: 'custom', sourceCustomFontName: name });
		} else {
			settingsStore.patch({ targetFontSource: 'custom', targetCustomFontName: name });
		}
	}
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-12">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white">Source line</h3>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label for="settings-font-source-src" class="mb-2">Source font source</Label>
		<select
			id="settings-font-source-src"
			class={sel}
			value={s.sourceFontSource}
			onchange={(e) =>
				settingsStore.patch({
					sourceFontSource: (e.currentTarget as HTMLSelectElement).value as 'google' | 'custom'
				})}
		>
			<option value="google">Google Fonts</option>
			<option value="custom">Custom upload</option>
		</select>
	</div>
	{#if s.sourceFontSource === 'google'}
		<div class="col-span-12 md:col-span-6">
			<Label for="settings-font-family-src" class="mb-2">Source typeface</Label>
			<select
				id="settings-font-family-src"
				class={sel}
				value={s.sourceFontFamily}
				onchange={(e) =>
					settingsStore.patch({ sourceFontFamily: (e.currentTarget as HTMLSelectElement).value })}
			>
				{#each GOOGLE_FONT_OPTIONS as o (o.family)}
					<option value={o.label}>{o.label}</option>
				{/each}
			</select>
		</div>
	{:else}
		<div class="col-span-12 md:col-span-6">
			<Label for="settings-font-file-src" class="mb-2">Upload source font</Label>
			<input
				id="settings-font-file-src"
				type="file"
				accept=".woff2,.ttf,.otf,.woff"
				class={fileClass}
				onchange={(e) => onCustomFile('source', e)}
			/>
		</div>
		{#if s.sourceCustomFontName}
			<div class="col-span-12">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Loaded: <strong class="text-gray-900 dark:text-white">{s.sourceCustomFontName}</strong>
				</p>
			</div>
		{/if}
	{/if}

	<div class="col-span-12 mt-2">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white">Target line</h3>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label for="settings-font-source-tgt" class="mb-2">Target font source</Label>
		<select
			id="settings-font-source-tgt"
			class={sel}
			value={s.targetFontSource}
			onchange={(e) =>
				settingsStore.patch({
					targetFontSource: (e.currentTarget as HTMLSelectElement).value as 'google' | 'custom'
				})}
		>
			<option value="google">Google Fonts</option>
			<option value="custom">Custom upload</option>
		</select>
	</div>
	{#if s.targetFontSource === 'google'}
		<div class="col-span-12 md:col-span-6">
			<Label for="settings-font-family-tgt" class="mb-2">Target typeface</Label>
			<select
				id="settings-font-family-tgt"
				class={sel}
				value={s.targetFontFamily}
				onchange={(e) =>
					settingsStore.patch({ targetFontFamily: (e.currentTarget as HTMLSelectElement).value })}
			>
				{#each GOOGLE_FONT_OPTIONS as o (o.family)}
					<option value={o.label}>{o.label}</option>
				{/each}
			</select>
		</div>
	{:else}
		<div class="col-span-12 md:col-span-6">
			<Label for="settings-font-file-tgt" class="mb-2">Upload target font</Label>
			<input
				id="settings-font-file-tgt"
				type="file"
				accept=".woff2,.ttf,.otf,.woff"
				class={fileClass}
				onchange={(e) => onCustomFile('target', e)}
			/>
		</div>
		{#if s.targetCustomFontName}
			<div class="col-span-12">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Loaded: <strong class="text-gray-900 dark:text-white">{s.targetCustomFontName}</strong>
				</p>
			</div>
		{/if}
	{/if}
</div>
