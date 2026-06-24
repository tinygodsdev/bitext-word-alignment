<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ALIGNER_DISPLAY_NAME } from '$lib/brand.js';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import PartnerBannerById from '$lib/components/partners/PartnerBannerById.svelte';
	import StructuredData from '$lib/components/seo/StructuredData.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { breadcrumbList, techArticle } from '$lib/seo/structured-data.js';
	import { EXAMPLE_PREVIEW_DIMENSIONS } from '$lib/examples/preview-dimensions.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const entry = $derived(data.entry);
	const previewImageUrl = $derived(data.previewImageUrl);
	const exampleSlug = $derived(data.exampleSlug);
	const bodyParagraphs = $derived(entry.body.split('\n\n'));
	const dimensions = $derived(EXAMPLE_PREVIEW_DIMENSIONS[entry.slug]);

	const canonical = $derived(page.url.origin + page.url.pathname);

	const structuredData = $derived([
		breadcrumbList([
			{ name: SITE_NAME, path: '/' },
			{ name: 'Examples', path: '/examples' },
			{ name: entry.title, path: `/examples/${entry.slug}` }
		]),
		techArticle({
			headline: entry.title,
			description: entry.description,
			path: `/examples/${entry.slug}`,
			image: {
				url: previewImageUrl,
				width: dimensions.width,
				height: dimensions.height,
				alt: entry.imageAlt
			}
		})
	]);

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';

	const ctaClass =
		'inline-flex items-center gap-1 rounded-none border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-medium text-white no-underline shadow-sm hover:bg-primary-700 dark:border-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500';
</script>

<svelte:head>
	<title>{entry.title} · {SITE_NAME}</title>
	<meta name="description" content={entry.description} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={`${entry.title} · ${SITE_NAME}`} />
	<meta property="og:description" content={entry.description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={previewImageUrl} />
	<meta property="og:image:secure_url" content={previewImageUrl} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content={String(dimensions.width)} />
	<meta property="og:image:height" content={String(dimensions.height)} />
	<meta property="og:image:alt" content={entry.imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${entry.title} · ${SITE_NAME}`} />
	<meta name="twitter:description" content={entry.description} />
	<meta name="twitter:image" content={previewImageUrl} />
	<meta name="twitter:image:alt" content={entry.imageAlt} />
</svelte:head>

<StructuredData data={structuredData} />

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<nav class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
			<a href={resolve('/')} class={linkClass}>← {ALIGNER_DISPLAY_NAME}</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/examples')} class={linkClass}>Examples</a>
		</nav>
		<h1 class="font-heading mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
			{entry.title}
		</h1>
		<p class="mt-3 max-w-prose text-base text-gray-600 dark:text-gray-400">
			{entry.description}
		</p>
	</header>

	{#each bodyParagraphs as paragraph (paragraph)}
		<p class="max-w-prose text-base leading-relaxed">{paragraph}</p>
	{/each}

	{#if entry.sourceAttribution}
		<p class="mt-6 max-w-prose text-sm leading-relaxed text-gray-600 dark:text-gray-400">
			Example layout based on an example in the Wikipedia article
			<a
				href={entry.sourceAttribution.url}
				class={linkClass}
				target="_blank"
				rel="noopener noreferrer">{entry.sourceAttribution.title}</a
			>
			(illustrative; Leipzig-style conventions).
		</p>
	{/if}

	<figure class="my-8 m-0">
		<div
			class="overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40"
		>
			<img
				src={previewImageUrl}
				alt={entry.imageAlt}
				width={dimensions.width}
				height={dimensions.height}
				loading="eager"
				decoding="async"
				class="h-auto w-full bg-white object-contain object-center dark:bg-gray-900/40"
			/>
		</div>
		<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
			Word alignment diagram — same export as in the editor.
		</figcaption>
	</figure>

	<div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
		<a href={resolve('/examples')} class="{linkClass} text-sm">← All examples</a>
		<a href="{resolve('/')}?example={exampleSlug}" class={ctaClass}> Open in Editor </a>
	</div>

	{#if data.related.length > 0}
		<section
			class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700"
			aria-label="More examples"
		>
			<h2 class="font-heading m-0 text-xl font-semibold text-gray-900 dark:text-white">
				More examples
			</h2>
			<ul class="m-0 mt-5 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
				{#each data.related as rel (rel.slug)}
					<li>
						<article
							class="flex h-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/40"
						>
							<a
								href={resolve(`/examples/${rel.slug}`)}
								class="block overflow-hidden border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40"
							>
								<img
									src={rel.previewImageUrl}
									alt={rel.imageAlt}
									width={960}
									height={540}
									loading="lazy"
									decoding="async"
									class="w-full bg-white object-contain object-center dark:bg-gray-900/40"
								/>
							</a>
							<h3 class="m-0 p-4 text-base leading-snug font-semibold">
								<a
									href={resolve(`/examples/${rel.slug}`)}
									class="text-gray-900 no-underline hover:underline dark:text-white"
								>
									{rel.title}
								</a>
							</h3>
						</article>
					</li>
				{/each}
			</ul>
			<p class="mt-5 mb-0">
				<a href={resolve('/examples')} class="{linkClass} text-sm">Browse all examples →</a>
			</p>
		</section>
	{/if}

	<div class="mt-10">
		<PartnerBannerById partnerId={data.partnerId} />
	</div>

	<SiteFooter />
</main>
