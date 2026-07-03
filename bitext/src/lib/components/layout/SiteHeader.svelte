<script lang="ts">
	import { resolve } from '$app/paths';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	const siteTheme = $derived(settingsStore.settings.theme);

	const navLink =
		'text-sm font-medium text-gray-600 underline decoration-gray-400/50 underline-offset-2 hover:text-gray-900 hover:decoration-gray-500/60 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-100 dark:hover:decoration-gray-400/60';

	const themeBtn =
		'inline-flex h-8 w-8 items-center justify-center border-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:focus-visible:outline-gray-400';
	const themeActive = `${themeBtn} bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100`;
	const themeIdle = `${themeBtn} bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800`;
</script>

<header
	class="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 sm:px-4 dark:border-gray-700 dark:bg-gray-900"
>
	<a
		href={resolve('/')}
		class="flex shrink-0 items-center gap-2 text-gray-900 dark:text-white"
		title="Word Aligner home"
	>
		<svg class="h-4 w-6" viewBox="0 0 30 20" fill="none" aria-hidden="true">
			<circle cx="5" cy="5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6" />
			<circle cx="25" cy="15" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6" />
			<line
				x1="6.6"
				y1="6.4"
				x2="23.4"
				y2="13.6"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
			/>
		</svg>
		<span class="font-heading hidden text-base font-semibold tracking-tight sm:inline"
			>Word Aligner</span
		>
	</a>

	<div class="flex shrink-0 items-center gap-2.5 sm:gap-4">
		<nav class="flex items-center gap-3 sm:gap-4" aria-label="Site">
			<a href={resolve('/examples')} class={navLink}>Examples</a>
			<a href={resolve('/guide')} class={navLink}>Guides</a>
			<a href={resolve('/about')} class={navLink}>About</a>
		</nav>
		<div
			class="inline-flex overflow-hidden rounded-none border border-gray-300 dark:border-gray-600"
			role="group"
			aria-label="Site theme (light or dark)"
		>
			<button
				type="button"
				class={siteTheme === 'light' ? themeActive : themeIdle}
				aria-pressed={siteTheme === 'light'}
				title="Light theme"
				onclick={() => settingsStore.patch({ theme: 'light' })}
			>
				<span class="sr-only">Light theme</span>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
					/></svg
				>
			</button>
			<button
				type="button"
				class="{siteTheme === 'dark'
					? themeActive
					: themeIdle} border-l border-gray-300 dark:border-gray-600"
				aria-pressed={siteTheme === 'dark'}
				title="Dark theme"
				onclick={() => settingsStore.patch({ theme: 'dark' })}
			>
				<span class="sr-only">Dark theme</span>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
					/></svg
				>
			</button>
		</div>
	</div>
</header>
