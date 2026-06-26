<script lang="ts">
	import GuideLayout from '$lib/components/guide/GuideLayout.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { guideArticle } from '$lib/seo/structured-data.js';
	import { GUIDE_LINK, GUIDE_H2, GUIDE_P, GUIDE_CTA } from '$lib/guide/ui.js';

	const PATH = '/guide/how-to-gloss-a-conlang';
	const TITLE = 'How to gloss your conlang';
	const SEO_TITLE = 'How to Gloss Your Conlang (Leipzig-Style, With a Free Tool)';
	const DESCRIPTION =
		'Gloss a constructed language the way grammars do: the three lines, choosing and documenting your abbreviations, a custom script font, an IPA tier, and clean exports.';

	const schema = [guideArticle({ headline: TITLE, description: DESCRIPTION, path: PATH })];

	const toc = [
		{ id: 'why', label: 'Why gloss a conlang' },
		{ id: 'lines', label: 'The same three lines' },
		{ id: 'labels', label: 'Choose your labels' },
		{ id: 'script', label: 'Custom script and font' },
		{ id: 'ipa', label: 'Add an IPA tier' },
		{ id: 'export', label: 'Export and share' }
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
		A constructed language is easier to share and to keep consistent when you gloss it the way
		grammars gloss natural languages. The Leipzig conventions work just as well for an invented
		language, and a visual tool removes the markup that usually makes glossing tedious.
	{/snippet}

	<p class={GUIDE_P}>
		For a full worked example, see the
		<a href="/examples/conlang-custom-font-interlinear-gloss" class={GUIDE_LINK}
			>conlang custom-font gloss</a
		>: an invented language in its own script, glossed with morpheme labels, an IPA tier, and an
		English translation. The steps below explain how to build the same thing.
	</p>

	<h2 id="why" class={GUIDE_H2}>Why gloss your conlang</h2>
	<p class={GUIDE_P}>
		A gloss documents how your morphology works, so a reader on a forum or in your own grammar can
		see what each affix does. It also keeps you honest: when you write out the morphemes and their
		labels, gaps and inconsistencies in the grammar show up. The same gloss doubles as a teaching
		aid when you introduce the language to other people.
	</p>

	<h2 id="lines" class={GUIDE_H2}>The same three lines apply</h2>
	<p class={GUIDE_P}>
		Stack the source line in your language, a gloss line under it, and a free translation below.
		Mark morpheme boundaries with a hyphen and keep the hyphen counts equal between the source and
		the gloss. If a single morpheme needs two English words, join them with a period, as
		<a href="/guide/leipzig-glossing-rules" class={GUIDE_LINK}>the Leipzig rules</a> describe. The
		<a href="/examples/lojban-sumti-interlinear-gloss" class={GUIDE_LINK}>Lojban example</a> shows a constructed
		language glossed this way.
	</p>

	<h2 id="labels" class={GUIDE_H2}>Choose and document your labels</h2>
	<p class={GUIDE_P}>
		Reuse standard labels wherever your language has a familiar category: NOM, ACC, PST, PL, and the
		rest. Start from the
		<a href="/guide/glossing-abbreviations" class={GUIDE_LINK}>glossing abbreviations cheat sheet</a
		>. When your language has a category the standard set does not cover, invent a short label in
		the same style and list it once so readers can follow. Consistency matters more than picking the
		perfect tag.
	</p>

	<h2 id="script" class={GUIDE_H2}>Custom script and font</h2>
	<p class={GUIDE_P}>
		If your conlang uses an invented script or characters a default font lacks, upload a font file
		under Settings → Fonts and set it per line. The source line can carry your script while the
		gloss and translation stay in a readable Latin font. This is the part that markup tools handle
		poorly, and a visual editor makes it routine. The
		<a href="/examples/conlang-custom-font-interlinear-gloss" class={GUIDE_LINK}
			>custom-font example</a
		> shows a constructed language in its own alphabet.
	</p>

	<h2 id="ipa" class={GUIDE_H2}>Add an IPA tier</h2>
	<p class={GUIDE_P}>
		Many conlang glosses add a pronunciation line in IPA between the source and the gloss. Add it as
		another line, then hide the connectors between the source, IPA, and gloss so the block reads as
		one unit and links only point to the translation. The
		<a href="/examples/turkish-interlinear-gloss-ipa" class={GUIDE_LINK}>Turkish IPA example</a> shows
		that four-line layout.
	</p>

	<h2 id="export" class={GUIDE_H2}>Export and share</h2>
	<p class={GUIDE_P}>
		Export the finished gloss as PNG or SVG for a wiki or a post, or as PDF for a printed grammar.
		You can also copy a share link that encodes the whole layout, so anyone who opens it sees the
		same diagram. For r/conlangs and similar venues, an exported image reads better than retyped
		plain text.
	</p>

	<div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
		<a href="/" class={GUIDE_CTA}>Open the editor</a>
		<a href="/guide/leipzig-glossing-rules" class="{GUIDE_LINK} text-sm">Leipzig Glossing Rules →</a
		>
		<a href="/examples" class="{GUIDE_LINK} text-sm">Browse examples →</a>
	</div>
</GuideLayout>
