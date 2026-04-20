<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	let { children } = $props();

	$effect(() => {
		if (!browser) return;
		const mode = settingsStore.settings.theme === 'dark' ? 'dark' : 'light';
		document.body.classList.remove('light', 'dark');
		document.body.classList.add(mode);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
		rel="stylesheet"
	/>
	<link href="https://cdn.jsdelivr.net/npm/beercss@4.0.20/dist/cdn/beer.min.css" rel="stylesheet" />
	<script
		type="module"
		src="https://cdn.jsdelivr.net/npm/beercss@4.0.20/dist/cdn/beer.min.js"
	></script>
	<script
		type="module"
		src="https://cdn.jsdelivr.net/npm/material-dynamic-colors@1.1.4/dist/cdn/material-dynamic-colors.min.js"
	></script>
</svelte:head>

{@render children()}
