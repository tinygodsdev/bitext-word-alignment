<script lang="ts">
	import GuideLayout from '$lib/components/guide/GuideLayout.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { guideArticle } from '$lib/seo/structured-data.js';
	import { GUIDE_LINK, GUIDE_H2, GUIDE_P, GUIDE_UL, GUIDE_CTA } from '$lib/guide/ui.js';

	const PATH = '/guide/how-to-read-an-interlinear-gloss';
	const TITLE = 'How to read an interlinear gloss';
	const SEO_TITLE = 'How to Read an Interlinear Gloss (Beginner’s Guide)';
	const DESCRIPTION =
		'A beginner’s guide to reading interlinear glosses: the three lines, what the small-capital labels mean, and how the hyphens line each morpheme up with its translation.';

	const schema = [guideArticle({ headline: TITLE, description: DESCRIPTION, path: PATH })];

	const toc = [
		{ id: 'anatomy', label: 'The three lines' },
		{ id: 'steps', label: 'Read it in passes' },
		{ id: 'labels', label: 'Small-capital labels' },
		{ id: 'marks', label: 'Hyphens and marks' },
		{ id: 'practice', label: 'A worked example' }
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
		An interlinear gloss lines a sentence up against a word-by-word analysis, so you can see what
		each part means even in a language you do not speak. Once you know what the three lines and the
		short labels stand for, they are quick to read. Here is how.
	{/snippet}

	<h2 id="anatomy" class={GUIDE_H2}>The three lines</h2>
	<p class={GUIDE_P}>A standard gloss stacks three lines, top to bottom:</p>
	<ul class={GUIDE_UL}>
		<li>
			<strong class="text-gray-900 dark:text-white">The source line</strong> is the original text, often
			split into morphemes with hyphens.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">The gloss line</strong> labels each piece of the source,
			with plain words for meanings and short tags for grammar.
		</li>
		<li>
			<strong class="text-gray-900 dark:text-white">The free translation</strong> gives the whole sentence
			in natural English, usually in quotation marks.
		</li>
	</ul>

	<h2 id="steps" class={GUIDE_H2}>Read it in passes</h2>
	<p class={GUIDE_P}>
		Start with the bottom line to learn what the sentence means. Then read the top two lines
		together, word by word, dropping from each source word to the gloss directly under it. The gloss
		tells you which part of the meaning each word carries. The source and gloss stay aligned, so
		your eye can move straight down at any point.
	</p>

	<h2 id="labels" class={GUIDE_H2}>What the small-capital labels mean</h2>
	<p class={GUIDE_P}>
		Grammar is written in short labels rather than full words. NOM marks a subject, PST marks past
		tense, 1SG marks a first-person singular. Plain words like “house” or “run” are lexical
		meanings; the labels are grammatical categories. You do not need to memorize them: keep the list
		open while you read.
	</p>
	<p class={GUIDE_P}>
		The
		<a href="/guide/glossing-abbreviations" class={GUIDE_LINK}>glossing abbreviations cheat sheet</a
		> explains the common ones with plain notes.
	</p>

	<h2 id="marks" class={GUIDE_H2}>Hyphens and a few marks</h2>
	<p class={GUIDE_P}>
		A hyphen separates morphemes, and the gloss line uses the same number of hyphens as the source,
		so every piece has a partner. A period inside a gloss joins meanings that share one form, as in
		come.out or PST.FEM. A tilde marks a copied syllable, and an overt ø marks a piece that has
		meaning but no sound. The
		<a href="/guide/glossing-abbreviations#notation" class={GUIDE_LINK}>notation marks</a> section lists
		them with examples.
	</p>

	<h2 id="practice" class={GUIDE_H2}>A worked example</h2>
	<p class={GUIDE_P}>
		The
		<a href="/examples/turkish-ablative-interlinear-gloss" class={GUIDE_LINK}
			>Turkish sentence Odadan hızlı çıktım</a
		>
		walks through one clause token by token: oda-dan is room-ABL, hız-lı is speed-COM, and çık-tı-m is
		exit-PFV-1SG. Reading it is good practice, because three short Turkish words answer to five English
		ones, and the connectors show which goes with which.
	</p>

	<div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
		<a href="/examples" class={GUIDE_CTA}>Browse examples</a>
		<a href="/guide/leipzig-glossing-rules" class="{GUIDE_LINK} text-sm">Leipzig Glossing Rules →</a
		>
		<a href="/" class="{GUIDE_LINK} text-sm">Open the editor →</a>
	</div>
</GuideLayout>
