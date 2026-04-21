<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { flowbiteTheme } from '$lib/flowbite-theme.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { ThemeProvider } from 'flowbite-svelte';

	let { children } = $props();

	$effect(() => {
		if (!browser) return;
		const isDark = settingsStore.settings.theme === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Merriweather:ital,wght@0,400;0,600;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<ThemeProvider theme={flowbiteTheme}>
	<div
		class="min-h-screen bg-app-shell font-sans text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100"
	>
		{@render children()}
	</div>
</ThemeProvider>
