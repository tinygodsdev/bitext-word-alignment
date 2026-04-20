<script lang="ts">
	import { Card, TabItem, Tabs } from 'flowbite-svelte';
	import AppearanceTab from './AppearanceTab.svelte';
	import ColorsTab from './ColorsTab.svelte';
	import LinguisticsTab from './LinguisticsTab.svelte';
	import FontsTab from './FontsTab.svelte';

	let selected = $state('appearance');
</script>

<Card class="min-w-0 w-full p-4 sm:p-6">
	<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
	<Tabs tabStyle="underline" bind:selected class="min-w-0">
		<TabItem key="appearance" title="Appearance">
			<div class="min-h-48 pt-4">
				<AppearanceTab />
			</div>
		</TabItem>
		<TabItem key="colors" title="Colors">
			<div class="min-h-48 pt-4">
				<ColorsTab />
			</div>
		</TabItem>
		<TabItem key="linguistics" title="Linguistics">
			<div class="min-h-48 pt-4">
				<LinguisticsTab />
			</div>
		</TabItem>
		<TabItem key="fonts" title="Fonts">
			<div class="min-h-48 pt-4">
				<FontsTab />
			</div>
		</TabItem>
	</Tabs>
</Card>
