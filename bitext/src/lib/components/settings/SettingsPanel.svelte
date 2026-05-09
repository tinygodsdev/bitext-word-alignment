<script lang="ts">
	import {
		AdjustmentsHorizontalSolid,
		FontFamilyOutline,
		PaletteSolid,
		SplitCellsOutline
	} from 'flowbite-svelte-icons';
	import { Card, TabItem, Tabs } from 'flowbite-svelte';
	import AppearanceTab from './AppearanceTab.svelte';
	import ColorsTab from './ColorsTab.svelte';
	import LinguisticsTab from './LinguisticsTab.svelte';
	import FontsTab from './FontsTab.svelte';
	import { settingsNavStore } from '$lib/state/settingsNav.svelte.js';

	let selected = $state('appearance');
	let lastTokensFocusGeneration = 0;

	$effect(() => {
		const gen = settingsNavStore.tokensFocusGeneration;
		if (gen <= lastTokensFocusGeneration) return;
		lastTokensFocusGeneration = gen;
		selected = 'linguistics';
		queueMicrotask(() => {
			document.getElementById('settings-panel')?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		});
	});
</script>

<Card class="max-w-none min-w-0 w-full p-4 sm:p-6">
	<h2
		id="settings-heading"
		class="font-heading mb-4 text-lg font-semibold text-gray-900 dark:text-white"
	>
		Settings
	</h2>
	<Tabs
		tabStyle="underline"
		bind:selected
		class="min-w-0"
		classes={{
			content: 'mt-0 rounded-none bg-transparent p-0 pt-4 dark:bg-transparent'
		}}
	>
		<TabItem key="appearance" title="Style">
			{#snippet titleSlot()}
				<span
					class="inline-flex items-center justify-center"
					title="Style — background, lines, spacing"
				>
					<span class="sr-only">Style</span>
					<AdjustmentsHorizontalSolid class="h-5 w-5 shrink-0" aria-hidden="true" />
				</span>
			{/snippet}
			<AppearanceTab />
		</TabItem>
		<TabItem key="colors" title="Colors">
			{#snippet titleSlot()}
				<span class="inline-flex items-center justify-center" title="Colors — palettes for links">
					<span class="sr-only">Colors</span>
					<PaletteSolid class="h-5 w-5 shrink-0" aria-hidden="true" />
				</span>
			{/snippet}
			<ColorsTab />
		</TabItem>
		<TabItem key="linguistics" title="Tokens">
			{#snippet titleSlot()}
				<span
					class="inline-flex items-center justify-center"
					title="Tokenization — numbers, split rules"
				>
					<span class="sr-only">Tokens</span>
					<SplitCellsOutline class="h-5 w-5 shrink-0" aria-hidden="true" />
				</span>
			{/snippet}
			<LinguisticsTab />
		</TabItem>
		<TabItem key="fonts" title="Fonts">
			{#snippet titleSlot()}
				<span class="inline-flex items-center justify-center" title="Custom fonts library">
					<span class="sr-only">Fonts</span>
					<FontFamilyOutline class="h-5 w-5 shrink-0" aria-hidden="true" />
				</span>
			{/snippet}
			<FontsTab />
		</TabItem>
	</Tabs>
</Card>
