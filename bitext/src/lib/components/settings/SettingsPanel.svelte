<script lang="ts">
	import AppearanceTab from './AppearanceTab.svelte';
	import ColorsTab from './ColorsTab.svelte';
	import LinguisticsTab from './LinguisticsTab.svelte';
	import FontsTab from './FontsTab.svelte';
	import ExportShareTab from './ExportShareTab.svelte';

	let tab = $state<'appearance' | 'colors' | 'linguistics' | 'fonts' | 'export'>('appearance');

	function go(e: MouseEvent, next: typeof tab) {
		e.preventDefault();
		tab = next;
	}
</script>

<article class="padding border round medium-elevate settings-card">
	<h5 class="no-margin bottom-margin">Settings</h5>
	<div class="settings-tabs-outer bottom-margin">
		<div class="tabs min settings-tabs">
			<a
				href="#appearance"
				class={tab === 'appearance' ? 'active' : ''}
				onclick={(e) => go(e, 'appearance')}>Appearance</a
			>
			<a href="#colors" class={tab === 'colors' ? 'active' : ''} onclick={(e) => go(e, 'colors')}
				>Colors</a
			>
			<a
				href="#linguistics"
				class={tab === 'linguistics' ? 'active' : ''}
				onclick={(e) => go(e, 'linguistics')}>Linguistics</a
			>
			<a href="#fonts" class={tab === 'fonts' ? 'active' : ''} onclick={(e) => go(e, 'fonts')}
				>Fonts</a
			>
			<a href="#export" class={tab === 'export' ? 'active' : ''} onclick={(e) => go(e, 'export')}
				>Export</a
			>
		</div>
	</div>
	<div class="settings-tab-panel">
		{#if tab === 'appearance'}
			<AppearanceTab />
		{:else if tab === 'colors'}
			<ColorsTab />
		{:else if tab === 'linguistics'}
			<LinguisticsTab />
		{:else if tab === 'fonts'}
			<FontsTab />
		{:else}
			<ExportShareTab />
		{/if}
	</div>
</article>
