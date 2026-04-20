<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Editor from '$lib/components/editor/Editor.svelte';
	import AlignmentPreview from '$lib/components/preview/AlignmentPreview.svelte';
	import SettingsPanel from '$lib/components/settings/SettingsPanel.svelte';
	import ExportShareTab from '$lib/components/settings/ExportShareTab.svelte';
	import ShareQuickRow from '$lib/components/share/ShareQuickRow.svelte';
	import SeoIntro from '$lib/components/seo/SeoIntro.svelte';
	import SeoSections from '$lib/components/seo/SeoSections.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV1 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, KEYWORDS, SITE_NAME } from '$lib/seo/metadata.js';
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
	const ogImage = $derived.by(() => {
		const p = page.url.searchParams.get('data');
		if (p) return `${origin}/api/og?data=${encodeURIComponent(p)}`;
		return `${origin}/api/og`;
	});
	const canonical = $derived(page.url.origin + page.url.pathname);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key !== 'Enter') return;
		const el = e.target as HTMLElement | null;
		if (el?.closest('textarea, input[type="text"], select')) return;
		if (!selectionStore.needsManualCommit()) return;
		e.preventDefault();
		selectionStore.commitLink();
	}}
/>

<svelte:head>
	<title>{DEFAULT_TITLE} · {SITE_NAME}</title>
	<meta name="description" content={DEFAULT_DESCRIPTION} />
	<meta name="keywords" content={KEYWORDS} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${DEFAULT_TITLE} · ${SITE_NAME}`} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${DEFAULT_TITLE} · ${SITE_NAME}`} />
	<meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<JsonLd {origin} />

<main class="app-shell">
	<header class="app-hero">
		<h1 class="no-margin">Word-by-word translation visualizer</h1>
		<p>
			Create a <strong>bilingual sentence alignment</strong> with connector lines, optional
			<strong>interlinear gloss</strong>, and exports — in under a minute.
		</p>
	</header>

	<div class="grid large-space">
		<div class="s12 l8">
			<div class="large-margin">
				<Editor />
			</div>
			<section class="large-margin" aria-labelledby="preview-heading">
				<h5 id="preview-heading" class="no-margin bottom-margin">Preview</h5>
				<AlignmentPreview />
			</section>
			<div class="large-margin">
				<SeoIntro />
				<SeoSections />
			</div>
		</div>
		<div class="s12 l4">
			<div id="settings-panel">
				<SettingsPanel />
			</div>
			<div class="top-margin">
				<ShareQuickRow />
			</div>
			<article class="top-margin padding border round medium-elevate settings-card">
				<h5 class="no-margin bottom-margin">Export</h5>
				<ExportShareTab />
			</article>
		</div>
	</div>
</main>
