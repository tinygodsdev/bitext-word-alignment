<script lang="ts">
	import GuideLayout from '$lib/components/guide/GuideLayout.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { GUIDE_LINK } from '$lib/guide/ui.js';
	import { GUIDES } from '$lib/guide/catalog.js';

	const PATH = '/guide';
	const TITLE = 'Glossing guides';
	const SEO_TITLE = 'Interlinear Glossing Guides';
	const DESCRIPTION =
		'Guides to interlinear glossing: how to read a gloss, the Leipzig Glossing Rules, an abbreviations cheat sheet, conlang glossing, and the free generator.';
</script>

<GuideLayout
	path={PATH}
	title={TITLE}
	seoTitle={SEO_TITLE}
	description={DESCRIPTION}
	crumbs={[
		{ name: SITE_NAME, path: '/' },
		{ name: 'Guides', path: PATH }
	]}
>
	{#snippet lede()}
		Short, practical guides to interlinear glossing: how to read one, the standard that shapes them,
		the abbreviations, and how to gloss a constructed language. Each one ends where the
		<a href="/" class={GUIDE_LINK}>editor</a> begins.
	{/snippet}

	<ul class="m-0 mt-2 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
		{#each GUIDES as guide (guide.path)}
			<li>
				<article
					class="flex h-full flex-col rounded-md border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800/40"
				>
					<h2 class="font-heading m-0 text-lg leading-snug font-semibold">
						<a href={guide.path} class="text-gray-900 no-underline hover:underline dark:text-white">
							{guide.title}
						</a>
					</h2>
					<p class="mt-2 mb-0 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
						{guide.blurb}
					</p>
				</article>
			</li>
		{/each}
	</ul>
</GuideLayout>
