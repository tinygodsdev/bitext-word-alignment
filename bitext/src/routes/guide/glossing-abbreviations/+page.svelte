<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ALIGNER_DISPLAY_NAME } from '$lib/brand.js';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import StructuredData from '$lib/components/seo/StructuredData.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { breadcrumbList, definedTermSet } from '$lib/seo/structured-data.js';
	import {
		ABBREVIATION_GROUPS,
		ALL_ABBREVIATIONS,
		GLOSSING_CONVENTIONS
	} from '$lib/guide/abbreviations.js';

	const TITLE = 'Glossing abbreviations cheat sheet';
	const SEO_TITLE = 'Glossing Abbreviations Cheat Sheet (NOM, PFV, 3SG…) — Leipzig-Style';
	const DESCRIPTION =
		'A plain-language reference for interlinear glossing abbreviations: case, person, tense, aspect, and the Leipzig notation marks, with worked examples you can open in the editor.';
	const PATH = '/guide/glossing-abbreviations';

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(`${page.url.origin}/api/og`);

	const structuredData = [
		breadcrumbList([
			{ name: SITE_NAME, path: '/' },
			{ name: TITLE, path: PATH }
		]),
		definedTermSet({
			name: 'Glossing abbreviations (Leipzig-style)',
			description: DESCRIPTION,
			path: PATH,
			terms: ALL_ABBREVIATIONS.map((t) => ({
				name: t.label,
				description: `${t.full} — ${t.note}`
			}))
		})
	];

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
	const headingClass =
		'font-heading scroll-mt-20 mt-10 text-xl font-semibold text-gray-900 dark:text-white';
	const tocLinkClass =
		'text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 hover:decoration-gray-600/60 dark:text-gray-300 dark:decoration-gray-500/40 dark:hover:text-white';
	const ctaClass =
		'inline-flex items-center gap-1 rounded-none border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-medium text-white no-underline shadow-sm hover:bg-primary-700 dark:border-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500';
</script>

<svelte:head>
	<title>{SEO_TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={SEO_TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:secure_url" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${TITLE} — ${SITE_NAME}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SEO_TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={`${TITLE} — ${SITE_NAME}`} />
</svelte:head>

<StructuredData data={structuredData} />

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<nav class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
			<a href={resolve('/')} class={linkClass}>← {ALIGNER_DISPLAY_NAME}</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/guide')} class={linkClass}>Guides</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/examples')} class={linkClass}>Examples</a>
		</nav>
		<h1 class="font-heading mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
			Glossing abbreviations: a Leipzig-style cheat sheet
		</h1>
		<p class="mt-3 max-w-prose text-base text-gray-600 dark:text-gray-400">
			Interlinear glosses label grammar with short tags: NOM for a subject, PFV for a completed
			action, 3SG for a third-person singular. The tags below follow the Leipzig Glossing Rules, the
			convention most grammars and journals use. Each one comes with a plain-language note, and the
			notation marks at the end link to worked examples you can open in the editor.
		</p>
	</header>

	<nav
		class="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800/60"
		aria-label="On this page"
	>
		<p class="m-0 font-medium text-gray-900 dark:text-white">On this page</p>
		<ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 list-none p-0">
			{#each ABBREVIATION_GROUPS as group (group.id)}
				<li><a href={`#${group.id}`} class={tocLinkClass}>{group.title}</a></li>
			{/each}
			<li><a href="#notation" class={tocLinkClass}>Notation marks</a></li>
		</ul>
	</nav>

	{#each ABBREVIATION_GROUPS as group (group.id)}
		<h2 id={group.id} class={headingClass}>{group.title}</h2>
		<dl class="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
			{#each group.terms as term (term.label)}
				<dt id={term.label.toLowerCase()} class="scroll-mt-20 min-w-0 sm:text-right">
					<span class="font-mono text-sm font-semibold text-gray-900 dark:text-white"
						>{term.label}</span
					>
					<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{term.full}</span>
				</dt>
				<dd class="m-0 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{term.note}</dd>
			{/each}
		</dl>
	{/each}

	<h2 id="notation" class={headingClass}>Notation marks</h2>
	<p class="mt-3 max-w-prose text-base leading-relaxed">
		Beyond the labels, glossing uses a small set of marks to line up the source text with the gloss.
		Each mark below links to an example that shows it in a real sentence.
	</p>
	<dl class="mt-4 space-y-4">
		{#each GLOSSING_CONVENTIONS as conv (conv.name)}
			<div class="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[7rem_1fr]">
				<dt class="min-w-0">
					<span class="font-mono text-base font-semibold text-gray-900 dark:text-white"
						>{conv.mark}</span
					>
					<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{conv.name}</span>
				</dt>
				<dd class="m-0 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
					{conv.rule}
					{#if conv.exampleSlug}
						<a href={resolve(`/examples/${conv.exampleSlug}`)} class="{linkClass} ml-1"
							>{conv.exampleLabel}</a
						>.
					{/if}
				</dd>
			</div>
		{/each}
	</dl>

	<div class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
		<p class="max-w-prose text-base leading-relaxed">
			Build your own interlinear gloss with these labels: stack a source line, a gloss line, and a
			translation, then draw the alignment and export it.
		</p>
		<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
			<a href={resolve('/')} class={ctaClass}>Open the editor</a>
			<a href={resolve('/examples')} class="{linkClass} text-sm">Browse examples →</a>
		</div>
	</div>

	<SiteFooter />
</main>
