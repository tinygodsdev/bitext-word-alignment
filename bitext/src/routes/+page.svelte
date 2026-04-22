<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Editor from '$lib/components/editor/Editor.svelte';
	import AlignmentPreview from '$lib/components/preview/AlignmentPreview.svelte';
	import SettingsPanel from '$lib/components/settings/SettingsPanel.svelte';
	import ExportCard from '$lib/components/settings/ExportCard.svelte';
	import ShareQuickRow from '$lib/components/share/ShareQuickRow.svelte';
	import SeoIntro from '$lib/components/seo/SeoIntro.svelte';
	import SeoSections from '$lib/components/seo/SeoSections.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import { Button } from 'flowbite-svelte';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV1 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { TALLY_FORM_ID } from '$lib/brand.js';
	import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME } from '$lib/seo/metadata.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let hydrated = $state(false);

	$effect(() => {
		if (hydrated) return;
		if (data.initialState) {
			projectStore.loadSnapshot(data.initialState.project);
			settingsStore.load(data.initialState.settings);
			projectStore.retokenizeFromSettings();
		}
		hydrated = true;
	});

	let urlDebounce: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		if (!browser || !hydrated) return;
		void projectStore.sourceTokens;
		void projectStore.targetTokens;
		void projectStore.links;
		void settingsStore.settings;
		clearTimeout(urlDebounce);
		urlDebounce = setTimeout(() => {
			const state: AppStateV1 = {
				v: SCHEMA_VERSION,
				project: projectStore.getSnapshot(),
				settings: { ...settingsStore.settings }
			};
			const encoded = encodeState(state);
			const u = new URL(window.location.href);
			u.searchParams.set('data', encoded);
			history.replaceState({}, '', u);
		}, 400);
	});

	const origin = $derived(page.url.origin);
	const dataParam = $derived(page.url.searchParams.get('data'));
	const ogImage = $derived.by(() => {
		if (dataParam) return `${origin}/api/og?data=${encodeURIComponent(dataParam)}`;
		return `${origin}/api/og`;
	});
	// Canonical / og:url must include the `?data=...` payload when present.
	// Without it, Facebook resolves each shared URL back to the bare landing page, reuses its
	// cached og:image (the generic preview), and never shows the visualization for the actual
	// share. Each `?data=...` URL is a distinct shareable view and deserves its own canonical.
	const canonical = $derived.by(() => {
		const base = page.url.origin + page.url.pathname;
		return dataParam ? `${base}?data=${encodeURIComponent(dataParam)}` : base;
	});

	const authorSite = 'https://danipolani.github.io/en/';
	const toolsPage = 'https://danipolani.github.io/en/blog/tools/';
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>{DEFAULT_TITLE} · {SITE_NAME}</title>
	<meta name="description" content={DEFAULT_DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${DEFAULT_TITLE} · ${SITE_NAME}`} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:secure_url" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${DEFAULT_TITLE} — ${SITE_NAME}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${DEFAULT_TITLE} · ${SITE_NAME}`} />
	<meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={`${DEFAULT_TITLE} — ${SITE_NAME}`} />
</svelte:head>

<JsonLd />

<main class="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
	<header class="mb-8 text-center">
		<h1
			class="font-heading text-3xl font-semibold tracking-tight leading-tight text-gray-900 md:text-4xl dark:text-white"
		>
			Word-by-word translation visualizer
		</h1>
		<p class="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
			See exactly which word matches which across two translated sentences. Link single words or
			short phrases, add an optional interlinear gloss, and export a clean image for lessons, posts,
			or conlang notes.
			<br />
			Created by
			<a
				href={authorSite}
				class="font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300"
				target="_blank"
				rel="noopener noreferrer">Dani</a
			>. See other
			<a
				href={toolsPage}
				class="font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300"
				target="_blank"
				rel="noopener noreferrer">tools</a
			> for linguistics and conlanging.
		</p>
	</header>

	<div class="grid grid-cols-12 gap-6 lg:gap-8">
		<div class="col-span-12 lg:col-span-8 lg:col-start-1 lg:row-start-1">
			<div class="mb-8">
				<Editor />
			</div>
			<section class="mb-8" aria-labelledby="preview-heading">
				<div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					<div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
						<h2
							id="preview-heading"
							class="font-heading shrink-0 text-lg font-semibold text-gray-900 dark:text-white"
						>
							Preview
						</h2>
						{#if selectionStore.showLinkHint()}
							<p class="max-w-xl text-base text-gray-600 dark:text-gray-400" role="status">
								Click a word on the other line to create the link.
							</p>
						{/if}
					</div>
					<Button
						color="light"
						size="sm"
						class="shrink-0"
						disabled={projectStore.links.length === 0}
						onclick={() => {
							projectStore.clearAllLinks();
							selectionStore.clear();
						}}
					>
						Clear all links
					</Button>
				</div>
				<AlignmentPreview />
			</section>
			<section class="mb-8" aria-labelledby="examples-heading">
				<details open class="group">
					<summary
						class="flex cursor-pointer list-none items-center gap-2 text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden dark:text-white"
					>
						<svg
							class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-90 dark:text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 0 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08.0Z"
								clip-rule="evenodd"
							/>
						</svg>
						<h2 id="examples-heading" class="font-heading text-lg font-semibold">Examples</h2>
					</summary>
					<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<figure class="m-0">
							<div
								class="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
							>
								<img
									src="/examples/action.gif"
									alt="Animated demo: creating word links between “Hello world” and its French translation"
									loading="lazy"
									decoding="async"
									class="h-full w-full object-contain"
								/>
							</div>
							<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
								Linking words between two sentences
							</figcaption>
						</figure>
						<figure class="m-0">
							<div
								class="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
							>
								<img
									src="/examples/conlang_gloss.png"
									alt="Conlang example with a custom script font, interlinear glosses, and an English translation"
									loading="lazy"
									decoding="async"
									class="h-full w-full object-contain"
								/>
							</div>
							<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
								Conlang with a custom font and interlinear glosses
							</figcaption>
						</figure>
					</div>
				</details>
			</section>
		</div>
		<div class="col-span-12 min-w-0 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-end-3">
			<div id="settings-panel">
				<SettingsPanel />
			</div>
			<div class="mt-6">
				<ExportCard />
			</div>
			<div class="mt-6">
				<ShareQuickRow />
			</div>
			<p class="mt-2 text-center">
				<!-- Looks like a text link; <button> avoids SvelteKit href + eslint; Tally uses data-tally-*. -->
				<button
					type="button"
					class="inline cursor-pointer border-0 bg-transparent p-0 text-sm text-gray-500 underline decoration-gray-400/50 underline-offset-2 transition-colors hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-200 dark:focus-visible:outline-primary-500"
					data-tally-open={TALLY_FORM_ID}
					data-tally-auto-close="0"
					data-tally-hide-title="1"
					data-tally-form-events-forwarding="1"
				>
					Send feedback
				</button>
			</p>
		</div>
		<div class="col-span-12 lg:col-span-8 lg:col-start-1 lg:row-start-2">
			<div class="mb-8">
				<SeoIntro />
				<SeoSections />
			</div>
		</div>
	</div>

	<footer
		class="mt-12 border-t border-gray-200 pt-8 text-center text-base leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400"
	>
		<p>
			Created by
			<a
				href={authorSite}
				class="font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300"
				target="_blank"
				rel="noopener noreferrer">Dani</a
			>. See other
			<a
				href={toolsPage}
				class="font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300"
				target="_blank"
				rel="noopener noreferrer">tools</a
			> for linguistics and conlanging.
		</p>
		<p class="mt-2 text-gray-500 dark:text-gray-500">© {year} Dani Polani</p>
	</footer>
</main>
