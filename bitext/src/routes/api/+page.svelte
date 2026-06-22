<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ALIGNER_SITE_HOST } from '$lib/brand.js';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

	const TITLE = 'API';
	const DESCRIPTION =
		'Word Aligner API: generate a pre-filled alignment link by posting text lines and optional word-pair data. Free, no auth required.';

	const canonical = $derived(page.url.origin + page.url.pathname);
	const apiBase = $derived(page.url.origin);

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';

	const headingClass = 'font-heading mt-10 text-xl font-semibold text-gray-900 dark:text-white';

	const codeClass =
		'rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200';

	const preClass =
		'overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200';
</script>

<svelte:head>
	<title>{TITLE} · Word Aligner</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{TITLE} · Word Aligner" />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
</svelte:head>

<main
	class="mx-auto w-full max-w-3xl min-w-0 px-4 pt-4 pb-16 leading-relaxed text-gray-700 sm:px-6 md:pt-6 md:pb-20 dark:text-gray-300"
>
	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
		<nav class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
			<a href={resolve('/')} class={linkClass}>← Word Aligner</a>
			<span class="text-gray-400 dark:text-gray-500" aria-hidden="true">·</span>
			<a href={resolve('/about')} class={linkClass}>About</a>
		</nav>
	</header>

	<h1 class="font-heading text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
		API
	</h1>
	<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
		One endpoint: send text lines and optional alignment pairs, get back a shareable Word Aligner
		URL. No API key, no sign-up.
	</p>
	<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
		OpenAPI schema: <a href={resolve('/api/align/openapi.json')} class={linkClass}
			>/api/align/openapi.json</a
		>
	</p>

	<nav
		class="mt-8 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800/60"
		aria-label="On this page"
	>
		<p class="m-0 font-medium text-gray-900 dark:text-white">On this page</p>
		<ul class="mt-2 list-none space-y-1 p-0">
			<li>
				<a
					href="#post-api-align"
					class="block py-1 text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>POST /api/align</a
				>
			</li>
			<li>
				<a
					href="#get-api-align"
					class="block py-1 text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>GET /api/align (lines only)</a
				>
			</li>
			<li>
				<a
					href="#word-indices"
					class="block py-1 text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>Word indices and tokenization</a
				>
			</li>
			<li>
				<a
					href="#errors"
					class="block py-1 text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>Errors</a
				>
			</li>
		</ul>
	</nav>

	<h2 id="post-api-align" class={headingClass}>POST /api/align</h2>
	<p class="mt-3">
		The main endpoint. Returns a URL to Word Aligner with the given lines and alignment links
		pre-filled.
	</p>

	<h3 class="mt-6 font-semibold text-gray-900 dark:text-white">Request</h3>
	<p class="mt-2 text-sm"><span class={codeClass}>Content-Type: application/json</span></p>

	<div class="mt-4 overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-800/60">
				<tr>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Field</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300"
						>Description</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
				<tr>
					<td class="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">lines</td>
					<td class="px-4 py-2 text-gray-600 dark:text-gray-400">string[] (required)</td>
					<td class="px-4 py-2 text-gray-700 dark:text-gray-300"
						>Text lines, top to bottom. 1–8 lines.</td
					>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">alignments</td>
					<td class="px-4 py-2 text-gray-600 dark:text-gray-400">[int,int,int,int][] (optional)</td>
					<td class="px-4 py-2 text-gray-700 dark:text-gray-300"
						>Word-alignment pairs as <span class={codeClass}>[lineA, wordA, lineB, wordB]</span>. Lines
						A and B must be adjacent (<span class={codeClass}>|A−B| = 1</span>). Indices are 0-based.</td
					>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class="mt-6 font-semibold text-gray-900 dark:text-white">Response</h3>
	<pre class="{preClass} mt-3">{`{ "url": "https://${ALIGNER_SITE_HOST}/?data=..." }`}</pre>

	<h3 class="mt-6 font-semibold text-gray-900 dark:text-white">Example</h3>
	<pre class="{preClass} mt-3">{`curl -X POST ${apiBase}/api/align \\
  -H "Content-Type: application/json" \\
  -d '{
    "lines": ["Hello world", "Bonjour le monde"],
    "alignments": [
      [0, 0, 1, 0],
      [0, 1, 1, 2]
    ]
  }'`}</pre>
	<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
		This links "Hello" → "Bonjour" (word 0 of line 0 to word 0 of line 1) and "world" → "monde"
		(word 1 of line 0 to word 2 of line 1 — "le" is word 1, "monde" is word 2).
	</p>

	<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
		Response:
	</p>
	<pre class="{preClass} mt-2">{`{ "url": "https://${ALIGNER_SITE_HOST}/?data=..." }`}</pre>

	<h2 id="get-api-align" class={headingClass}>GET /api/align</h2>
	<p class="mt-3">
		Simple variant for quick links: pass lines as repeated query parameters. No alignments. Useful
		for opening the editor pre-filled via a link.
	</p>

	<pre class="{preClass} mt-4">{`GET /api/align?lines=Hello+world&lines=Bonjour+le+monde`}</pre>

	<p class="mt-3 text-sm">
		<strong class="text-gray-900 dark:text-white">Parameters:</strong>
		<span class={codeClass}>lines</span> — repeat for each line (1–8).
	</p>

	<h2 id="word-indices" class={headingClass}>Word indices and tokenization</h2>
	<p class="mt-3">
		Words are counted from 0, left to right as written. The default split rules: whitespace always
		splits, and the characters <span class={codeClass}>.</span>
		<span class={codeClass}>-</span>
		<span class={codeClass}>|</span> also create word boundaries. Punctuation is not split into
		separate tokens by default.
	</p>
	<p class="mt-3">Example — <em>"Bonjour le monde"</em>:</p>
	<div class="mt-3 overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-800/60">
				<tr>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Index</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Word</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
				<tr>
					<td class="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">0</td>
					<td class="px-4 py-2 text-gray-700 dark:text-gray-300">Bonjour</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">1</td>
					<td class="px-4 py-2 text-gray-700 dark:text-gray-300">le</td>
				</tr>
				<tr>
					<td class="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">2</td>
					<td class="px-4 py-2 text-gray-700 dark:text-gray-300">monde</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
		If you are unsure about word counts, use the GET endpoint without alignments first — open the
		returned URL and count the word boxes in the editor.
	</p>

	<h2 id="errors" class={headingClass}>Errors</h2>
	<p class="mt-3">
		Errors return HTTP 400 with a JSON body:
	</p>
	<pre class="{preClass} mt-3">{`{ "error": "alignments[0]: lines 0 and 2 are not adjacent" }`}</pre>

	<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
		All endpoints support CORS (<span class={codeClass}>Access-Control-Allow-Origin: *</span>).
	</p>

	<SiteFooter class="mt-12" />
</main>
