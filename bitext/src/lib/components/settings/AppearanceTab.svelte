<script lang="ts">
	import { Label, Range } from 'flowbite-svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	// `group` lets a caller render only part of the controls:
	//   'all'  → everything (default; used by the settings panel)
	//   'basic'→ the safe, always-good choices (auto-fit, background, line style)
	//   'fine' → the fine-tuning (size variance, thickness, opacity)
	let { group = 'all' }: { group?: 'all' | 'basic' | 'fine' } = $props();

	const s = $derived(settingsStore.settings);

	const showBasic = $derived(group === 'all' || group === 'basic');
	const showFine = $derived(group === 'all' || group === 'fine');

	const sel =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';
	const chk =
		'peer h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700';
</script>

<div class="grid grid-cols-12 gap-4">
	{#if showBasic}
		<div class="col-span-12">
			<label class="inline-flex cursor-pointer items-center gap-2">
				<input
					type="checkbox"
					class={chk}
					checked={s.autoFit}
					onchange={(e) =>
						settingsStore.patch({ autoFit: (e.currentTarget as HTMLInputElement).checked })}
				/>
				<span class="text-sm font-medium text-gray-800 dark:text-gray-200">
					Auto-fit text to width (never wrap a line)
				</span>
			</label>
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
	{/if}

	{#if showFine}
		{#if s.autoFit}
			<div class="col-span-12">
				<Label class="mb-2">Line size variance ({Math.round(s.autoFitVariance * 100)}%)</Label>
				<Range
					appearance="auto"
					aria-label="How much line sizes may differ when auto-fitting"
					color="indigo"
					size="lg"
					min={0}
					max={1}
					step={0.05}
					value={s.autoFitVariance}
					oninput={(e) =>
						settingsStore.patch({
							autoFitVariance: Number((e.currentTarget as HTMLInputElement).value)
						})}
				/>
				<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
					0% = every line uses one size · 100% = each line is sized on its own
				</p>
			</div>
		{/if}
		<div class="col-span-12 md:col-span-6">
			<Label class="mb-2">Line thickness ({s.lineThickness}px)</Label>
			<Range
				appearance="auto"
				aria-label="Line thickness in pixels"
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
				aria-label="Line opacity"
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
	{/if}
</div>
