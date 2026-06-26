<script lang="ts">
	import GuideLayout from '$lib/components/guide/GuideLayout.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { guideArticle } from '$lib/seo/structured-data.js';
	import { GUIDE_LINK, GUIDE_H2, GUIDE_P, GUIDE_UL, GUIDE_CTA } from '$lib/guide/ui.js';

	const PATH = '/guide/leipzig-glossing-rules';
	const TITLE = 'Leipzig Glossing Rules explained';
	const SEO_TITLE = 'Leipzig Glossing Rules Explained, With Examples';
	const DESCRIPTION =
		'A plain-language guide to the Leipzig Glossing Rules: the three lines, hyphen alignment, category labels, and the marks for one-to-many, reduplication, zero, and clitics.';

	const schema = [guideArticle({ headline: TITLE, description: DESCRIPTION, path: PATH })];

	const toc = [
		{ id: 'three-lines', label: 'The three lines' },
		{ id: 'align', label: 'Align the words' },
		{ id: 'morphemes', label: 'Hyphen per morpheme' },
		{ id: 'labels', label: 'Category labels' },
		{ id: 'one-to-many', label: 'One form, many meanings' },
		{ id: 'special-marks', label: 'Special marks' },
		{ id: 'clitics', label: 'Clitics' },
		{ id: 'start', label: 'Gloss it yourself' }
	];
</script>

<GuideLayout
	path={PATH}
	title={TITLE}
	seoTitle={SEO_TITLE}
	description={DESCRIPTION}
	crumbs={[
		{ name: SITE_NAME, path: '/' },
		{ name: 'Guides', path: '/guide' },
		{ name: TITLE, path: PATH }
	]}
	extraSchema={schema}
	{toc}
>
	{#snippet lede()}
		The Leipzig Glossing Rules are the shared standard for writing interlinear morpheme-by-morpheme
		glosses. They were drafted by Bernard Comrie, Martin Haspelmath, and Balthasar Bickel at the Max
		Planck Institute for Evolutionary Anthropology and the University of Leipzig, and most grammars
		and journals follow them. This guide covers the rules you will use most, each with an example.
	{/snippet}

	<h2 id="three-lines" class={GUIDE_H2}>The three lines</h2>
	<p class={GUIDE_P}>
		An interlinear gloss has three lines. The top line is the object language, the text you are
		analyzing. The middle line is the gloss, which labels each piece of the text. The bottom line is
		a free translation in running English. The first two lines stay tightly aligned; the translation
		reads naturally and sits in quotation marks.
	</p>

	<h2 id="align" class={GUIDE_H2}>Align the words</h2>
	<p class={GUIDE_P}>
		Each word in the object line sits directly above its gloss, lined up at the left edge. A reader
		should be able to drop straight down from any word to the label that explains it. In a visual
		editor this happens automatically, because each word is its own box and the gloss box sits under
		it.
	</p>

	<h2 id="morphemes" class={GUIDE_H2}>One hyphen per morpheme boundary</h2>
	<p class={GUIDE_P}>
		When a word splits into morphemes, separate them with hyphens in the object line, and use the
		same number of hyphens in the gloss. So a word with two hyphens is glossed with two hyphens, and
		every piece has a partner. The Turkish
		<a href="/examples/turkish-ablative-interlinear-gloss" class={GUIDE_LINK}
			>oda-dan glossed room-ABL</a
		> keeps one hyphen on each side. The matching count is what makes the gloss readable.
	</p>

	<h2 id="labels" class={GUIDE_H2}>Grammatical category labels</h2>
	<p class={GUIDE_P}>
		Grammatical morphemes get a short label rather than a translation. Case, tense, person, and
		number are written as abbreviations, traditionally in small capitals: NOM for nominative, PST
		for past, 1SG for first-person singular. Lexical morphemes keep a plain translation, like
		“house” or “run”. Person, number, and gender combine without periods, so first-person singular
		is 1SG, not 1.SG.
	</p>
	<p class={GUIDE_P}>
		The full set of common labels lives on the
		<a href="/guide/glossing-abbreviations" class={GUIDE_LINK}>glossing abbreviations cheat sheet</a
		>.
	</p>

	<h2 id="one-to-many" class={GUIDE_H2}>One form, several meanings</h2>
	<p class={GUIDE_P}>
		Sometimes one morpheme answers to several English words or several grammatical meanings. Join
		them with a period so the gloss still counts as one piece. The Turkish verb
		<a href="/examples/turkish-one-to-many-morpheme-gloss" class={GUIDE_LINK}
			>çık glossed come.out</a
		>
		uses a period because English needs two words for one stem. The same period appears inside a label
		like PST.FEM when one ending carries both meanings at once.
	</p>

	<h2 id="special-marks" class={GUIDE_H2}>Reduplication, zero, and stem changes</h2>
	<p class={GUIDE_P}>A few more marks handle the cases a plain hyphen cannot:</p>
	<ul class={GUIDE_UL}>
		<li>
			A tilde marks reduplication, a copied syllable or stem, as in the
			<a href="/examples/tagalog-reduplication-interlinear" class={GUIDE_LINK}
				>Tagalog bi~bili glossed IPFV~buy</a
			>.
		</li>
		<li>
			An overt ø stands for a morpheme that has meaning but no sound, as in the
			<a href="/examples/latin-zero-morpheme-gloss" class={GUIDE_LINK}
				>Latin puer-ø glossed boy-NOM</a
			>.
		</li>
		<li>
			A backslash marks a category shown by a change inside the word, as in the
			<a href="/examples/german-umlaut-plural-gloss" class={GUIDE_LINK}>German father\PL</a> umlaut plural.
		</li>
		<li>Angle brackets mark an infix, a morpheme inserted inside the stem.</li>
	</ul>

	<h2 id="clitics" class={GUIDE_H2}>Clitics</h2>
	<p class={GUIDE_P}>
		A clitic is a small word that leans on a neighbor, like the French object pronoun in
		<a href="/examples/french-clitic-pronoun-gloss" class={GUIDE_LINK}>Je t’aime</a>. Where a hyphen
		marks a piece inside a word, an equals sign marks a clitic boundary, so the clitic gets its own
		gloss while staying attached to its host.
	</p>

	<h2 id="start" class={GUIDE_H2}>Gloss it yourself</h2>
	<p class={GUIDE_P}>
		Stack a source line, a gloss line, and a translation, mark your morpheme boundaries, then draw
		the alignment and export it as PNG, SVG, or PDF for a paper, a grammar, or a slide.
	</p>
	<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
		<a href="/" class={GUIDE_CTA}>Open the editor</a>
		<a href="/guide/how-to-read-an-interlinear-gloss" class="{GUIDE_LINK} text-sm"
			>How to read a gloss →</a
		>
		<a href="/examples" class="{GUIDE_LINK} text-sm">Browse examples →</a>
	</div>
</GuideLayout>
