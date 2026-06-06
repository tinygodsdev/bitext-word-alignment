<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ALIGNER_DISPLAY_NAME } from '$lib/brand.js';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { galleryPreviewImageUrl } from '$lib/examples/cdn.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const TITLE = 'Examples';
	const DESCRIPTION =
		'Browse word alignment and interlinear gloss examples — bilingual pairs, Turkish IPA stacks, RTL scripts, Tagalog compounds, and Japanese–Chinese–English word order. Open any example in the Aligner editor.';

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(galleryPreviewImageUrl(data.examples[0]?.slug ?? 'english-french-word-alignment'));

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
</script>

<svelte:head>
	<title>{TITLE} · {ALIGNER_DISPLAY_NAME}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${TITLE} · ${ALIGNER_DISPLAY_NAME}`} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:secure_url" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content={`${TITLE} — ${ALIGNER_DISPLAY_NAME}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${TITLE} · ${ALIGNER_DISPLAY_NAME}`} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<nav class="text-sm">
			<a href={resolve('/')} class={linkClass}>← {ALIGNER_DISPLAY_NAME}</a>
		</nav>
		<h1 class="font-heading mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
			{TITLE}
		</h1>
		<p class="mt-3 max-w-prose text-base text-gray-600 dark:text-gray-400">
			{DESCRIPTION}
		</p>
	</header>

	<ul class="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
		{#each data.examples as ex (ex.slug)}
			<li>
				<article
					class="flex h-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/40"
				>
					<a
						href={resolve(`/examples/${ex.slug}`)}
						class="block overflow-hidden border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40"
					>
						<img
							src={ex.previewImageUrl}
							alt={ex.imageAlt}
							width={960}
							height={540}
							loading="lazy"
							decoding="async"
							class="w-full bg-white object-contain object-center dark:bg-gray-900/40"
						/>
					</a>
					<div class="flex flex-1 flex-col p-4">
						<h2 class="font-heading m-0 text-lg font-semibold leading-snug text-gray-900 dark:text-white">
							<a href={resolve(`/examples/${ex.slug}`)} class="text-inherit no-underline hover:underline">
								{ex.title}
							</a>
						</h2>
						<p class="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							{ex.description}
						</p>
						<p class="mt-4 mb-0">
							<a href={resolve(`/examples/${ex.slug}`)} class="{linkClass} text-sm">
								View example →
							</a>
						</p>
					</div>
				</article>
			</li>
		{/each}
	</ul>

	<SiteFooter />
</main>
