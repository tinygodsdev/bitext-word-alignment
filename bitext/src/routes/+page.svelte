<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { Button } from 'flowbite-svelte';
	import {
		ChevronDownOutline,
		CloseOutline,
		ExpandOutline,
		EyeOutline,
		EyeSlashOutline,
		FolderOpenOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import AlignmentPreview from '$lib/components/preview/AlignmentPreview.svelte';
	import StylePicker from '$lib/components/preview/StylePicker.svelte';
	import LineEditModal from '$lib/components/editor/LineEditModal.svelte';
	import LineSettingsSheet from '$lib/components/editor/LineSettingsSheet.svelte';
	import GroupColorPopover from '$lib/components/preview/GroupColorPopover.svelte';
	import EditorTabBar from '$lib/components/editor-shell/EditorTabBar.svelte';
	import EditorPanels from '$lib/components/editor-shell/EditorPanels.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import SeoIntro from '$lib/components/seo/SeoIntro.svelte';
	import SeoSections from '$lib/components/seo/SeoSections.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import PartnerBannerById from '$lib/components/partners/PartnerBannerById.svelte';
	import { editorShellStore } from '$lib/state/editorShell.svelte.js';
	import { viewportStore } from '$lib/state/viewport.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV2 } from '$lib/serialization/schema.js';
	import { editorExamples, type ExampleId } from '$lib/state/examples.js';
	import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME } from '$lib/seo/metadata.js';
	import { TALLY_FORM_ID } from '$lib/brand.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const previewHideChrome = $derived(settingsStore.settings.previewHideChrome);

	const sheetTitle = $derived(
		editorShellStore.tab === 'text'
			? 'Your text'
			: editorShellStore.tab === 'style'
				? 'Style'
				: 'Export & share'
	);

	const authorSite = 'https://danipolani.github.io/en/';
	const toolsPage = 'https://danipolani.github.io/en/blog/tools/';
	const seoLink =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';

	function scrollToContent() {
		document.getElementById('home-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	let previewExpand = $state(false);
	function openFullscreenPreview() {
		previewExpand = true;
		queueMicrotask(() => layoutExportStore.requestRemeasure());
	}
	function closeFullscreenPreview() {
		previewExpand = false;
		queueMicrotask(() => layoutExportStore.requestRemeasure());
	}

	/** Shared geometry so fullscreen toolbar buttons match despite UA `button` defaults. */
	const fullscreenPreviewToolbarBtn =
		'box-border m-0 appearance-none inline-flex h-8 min-h-8 max-h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-none border border-solid px-3 py-0 text-sm font-medium leading-none shadow-sm backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400';

	// Initial state comes from the server load (decoded `?data=` or `?example=`).
	let hydrated = $state(false);
	$effect(() => {
		if (hydrated) return;
		if (data.initialState) {
			projectStore.loadSnapshotV2(data.initialState.project);
			settingsStore.load(data.initialState.settings);
			projectStore.retokenizeFromSettings();
		}
		hydrated = true;
	});

	$effect(() => {
		if (!browser || !data.exampleInvalid) return;
		const u = new URL(window.location.href);
		u.searchParams.delete('example');
		history.replaceState({}, '', u);
	});

	// Keep the URL in sync so the diagram is shareable / reload-safe.
	let urlDebounce: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		if (!browser || !hydrated) return;
		void projectStore.lines;
		void projectStore.connections;
		void projectStore.pairControls;
		void settingsStore.settings;
		clearTimeout(urlDebounce);
		urlDebounce = setTimeout(() => {
			const state: AppStateV2 = {
				v: SCHEMA_VERSION,
				project: projectStore.getSnapshot(),
				settings: { ...settingsStore.settings }
			};
			const u = new URL(window.location.href);
			u.searchParams.set('data', encodeState(state));
			history.replaceState({}, '', u);
		}, 400);
	});

	$effect(() => {
		if (!browser || !previewExpand) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') closeFullscreenPreview();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	const origin = $derived(page.url.origin);
	const dataParam = $derived(page.url.searchParams.get('data'));
	const ogImage = $derived.by(() =>
		dataParam ? `${origin}/api/og?data=${encodeURIComponent(dataParam)}` : `${origin}/api/og`
	);
	const canonical = $derived.by(() => {
		const base = page.url.origin + page.url.pathname;
		return dataParam ? `${base}?data=${encodeURIComponent(dataParam)}` : base;
	});

	let loadExampleEl = $state<HTMLDetailsElement | null>(null);
	function pickExample(kind: ExampleId) {
		projectStore.loadExample(kind);
		if (loadExampleEl) loadExampleEl.open = false;
	}

	const exampleBtn =
		'inline-flex list-none cursor-pointer items-center gap-1 rounded-none border border-gray-300 bg-white px-2 py-1.5 text-sm font-medium text-gray-800 shadow-sm marker:hidden outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/80 [&::-webkit-details-marker]:hidden';
	const exampleItem =
		'block w-full border-0 bg-transparent px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/80';
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

<div
	class="relative flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-app-shell dark:bg-gray-900"
>
	<!-- Body: canvas + (wide) rail -->
	<div class="flex min-h-0 flex-1">
		<!-- Canvas column -->
		<main class="relative flex min-h-0 flex-1 flex-col">
			<!-- Panel above the editor: example loader + style picker + view controls -->
			<div
				class="flex shrink-0 flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
			>
				<details bind:this={loadExampleEl} class="group relative shrink-0">
					<summary class={exampleBtn} title="Load example">
						<FolderOpenOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
						<span class="sr-only sm:not-sr-only sm:inline">Example</span>
						<svg
							class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 dark:text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							><path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06z"
								clip-rule="evenodd"
							/></svg
						>
					</summary>
					<div
						class="absolute left-0 top-full z-20 mt-1 min-w-[16rem] border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
						role="menu"
						aria-label="Example projects"
					>
						{#each editorExamples() as ex (ex.id)}
							<button
								type="button"
								class={exampleItem}
								role="menuitem"
								onclick={() => pickExample(ex.id)}>{ex.label}</button
							>
						{/each}
					</div>
				</details>

				<div class="flex flex-1 flex-wrap items-center justify-end gap-2">
					<StylePicker />
					<Button
						color="light"
						size="sm"
						class="shrink-0 px-2!"
						title="Hide the controls inside the preview frame"
						aria-pressed={previewHideChrome}
						onclick={() => {
							settingsStore.patch({ previewHideChrome: !previewHideChrome });
							layoutExportStore.requestRemeasureAfterLayout();
						}}
					>
						{#if previewHideChrome}
							<EyeOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
						{:else}
							<EyeSlashOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
						{/if}
						<span class="sr-only md:not-sr-only md:ml-1 md:inline">
							{previewHideChrome ? 'Show controls' : 'Hide controls'}
						</span>
					</Button>
					<Button
						color="light"
						size="sm"
						class="shrink-0 px-2!"
						title="Remove every word link"
						disabled={projectStore.connections.length === 0}
						onclick={() => {
							projectStore.clearAllConnections();
							selectionStore.clear();
						}}
					>
						<TrashBinOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
						<span class="sr-only md:not-sr-only md:ml-1 md:inline">Clear links</span>
					</Button>
					<Button
						color="light"
						size="sm"
						class="shrink-0 px-2!"
						title="Expand preview to fullscreen"
						onclick={openFullscreenPreview}
					>
						<ExpandOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
						<span class="sr-only md:not-sr-only md:ml-1 md:inline">Expand</span>
					</Button>
				</div>
			</div>

			<!-- Canvas scroll area -->
			<div class="min-h-0 flex-1 overflow-auto">
				<div class="p-3 sm:p-4">
					<AlignmentPreview instancePrefix="editor" writesExportLayout={!previewExpand} />
				</div>
			</div>

			<!-- Narrow: sheet over the canvas (above the pinned bottom bar) -->
			{#if viewportStore.isNarrow && editorShellStore.sheetOpen}
				<button
					type="button"
					class="absolute inset-0 z-20 cursor-default bg-black/30"
					aria-label="Close panel"
					onclick={() => editorShellStore.closeSheet()}
				></button>
				<div
					class="absolute inset-x-0 bottom-0 z-30 flex max-h-[75%] flex-col rounded-t-2xl border-x border-t border-gray-200 bg-white shadow-[0_-14px_40px_-10px_rgba(0,0,0,0.28)] dark:border-gray-700 dark:bg-gray-800"
					role="dialog"
					aria-label={sheetTitle}
				>
					<div
						class="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-2.5 dark:border-gray-700"
					>
						<span class="font-heading text-sm font-semibold text-gray-900 dark:text-white"
							>{sheetTitle}</span
						>
						<button
							type="button"
							class="inline-flex h-8 w-8 items-center justify-center rounded-none border-0 bg-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
							aria-label="Close {sheetTitle}"
							onclick={() => editorShellStore.closeSheet()}
						>
							<ChevronDownOutline class="h-5 w-5 shrink-0" aria-hidden="true" />
						</button>
					</div>
					<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-3">
						<EditorPanels />
					</div>
				</div>
			{/if}
		</main>

		<!-- Wide: docked config rail -->
		{#if !viewportStore.isNarrow}
			<aside
				class="flex w-[22rem] shrink-0 flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
				aria-label="Configuration"
			>
				<div class="shrink-0 border-b border-gray-200 dark:border-gray-700">
					<EditorTabBar variant="rail" />
				</div>
				<div class="min-h-0 flex-1 overflow-y-auto p-4">
					<EditorPanels />
				</div>
			</aside>
		{/if}
	</div>

	{#if viewportStore.isNarrow}
		<!-- Narrow: pinned bottom bar -->
		<div class="shrink-0 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
			<EditorTabBar variant="bottom" />
		</div>
	{/if}

	<!-- Hint that guides, examples and more sit below the editor. Scrolls away with the hero. -->
	<button
		type="button"
		class="absolute bottom-16 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-gray-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 md:bottom-4 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-800"
		onclick={scrollToContent}
	>
		<span class="hidden sm:inline">Guides &amp; examples</span>
		<span class="sm:hidden">More</span>
		<ChevronDownOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
	</button>
</div>

<!-- Below the fold: intro, examples, guides/SEO copy, partner banners, footer. -->
<section
	id="home-content"
	class="scroll-mt-14 border-t border-gray-200 px-4 pb-8 pt-10 sm:px-6 md:pb-12 lg:px-10 dark:border-gray-700"
	aria-label="About Word Aligner"
>
	<h1
		class="font-heading mb-6 min-w-0 text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-white"
	>
		Word-by-word translation visualizer
	</h1>

	<div class="grid grid-cols-12 gap-6 lg:gap-8">
		<div class="col-span-12 lg:col-span-8">
			<section class="mb-8" aria-labelledby="examples-heading">
				<h2 id="examples-heading" class="font-heading mb-4 text-lg font-semibold">Examples</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
								style:clip-path="inset(10% 0 10% 0)"
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
								style:clip-path="inset(10% 0 10% 0)"
							/>
						</div>
						<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
							Conlang with a custom font and interlinear glosses
						</figcaption>
					</figure>
				</div>
			</section>

			<div class="mb-8 min-w-0 max-w-3xl">
				<p
					class="mt-0 max-w-prose text-base leading-relaxed text-gray-600 lg:text-[1.05rem] dark:text-gray-400"
				>
					See exactly which word matches which across stacked lines. Add rows for glosses or IPA if
					you need them, click a word then its match on the line above or below, and export or share
					the diagram, great for lessons, posts, or conlang notes.
				</p>
				<p class="mt-4 max-w-prose text-sm leading-relaxed text-gray-600 dark:text-gray-400">
					Created by
					<a href={authorSite} class={seoLink} target="_blank" rel="noopener noreferrer">Dani</a>.
					See other
					<a href={toolsPage} class={seoLink} target="_blank" rel="noopener noreferrer">tools</a> for
					linguistics and conlanging.
				</p>
			</div>

			<div class="mb-8">
				<SeoIntro />
				<SeoSections />
			</div>
		</div>

		<div class="col-span-12 min-w-0 lg:col-span-4">
			<div class="min-w-0">
				{#key data.homePartnerOrder[0]}
					<PartnerBannerById partnerId={data.homePartnerOrder[0]} />
				{/key}
			</div>
			<div class="mt-6 min-w-0">
				{#key data.homePartnerOrder[1]}
					<PartnerBannerById partnerId={data.homePartnerOrder[1]} />
				{/key}
			</div>
			<p class="mt-4 text-center">
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
	</div>

	<SiteFooter />
</section>

{#if previewExpand}
	<div class="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Fullscreen preview">
		<button
			type="button"
			class="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
			aria-label="Close fullscreen preview"
			onclick={closeFullscreenPreview}
		></button>
		<div class="pointer-events-none relative z-10 box-border pb-3 pt-12 md:pb-4 md:pt-14">
			<div
				class="pointer-events-auto absolute right-3 top-3 z-10 flex flex-wrap items-center justify-end gap-2"
			>
				<button
					type="button"
					class="{fullscreenPreviewToolbarBtn} px-2! md:px-3! border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
					aria-pressed={previewHideChrome}
					onclick={() => {
						settingsStore.patch({ previewHideChrome: !previewHideChrome });
						layoutExportStore.requestRemeasureAfterLayout();
					}}
				>
					{#if previewHideChrome}
						<EyeOutline class="h-4 w-4 shrink-0 md:hidden" aria-hidden="true" />
					{:else}
						<EyeSlashOutline class="h-4 w-4 shrink-0 md:hidden" aria-hidden="true" />
					{/if}
					<span class="sr-only md:not-sr-only md:inline">
						{previewHideChrome ? 'Show controls' : 'Hide controls'}
					</span>
				</button>
				<button
					type="button"
					class="{fullscreenPreviewToolbarBtn} px-2! md:px-3! border-gray-600 bg-gray-900/90 text-white hover:bg-gray-800 dark:bg-gray-950/90"
					title="Close fullscreen preview"
					onclick={closeFullscreenPreview}
				>
					<CloseOutline class="h-4 w-4 shrink-0 md:hidden" aria-hidden="true" />
					<span class="sr-only md:not-sr-only md:inline">Close</span>
				</button>
			</div>
			<div
				class="pointer-events-auto max-h-[calc(100dvh-3.75rem)] w-full overflow-y-auto overscroll-contain md:max-h-[calc(100dvh-4.5rem)]"
			>
				<AlignmentPreview instancePrefix="editor-fs" writesExportLayout={previewExpand} />
			</div>
		</div>
	</div>
{/if}

<LineEditModal />
<LineSettingsSheet />
<GroupColorPopover />
