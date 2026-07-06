<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SITE_CONTACT_EMAIL, TALLY_FORM_ID } from '$lib/brand.js';
	import PartnerBannerCursor from '$lib/components/partners/PartnerBannerCursor.svelte';
	import PartnerBannerPreply from '$lib/components/partners/PartnerBannerPreply.svelte';
	import PartnerBannerRailway from '$lib/components/partners/PartnerBannerRailway.svelte';
	import PartnerBannerWise from '$lib/components/partners/PartnerBannerWise.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import YouTubeEmbed from '$lib/components/media/YouTubeEmbed.svelte';
	import StructuredData from '$lib/components/seo/StructuredData.svelte';
	import { breadcrumbList, personCreator } from '$lib/seo/structured-data.js';
	import { SITE_AUTHOR_URL } from '$lib/brand.js';
	import { galleryPreviewImageUrl } from '$lib/examples/cdn.js';

	const TITLE = 'About';
	const DISPLAY_NAME = 'Word Aligner';
	const SEO_TITLE = 'About Word Aligner — Free Word Alignment & Gloss Tool';
	const DESCRIPTION =
		'Word Aligner: multi-line word alignment, interlinear glosses and IPA, RTL scripts, word-splitting rules, per-line typography, exports (PNG, SVG, PDF, HTML), and shareable URLs — for learners, teachers, and linguists.';

	const DEMO_VIDEO_ID = 'rgGEb2WaNso';

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(`${page.url.origin}/api/og`);

	const structuredData = [
		breadcrumbList([
			{ name: DISPLAY_NAME, path: '/' },
			{ name: TITLE, path: '/about' }
		]),
		personCreator()
	];

	const eyebrow =
		'font-heading text-xs font-semibold tracking-[0.18em] text-primary-600 uppercase dark:text-primary-400';
	const h2Class =
		'font-heading mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white';
	const cardClass =
		'flex h-full flex-col border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/40';
	const captionClass = 'mt-3 text-center text-sm leading-snug text-gray-600 dark:text-gray-400';
	const shotFrame =
		'overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50';
	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
	const feedbackBtnClass =
		'inline cursor-pointer border-0 bg-transparent p-0 text-sm text-gray-600 underline decoration-gray-400/50 underline-offset-2 transition-colors hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-200 dark:focus-visible:outline-primary-500';

	const ctaPrimary =
		'inline-flex items-center gap-2 border border-primary-600 bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:border-primary-500 dark:hover:bg-primary-500';
	const ctaGhost =
		'inline-flex items-center gap-2 border border-gray-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-gray-800 no-underline transition-colors hover:border-gray-400 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-100 dark:hover:bg-gray-800';

	const featuredExamples = [
		{
			slug: 'hebrew-arabic-english-rtl-interlinear',
			alt: 'Right-to-left example: Hebrew and Arabic sentences aligned to an English translation, with connectors crossing between the differently ordered words.',
			caption: 'Hebrew and Arabic aligned to English (RTL).'
		},
		{
			slug: 'conlang-custom-font-interlinear-gloss',
			alt: 'Conlang example: a constructed-language sentence in a custom script font, with an interlinear gloss and an English translation joined by connectors.',
			caption: 'A conlang with a custom font and a gloss.'
		}
	];

	const steps = [
		{
			n: '1',
			title: 'Type or paste two lines',
			body: 'A sentence and its translation, one per line. Add more rows for a gloss or an IPA transcription whenever you need them.'
		},
		{
			n: '2',
			title: 'Click a word, then its match',
			body: 'A curved connector draws the link. Link one word to many, and let connectors cross freely when the translation reorders the words.'
		},
		{
			n: '3',
			title: 'Export or share',
			body: 'Download PNG, SVG, PDF, or a self-contained HTML file, or copy a link that reproduces every word box and connector.'
		}
	];

	type FeatureIcon =
		| 'link'
		| 'tiers'
		| 'rtl'
		| 'fonts'
		| 'tokens'
		| 'export'
		| 'palette'
		| 'free'
		| 'api';
	type Feature = { title: string; icon: FeatureIcon; body: string };
	const features: Feature[] = [
		{
			title: 'You draw every link',
			icon: 'link',
			body: 'No machine translation. One-to-many and many-to-one connectors, crossing freely for reordered translations, so the alignment stays yours and stays accurate.'
		},
		{
			title: 'Gloss and IPA tiers',
			icon: 'tiers',
			body: 'Stack a morpheme-by-morpheme gloss or an IPA row above or below any line for Leipzig-style interlinear layouts.'
		},
		{
			title: 'Right-to-left and mixed scripts',
			icon: 'rtl',
			body: 'Hebrew and Arabic sit alongside left-to-right text, with direction set per line.'
		},
		{
			title: 'Per-line typography',
			icon: 'fonts',
			body: 'Set font, size, and word spacing on each line, from Google Fonts or an uploaded file. Exports keep custom-font shaping.'
		},
		{
			title: 'Tokenization control',
			icon: 'tokens',
			body: 'Choose how text splits into linkable words: extra separators for morpheme boundaries and a join marker for fixed expressions.'
		},
		{
			title: 'Exports that match the preview',
			icon: 'export',
			body: 'PNG, SVG, PDF, and self-contained HTML, plus a QR code, all matching what you see on screen.'
		},
		{
			title: 'Palettes and styles',
			icon: 'palette',
			body: 'Twelve color palettes, curved or straight connectors, light or dark canvas, and word colors that follow the links.'
		},
		{
			title: 'Free and account-less',
			icon: 'free',
			body: 'The whole diagram lives in a shareable URL, so there is nothing to save, no backend storage, and nothing to sign up for.'
		},
		{
			title: 'API, MCP, and an agent skill',
			icon: 'api',
			body: 'A free HTTP API, an MCP server, and an installable skill let an AI assistant build a diagram from a plain request.'
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

{#snippet fIcon(name: FeatureIcon)}
	<svg
		class="h-5 w-5"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.7"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		{#if name === 'link'}
			<path
				d="M13.19 8.69a4.5 4.5 0 0 1 1.24 7.24l-2.7 2.7a4.5 4.5 0 0 1-6.37-6.36l1.06-1.06m4.39-3.15 1.06-1.06a4.5 4.5 0 0 1 6.37 6.36l-1.06 1.06M9 15l6-6"
			/>
		{:else if name === 'tiers'}
			<path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
		{:else if name === 'rtl'}
			<path d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
		{:else if name === 'fonts'}
			<path d="M10.5 21 15.75 9.75 21 21m-9-3h7.5" />
			<path d="M3 5.6a48 48 0 0 1 6-.37M9 5.25V3m3.33 2.36C11.18 10.66 7.7 15.08 3 17.5" />
		{:else if name === 'tokens'}
			<path d="M9.5 9 20 15M9.5 15 20 9" />
			<circle cx="5.5" cy="6.5" r="2.5" />
			<circle cx="5.5" cy="17.5" r="2.5" />
		{:else if name === 'export'}
			<path
				d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
			/>
		{:else if name === 'palette'}
			<path
				d="M6.75 21A3.75 3.75 0 0 1 3 17.25V4.5A1.5 1.5 0 0 1 4.5 3h4.5A1.5 1.5 0 0 1 10.5 4.5v12.75A3.75 3.75 0 0 1 6.75 21ZM6.75 17.25h.008v.008H6.75Z"
			/>
			<path d="M10.5 8.4 14 5a1.5 1.5 0 0 1 2.1 0l3.2 3.2a1.5 1.5 0 0 1 0 2.1L9.4 20" />
			<path d="M10.5 17.25H19.5A1.5 1.5 0 0 0 21 15.75v-4.5" />
		{:else if name === 'free'}
			<path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		{:else}
			<path
				d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3M5.25 3.75h13.5A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6a2.25 2.25 0 0 1 2.25-2.25Z"
			/>
		{/if}
	</svg>
{/snippet}

<main class="w-full min-w-0 text-gray-700 dark:text-gray-300">
	<!-- Hero -->
	<section class="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
		<div class="pointer-events-none absolute inset-0" aria-hidden="true">
			<div
				class="absolute inset-0 bg-linear-to-b from-primary-50/70 via-app-shell to-app-shell dark:from-primary-950/40 dark:via-gray-900 dark:to-gray-900"
			></div>
			<div
				class="absolute -top-24 -right-16 h-80 w-80"
				style="background: radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%);"
			></div>
			<div
				class="absolute top-24 -left-20 h-72 w-72"
				style="background: radial-gradient(circle, rgba(14,165,233,0.16), transparent 70%);"
			></div>
		</div>

		<div class="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 md:py-20">
			<nav
				class="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm"
				aria-label="Breadcrumb"
			>
				<a
					href={resolve('/')}
					class="font-medium text-gray-500 no-underline transition-colors hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-300"
					>← {DISPLAY_NAME}</a
				>
				<span class="text-gray-300 dark:text-gray-600" aria-hidden="true">/</span>
				<a
					href={resolve('/examples')}
					class="font-medium text-gray-500 no-underline transition-colors hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-300"
					>Examples</a
				>
			</nav>

			<p class="{eyebrow} mt-6">Free · runs in your browser</p>
			<h1
				class="font-heading mt-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white"
			>
				About {DISPLAY_NAME}
			</h1>
			<p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
				A free, browser-based tool for drawing word-to-word and morpheme-to-morpheme links between
				stacked lines of text: bilingual glosses, interlinear annotations, classroom handouts, and
				social posts. Everything runs in your browser; your sentences are not stored on our servers
				unless you choose to share them.
			</p>
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
				<a href={resolve('/')} class={ctaPrimary}>
					Open the editor
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
					</svg>
				</a>
				<a href={resolve('/examples')} class={ctaGhost}>Browse examples</a>
			</div>

			<div class="mx-auto mt-12 max-w-3xl">
				<YouTubeEmbed id={DEMO_VIDEO_ID} title="Word Aligner demo" label="Watch the demo" />
				<p class={captionClass}>A short walkthrough of building an alignment from scratch.</p>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section id="how-it-works" class="border-b border-gray-200 dark:border-gray-800">
		<div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
			<p class={eyebrow}>How it works</p>
			<h2 class={h2Class}>From two lines to a diagram in a minute</h2>
			<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
				{#each steps as step (step.n)}
					<div class={cardClass}>
						<span
							class="font-heading flex h-9 w-9 items-center justify-center border border-primary-200 bg-primary-50 text-sm font-semibold text-primary-700 dark:border-primary-500/40 dark:bg-primary-950/50 dark:text-primary-300"
						>
							{step.n}
						</span>
						<h3 class="font-heading mt-4 text-lg font-semibold text-gray-900 dark:text-white">
							{step.title}
						</h3>
						<p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							{step.body}
						</p>
					</div>
				{/each}
			</div>

			<figure class="m-0 mt-10">
				<div class={shotFrame}>
					<img
						src="/screenshots/about/editor-overview.png"
						alt="Word Aligner editor: a toolbar with example loader and view controls, a live word-alignment diagram of a Turkish sentence on the left, and the line editor with the Text tab on the right."
						width={2850}
						height={1016}
						loading="lazy"
						decoding="async"
						class="w-full"
					/>
				</div>
				<figcaption class={captionClass}>
					The editor: lines and settings on the right, the live diagram on the left.
				</figcaption>
			</figure>
		</div>
	</section>

	<!-- Diagram highlight -->
	<section class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
		<div class="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 md:py-20">
			<p class={eyebrow}>The diagram</p>
			<h2 class={h2Class}>Word order stays visible</h2>
			<p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
				Each sentence keeps its own line and the connectors draw between them, so reordering,
				splits, and dropped words stay obvious instead of being flattened into a stacked gloss.
			</p>
			<figure class="m-0 mt-8">
				<div class="{shotFrame} mx-auto max-w-3xl">
					<img
						src="/screenshots/about/preview-clean.png"
						alt="Clean word-alignment diagram: a Turkish sentence with a gloss row, an IPA row, and an English translation, connected by curved colored lines that cross where the word order differs."
						width={2082}
						height={916}
						loading="lazy"
						decoding="async"
						class="w-full"
					/>
				</div>
			</figure>
		</div>
	</section>

	<!-- Features -->
	<section id="features" class="border-b border-gray-200 dark:border-gray-800">
		<div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
			<p class={eyebrow}>Features</p>
			<h2 class={h2Class}>What's inside</h2>
			<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature (feature.title)}
					<div class={cardClass}>
						<span
							class="flex h-9 w-9 shrink-0 items-center justify-center border border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-500/40 dark:bg-primary-950/50 dark:text-primary-300"
						>
							{@render fIcon(feature.icon)}
						</span>
						<h3 class="font-heading mt-4 text-base font-semibold text-gray-900 dark:text-white">
							{feature.title}
						</h3>
						<p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							{feature.body}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- A closer look: style + export -->
	<section class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
		<div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20">
			<p class={eyebrow}>A closer look</p>
			<h2 class={h2Class}>Style and export</h2>
			<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
				<figure class="m-0">
					<div class={shotFrame}>
						<img
							src="/screenshots/about/rail-style.png"
							alt="Style tab: a light or dark canvas toggle, a grid of twelve color palettes, a toggle to color words to match their links, and connector shape and thickness controls."
							width={704}
							height={1424}
							loading="lazy"
							decoding="async"
							class="max-h-112 w-full object-contain object-top"
						/>
					</div>
					<figcaption class={captionClass}>
						Style: palettes, light or dark canvas, curved or straight connectors, thickness.
					</figcaption>
				</figure>
				<figure class="m-0">
					<div class={shotFrame}>
						<img
							src="/screenshots/about/rail-export.png"
							alt="Export tab: download buttons for PNG, SVG, PDF, HTML, and QR, and a share row with social buttons and a Copy link button."
							width={704}
							height={800}
							loading="lazy"
							decoding="async"
							class="max-h-112 w-full object-contain object-top"
						/>
					</div>
					<figcaption class={captionClass}>
						Export: PNG, SVG, PDF, HTML, a QR code, and a shareable link.
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<!-- Examples -->
	<section id="examples" class="border-b border-gray-200 dark:border-gray-800">
		<div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
			<p class={eyebrow}>Examples</p>
			<h2 class={h2Class}>Start from a ready-made example</h2>
			<p class="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
				The gallery covers bilingual pairs, interlinear stacks, right-to-left scripts, and tricky
				word-splitting cases. Open any one in the editor and adapt it.
			</p>
			<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
				{#each featuredExamples as ex (ex.slug)}
					<figure class="m-0">
						<a
							href={resolve(`/examples/${ex.slug}`)}
							class="group block overflow-hidden border border-gray-200 bg-white transition-colors hover:border-primary-400 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-primary-500/60"
						>
							<img
								src={galleryPreviewImageUrl(ex.slug)}
								alt={ex.alt}
								width={960}
								height={540}
								loading="lazy"
								decoding="async"
								class="w-full bg-white object-contain object-center transition-transform duration-300 group-hover:scale-[1.03] dark:bg-gray-900/40"
							/>
						</a>
						<figcaption class={captionClass}>{ex.caption}</figcaption>
					</figure>
				{/each}
			</div>
			<div class="mt-8">
				<a href={resolve('/examples')} class={ctaPrimary}>
					Browse all examples
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
					</svg>
				</a>
			</div>
		</div>
	</section>

	<!-- Origin story -->
	<section
		id="origin"
		class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
	>
		<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
			<p class={eyebrow}>Origin</p>
			<h2 class={h2Class}>Where it came from</h2>
			<div
				class="mt-6 border-l-2 border-primary-500 pl-5 text-lg leading-relaxed text-gray-700 dark:border-primary-400 dark:text-gray-300"
			>
				<p class="m-0">
					Word Aligner started in the conlang community. People who invent languages like to post
					word-by-word breakdowns of a sentence to show how the grammar works, and there was no real
					tool for it. They lined up words and drew arrows by hand in Paint or PowerPoint, in
					whatever was open. It looked rough and took an afternoon.
				</p>
				<p class="mt-4 mb-0">
					So this became a single editor: type two lines, click a word and then its match, and a
					connector draws itself. Add a gloss or an IPA row, use a custom font for your script, and
					export a clean image or share the link. It caught on in the conlang subreddit first, then
					language teachers and linguists picked it up for the same reason. Seeing which word became
					which is useful well beyond conlanging.
				</p>
			</div>
		</div>
	</section>

	<!-- Partner links + creator + contact + privacy -->
	<div class="mx-auto w-full max-w-3xl min-w-0 px-4 py-16 leading-relaxed sm:px-6 md:py-20">
		<h2 id="doc-partners" class="font-heading text-2xl font-semibold text-gray-900 dark:text-white">
			Partner links
		</h2>
		<p class="mt-3 text-gray-700 dark:text-gray-300">
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

		<h2
			id="doc-creator"
			class="font-heading mt-14 text-2xl font-semibold text-gray-900 dark:text-white"
		>
			About the creator
		</h2>
		<div
			class="mt-4 border border-gray-200 bg-gray-50/70 p-6 dark:border-gray-700 dark:bg-gray-800/40"
		>
			<p class="mt-0 text-gray-700 dark:text-gray-300">
				{DISPLAY_NAME} is built by Dani Polani, a fantasy author, the creator of the constructed language
				Lemu Teloku, and a maker of tools for conlangers and linguists. A psychologist and linguist by
				training and a self-taught developer, Dani builds small, focused tools and likes automating the
				tedious parts.
			</p>
			<p class="mt-3 text-gray-700 dark:text-gray-300">
				The same attention to interlinear glosses and Leipzig-style conventions that goes into
				documenting a constructed language shaped this tool. Alongside the language work there is a
				wider creative world of drawings, an encyclopedia of Lemu Teloku and its setting, and other
				handmade art projects. Offline, Dani is fond of literature, nineteenth-century technology,
				cats, and seals.
			</p>
			<p class="mt-3 mb-0 text-gray-700 dark:text-gray-300">
				More of Dani's work and tools:
				<a href={SITE_AUTHOR_URL} class={linkClass} target="_blank" rel="noopener noreferrer">
					danipolani.github.io
				</a>.
			</p>
		</div>

		<h2
			id="doc-contact"
			class="font-heading mt-14 text-2xl font-semibold text-gray-900 dark:text-white"
		>
			Contact
		</h2>
		<p class="mt-3 text-gray-700 dark:text-gray-300">
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

		<h2
			id="doc-privacy"
			class="font-heading mt-14 text-2xl font-semibold text-gray-900 dark:text-white"
		>
			Privacy
		</h2>
		<p class="mt-3 text-gray-700 dark:text-gray-300">
			We do not run accounts or store your text on our infrastructure. Details on analytics,
			feedback, and fonts are in the
			<a href={resolve('/privacy')} class={linkClass}>privacy policy</a>.
		</p>
	</div>

	<!-- Final CTA -->
	<section class="relative overflow-hidden border-t border-gray-200 dark:border-gray-800">
		<div
			class="pointer-events-none absolute inset-0 bg-linear-to-b from-app-shell to-primary-50/70 dark:from-gray-900 dark:to-primary-950/40"
			aria-hidden="true"
		></div>
		<div class="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-20">
			<h2
				class="font-heading text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
			>
				Draw your first alignment
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
				No account, no machine translation. Open the editor and link two words to see how it feels.
			</p>
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
				<a href={resolve('/')} class={ctaPrimary}>
					Open the editor
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
					</svg>
				</a>
				<a href={resolve('/guide')} class={ctaGhost}>Read the guides</a>
			</div>
			<div class="mt-12">
				<SiteFooter />
			</div>
		</div>
	</section>
</main>
