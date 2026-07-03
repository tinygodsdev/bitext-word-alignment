<script lang="ts">
	import { Label, Range } from 'flowbite-svelte';
	import SegmentedControl from '$lib/components/settings/SegmentedControl.svelte';
	import FontsTab from '$lib/components/settings/FontsTab.svelte';
	import { PALETTES, PALETTE_NAMES, type PaletteName } from '$lib/domain/palettes.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';

	const s = $derived(settingsStore.settings);
	const isClassic = $derived(s.style === 'classic');

	function choosePalette(name: PaletteName) {
		settingsStore.patch({ palette: name });
		projectStore.recolorAllConnections(name);
	}

	const chk =
		'peer h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600';
	const sectionTitle =
		'text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400';
	const toggleRow = 'inline-flex cursor-pointer items-center gap-2';
	const toggleText = 'text-sm font-medium text-gray-800 dark:text-gray-200';
	const section = 'border-t border-gray-200 pt-4 dark:border-gray-700 first:border-t-0 first:pt-0';
</script>

<div class="flex flex-col gap-4">
	<!-- Canvas: only Classic exposes a light/dark switch; other themes bring their own background. -->
	{#if isClassic}
		<section aria-labelledby="style-section-canvas" class={section}>
			<h3 id="style-section-canvas" class="{sectionTitle} mb-2">Canvas</h3>
			<SegmentedControl
				label="Canvas background"
				options={[
					{ value: 'light', label: 'Light' },
					{ value: 'dark', label: 'Dark' }
				]}
				value={s.background}
				onSelect={(v) => settingsStore.patch({ background: v as 'light' | 'dark' })}
			/>
		</section>
	{/if}

	<!-- Colors: link palette + how it spills onto the words -->
	<section aria-labelledby="style-section-colors" class={section}>
		<h3 id="style-section-colors" class="{sectionTitle} mb-2">Colors</h3>
		<div class="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Link color palette">
			{#each PALETTE_NAMES as name (name)}
				{@const selected = s.palette === name}
				<button
					type="button"
					role="radio"
					aria-checked={selected}
					class="border p-1.5 text-left transition-colors {selected
						? 'border-primary-500 ring-1 ring-primary-500'
						: 'border-gray-200 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-400'}"
					onclick={() => choosePalette(name)}
				>
					<span
						class="mb-1 block truncate text-xs font-medium capitalize text-gray-800 dark:text-gray-100"
					>
						{name}
					</span>
					<span class="flex h-4 overflow-hidden rounded-sm">
						{#each PALETTES[name] as color, i (i)}
							<span class="h-full flex-1" style:background={color}></span>
						{/each}
					</span>
				</button>
			{/each}
		</div>
		<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
			New links pick the next unused color. Changing the palette recolors existing links.
		</p>

		<div class="mt-3 flex flex-col gap-2">
			<label class={toggleRow}>
				<input
					type="checkbox"
					class={chk}
					checked={s.colorTokensByLink}
					onchange={(e) =>
						settingsStore.patch({
							colorTokensByLink: (e.currentTarget as HTMLInputElement).checked
						})}
				/>
				<span class={toggleText}>Color words to match their links</span>
			</label>
			{#if s.colorTokensByLink}
				<SegmentedControl
					label="Where the link color is applied on words"
					options={[
						{ value: 'text', label: 'Word text' },
						{ value: 'background', label: 'Word background' }
					]}
					value={s.tokenLinkColorMode}
					onSelect={(v) => settingsStore.patch({ tokenLinkColorMode: v as 'text' | 'background' })}
				/>
			{/if}
		</div>
	</section>

	<!-- Lines: the connectors between words -->
	<section aria-labelledby="style-section-lines" class={section}>
		<h3 id="style-section-lines" class="{sectionTitle} mb-2">Lines</h3>
		<div class="flex flex-col gap-4">
			<div>
				<Label class="mb-2">Shape</Label>
				<SegmentedControl
					label="Line shape"
					options={[
						{ value: 'straight', label: 'Straight' },
						{ value: 'curved', label: 'Curved' }
					]}
					value={s.lineStyle}
					onSelect={(v) => settingsStore.patch({ lineStyle: v as 'straight' | 'curved' })}
				/>
			</div>
			<div>
				<Label class="mb-2">Thickness ({s.lineThickness}px)</Label>
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
			<div>
				<Label class="mb-2">Opacity ({Math.round(s.lineOpacity * 100)}%)</Label>
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
		</div>
	</section>

	<!-- Text: sizing and word markers -->
	<section aria-labelledby="style-section-text" class={section}>
		<h3 id="style-section-text" class="{sectionTitle} mb-2">Text</h3>
		<div class="flex flex-col gap-3">
			<label class={toggleRow}>
				<input
					type="checkbox"
					class={chk}
					checked={s.autoFit}
					onchange={(e) =>
						settingsStore.patch({ autoFit: (e.currentTarget as HTMLInputElement).checked })}
				/>
				<span class={toggleText}>Auto-fit text to width (never wrap a line)</span>
			</label>
			{#if s.autoFit}
				<div>
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
			<label class={toggleRow}>
				<input
					type="checkbox"
					class={chk}
					checked={s.showNumbers}
					onchange={(e) =>
						settingsStore.patch({ showNumbers: (e.currentTarget as HTMLInputElement).checked })}
				/>
				<span class={toggleText}>Number the words</span>
			</label>
		</div>
	</section>

	<!-- Custom fonts: global library -->
	<section aria-labelledby="style-section-fonts" class={section}>
		<h3 id="style-section-fonts" class="{sectionTitle} mb-2">Custom fonts</h3>
		<FontsTab />
	</section>
</div>
