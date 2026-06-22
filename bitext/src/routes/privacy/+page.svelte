<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SITE_CONTACT_EMAIL } from '$lib/brand.js';
	import { SITE_NAME } from '$lib/seo/metadata.js';

	const TITLE = 'Privacy policy';
	const DESCRIPTION =
		'How Word Aligner handles your data: no accounts, no server-side storage of your sentences, and what third-party tools (Google Analytics, Tally) we load.';

	const canonical = $derived(page.url.origin + page.url.pathname);
	/** Last meaningful content review of this policy. Bump when wording changes. */
	const LAST_UPDATED = '2026-05-10';

	const headingClass = 'font-heading mt-8 text-xl font-semibold text-gray-900 dark:text-white';
	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
</script>

<svelte:head>
	<title>{TITLE} · {SITE_NAME}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={`${TITLE} · ${SITE_NAME}`} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
</svelte:head>

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-6 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-10 dark:text-gray-300"
>
	<nav class="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
		<a href={resolve('/')} class={linkClass}>← Back to {SITE_NAME}</a>
		<span class="text-gray-300 dark:text-gray-600" aria-hidden="true">·</span>
		<a href={resolve('/about')} class={linkClass}>About</a>
	</nav>

	<h1
		class="font-heading text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
	>
		Privacy policy
	</h1>
	<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
		Last updated: <time datetime={LAST_UPDATED}>{LAST_UPDATED}</time>
	</p>

	<p class="mt-6">
		<a href={resolve('/')} class={linkClass}>{SITE_NAME}</a> ("the tool", "we") is a free, browser-based
		visualizer for word-by-word translations. We don't run user accounts, you don't need to provide an
		email address to use the tool, and the sentences you align never leave your browser unless you choose
		to share or export them. This page
		summarizes what data is involved when you use the tool.
	</p>

	<h2 class={headingClass}>What we collect ourselves</h2>
	<p class="mt-3">
		<strong class="text-gray-900 dark:text-white">Nothing on a server we control.</strong> The tool has
		no backend that stores user sentences, alignments, font files, or settings. The page is a static web
		app delivered from a CDN.
	</p>

	<h2 class={headingClass}>What stays in your browser</h2>
	<ul class="mt-3 list-disc space-y-2 pl-6">
		<li>
			<strong class="text-gray-900 dark:text-white">Your current project</strong> (sentences, links, and
			visual settings) is encoded into the page URL after each change, so reloading restores your state
			and the URL is shareable. Nothing is sent to a server in the process.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Custom font files</strong> you upload via the Fonts
			tab are kept in your browser's IndexedDB storage on your device. They are not uploaded anywhere.
			You can remove them in the Fonts tab.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Site theme</strong> (light/dark) and similar UI preferences
			are derived from your project URL or chosen for the current visit; we don't set tracking cookies
			of our own.
		</li>
	</ul>

	<h2 class={headingClass}>Sharing and exports</h2>
	<p class="mt-3">
		When you copy a share link, your sentences and visual settings are encoded into the URL itself
		(after <code class="font-mono text-sm">?data=</code>). Anyone you give that URL to can decode it
		and see the same alignment. We do not log or otherwise process the contents of share URLs on our
		servers — the link is decoded entirely in the recipient's browser.
	</p>
	<p class="mt-3">
		Image and document exports (PNG, SVG, PDF, HTML) are produced in your browser and downloaded
		directly. They are not uploaded to us.
	</p>
	<p class="mt-3">
		If you paste a share link into a third-party platform (Twitter/X, Facebook, etc.) to generate a
		preview card, that platform's servers will fetch the page and may render the embedded
		visualization. That fetch is governed by the receiving platform's own privacy policy.
	</p>

	<h2 class={headingClass}>Third-party services we load</h2>
	<p class="mt-3">
		To keep the tool free and to understand how it is used, we include a small number of third-party
		scripts on the page. Each one sets its own cookies and processes your data under its own privacy
		policy.
	</p>
	<ul class="mt-3 list-disc space-y-2 pl-6">
		<li>
			<strong class="text-gray-900 dark:text-white">Google Analytics 4</strong> (Google LLC) —
			aggregate visit statistics: page views, country, browser, referring site. The contents of your
			sentences and share data are not sent to Analytics. See
			<a
				class={linkClass}
				href="https://policies.google.com/privacy"
				target="_blank"
				rel="noopener noreferrer">Google's privacy policy</a
			>
			and
			<a
				class={linkClass}
				href="https://support.google.com/analytics/answer/6004245"
				target="_blank"
				rel="noopener noreferrer">how Analytics handles data</a
			>.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Tally</strong> (Tally BV) — used only when you
			open the "Send feedback" form. Submitting feedback shares whatever you type with Tally, who
			delivers it to us. See
			<a
				class={linkClass}
				href="https://tally.so/help/privacy-policy"
				target="_blank"
				rel="noopener noreferrer">Tally's privacy policy</a
			>.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Google Fonts</strong> (Google LLC) — Google serves
			the UI fonts and any Google Font you pick for your visualization. Font requests reveal your IP address
			and user agent to Google.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">Possible future advertising</strong> — we may add
			Google Ads in the future to help cover hosting costs. If we do, this page will be updated to describe
			it before ads are enabled.
		</li>
	</ul>

	<h2 class={headingClass}>Cookies and similar technologies</h2>
	<p class="mt-3">
		The tool itself does not set any cookies. Google Analytics sets a small number of cookies to
		measure unique visits; you can opt out using the
		<a
			class={linkClass}
			href="https://tools.google.com/dlpage/gaoptout"
			target="_blank"
			rel="noopener noreferrer">Google Analytics opt-out browser add-on</a
		>
		or by blocking analytics scripts in your browser. Tally sets cookies only after you open its feedback
		form.
	</p>

	<h2 class={headingClass}>Children</h2>
	<p class="mt-3">
		The tool is suitable for general audiences and is often used in language classrooms. We do not
		knowingly collect personal data from children. Because the tool requires no account and does not
		ask for personal information, no such data is collected by us in the first place.
	</p>

	<h2 class={headingClass}>Changes to this policy</h2>
	<p class="mt-3">
		If this policy changes in a way that affects how data is handled, the "Last updated" date above
		will be bumped and the change will be summarized in the project's repository history.
	</p>

	<h2 class={headingClass}>Contact</h2>
	<p class="mt-3">
		Questions or requests about this policy:
		<a class={linkClass} href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
		<span class="text-gray-400 dark:text-gray-600"> · </span>
		the
		<a
			class={linkClass}
			href="https://danipolani.github.io/en/"
			target="_blank"
			rel="noopener noreferrer">author's site</a
		>, or the in-app "Send feedback" form (Tally).
	</p>
</main>
