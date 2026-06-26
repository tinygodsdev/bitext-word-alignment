<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ALIGNER_DISPLAY_NAME } from '$lib/brand.js';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import StructuredData from '$lib/components/seo/StructuredData.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { breadcrumbList, guideArticle } from '$lib/seo/structured-data.js';

	const PATH = '/skill';
	const TITLE = 'Agent skill';
	const SEO_TITLE = 'Word Aligner Agent Skill for Claude, ChatGPT, and Other Assistants';
	const DESCRIPTION =
		'Install the Word Aligner skill so your AI assistant turns a plain request into a shareable word alignment or interlinear gloss diagram. Free, no API key.';

	const REPO = 'https://github.com/tinygodsdev/bitext-word-alignment';
	const SKILL_DIR = `${REPO}/tree/main/word-aligner-skill`;
	const SKILL_MD = `${REPO}/blob/main/word-aligner-skill/SKILL.md`;

	const canonical = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(`${page.url.origin}/api/og`);

	const structuredData = [
		breadcrumbList([
			{ name: SITE_NAME, path: '/' },
			{ name: TITLE, path: PATH }
		]),
		guideArticle({ headline: 'Word Aligner agent skill', description: DESCRIPTION, path: PATH })
	];

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
	const headingClass = 'font-heading mt-10 text-xl font-semibold text-gray-900 dark:text-white';
	const subheadingClass = 'mt-6 font-semibold text-gray-900 dark:text-white';
	const pClass = 'mt-3 max-w-prose text-base leading-relaxed';
	const ulClass = 'mt-3 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300';
	const codeClass =
		'rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200';
	const preClass =
		'mt-3 overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200';
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
</svelte:head>

<StructuredData data={structuredData} />

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<nav class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
			<a href={resolve('/')} class={linkClass}>← {ALIGNER_DISPLAY_NAME}</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/api')} class={linkClass}>API</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/examples')} class={linkClass}>Examples</a>
		</nav>
	</header>

	<h1
		class="font-heading text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
	>
		Word Aligner agent skill
	</h1>
	<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
		Install the skill once, then ask your assistant in plain language. It translates, works out
		which words correspond, calls the {SITE_NAME} API, and hands back a shareable diagram link. No API
		key, no sign-up.
	</p>

	<nav
		class="mt-8 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800/60"
		aria-label="On this page"
	>
		<p class="m-0 font-medium text-gray-900 dark:text-white">On this page</p>
		<ul class="mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
			{#each [['#what', 'What it is'], ['#ask', 'What you can ask'], ['#install', 'Install'], ['#how', 'How it works'], ['#get', 'Get the skill']] as [href, label] (href)}
				<li>
					<a
						{href}
						class="text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
						>{label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<h2 id="what" class={headingClass}>What it is</h2>
	<p class={pClass}>
		The skill is a small package that teaches an AI assistant how to use {SITE_NAME}. It holds a
		<a href={SKILL_MD} class={linkClass} target="_blank" rel="noopener noreferrer">SKILL.md</a> with instructions
		and worked patterns, an API reference, and an OpenAPI schema. Any assistant that can follow instructions
		and make an HTTP request can run it, so the same package works across Claude, ChatGPT, and custom
		agents.
	</p>

	<h2 id="ask" class={headingClass}>What you can ask</h2>
	<p class={pClass}>Once it is installed, requests like these produce a diagram link:</p>
	<ul class={ulClass}>
		<li>“Translate ‘я хочу спать’ into English and show the word alignment.”</li>
		<li>“Make an interlinear gloss of this Latin sentence.”</li>
		<li>“Align this Hebrew verse with its English translation, right to left.”</li>
		<li>“Show which French words map to which English words in this pair.”</li>
	</ul>
	<p class={pClass}>
		The assistant returns a {SITE_NAME} URL you can open, edit, or export as PNG, SVG, or PDF.
	</p>

	<h2 id="install" class={headingClass}>Install</h2>

	<h3 id="install-claude" class={subheadingClass}>Claude</h3>
	<p class={pClass}>
		Add it as an Agent Skill. In Claude Code, put the
		<span class={codeClass}>word-aligner-skill/</span> folder in your skills directory (<span
			class={codeClass}>~/.claude/skills/</span
		>
		for personal use, or <span class={codeClass}>.claude/skills/</span> in a project). In the Claude
		apps that support skills, upload
		<a href="/word-aligner-skill.zip" class={linkClass} download>word-aligner-skill.zip</a> where custom
		skills are added. As a fallback on any Claude surface, paste the contents of SKILL.md into your project
		instructions.
	</p>

	<h3 id="install-chatgpt" class={subheadingClass}>ChatGPT</h3>
	<p class={pClass}>
		Build a Custom GPT. Add an Action from the OpenAPI schema at
		<a href={resolve('/api/align/openapi.json')} class={linkClass}>/api/align/openapi.json</a>, then
		paste SKILL.md into the instructions so the model knows how to count word indices and lay out a
		gloss. No authentication is needed.
	</p>

	<h3 id="install-other" class={subheadingClass}>Any other agent</h3>
	<p class={pClass}>
		The API is open and needs no key, so any tool-using agent can call it. Point your framework at
		<span class={codeClass}>POST /api/align</span> with the
		<a href={SKILL_MD} class={linkClass} target="_blank" rel="noopener noreferrer">SKILL.md</a>
		guidance and the
		<a href={resolve('/api')} class={linkClass}>full API reference</a>. The package also ships an
		<span class={codeClass}>agents/openai.yaml</span> manifest for OpenAI-style agents.
	</p>

	<h2 id="how" class={headingClass}>How it works</h2>
	<p class={pClass}>
		Under the hood the skill calls one endpoint, <span class={codeClass}>POST /api/align</span>,
		with the text lines and the word pairs that link them, and gets back a URL:
	</p>
	<pre class={preClass}>{`{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0, 0, 1, 0], [0, 1, 1, 1], [0, 1, 1, 2]]
}`}</pre>
	<p class={pClass}>
		The hard part for a model is counting word indices and laying out a gloss tier, which is what
		SKILL.md spells out. The
		<a href={resolve('/api')} class={linkClass}>API reference</a> covers every parameter: per-line fonts
		and RTL, palettes and line style, and pair-level gap and connector control.
	</p>

	<h2 id="get" class={headingClass}>Get the skill</h2>
	<ul class={ulClass}>
		<li>
			<a href="/word-aligner-skill.zip" class={linkClass} download
				>Download word-aligner-skill.zip</a
			>
		</li>
		<li>
			<a href={SKILL_DIR} class={linkClass} target="_blank" rel="noopener noreferrer"
				>Browse the source on GitHub</a
			>
		</li>
		<li>
			<a href={resolve('/api')} class={linkClass}>Read the API reference</a>
		</li>
	</ul>

	<div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
		<a href="/word-aligner-skill.zip" class={ctaClass} download>Download the skill</a>
		<a href={resolve('/')} class="{linkClass} text-sm">Open the editor →</a>
	</div>

	<SiteFooter class="mt-12" />
</main>
