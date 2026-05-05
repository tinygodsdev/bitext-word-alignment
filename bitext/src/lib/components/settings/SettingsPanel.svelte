<script lang="ts">
	import {
		AdjustmentsHorizontalSolid,
		FontFamilyOutline,
		LanguageOutline,
		PaletteSolid
	} from 'flowbite-svelte-icons';
	import { Card, TabItem, Tabs } from 'flowbite-svelte';
	import AppearanceTab from './AppearanceTab.svelte';
	import ColorsTab from './ColorsTab.svelte';
	import LinguisticsTab from './LinguisticsTab.svelte';
	import FontsTab from './FontsTab.svelte';

	let selected = $state('appearance');
</script>

<Card class="min-w-0 w-full p-4 sm:p-6">
	<h2 class="font-heading mb-4 text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
	<Tabs tabStyle="underline" bind:selected class="min-w-0">
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
			<div class="min-h-48 pt-4">
				<AppearanceTab />
			</div>
		</TabItem>
		<TabItem key="colors" title="Colors">
			{#snippet titleSlot()}
				<span class="inline-flex items-center justify-center" title="Colors — palettes for links">
					<span class="sr-only">Colors</span>
					<PaletteSolid class="h-5 w-5 shrink-0" aria-hidden="true" />
				</span>
			{/snippet}
			<div class="min-h-48 pt-4">
				<ColorsTab />
			</div>
		</TabItem>
		<TabItem key="linguistics" title="Tokens">
			{#snippet titleSlot()}
				<span
					class="inline-flex items-center justify-center"
					title="Tokenization — numbers, split rules"
				>
					<span class="sr-only">Tokens</span>
					<LanguageOutline class="h-5 w-5 shrink-0" aria-hidden="true" />
				</span>
			{/snippet}
			<div class="min-h-48 pt-4">
				<LinguisticsTab />
			</div>
		</TabItem>
		<TabItem key="fonts" title="Fonts">
			{#snippet titleSlot()}
				<span class="inline-flex items-center justify-center" title="Custom fonts library">
					<span class="sr-only">Fonts</span>
					<FontFamilyOutline class="h-5 w-5 shrink-0" aria-hidden="true" />
				</span>
			{/snippet}
			<div class="min-h-48 pt-4">
				<FontsTab />
			</div>
		</TabItem>
	</Tabs>
</Card>
