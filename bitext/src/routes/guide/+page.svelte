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
	eyebrow="Interlinear glossing"
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
		{#each GUIDES as guide, i (guide.path)}
			<li class="h-full">
				<a
					href={guide.path}
					class="group relative flex h-full flex-col overflow-hidden border border-gray-200 bg-white p-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-primary-500/60"
				>
					<span
						class="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-primary-500 to-secondary-500 transition-transform duration-200 group-hover:scale-x-100"
						aria-hidden="true"
					></span>
					<h2
						class="font-heading m-0 flex items-start justify-between gap-3 text-lg leading-snug font-semibold text-gray-900 dark:text-white"
					>
						<span>{guide.title}</span>
						<svg
							class="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary-600 dark:text-gray-600 dark:group-hover:text-primary-400"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
						</svg>
					</h2>
					{#if i === 0}
						<span
							class="mt-2 inline-flex w-fit items-center bg-primary-50 px-2 py-0.5 text-xs font-medium tracking-wide text-primary-700 dark:bg-primary-950/50 dark:text-primary-300"
							>Start here</span
						>
					{/if}
					<p class="mt-2 mb-0 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
						{guide.blurb}
					</p>
				</a>
			</li>
		{/each}
		<li class="h-full">
			<a
				href="/skill"
				class="group relative flex h-full flex-col overflow-hidden border border-gray-200 bg-white p-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-primary-500/60"
			>
				<span
					class="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-primary-500 to-secondary-500 transition-transform duration-200 group-hover:scale-x-100"
					aria-hidden="true"
				></span>
				<h2
					class="font-heading m-0 flex items-start justify-between gap-3 text-lg leading-snug font-semibold text-gray-900 dark:text-white"
				>
					<span>Agent skill for Claude and ChatGPT</span>
					<svg
						class="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary-600 dark:text-gray-600 dark:group-hover:text-primary-400"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
					</svg>
				</h2>
				<p class="mt-2 mb-0 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
					Let your AI assistant build these diagrams from a plain request, on the same open API.
				</p>
			</a>
		</li>
	</ul>
</GuideLayout>
