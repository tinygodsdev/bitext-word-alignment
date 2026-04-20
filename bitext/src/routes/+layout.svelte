<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	let { children } = $props();

	$effect(() => {
		if (!browser) return;
		const isDark = settingsStore.settings.theme === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
	{@render children()}
</div>
