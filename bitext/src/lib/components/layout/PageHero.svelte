<script lang="ts">
	import type { Snippet } from 'svelte';

	type Crumb = { label: string; href: string };

	let {
		eyebrow,
		title,
		crumbs = [],
		lede
	}: {
		eyebrow?: string;
		title: string;
		crumbs?: Crumb[];
		lede?: Snippet;
	} = $props();

	const crumbLink =
		'font-medium text-gray-500 no-underline transition-colors hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-300';
</script>

<header class="relative mb-10">
	{#if crumbs.length > 0}
		<nav class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm" aria-label="Breadcrumb">
			{#each crumbs as crumb, i (crumb.href)}
				{#if i > 0}
					<span class="text-gray-300 dark:text-gray-600" aria-hidden="true">/</span>
				{/if}
				<a href={crumb.href} class={crumbLink}>{crumb.label}</a>
			{/each}
		</nav>
	{/if}

	{#if eyebrow}
		<p
			class="font-heading mt-6 text-xs font-semibold tracking-[0.18em] text-primary-600 uppercase dark:text-primary-400"
		>
			{eyebrow}
		</p>
	{/if}

	<h1
		class="font-heading mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
	>
		{title}
	</h1>

	{#if lede}
		<div class="mt-4 max-w-prose text-lg leading-relaxed text-gray-600 dark:text-gray-400">
			{@render lede()}
		</div>
	{/if}

	<div
		class="mt-8 h-px w-full bg-linear-to-r from-primary-500/60 via-gray-200 to-transparent dark:from-primary-400/50 dark:via-gray-700"
		aria-hidden="true"
	></div>
</header>
