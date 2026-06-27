<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SITE_CONTACT_EMAIL, TALLY_FORM_ID } from '$lib/brand.js';
	import PartnerBannerCursor from '$lib/components/partners/PartnerBannerCursor.svelte';
	import PartnerBannerPreply from '$lib/components/partners/PartnerBannerPreply.svelte';
	import PartnerBannerRailway from '$lib/components/partners/PartnerBannerRailway.svelte';
	import PartnerBannerWise from '$lib/components/partners/PartnerBannerWise.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import StructuredData from '$lib/components/seo/StructuredData.svelte';
	import { breadcrumbList, personCreator } from '$lib/seo/structured-data.js';
	import { SITE_AUTHOR_URL } from '$lib/brand.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	const TITLE = 'About';
	const DISPLAY_NAME = 'Word Aligner';
	const SEO_TITLE = 'About Word Aligner — Free Word Alignment & Gloss Tool';
	const DESCRIPTION =
		'Word Aligner: multi-line word alignment, interlinear glosses and IPA, RTL scripts, word-splitting rules, per-line typography, exports (PNG, SVG, PDF, HTML), and shareable URLs — for learners, teachers, and linguists.';

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(`${page.url.origin}/api/og`);

	const structuredData = [
		breadcrumbList([
			{ name: DISPLAY_NAME, path: '/' },
			{ name: TITLE, path: '/about' }
		]),
		personCreator()
	];

	const siteTheme = $derived(settingsStore.settings.theme);
	const themeIconBtn =
		'box-border m-0 inline-flex h-9 w-9 shrink-0 items-center justify-center border-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:focus-visible:outline-gray-400';
	const themeIconActive = `${themeIconBtn} bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100`;
	const themeIconIdle = `${themeIconBtn} bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800`;

	const EXAMPLES_IMAGE_VERTICAL_CROP = '10%';
	const examplesImageClipPath = `inset(${EXAMPLES_IMAGE_VERTICAL_CROP} 0 ${EXAMPLES_IMAGE_VERTICAL_CROP} 0)`;

	const headingClass =
		'font-heading scroll-mt-20 mt-10 text-xl font-semibold text-gray-900 dark:text-white';
	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';

	const feedbackBtnClass =
		'inline cursor-pointer border-0 bg-transparent p-0 text-sm text-gray-600 underline decoration-gray-400/50 underline-offset-2 transition-colors hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-200 dark:focus-visible:outline-primary-500';

	const tocLinkClass =
		'block rounded-none py-1 text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 hover:decoration-gray-600/60 dark:text-gray-300 dark:decoration-gray-500/40 dark:hover:text-white dark:hover:decoration-gray-400/60';

	/** Shared frame for UI screenshots (mixed aspect ratios). */
	const shotFrame =
		'flex w-full items-center justify-center overflow-x-auto overflow-y-hidden rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/80';
	const shotImg =
		'max-h-[min(85vh,1280px)] w-full max-w-full object-contain [image-rendering:auto]';
	/** Compact screenshots in the Line editor section so captions sit clearly under each card. */
	const lineEditorShotFrame =
		'flex w-full items-center justify-center overflow-x-auto overflow-y-hidden rounded border border-gray-200 bg-white p-1 dark:border-gray-600 dark:bg-gray-900/50';
	const lineEditorShotImg =
		'max-h-[min(38vh,480px)] w-full max-w-full object-contain object-top [image-rendering:auto] sm:max-h-[min(44vh,520px)]';
	const lineEditorFigureShell =
		'm-0 rounded-lg border border-gray-200 bg-gray-50/80 p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800/40';
	const lineEditorFigcaptionClass =
		'mt-2 border-t border-gray-200 pt-2 text-left text-xs leading-snug text-gray-600 dark:border-gray-600 dark:text-gray-400';

	type DocShot = {
		src: string;
		alt: string;
		caption: string;
		/** Narrow popovers/modals: keep readable width on wide viewports */
		narrow?: boolean;
		eager?: boolean;
	};

	const lineEditorShots: DocShot[] = [
		{
			src: '/screenshots/line-editor.png',
			alt: 'Aligner line editor: summary of how words are split (whitespace, extra characters, join marker, punctuation) above stacked lines of text, with a gear control to open word-splitting settings.',
			caption:
				'Main editor: stacked lines and a short recap of how text is split into clickable words (gear opens the Tokens tab in Settings).',
			eager: true
		},
		{
			src: '/screenshots/edit-popover-turkish-line-3.png',
			alt: 'Popover for editing line 3: typography controls for font family, text size, word spacing, line reorder arrows, and delete, above a Turkish token row.',
			caption:
				'Popover on a line: font, size, spacing, reorder, and whether to draw connectors to the row below.',
			narrow: true
		},
		{
			src: '/screenshots/edit-line-modal-turkish-line-3.png',
			alt: 'Edit line modal for line 3: Turkish text with pipe characters as morpheme boundaries, a summary of split and join rules, optional right-to-left row toggle, color-coded token preview chips, and Done.',
			caption:
				'Edit line dialog: change the sentence and see how it splits into highlighted word boxes.',
			narrow: true
		}
	];

	const previewShots: DocShot[] = [
		{
			src: '/screenshots/preview-turkish-example.png',
			alt: 'Preview of the Turkish interlinear example: four stacked rows (glosses, IPA, Turkish, English) with curved colored connectors linking aligned tokens across adjacent lines.',
			caption: 'Live preview with connectors across a multi-line Turkish interlinear.',
			eager: true
		}
	];

	const settingsTabShots: DocShot[] = [
		{
			src: '/screenshots/settings-tab-1-style.png',
			alt: 'Settings Style tab: UI theme, background mode, connector curve style, line thickness and opacity, default and per-pair line gaps, and options to hide preview chrome.',
			caption: 'Style — background, connectors, spacing, preview chrome.'
		},
		{
			src: '/screenshots/settings-tab-2-colors.png',
			alt: 'Settings Colors tab: toggle to match token colors to links, choice between coloring token text or backgrounds, and pastel, vivid, and academic palette buttons with swatches.',
			caption: 'Colors — palettes and how link colors apply to tokens.'
		},
		{
			src: '/screenshots/settings-tab-3-tokenization.png',
			alt: 'Settings Tokens tab: show line numbers, extra token split characters, single-character merge marker, and punctuation tokenization with optional custom punctuation list.',
			caption: 'Tokens — how text becomes word boxes: splits, join marker, punctuation.'
		},
		{
			src: '/screenshots/settings-tab-4-custom-fonts-library.png',
			alt: 'Settings Fonts tab: library of uploaded custom fonts with remove actions, plus controls to add fonts from Google Fonts by family name.',
			caption: 'Fonts — custom uploads and Google Fonts lookup.'
		}
	];

	const exportShareShots: DocShot[] = [
		{
			src: '/screenshots/export-card.png',
			alt: 'Export card with buttons to download the alignment as PNG, SVG, PDF, or self-contained HTML, plus options related to QR and sharing.',
			caption: 'Export — PNG, SVG, PDF, and HTML.'
		},
		{
			src: '/screenshots/share-card.png',
			alt: 'Share card with Copy share link, More options for QR and advanced sharing, and icons to share on X, Facebook, and Reddit.',
			caption: 'Share — link, QR, social targets, and developer JSON copy from the dialog.'
		}
	];
</script>

<svelte:head>
	<title>{SEO_TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={SEO_TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:secure_url" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${TITLE} — ${DISPLAY_NAME}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SEO_TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={`${TITLE} — ${DISPLAY_NAME}`} />
</svelte:head>

<StructuredData data={structuredData} />

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
			<nav class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
				<a href={resolve('/')} class={linkClass}>← {DISPLAY_NAME}</a>
				<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
				<a href={resolve('/examples')} class={linkClass}>Examples</a>
			</nav>
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
	</header>

	<h1
		class="font-heading text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
	>
		About {DISPLAY_NAME}
	</h1>
	<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
		<strong class="font-semibold text-gray-800 dark:text-gray-200">{DISPLAY_NAME}</strong> is a free,
		browser-based tool for drawing word-to-word and morpheme-to-morpheme links between stacked lines of
		text such as bilingual glosses, interlinear annotations, classroom handouts, and social posts. Everything
		runs in your browser; your sentences are not stored on our servers unless you choose to share them.
	</p>

	<nav
		class="mt-8 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800/60"
		aria-label="On this page"
	>
		<p class="m-0 font-medium text-gray-900 dark:text-white">On this page</p>
		<ul class="mt-2 list-none space-y-1 p-0">
			<li><a href="#doc-line-editor" class={tocLinkClass}>Line editor</a></li>
			<li><a href="#doc-preview" class={tocLinkClass}>Preview and alignment</a></li>
			<li><a href="#doc-settings" class={tocLinkClass}>Settings</a></li>
			<li><a href="#doc-export-share" class={tocLinkClass}>Export and share</a></li>
			<li><a href="#doc-examples" class={tocLinkClass}>Examples and motion demos</a></li>
			<li><a href="#doc-partners" class={tocLinkClass}>Partner links</a></li>
			<li><a href="#doc-creator" class={tocLinkClass}>About the creator</a></li>
			<li><a href="#doc-contact" class={tocLinkClass}>Contact</a></li>
			<li><a href="#doc-privacy" class={tocLinkClass}>Privacy</a></li>
		</ul>
	</nav>

	<h2 id="doc-line-editor" class={headingClass}>Line editor</h2>
	<p class="mt-3">
		You can add several lines (for example source, IPA, glosses, and a free translation). Each line
		has its own font (Google Fonts or an uploaded file), text size, horizontal spacing between
		words, and optional right-to-left layout for scripts such as Hebrew or Arabic. Lines can be
		reordered so that only <strong class="text-gray-900 dark:text-white">adjacent</strong> rows are
		linkable —
		{DISPLAY_NAME} always links the line above to the line directly below it. Open a line’s popover for
		quick typography controls, or the full
		<strong class="text-gray-900 dark:text-white">Edit line</strong>
		dialog to change text and see a live preview of how it splits into word boxes.
	</p>
	<div class="mt-6 flex flex-col gap-6">
		{#each lineEditorShots as shot, i (shot.src)}
			<figure
				class="{lineEditorFigureShell} {shot.narrow
					? 'mx-auto w-full max-w-md'
					: 'mx-auto w-full max-w-2xl'}"
			>
				<div class={lineEditorShotFrame}>
					<img
						src={shot.src}
						alt={shot.alt}
						loading={shot.eager || i === 0 ? 'eager' : 'lazy'}
						decoding="async"
						class={lineEditorShotImg}
					/>
				</div>
				<figcaption class={lineEditorFigcaptionClass}>
					{shot.caption}
				</figcaption>
			</figure>
		{/each}
	</div>

	<h2 id="doc-preview" class={headingClass}>Preview and alignment</h2>
	<p class="mt-3">
		Click tokens to create colored alignment links. Many-to-many groupings share one color so you
		can see which tokens belong to the same correspondence. For each pair of adjacent lines you can
		adjust the vertical gap and optionally <strong class="text-gray-900 dark:text-white"
			>hide the connector curves</strong
		>
		while keeping the links in the data model — useful when a gloss row sits tight under a sentence. The
		preview supports a clean “hide chrome” mode and fullscreen for screenshots.
	</p>
	<div class="mt-6 space-y-8">
		{#each previewShots as shot (shot.src)}
			<figure class="m-0">
				<div class={shotFrame}>
					<img
						src={shot.src}
						alt={shot.alt}
						loading={shot.eager ? 'eager' : 'lazy'}
						decoding="async"
						class={shotImg}
					/>
				</div>
				<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
					{shot.caption}
				</figcaption>
			</figure>
		{/each}
	</div>

	<h2 id="doc-settings" class={headingClass}>Settings</h2>
	<p class="mt-3">
		The settings panel uses icons for four areas. What each one does in plain language:
	</p>
	<ul class="mt-3 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
		<li>
			<strong class="text-gray-900 dark:text-white">Style</strong> — light or dark UI, background of the
			preview background (light or dark), whether connectors are curved or straight, how thick and faint
			they are, default vertical space between lines, and optional per-pair spacing overrides. You can
			also hide preview controls for a clean screenshot and open fullscreen from the preview toolbar.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Colors</strong> — color palettes for links, and whether
			matching words are highlighted by coloring the text or the word background (including in exports
			when that option is on).
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Tokens</strong> — in the UI this tab is labeled
			“Tokens”; internally we talk about
			<strong class="text-gray-900 dark:text-white">tokenization</strong>, meaning “how your text is
			cut into clickable word boxes.” Here you can show line numbers; choose extra characters that
			force a new word (for example <code class="font-mono text-sm">|</code> or
			<code class="font-mono text-sm">-</code> when you need morpheme boundaries); set a
			<strong class="text-gray-900 dark:text-white">join</strong> character so two written words still
			count as one box for linking (shown with a space in the preview); and optionally split punctuation
			into its own boxes or limit which punctuation splits.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Fonts</strong> — upload font files for custom scripts
			and pick them per line, or add families from Google Fonts by name.
		</li>
	</ul>
	<p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
		The short summary next to the line editor (“Whitespace splits words…”) mirrors the same rules as
		the Tokens tab; use the gear button there to jump straight to those controls.
	</p>
	<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
		{#each settingsTabShots as shot (shot.src)}
			<figure class="m-0 min-w-0">
				<div class={shotFrame}>
					<img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" class={shotImg} />
				</div>
				<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
					{shot.caption}
				</figcaption>
			</figure>
		{/each}
	</div>

	<h2 id="doc-export-share" class={headingClass}>Export and share</h2>
	<p class="mt-3">
		Download the visualization as <strong class="text-gray-900 dark:text-white"
			>PNG, SVG, PDF,</strong
		>
		or a self-contained <strong class="text-gray-900 dark:text-white">HTML</strong> file. You can
		also build a <strong class="text-gray-900 dark:text-white">share link</strong>: the full project
		and visual settings are encoded in the
		<code class="font-mono text-sm text-gray-800 dark:text-gray-200">?data=</code>
		URL parameter so anyone who opens the link sees the same alignment. The Share dialog adds a QR code,
		social targets, and a <strong class="text-gray-900 dark:text-white">Data object</strong> action for
		JSON shaped like a curated preset (useful for authors and debugging).
	</p>
	<div class="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
		{#each exportShareShots as shot (shot.src)}
			<figure class="m-0 min-w-0">
				<div class={shotFrame}>
					<img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" class={shotImg} />
				</div>
				<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
					{shot.caption}
				</figcaption>
			</figure>
		{/each}
	</div>

	<h2 id="doc-examples" class={headingClass}>Examples and motion demos</h2>
	<p class="mt-3">
		Use <strong class="text-gray-900 dark:text-white">Load example</strong> on the main page to open curated
		projects (simple bilingual pair, Turkish interlinear with IPA and glosses, Hebrew and Arabic with
		English, Tagalog compounds, Japanese–Chinese–English, and more). They illustrate RTL, multi-line stacks,
		and tricky word-splitting cases. The clips below are the same motion demos as on the home page: linking
		in the editor, and a conlang layout with a custom font and glosses.
	</p>
	<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
		<figure class="m-0">
			<div
				class="flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
			>
				<img
					src="/examples/action.gif"
					alt="Animated demo in Aligner: creating word links between “Hello world” and its French translation"
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
				class="flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
			>
				<img
					src="/examples/conlang_gloss.png"
					alt="Conlang alignment example in Aligner: custom script font on the source line, interlinear glosses, and English translation with connectors"
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

	<h2 id="doc-partners" class={headingClass}>Partner links</h2>
	<p class="mt-3">
		{DISPLAY_NAME} stays free and without aggressive ads. Hosting and ongoing upkeep still have a cost,
		so I add a few optional partner links. Use them if you were already considering the service, it
		helps keep the site running. The referral bonuses come from the provider. These are services I use
		myself.
	</p>
	<div class="mt-5 flex min-w-0 flex-col gap-4">
		<PartnerBannerPreply />
		<PartnerBannerRailway />
		<PartnerBannerCursor />
		<PartnerBannerWise />
	</div>

	<h2 id="doc-creator" class={headingClass}>About the creator</h2>
	<p class="mt-3">
		{DISPLAY_NAME} is built by Dani Polani — a fantasy author, the creator of the constructed language
		Lemu Teloku, and a maker of tools for conlangers and linguists. A psychologist and linguist by training
		and a self-taught developer, Dani builds small, focused tools and likes automating the tedious parts.
	</p>
	<p class="mt-3">
		The same attention to interlinear glosses and Leipzig-style conventions that goes into
		documenting a constructed language shaped this tool. Alongside the language work there is a
		wider creative world — drawings, an encyclopedia of Lemu Teloku and its setting, and other
		handmade art projects. Offline, Dani is fond of literature, nineteenth-century technology, cats,
		and seals.
	</p>
	<p class="mt-3">
		More of Dani's work and tools:
		<a href={SITE_AUTHOR_URL} class={linkClass} target="_blank" rel="noopener noreferrer">
			danipolani.github.io
		</a>.
	</p>

	<h2 id="doc-contact" class={headingClass}>Contact</h2>
	<p class="mt-3">
		Questions or feedback about {DISPLAY_NAME}:
		<a href={`mailto:${SITE_CONTACT_EMAIL}`} class={linkClass}>{SITE_CONTACT_EMAIL}</a>
		<span class="text-gray-400 dark:text-gray-600"> · </span>
		<button
			type="button"
			class={feedbackBtnClass}
			data-tally-open={TALLY_FORM_ID}
			data-tally-auto-close="0"
			data-tally-hide-title="1"
			data-tally-form-events-forwarding="1"
		>
			Feedback form (Tally)
		</button>
	</p>

	<h2 id="doc-privacy" class={headingClass}>Privacy</h2>
	<p class="mt-3">
		We do not run accounts or store your text on our infrastructure. Details on analytics, feedback,
		and fonts are in the
		<a href={resolve('/privacy')} class={linkClass}>privacy policy</a>.
	</p>

	<SiteFooter />
</main>
