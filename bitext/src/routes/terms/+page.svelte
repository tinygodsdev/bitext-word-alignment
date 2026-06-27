<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SITE_CONTACT_EMAIL } from '$lib/brand.js';
	import { SITE_NAME } from '$lib/seo/metadata.js';

	const TITLE = 'Terms of use';
	const DESCRIPTION =
		'Terms of use for Word Aligner: a free, no-account browser tool. Covers acceptable use, your content and uploaded fonts, the API and MCP server, warranty disclaimer, and liability.';

	const canonical = $derived(page.url.origin + page.url.pathname);
	/** Last meaningful content review of these terms. Bump when wording changes. */
	const LAST_UPDATED = '2026-06-27';

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
		<span class="text-gray-300 dark:text-gray-600" aria-hidden="true">·</span>
		<a href={resolve('/privacy')} class={linkClass}>Privacy policy</a>
	</nav>

	<h1
		class="font-heading text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
	>
		Terms of use
	</h1>
	<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
		Last updated: <time datetime={LAST_UPDATED}>{LAST_UPDATED}</time>
	</p>

	<p class="mt-6">
		These terms govern your use of <a href={resolve('/')} class={linkClass}>{SITE_NAME}</a> ("the tool",
		"the service", "we", "us"), a free, browser-based visualizer for word-by-word translations available
		at aligner.tinygods.dev. By using the tool, its example pages, its HTTP API, or its MCP server, you
		agree to these terms. If you do not agree, do not use the service.
	</p>

	<h2 class={headingClass}>The service</h2>
	<p class="mt-3">
		The tool lets you align words across stacked lines of text, add gloss and IPA tiers, style the
		result, and export or share it. It is provided free of charge. There are no user accounts, and
		you do not need to register or provide an email address to use it. How data is handled is
		described in our <a href={resolve('/privacy')} class={linkClass}>privacy policy</a>.
	</p>
	<p class="mt-3">
		We may change, suspend, or discontinue any part of the service at any time, including the
		editor, the example pages, the API, and the MCP server, without notice and without liability to
		you.
	</p>

	<h2 class={headingClass}>Your content</h2>
	<p class="mt-3">
		You keep all rights to the text, translations, glosses, and other content you enter into the
		tool ("your content"). We do not claim ownership of it. Because the tool has no backend that
		stores your content, your content stays in your browser and in the share URLs and exports you
		choose to create.
	</p>
	<p class="mt-3">
		You are responsible for your content. You represent that you have the necessary rights to the
		text you input and that your use of it, and of any diagram you create, share, or publish, does
		not infringe the rights of others or break any applicable law.
	</p>

	<h2 class={headingClass}>Uploaded fonts</h2>
	<p class="mt-3">
		The tool lets you upload custom font files for use in your visualization. These files are stored
		only in your browser and are embedded in some export formats (for example, self-contained HTML
		and SVG). You are responsible for holding the licenses required to use and to embed any font you
		upload and any font you redistribute inside an exported file. We do not provide font licenses
		and are not a party to your font licensing.
	</p>

	<h2 class={headingClass}>Acceptable use</h2>
	<p class="mt-3">You agree not to:</p>
	<ul class="mt-3 list-disc space-y-2 pl-6">
		<li>use the service in any way that breaks an applicable law or regulation;</li>
		<li>
			attempt to disrupt, overload, or impair the service, its infrastructure, or its networks,
			including through automated requests beyond reasonable use;
		</li>
		<li>
			probe, scan, or test the vulnerability of the service, or breach its security or
			authentication measures;
		</li>
		<li>
			use the service to create or distribute content that is unlawful, infringing, or harmful to
			others;
		</li>
		<li>
			misrepresent the source of an exported diagram in a way that violates the rights of others.
		</li>
	</ul>

	<h2 class={headingClass}>API and MCP server</h2>
	<p class="mt-3">
		The tool exposes a free HTTP API and an MCP server. They are provided for reasonable, good-faith
		use. We may apply rate limits, change the request and response formats, require attribution, or
		withdraw access at any time. You must not use the API or MCP server in a way that degrades the
		service for others. Output you generate through the API or MCP server is subject to the same
		rules as content created in the editor, including your responsibilities for your content and for
		any fonts you supply.
	</p>

	<h2 class={headingClass}>Intellectual property</h2>
	<p class="mt-3">
		The tool itself, including its software, design, text, and example pages, is owned by the author
		and protected by intellectual property laws. These terms do not grant you any right in the tool
		beyond using it as intended. The project's source code is published separately and is governed
		by the license stated in its repository; nothing here overrides that license.
	</p>
	<p class="mt-3">
		Diagrams you export are yours to use. Exports may include a small attribution line referencing
		aligner.tinygods.dev; you may keep it or remove it as you see fit.
	</p>

	<h2 class={headingClass}>Third-party services and links</h2>
	<p class="mt-3">
		The tool loads third-party services (such as Google Fonts, Google Analytics, and the Tally
		feedback form) as described in the <a href={resolve('/privacy')} class={linkClass}
			>privacy policy</a
		>. Your use of those services is governed by their own terms.
	</p>
	<p class="mt-3">
		To help cover hosting costs, the tool may show partner or affiliate links to third-party
		products. If you follow such a link and use the service, we may receive a commission at no extra
		cost to you. These links do not change the price you pay, and we describe the products on their
		own merits. We are not responsible for third-party products, sites, or services, and listing a
		link is not an endorsement you should rely on without your own judgment.
	</p>

	<h2 class={headingClass}>Disclaimer of warranties</h2>
	<p class="mt-3">
		The service is provided "as is" and "as available", without warranties of any kind, whether
		express or implied, including warranties of merchantability, fitness for a particular purpose,
		and non-infringement. We do not warrant that the service will be uninterrupted, error-free, or
		secure, that exports or share URLs will always render correctly, or that any defect will be
		corrected. You use the service at your own risk and are responsible for keeping your own copies
		of anything you need to retain.
	</p>

	<h2 class={headingClass}>Limitation of liability</h2>
	<p class="mt-3">
		To the maximum extent permitted by law, the author and operator of the service will not be
		liable for any indirect, incidental, special, consequential, or punitive damages, or for any
		loss of data, work, or goodwill, arising out of or related to your use of, or inability to use,
		the service. The service is free, and to the extent any liability cannot be excluded, it is
		limited to the amount you paid to use the service, which is zero.
	</p>

	<h2 class={headingClass}>Changes to these terms</h2>
	<p class="mt-3">
		We may update these terms from time to time. When we do, the "Last updated" date above will be
		bumped and the change will be reflected in the project's repository history. Your continued use
		of the service after a change means you accept the updated terms.
	</p>

	<h2 class={headingClass}>Governing law</h2>
	<p class="mt-3">
		These terms are governed by the laws of the State of Israel, where the operator resides, without
		regard to conflict-of-law rules, and the competent courts of Israel have jurisdiction over any
		dispute arising from them. Nothing in these terms removes any mandatory consumer rights you have
		under the law of your own country of residence.
	</p>

	<h2 class={headingClass}>Contact</h2>
	<p class="mt-3">
		Questions about these terms:
		<a class={linkClass} href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
		<span class="text-gray-400 dark:text-gray-600"> · </span>
		the
		<a
			class={linkClass}
			href="https://danipolani.github.io/en/"
			target="_blank"
			rel="noopener noreferrer">author's site</a
		>, or the in-app "Send feedback" form.
	</p>
</main>
