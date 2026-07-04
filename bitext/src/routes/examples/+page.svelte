<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ALIGNER_DISPLAY_NAME } from '$lib/brand.js';
	import PageHero from '$lib/components/layout/PageHero.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import StructuredData from '$lib/components/seo/StructuredData.svelte';
	import { galleryPreviewImageUrl } from '$lib/examples/cdn.js';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { breadcrumbList } from '$lib/seo/structured-data.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const TITLE = 'Examples';
	const SEO_TITLE = 'Word Alignment & Interlinear Gloss Examples';
	const DESCRIPTION =
		'Browse word alignment and interlinear gloss examples — bilingual pairs, Turkish IPA stacks, RTL scripts, Tagalog compounds, and Japanese–Chinese–English word order. Open any example in the Aligner editor.';

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(
		galleryPreviewImageUrl(data.examples[0]?.slug ?? 'english-french-word-alignment')
	);

	const structuredData = breadcrumbList([
		{ name: SITE_NAME, path: '/' },
		{ name: 'Examples', path: '/examples' }
	]);

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
</script>

<svelte:head>
	<title>{SEO_TITLE} · {SITE_NAME}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${SEO_TITLE} · ${SITE_NAME}`} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:secure_url" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content={`${SEO_TITLE} — ${SITE_NAME}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${SEO_TITLE} · ${SITE_NAME}`} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<StructuredData data={structuredData} />

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<PageHero
		eyebrow="Gallery"
		title={TITLE}
		crumbs={[
			{ label: `← ${ALIGNER_DISPLAY_NAME}`, href: resolve('/') },
			{ label: 'Guides', href: resolve('/guide') },
			{ label: 'Examples', href: resolve('/examples') }
		]}
	>
		{#snippet lede()}
			{DESCRIPTION}
			<span class="mt-3 block">
				New to the notation? Start with the
				<a href={resolve('/guide/glossing-abbreviations')} class={linkClass}
					>glossing abbreviations cheat sheet</a
				>, then open any example below in the editor.
			</span>
		{/snippet}
	</PageHero>

	<ul class="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
		{#each data.examples as ex (ex.slug)}
			<li class="h-full">
				<a
					href={resolve(`/examples/${ex.slug}`)}
					class="group flex h-full flex-col overflow-hidden border border-gray-200 bg-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-primary-500/60"
				>
					<div
						class="overflow-hidden border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40"
					>
						<img
							src={ex.previewImageUrl}
							alt={ex.imageAlt}
							width={960}
							height={540}
							loading="lazy"
							decoding="async"
							class="w-full bg-white object-contain object-center transition-transform duration-300 group-hover:scale-[1.03] dark:bg-gray-900/40"
						/>
					</div>
					<div class="flex flex-1 flex-col p-4">
						<h2
							class="font-heading m-0 text-lg leading-snug font-semibold text-gray-900 dark:text-white"
						>
							{ex.title}
						</h2>
						<p class="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							{ex.description}
						</p>
						<p
							class="mt-4 mb-0 inline-flex items-center gap-1 text-sm font-medium text-primary-700 dark:text-primary-400"
						>
							View example
							<svg
								class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
							</svg>
						</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	<SiteFooter />
</main>
