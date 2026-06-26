<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ALIGNER_DISPLAY_NAME } from '$lib/brand.js';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import StructuredData from '$lib/components/seo/StructuredData.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { breadcrumbList, type Crumb } from '$lib/seo/structured-data.js';
	import { GUIDE_LINK } from '$lib/guide/ui.js';

	type TocItem = { id: string; label: string };

	let {
		seoTitle,
		description,
		path,
		title,
		lede,
		crumbs = [],
		extraSchema = [],
		toc = [],
		children
	}: {
		seoTitle: string;
		description: string;
		path: string;
		title: string;
		lede?: Snippet;
		crumbs?: Crumb[];
		extraSchema?: object[];
		toc?: TocItem[];
		children: Snippet;
	} = $props();

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(`${page.url.origin}/api/og`);

	const trail: Crumb[] = $derived(
		crumbs.length > 0
			? crumbs
			: [
					{ name: SITE_NAME, path: '/' },
					{ name: title, path }
				]
	);

	const structuredData = $derived([breadcrumbList(trail), ...extraSchema]);
</script>

<svelte:head>
	<title>{seoTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={seoTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:secure_url" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${title} — ${SITE_NAME}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seoTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={`${title} — ${SITE_NAME}`} />
</svelte:head>

<StructuredData data={structuredData} />

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<nav class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
			<a href={resolve('/')} class={GUIDE_LINK}>← {ALIGNER_DISPLAY_NAME}</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/guide')} class={GUIDE_LINK}>Guides</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/examples')} class={GUIDE_LINK}>Examples</a>
		</nav>
		<h1 class="font-heading mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
			{title}
		</h1>
		{#if lede}
			<div class="mt-3 max-w-prose text-base text-gray-600 dark:text-gray-400">
				{@render lede()}
			</div>
		{/if}
	</header>

	{#if toc.length > 0}
		<nav
			class="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800/60"
			aria-label="On this page"
		>
			<p class="m-0 font-medium text-gray-900 dark:text-white">On this page</p>
			<ul class="mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
				{#each toc as item (item.id)}
					<li>
						<a
							href={`#${item.id}`}
							class="text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
							>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}

	{@render children()}

	<SiteFooter />
</main>
