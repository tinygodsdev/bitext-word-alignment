<script lang="ts">
	import { Label, Range } from 'flowbite-svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import {
		MAX_LINE_GAP_PX,
		MAX_TEXT_SIZE_PX,
		MIN_LINE_GAP_PX,
		MIN_TEXT_SIZE_PX
	} from '$lib/serialization/schema.js';

	const s = $derived(settingsStore.settings);

	const sel =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';

	const fileInputClass =
		'block w-full cursor-pointer rounded-none border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400';
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-12 md:col-span-6">
		<Label for="settings-theme" class="mb-2">Theme</Label>
		<select
			id="settings-theme"
			class={sel}
			value={s.theme}
			onchange={(e) =>
				settingsStore.patch({
					theme: (e.currentTarget as HTMLSelectElement).value as 'light' | 'dark'
				})}
		>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label for="settings-background" class="mb-2">Background</Label>
		<select
			id="settings-background"
			class={sel}
			value={s.background}
			onchange={(e) =>
				settingsStore.patch({
					background: (e.currentTarget as HTMLSelectElement).value as 'light' | 'dark' | 'image'
				})}
		>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
			<option value="image">Image</option>
		</select>
	</div>
	{#if s.background === 'image'}
		<div class="col-span-12">
			<Label for="settings-bg-file" class="mb-2">Background image</Label>
			<input
				id="settings-bg-file"
				type="file"
				accept="image/*"
				class={fileInputClass}
				onchange={async (e) => {
					const f = (e.currentTarget as HTMLInputElement).files?.[0];
					if (!f) return;
					const dataUrl = await new Promise<string>((res, rej) => {
						const r = new FileReader();
						r.onload = () => res(String(r.result));
						r.onerror = () => rej(new Error('read'));
						r.readAsDataURL(f);
					});
					settingsStore.patch({ backgroundImageDataUrl: dataUrl });
				}}
			/>
		</div>
	{/if}
	<div class="col-span-12 md:col-span-6">
		<Label class="mb-2">Source size ({s.sourceTextSizePx}px)</Label>
		<Range
			appearance="auto"
			color="indigo"
			size="lg"
			min={MIN_TEXT_SIZE_PX}
			max={MAX_TEXT_SIZE_PX}
			step={1}
			value={s.sourceTextSizePx}
			oninput={(e) =>
				settingsStore.patch({
					sourceTextSizePx: Number((e.currentTarget as HTMLInputElement).value)
				})}
		/>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label class="mb-2">Target size ({s.targetTextSizePx}px)</Label>
		<Range
			appearance="auto"
			color="indigo"
			size="lg"
			min={MIN_TEXT_SIZE_PX}
			max={MAX_TEXT_SIZE_PX}
			step={1}
			value={s.targetTextSizePx}
			oninput={(e) =>
				settingsStore.patch({
					targetTextSizePx: Number((e.currentTarget as HTMLInputElement).value)
				})}
		/>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label class="mb-2">Word gap ({s.gapWordPx}px)</Label>
		<Range
			appearance="auto"
			color="indigo"
			size="lg"
			min={0}
			max={32}
			step={1}
			value={s.gapWordPx}
			oninput={(e) =>
				settingsStore.patch({ gapWordPx: Number((e.currentTarget as HTMLInputElement).value) })}
		/>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label class="mb-2">Line gap ({s.gapLinePx}px)</Label>
		<Range
			appearance="auto"
			color="indigo"
			size="lg"
			min={MIN_LINE_GAP_PX}
			max={MAX_LINE_GAP_PX}
			step={1}
			value={s.gapLinePx}
			oninput={(e) =>
				settingsStore.patch({ gapLinePx: Number((e.currentTarget as HTMLInputElement).value) })}
		/>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label class="mb-2">Line thickness ({s.lineThickness}px)</Label>
		<Range
			appearance="auto"
			color="indigo"
			size="lg"
			min={1}
			max={8}
			step={1}
			value={s.lineThickness}
			oninput={(e) =>
				settingsStore.patch({
					lineThickness: Number((e.currentTarget as HTMLInputElement).value)
				})}
		/>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label class="mb-2">Line opacity ({Math.round(s.lineOpacity * 100)}%)</Label>
		<Range
			appearance="auto"
			color="indigo"
			size="lg"
			min={0.2}
			max={1}
			step={0.05}
			value={s.lineOpacity}
			oninput={(e) =>
				settingsStore.patch({
					lineOpacity: Number((e.currentTarget as HTMLInputElement).value)
				})}
		/>
	</div>
	<div class="col-span-12 md:col-span-6">
		<Label for="settings-line-style" class="mb-2">Line style</Label>
		<select
			id="settings-line-style"
			class={sel}
			value={s.lineStyle}
			onchange={(e) =>
				settingsStore.patch({
					lineStyle: (e.currentTarget as HTMLSelectElement).value as 'straight' | 'curved'
				})}
		>
			<option value="straight">Straight</option>
			<option value="curved">Curved</option>
		</select>
	</div>
</div>
