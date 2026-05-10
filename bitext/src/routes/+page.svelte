<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Editor from '$lib/components/editor/Editor.svelte';
	import LineEditModal from '$lib/components/editor/LineEditModal.svelte';
	import LineSettingsSheet from '$lib/components/editor/LineSettingsSheet.svelte';
	import AlignmentPreview from '$lib/components/preview/AlignmentPreview.svelte';
	import SettingsPanel from '$lib/components/settings/SettingsPanel.svelte';
	import ExportCard from '$lib/components/settings/ExportCard.svelte';
	import ShareQuickRow from '$lib/components/share/ShareQuickRow.svelte';
	import PartnerBannerPreply from '$lib/components/partners/PartnerBannerPreply.svelte';
	import PartnerBannerRailway from '$lib/components/partners/PartnerBannerRailway.svelte';
	import SeoIntro from '$lib/components/seo/SeoIntro.svelte';
	import SeoSections from '$lib/components/seo/SeoSections.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import { Button } from 'flowbite-svelte';
	import {
		CloseOutline,
		ExpandOutline,
		EyeOutline,
		EyeSlashOutline,
		FolderOpenOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV2 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { EXAMPLES, type ExampleId } from '$lib/state/examples.js';
	import { TALLY_FORM_ID } from '$lib/brand.js';
	import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME } from '$lib/seo/metadata.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let hydrated = $state(false);
	let previewExpand = $state(false);

	function closeFullscreenPreview() {
		previewExpand = false;
		queueMicrotask(() => layoutExportStore.requestRemeasure());
	}

	/** Shared geometry so fullscreen toolbar buttons match despite UA `button` defaults. */
	const fullscreenPreviewToolbarBtn =
		'box-border m-0 appearance-none inline-flex h-8 min-h-8 max-h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-none border border-solid px-3 py-0 text-sm font-medium leading-none shadow-sm backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400';

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
		if (!browser) return;
		if (!previewExpand) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') closeFullscreenPreview();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

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

	/** How much to trim from the top and bottom of each example image (CSS length, e.g. %, px). */
	const EXAMPLES_IMAGE_VERTICAL_CROP = '10%';
	const examplesImageClipPath = `inset(${EXAMPLES_IMAGE_VERTICAL_CROP} 0 ${EXAMPLES_IMAGE_VERTICAL_CROP} 0)`;

	const siteTheme = $derived(settingsStore.settings.theme);
	const previewHideChrome = $derived(settingsStore.settings.previewHideChrome);

	let loadExampleDetailsEl = $state<HTMLDetailsElement | null>(null);

	function pickExample(kind: ExampleId) {
		projectStore.loadExample(kind);
		if (loadExampleDetailsEl) loadExampleDetailsEl.open = false;
	}

	const themeIconBtn =
		'box-border m-0 inline-flex h-9 w-9 shrink-0 items-center justify-center border-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:focus-visible:outline-gray-400';
	const themeIconActive = `${themeIconBtn} bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100`;
	const themeIconIdle = `${themeIconBtn} bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800`;

	const exampleDropdownBtn =
		'inline-flex list-none cursor-pointer items-center gap-1 rounded-none border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-800 shadow-sm marker:hidden outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/80 dark:focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden md:px-2.5';

	const exampleDropdownItem =
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

<main
	class="w-full min-w-0 overflow-x-hidden px-4 pt-4 pb-8 sm:px-6 md:pt-6 md:pb-12 lg:px-10"
>
	<header class="mb-8 border-b border-gray-200 pb-8 dark:border-gray-700">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
			<h1
				class="font-heading min-w-0 text-left text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:flex-1 sm:pr-4 sm:text-3xl dark:text-white"
			>
				Word-by-word translation visualizer
			</h1>
			<div class="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
				<a
					href={resolve('/about')}
					class="text-sm font-medium text-gray-600 underline decoration-gray-400/50 underline-offset-2 hover:text-gray-900 hover:decoration-gray-500/60 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-100 dark:hover:decoration-gray-400/60"
					>About</a
				>
				<div
					class="inline-flex overflow-hidden rounded-none border border-gray-300 dark:border-gray-600"
					role="group"
					aria-label="Site theme (light or dark)"
				>
					<button
						type="button"
						class={siteTheme === 'light' ? themeIconActive : themeIconIdle}
						aria-pressed={siteTheme === 'light'}
						title="Light theme"
						onclick={() => settingsStore.patch({ theme: 'light' })}
					>
						<span class="sr-only">Light theme</span>
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
							/>
						</svg>
					</button>
					<button
						type="button"
						class="{siteTheme === 'dark'
							? themeIconActive
							: themeIconIdle} border-l border-gray-300 dark:border-gray-600"
						aria-pressed={siteTheme === 'dark'}
						title="Dark theme"
						onclick={() => settingsStore.patch({ theme: 'dark' })}
					>
						<span class="sr-only">Dark theme</span>
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
		<div
			class="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8 xl:gap-10"
		>
			<div class="min-w-0 max-w-3xl flex-1 text-left">
				<p
					class="mt-0 max-w-prose text-base leading-relaxed text-gray-600 dark:text-gray-400 lg:text-[1.05rem]"
				>
					See exactly which word matches which across stacked lines. Add rows for glosses or IPA if you
					need them, click a word then its match on the line above or below, and export or share the
					diagram—great for lessons, posts, or conlang notes.
				</p>
				<p class="mt-4 max-w-prose text-sm leading-relaxed text-gray-600 dark:text-gray-400">
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
			</div>
			<div class="w-full min-w-0 lg:w-auto lg:flex-1">
				<PartnerBannerPreply />
			</div>
		</div>
	</header>

	<div class="grid grid-cols-12 gap-6 lg:gap-8">
		<div class="col-span-12 lg:col-span-8 lg:col-start-1 lg:row-start-1">
			<div class="mb-8">
				<Editor />
			</div>
			<section class="mb-8" aria-labelledby="preview-heading">
				<div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					<div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
						<h2
							id="preview-heading"
							class="font-heading shrink-0 text-lg font-semibold text-gray-900 dark:text-white"
						>
							Preview
						</h2>
						<details bind:this={loadExampleDetailsEl} class="group relative shrink-0">
							<summary class={exampleDropdownBtn} title="Load example">
								<FolderOpenOutline class="h-4 w-4 shrink-0 md:hidden" aria-hidden="true" />
								<span class="sr-only md:not-sr-only md:inline">Load example</span>
								<svg
									class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 dark:text-gray-400"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
										clip-rule="evenodd"
									/>
								</svg>
							</summary>
							<div
								class="absolute left-0 top-full z-20 mt-1 min-w-[16rem] border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
								role="menu"
								aria-label="Example projects"
							>
								{#each EXAMPLES as ex (ex.id)}
									<button
										type="button"
										class={exampleDropdownItem}
										role="menuitem"
										onclick={() => pickExample(ex.id)}
									>
										{ex.label}
									</button>
								{/each}
							</div>
						</details>
					</div>
					<div class="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
						<Button
							color="light"
							size="sm"
							class="shrink-0 px-2! md:px-4!"
							title="Only affects controls inside the preview frame (add line, reorder, line settings, gap sliders). Attribution appears at the bottom when hidden. Layout stays the same."
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
						</Button>
						<div class="flex flex-wrap items-center gap-2">
							<Button
								color="light"
								size="sm"
								class="shrink-0 px-2! md:px-4!"
								title="Expand preview to fullscreen"
								onclick={() => {
									previewExpand = true;
									queueMicrotask(() => layoutExportStore.requestRemeasure());
								}}
							>
								<ExpandOutline class="h-4 w-4 shrink-0 md:hidden" aria-hidden="true" />
								<span class="sr-only md:not-sr-only md:inline">Expand</span>
							</Button>
							<Button
								color="light"
								size="sm"
								class="shrink-0 px-2! md:px-4!"
								title="Remove every word link in the project"
								disabled={projectStore.connections.length === 0}
								onclick={() => {
									projectStore.clearAllConnections();
									selectionStore.clear();
								}}
							>
								<TrashBinOutline class="h-4 w-4 shrink-0 md:hidden" aria-hidden="true" />
								<span class="sr-only md:not-sr-only md:inline">Clear all links</span>
							</Button>
						</div>
					</div>
				</div>
				<p
					class="mb-2 text-sm leading-snug text-gray-600 lg:hidden dark:text-gray-400"
					role="note"
				>
					Narrow screen: try landscape orientation or reduce line size in line settings—layouts stay
					readable with a bit more horizontal space.
				</p>
				<div class="-mx-4 sm:-mx-6 lg:mx-0">
					<AlignmentPreview instancePrefix="preview-inline" writesExportLayout={!previewExpand} />
				</div>
				{#if previewExpand}
					<div
						class="fixed inset-0 z-40"
						role="dialog"
						aria-modal="true"
						aria-label="Fullscreen preview"
					>
						<button
							type="button"
							class="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
							aria-label="Close fullscreen preview"
							onclick={closeFullscreenPreview}
						></button>
						<div class="relative z-10 box-border pointer-events-none pt-12 pb-3 md:pt-14 md:pb-4">
							<div
								class="pointer-events-auto absolute right-3 top-3 z-10 flex flex-wrap items-center justify-end gap-2"
							>
								<button
									type="button"
									class="{fullscreenPreviewToolbarBtn} px-2! md:px-3! border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
									title="Only affects controls inside the preview frame (add line, reorder, line settings, gap sliders). Attribution appears at the bottom when hidden. Layout stays the same."
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
								<AlignmentPreview instancePrefix="preview-fs" writesExportLayout={previewExpand} />
							</div>
						</div>
					</div>
				{/if}
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
									style:clip-path={examplesImageClipPath}
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
									style:clip-path={examplesImageClipPath}
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
			<div class="mt-6 min-w-0">
				<PartnerBannerRailway />
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

	<LineEditModal />
	<LineSettingsSheet />

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
		<p class="mt-2 text-gray-500 dark:text-gray-500">
			© {year} Dani Polani ·
			<a
				href={resolve('/about')}
				class="text-gray-600 underline decoration-gray-400/50 underline-offset-2 hover:text-gray-900 hover:decoration-gray-500/60 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-200 dark:hover:decoration-gray-400/60"
				>About</a
			>
			·
			<a
				href={resolve('/privacy')}
				class="text-gray-600 underline decoration-gray-400/50 underline-offset-2 hover:text-gray-900 hover:decoration-gray-500/60 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-200 dark:hover:decoration-gray-400/60"
				>Privacy policy</a
			>
		</p>
	</footer>
</main>
