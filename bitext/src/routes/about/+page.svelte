<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	const TITLE = 'About';
	const DESCRIPTION =
		'What Bitext Align can do: multi-line word alignment, interlinear glosses and IPA, RTL scripts, custom tokenization, per-line typography, exports (PNG, SVG, PDF, HTML), and shareable URLs — for learners, teachers, and linguists.';

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(`${page.url.origin}/api/og`);

	const siteTheme = $derived(settingsStore.settings.theme);
	const themeIconBtn =
		'box-border m-0 inline-flex h-9 w-9 shrink-0 items-center justify-center border-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:focus-visible:outline-gray-400';
	const themeIconActive = `${themeIconBtn} bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100`;
	const themeIconIdle = `${themeIconBtn} bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800`;

	const EXAMPLES_IMAGE_VERTICAL_CROP = '10%';
	const examplesImageClipPath = `inset(${EXAMPLES_IMAGE_VERTICAL_CROP} 0 ${EXAMPLES_IMAGE_VERTICAL_CROP} 0)`;

	const headingClass = 'font-heading mt-10 text-xl font-semibold text-gray-900 dark:text-white';
	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';

	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>{TITLE} · {SITE_NAME}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${TITLE} · ${SITE_NAME}`} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:secure_url" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${TITLE} — ${SITE_NAME}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${TITLE} · ${SITE_NAME}`} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
			<nav class="text-sm">
				<a href={resolve('/')} class={linkClass}>← {SITE_NAME}</a>
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
		About {SITE_NAME}
	</h1>
	<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
		{SITE_NAME} is a free, browser-based tool for drawing word-to-word and morpheme-to-morpheme links
		between stacked lines of text — for bilingual glosses, interlinear annotations, classroom
		handouts, and social posts. Everything runs in your browser; your sentences are not stored on
		our servers unless you choose to share them.
	</p>

	<h2 class={headingClass}>Editing and lines</h2>
	<p class="mt-3">
		You can add up to several lines (for example source language, IPA, morpheme glosses, and a free
		translation). Each line has its own font (Google Fonts or an uploaded file), text size, horizontal
		spacing between tokens, and optional right-to-left layout for scripts such as Hebrew or Arabic.
		Lines can be reordered so that only <strong class="text-gray-900 dark:text-white">adjacent</strong>
		rows are linkable — the tool always links the line above to the line directly below it.
	</p>

	<h2 class={headingClass}>Connections and layout</h2>
	<p class="mt-3">
		Click tokens to create colored alignment links. Many-to-many groupings share one color so you can
		see which tokens belong to the same correspondence. For each pair of adjacent lines you can
		adjust the vertical gap and optionally <strong class="text-gray-900 dark:text-white">hide the connector curves</strong>
		while keeping the links in the data model — useful when a gloss row sits tight under a sentence.
	</p>

	<h2 class={headingClass}>Tokenization</h2>
	<p class="mt-3">
		By default, words split on whitespace and on a small set of extra characters (including a merge
		marker so two surface words can count as one alignment unit, shown with a space in the preview).
		You can change split characters, the single-character merge marker, and optionally split
		punctuation into its own tokens. That supports linguistics workflows such as clitic boundaries,
		compound-friendly hyphen handling, or pipe-separated gloss segments.
	</p>

	<h2 class={headingClass}>Appearance and preview</h2>
	<p class="mt-3">
		Choose curved or straight connectors, thickness and opacity, and a color palette. You can tint
		either token text or token backgrounds to match link colors. The preview supports a clean
		“hide chrome” mode and fullscreen for screenshots. Light and dark UI themes follow your choice in
		settings.
	</p>

	<h2 class={headingClass}>Export and share</h2>
	<p class="mt-3">
		Download the visualization as <strong class="text-gray-900 dark:text-white">PNG, SVG, PDF,</strong>
		or a self-contained <strong class="text-gray-900 dark:text-white">HTML</strong> file. You can also
		build a <strong class="text-gray-900 dark:text-white">share link</strong>: the full project and
		visual settings are encoded in the <code class="font-mono text-sm text-gray-800 dark:text-gray-200"
			>?data=</code
		>
		URL parameter so anyone who opens the link sees the same alignment. The Share panel also offers a QR
		code and social share targets. For authors of built-in examples or debugging, the Share dialog
		can copy a compact <strong class="text-gray-900 dark:text-white">JSON “data object”</strong> shaped
		like a preset entry.
	</p>

	<h2 class={headingClass}>Examples and presets</h2>
	<p class="mt-3">
		Use <strong class="text-gray-900 dark:text-white">Load example</strong> to open curated projects
		(simple bilingual pair, Turkish interlinear with IPA and glosses, Hebrew and Arabic with English,
		Tagalog compounds, Japanese–Chinese–English, and more). They illustrate RTL, multi-line stacks, and
		tokenization edge cases.
	</p>

	<h2 class={headingClass}>Screenshots from the app</h2>
	<p class="mt-3 text-gray-600 dark:text-gray-400">
		The same assets shown on the home page: linking in the editor, and a multi-line conlang layout with
		custom font and glosses.
	</p>
	<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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

	<h2 class={headingClass}>Privacy</h2>
	<p class="mt-3">
		We do not run accounts or store your text on our infrastructure. Details on analytics, feedback,
		and fonts are in the
		<a href={resolve('/privacy')} class={linkClass}>privacy policy</a>.
	</p>

	<footer class="mt-14 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
		<p>
			<a href={resolve('/')} class={linkClass}>Open {SITE_NAME}</a>
			<span class="mx-2 text-gray-400 dark:text-gray-600" aria-hidden="true">·</span>
			<a href={resolve('/privacy')} class={linkClass}>Privacy policy</a>
		</p>
		<p class="mt-2">© {year} Dani Polani</p>
	</footer>
</main>
