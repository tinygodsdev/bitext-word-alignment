<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import '../app.css';
	import { GA_MEASUREMENT_ID } from '$lib/brand.js';
	import { flowbiteTheme } from '$lib/flowbite-theme.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { ThemeProvider } from 'flowbite-svelte';

	let { children } = $props();

	$effect(() => {
		if (!browser) return;
		const isDark = settingsStore.settings.theme === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
	});

	/** SPA navigations: initial `enter` is already counted by the snippet in app.html */
	afterNavigate(({ to, type }) => {
		if (!browser || type === 'enter' || !to) return;
		const g = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
		if (typeof g !== 'function') return;
		g('config', GA_MEASUREMENT_ID, {
			page_path: to.url.pathname + to.url.search
		});
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap"
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
