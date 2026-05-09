<script lang="ts">
	import { Label, Range } from 'flowbite-svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	const s = $derived(settingsStore.settings);

	const sel =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';

</script>

<div class="grid grid-cols-12 gap-4">
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
		<Label for="settings-background" class="mb-2">Background</Label>
		<select
			id="settings-background"
			class={sel}
			value={s.background}
			onchange={(e) =>
				settingsStore.patch({
					background: (e.currentTarget as HTMLSelectElement).value as 'light' | 'dark'
				})}
		>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
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
