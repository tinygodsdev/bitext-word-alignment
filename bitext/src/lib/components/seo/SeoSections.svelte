<script lang="ts">
	import { GUIDES } from '$lib/guide/catalog.js';

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
</script>

<section
	class="mt-10 w-full max-w-none space-y-3 leading-relaxed text-gray-700 dark:text-gray-300"
	aria-labelledby="seo-sections"
>
	<h2 id="seo-sections" class="sr-only font-heading">Guides</h2>

	<h3 class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Why a visual beats plain text
	</h3>
	<p>
		A plain word-by-word translation under each line breaks down the moment the translation changes
		word order, uses one word where the source uses three, or collapses several source words into a
		single morpheme. Curved connectors solve all three cases: lines can cross, fan out from one word
		to several, or converge from several words onto one. That is why a bilingual sentence alignment
		is easier to read than an interlinear row when you care about structure, not only meaning.
	</p>

	<h3 class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Great for language learners and teachers
	</h3>
	<p>
		Learners see at a glance why a translation says what it does — which source word became which
		target word, which words are dropped, and where the target language moves things around.
		Teachers can build handouts, slides, or flashcards by exporting PNG or SVG and embed the
		finished diagram into a lesson without retyping anything.
	</p>

	<h3 class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Great for conlangs, glosses, and linguistics posts
	</h3>
	<p>
		For conlangers, the visualizer is a lightweight way to show how a constructed language maps onto
		English in a specific example. Add extra lines for
		<strong class="font-medium text-gray-900 dark:text-white">glosses or IPA</strong> (and stack
		them next to the sentences they annotate), tune how text splits into word-sized boxes under
		<strong class="font-medium text-gray-900 dark:text-white">Settings → Tokens</strong>, and export
		the result for a blog post, a forum thread, or a conlang community share. The
		<a href="/guide/how-to-gloss-a-conlang" class={linkClass}>conlang glossing guide</a> walks through
		custom scripts, an IPA tier, and exports.
	</p>

	<h3 class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Word alignment vs interlinear translation
	</h3>
	<p>
		Interlinear translators place a translation directly under each source word. That display is
		compact and great for reading, but it hides reordering — if the translation swaps word order,
		the row underneath lies about which word corresponds to which. Word alignment keeps both
		sentences on their own line and draws connectors between them, so reorderings, splits, and
		merges are obvious.
	</p>

	<h3 class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Word alignment vs parallel text
	</h3>
	<p>
		Parallel text usually means side-by-side bilingual reading — two columns, or a source paragraph
		next to a translated paragraph, meant for studying in long form. This tool is a different job:
		one sentence pair at a time, with explicit connectors showing which tokens correspond.
	</p>

	<h3 class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Glossing guides
	</h3>
	<p>
		New to interlinear glossing or want a refresher on the notation? These guides cover the standard
		and the labels, and link back into the editor.
	</p>
	<ul class="mt-2 list-disc space-y-1 pl-6">
		{#each GUIDES as guide (guide.path)}
			<li>
				<a href={guide.path} class={linkClass}>{guide.title}</a>.
				<span class="text-gray-600 dark:text-gray-400">{guide.blurb}</span>
			</li>
		{/each}
	</ul>

	<h3 class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Use it from your AI assistant
	</h3>
	<p>
		There is an <a href="/skill" class={linkClass}>agent skill</a> that teaches Claude, ChatGPT, or
		a custom agent to build these diagrams from a plain request: ask it to align a translation or
		gloss a sentence, and it returns a shareable link. It runs on the same open
		<a href="/api" class={linkClass}>API</a>, with no key required.
	</p>

	<h3 id="faq" class="font-heading mt-6 text-xl font-semibold text-gray-900 dark:text-white">
		Questions people ask
	</h3>

	<h4 class="font-heading mt-4 text-base font-semibold text-gray-900 dark:text-white">
		What is this kind of tool called?
	</h4>
	<p>
		The formal name is a word alignment visualizer. In everyday language people also call it a
		word-by-word translation tool, an interlinear-style visualizer, or simply a way to see which
		words match in a translation.
	</p>

	<h4 class="font-heading mt-4 text-base font-semibold text-gray-900 dark:text-white">
		Does it handle reordered translations?
	</h4>
	<p>
		Yes. Curved connectors can cross each other freely, so sentences where the target language puts
		the verb, subject, or modifier in a different position still look clean. That is one of the main
		reasons this visualization is useful for language learning.
	</p>

	<h4 class="font-heading mt-4 text-base font-semibold text-gray-900 dark:text-white">
		Can I align phrases, not just single words?
	</h4>
	<p>
		Yes. Each link joins two word-sized boxes on neighboring lines. You can add several links from
		the same word to different partners (one-to-many or many-to-one) by clicking that word again and
		choosing another match on the adjacent row. To treat two written words as a single box—for
		example a fixed expression—use the join character under <strong
			class="font-medium text-gray-900 dark:text-white">Settings → Tokens</strong
		>.
	</p>

	<h4 class="font-heading mt-4 text-base font-semibold text-gray-900 dark:text-white">
		Is this a full machine translator?
	</h4>
	<p>
		No. You type or paste the text yourself—the app does not translate it for you. The value is in
		the visualization and the manual control over which words count as matches.
	</p>

	<h4 class="font-heading mt-4 text-base font-semibold text-gray-900 dark:text-white">
		Can I export the alignment as an image?
	</h4>
	<p>
		Yes. PNG, SVG, PDF, and a self-contained HTML file are all supported, along with a shareable
		link that encodes every line of text, every connector, and your visual settings.
	</p>
</section>
