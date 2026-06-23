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
	const subheadingClass = 'mt-6 font-semibold text-gray-900 dark:text-white';

	const codeClass =
		'rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200';

	const preClass =
		'overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200';

	const tableClass = 'mt-4 overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700';
	const thClass = 'px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300';
	const tdClass = 'px-4 py-2 font-mono text-gray-800 dark:text-gray-200';
	const tdDescClass = 'px-4 py-2 text-gray-700 dark:text-gray-300';
	const tdTypeClass = 'px-4 py-2 text-gray-600 dark:text-gray-400';
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
			{#each [
				['#post-api-align', 'POST /api/align'],
				['#get-api-align', 'GET /api/align (lines only)'],
				['#line-options', 'Per-line options'],
				['#settings', 'Visual settings'],
				['#pairs', 'Pair controls'],
				['#word-indices', 'Word indices and tokenization'],
				['#errors', 'Errors'],
			] as [href, label]}
				<li>
					<a
						{href}
						class="block py-1 text-gray-700 underline decoration-gray-400/40 underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
						>{label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- ── POST /api/align ─────────────────────────────────────── -->

	<h2 id="post-api-align" class={headingClass}>POST /api/align</h2>
	<p class="mt-3">
		The main endpoint. Returns a URL to Word Aligner with the given lines and alignment links
		pre-filled.
	</p>

	<h3 class={subheadingClass}>Request body</h3>
	<p class="mt-2 text-sm"><span class={codeClass}>Content-Type: application/json</span></p>

	<div class={tableClass}>
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-800/60">
				<tr>
					<th class={thClass}>Field</th>
					<th class={thClass}>Type</th>
					<th class={thClass}>Description</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
				<tr>
					<td class={tdClass}>lines</td>
					<td class={tdTypeClass}>(string | LineInput)[] <em>required</em></td>
					<td class={tdDescClass}
						>Text lines, top to bottom. 1–8 entries. Each may be a plain string or a <a
							href="#line-options"
							class={linkClass}>LineInput</a
						> object with per-line visual options.</td
					>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>alignments</td>
					<td class={tdTypeClass}>[int,int,int,int][] <em>optional</em></td>
					<td class={tdDescClass}
						>Word-alignment pairs as <span class={codeClass}>[lineA, wordA, lineB, wordB]</span>. Lines
						A and B must be adjacent (<span class={codeClass}>|A−B| = 1</span>). Indices are 0-based.
						Multiple pairs can share the same word (many-to-one) — they receive the same color
						automatically.</td
					>
				</tr>
				<tr>
					<td class={tdClass}>settings</td>
					<td class={tdTypeClass}>SettingsInput <em>optional</em></td>
					<td class={tdDescClass}
						>Global visual overrides: palette, line style, thickness, opacity, background. See <a
							href="#settings"
							class={linkClass}>Visual settings</a
						>.</td
					>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>pairs</td>
					<td class={tdTypeClass}>PairInput[] <em>optional</em></td>
					<td class={tdDescClass}
						>Per-pair controls: vertical gap between adjacent lines or hiding connectors for a specific
						pair. See <a href="#pairs" class={linkClass}>Pair controls</a>.</td
					>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class={subheadingClass}>Response</h3>
	<pre class="{preClass} mt-3">{`{ "url": "https://${ALIGNER_SITE_HOST}/?data=..." }`}</pre>

	<h3 class={subheadingClass}>Example — simple alignment</h3>
	<pre class="{preClass} mt-3">{`curl -X POST ${apiBase}/api/align \\
  -H "Content-Type: application/json" \\
  -d '{
    "lines": ["Hello world", "Bonjour le monde"],
    "alignments": [
      [0, 0, 1, 0],
      [0, 1, 1, 1],
      [0, 1, 1, 2]
    ]
  }'`}</pre>
	<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
		Links "Hello" → "Bonjour" (word 0 → word 0). "world" → "le" + "monde" (words 1 and 2) — the
		French article is part of the noun phrase, so both words share the same color.
	</p>

	<h3 class={subheadingClass}>Example — many-to-one (one word maps to several)</h3>
	<pre class="{preClass} mt-3">{`curl -X POST ${apiBase}/api/align \\
  -H "Content-Type: application/json" \\
  -d '{
    "lines": ["Я ходил", "I have been going"],
    "alignments": [
      [0, 0, 1, 0],
      [0, 1, 1, 1],
      [0, 1, 1, 2],
      [0, 1, 1, 3]
    ]
  }'`}</pre>
	<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
		"ходил" (word 1) maps to three English words. All three connections share the same color
		automatically.
	</p>

	<!-- ── GET /api/align ──────────────────────────────────────── -->

	<h2 id="get-api-align" class={headingClass}>GET /api/align</h2>
	<p class="mt-3">
		Simple variant: pass lines as repeated query parameters. No alignments. Useful for opening the
		editor pre-filled via a plain link.
	</p>
	<pre class="{preClass} mt-4">{`GET /api/align?lines=Hello+world&lines=Bonjour+le+monde`}</pre>
	<p class="mt-3 text-sm">
		<strong class="text-gray-900 dark:text-white">Parameter:</strong>
		<span class={codeClass}>lines</span> — repeat for each line (1–8).
	</p>

	<!-- ── Per-line options ────────────────────────────────────── -->

	<h2 id="line-options" class={headingClass}>Per-line options (LineInput)</h2>
	<p class="mt-3">
		Instead of a plain string, each entry in <span class={codeClass}>lines</span> can be an object:
	</p>

	<div class={tableClass}>
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-800/60">
				<tr>
					<th class={thClass}>Field</th>
					<th class={thClass}>Type</th>
					<th class={thClass}>Default</th>
					<th class={thClass}>Description</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
				<tr>
					<td class={tdClass}>text</td>
					<td class={tdTypeClass}>string <em>required</em></td>
					<td class={tdTypeClass}>—</td>
					<td class={tdDescClass}>Line text.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>font</td>
					<td class={tdTypeClass}>string</td>
					<td class={tdTypeClass}>Inter</td>
					<td class={tdDescClass}
						>Google Fonts family name, e.g. <span class={codeClass}>"Noto Serif"</span>, <span
							class={codeClass}>"Noto Sans Arabic"</span
						>, <span class={codeClass}>"Noto Sans Hebrew"</span>.</td
					>
				</tr>
				<tr>
					<td class={tdClass}>sizePx</td>
					<td class={tdTypeClass}>integer 12–64</td>
					<td class={tdTypeClass}>36</td>
					<td class={tdDescClass}>Text size in px.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>gapPx</td>
					<td class={tdTypeClass}>integer 0–56</td>
					<td class={tdTypeClass}>14</td>
					<td class={tdDescClass}>Horizontal gap between word tokens in px.</td>
				</tr>
				<tr>
					<td class={tdClass}>rtl</td>
					<td class={tdTypeClass}>boolean</td>
					<td class={tdTypeClass}>false</td>
					<td class={tdDescClass}
						>Right-to-left layout. Use for Hebrew, Arabic, Farsi, Urdu, etc. Word indices remain
						0-based left-to-right in logical order.</td
					>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class={subheadingClass}>Example — Hebrew with RTL and custom font</h3>
	<pre class="{preClass} mt-3">{`curl -X POST ${apiBase}/api/align \\
  -H "Content-Type: application/json" \\
  -d '{
    "lines": [
      { "text": "שלום עולם", "rtl": true, "sizePx": 48, "font": "Noto Sans Hebrew" },
      { "text": "Hello world", "sizePx": 40 }
    ],
    "alignments": [
      [0, 0, 1, 0],
      [0, 1, 1, 1]
    ]
  }'`}</pre>

	<!-- ── Visual settings ─────────────────────────────────────── -->

	<h2 id="settings" class={headingClass}>Visual settings (SettingsInput)</h2>
	<p class="mt-3">
		The optional <span class={codeClass}>settings</span> object overrides global visual parameters.
		Unset fields inherit defaults.
	</p>

	<div class={tableClass}>
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-800/60">
				<tr>
					<th class={thClass}>Field</th>
					<th class={thClass}>Values</th>
					<th class={thClass}>Default</th>
					<th class={thClass}>Description</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
				<tr>
					<td class={tdClass}>palette</td>
					<td class={tdTypeClass}
						><span class={codeClass}>pastel</span> <span class={codeClass}>vivid</span>
						<span class={codeClass}>academic</span></td
					>
					<td class={tdTypeClass}>pastel</td>
					<td class={tdDescClass}>Color palette for connection lines and token tints.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>lineStyle</td>
					<td class={tdTypeClass}
						><span class={codeClass}>curved</span> <span class={codeClass}>straight</span></td
					>
					<td class={tdTypeClass}>curved</td>
					<td class={tdDescClass}>Shape of connection lines.</td>
				</tr>
				<tr>
					<td class={tdClass}>lineThickness</td>
					<td class={tdTypeClass}>number 1–8</td>
					<td class={tdTypeClass}>3</td>
					<td class={tdDescClass}>Stroke width of connection lines.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>lineOpacity</td>
					<td class={tdTypeClass}>number 0.2–1</td>
					<td class={tdTypeClass}>1</td>
					<td class={tdDescClass}>Opacity of connection lines.</td>
				</tr>
				<tr>
					<td class={tdClass}>background</td>
					<td class={tdTypeClass}
						><span class={codeClass}>light</span> <span class={codeClass}>dark</span></td
					>
					<td class={tdTypeClass}>light</td>
					<td class={tdDescClass}>Preview background color.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>theme</td>
					<td class={tdTypeClass}
						><span class={codeClass}>light</span> <span class={codeClass}>dark</span></td
					>
					<td class={tdTypeClass}>light</td>
					<td class={tdDescClass}>UI theme (affects token chip color).</td>
				</tr>
				<tr>
					<td class={tdClass}>showNumbers</td>
					<td class={tdTypeClass}>boolean</td>
					<td class={tdTypeClass}>false</td>
					<td class={tdDescClass}>Show line numbers next to each line.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>colorTokensByLink</td>
					<td class={tdTypeClass}>boolean</td>
					<td class={tdTypeClass}>true</td>
					<td class={tdDescClass}>Tint word tokens in the color of their connection.</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class={subheadingClass}>Example — vivid palette, straight lines, dark background</h3>
	<pre class="{preClass} mt-3">{`curl -X POST ${apiBase}/api/align \\
  -H "Content-Type: application/json" \\
  -d '{
    "lines": ["Hello world", "Bonjour le monde"],
    "alignments": [[0, 0, 1, 0], [0, 1, 1, 2]],
    "settings": {
      "palette": "vivid",
      "lineStyle": "straight",
      "background": "dark",
      "theme": "dark",
      "lineThickness": 2
    }
  }'`}</pre>

	<!-- ── Pair controls ───────────────────────────────────────── -->

	<h2 id="pairs" class={headingClass}>Pair controls (PairInput)</h2>
	<p class="mt-3">
		The optional <span class={codeClass}>pairs</span> array lets you adjust the vertical gap between
		specific adjacent line pairs, or hide connectors entirely for a pair (useful when some lines are
		glosses that annotate but do not align to the line above).
	</p>

	<div class={tableClass}>
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-800/60">
				<tr>
					<th class={thClass}>Field</th>
					<th class={thClass}>Type</th>
					<th class={thClass}>Default</th>
					<th class={thClass}>Description</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
				<tr>
					<td class={tdClass}>upper</td>
					<td class={tdTypeClass}>integer <em>required</em></td>
					<td class={tdTypeClass}>—</td>
					<td class={tdDescClass}>0-based index of the upper line.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>lower</td>
					<td class={tdTypeClass}>integer <em>required</em></td>
					<td class={tdTypeClass}>—</td>
					<td class={tdDescClass}>0-based index of the lower line (must equal upper + 1).</td>
				</tr>
				<tr>
					<td class={tdClass}>gapPx</td>
					<td class={tdTypeClass}>integer 12–156</td>
					<td class={tdTypeClass}>120</td>
					<td class={tdDescClass}>Vertical gap between the two lines in px.</td>
				</tr>
				<tr class="bg-gray-50/50 dark:bg-gray-800/20">
					<td class={tdClass}>showConnectors</td>
					<td class={tdTypeClass}>boolean</td>
					<td class={tdTypeClass}>true</td>
					<td class={tdDescClass}
						>When <span class={codeClass}>false</span>, connection lines are not drawn between this pair.
						Alignment data is still encoded.</td
					>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class={subheadingClass}>Example — 3 lines, gloss row with tighter gap and no connectors</h3>
	<pre class="{preClass} mt-3">{`curl -X POST ${apiBase}/api/align \\
  -H "Content-Type: application/json" \\
  -d '{
    "lines": [
      { "text": "Я ходил", "sizePx": 40 },
      { "text": "1SG.NOM PST.IPFV", "sizePx": 22 },
      { "text": "I have been going", "sizePx": 36 }
    ],
    "alignments": [
      [0, 0, 1, 0], [0, 0, 1, 1],
      [0, 1, 1, 2], [0, 1, 1, 3]
    ],
    "pairs": [
      { "upper": 0, "lower": 1, "gapPx": 12, "showConnectors": false },
      { "upper": 1, "lower": 2, "gapPx": 80, "showConnectors": false }
    ]
  }'`}</pre>
	<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
		Gloss is adjacent to source (lines 0–1) with a 12 px gap and hidden arcs — tokens are colored
		but no lines are drawn. Dots in the gloss text are split characters: <span class={codeClass}>"1SG.NOM"</span>
		becomes two tokens (word 0 = <em>1SG</em>, word 1 = <em>NOM</em>). The free translation sits
		below with a larger gap.
	</p>

	<!-- ── Word indices ────────────────────────────────────────── -->

	<h2 id="word-indices" class={headingClass}>Word indices and tokenization</h2>
	<p class="mt-3">
		Words are counted from 0, left to right as written (logical order — even for RTL lines). The
		default split rules: whitespace always splits, and the characters <span class={codeClass}>.</span
		>
		<span class={codeClass}>-</span>
		<span class={codeClass}>|</span> also create word boundaries. Punctuation is not split into separate
		tokens by default.
	</p>
	<p class="mt-3">Example — <em>"Bonjour le monde"</em>:</p>
	<div class={tableClass}>
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-800/60">
				<tr>
					<th class={thClass}>Index</th>
					<th class={thClass}>Word</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
				{#each [['0', 'Bonjour'], ['1', 'le'], ['2', 'monde']] as [idx, word]}
					<tr class={idx === '1' ? 'bg-gray-50/50 dark:bg-gray-800/20' : ''}>
						<td class={tdClass}>{idx}</td>
						<td class="px-4 py-2 text-gray-700 dark:text-gray-300">{word}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
		If you are unsure about word counts, use the GET endpoint without alignments first — open the
		returned URL and count the word boxes in the editor.
	</p>

	<!-- ── Errors ─────────────────────────────────────────────── -->

	<h2 id="errors" class={headingClass}>Errors</h2>
	<p class="mt-3">Errors return HTTP 400 with a JSON body:</p>
	<pre class="{preClass} mt-3">{`{ "error": "alignments[0]: lines 0 and 2 are not adjacent" }`}</pre>
	<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
		All endpoints support CORS (<span class={codeClass}>Access-Control-Allow-Origin: *</span>).
	</p>

	<SiteFooter class="mt-12" />
</main>
