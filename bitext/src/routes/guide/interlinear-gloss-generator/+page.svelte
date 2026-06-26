<script lang="ts">
	import GuideLayout from '$lib/components/guide/GuideLayout.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { guideArticle } from '$lib/seo/structured-data.js';
	import { GUIDE_LINK, GUIDE_H2, GUIDE_P, GUIDE_UL, GUIDE_CTA } from '$lib/guide/ui.js';

	const PATH = '/guide/interlinear-gloss-generator';
	const TITLE = 'Interlinear gloss generator';
	const SEO_TITLE = 'Interlinear Gloss Generator, Free and Online';
	const DESCRIPTION =
		'A free online interlinear gloss generator: stack source, gloss, IPA, and translation lines, draw word alignment, and export PNG, SVG, or PDF. No signup, runs in your browser.';

	const schema = [guideArticle({ headline: TITLE, description: DESCRIPTION, path: PATH })];

	const toc = [
		{ id: 'how', label: 'How it works' },
		{ id: 'features', label: 'What it does' },
		{ id: 'standards', label: 'Leipzig conventions' },
		{ id: 'examples', label: 'On real languages' },
		{ id: 'alternatives', label: 'Compared to markup' }
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
		{SITE_NAME} is a free interlinear gloss generator that runs in your browser. Stack a source line,
		a gloss, an optional IPA tier, and a translation, draw the word alignment, and export a clean diagram.
		There is no signup, and your text stays in the browser unless you choose to share it.
	{/snippet}

	<h2 id="how" class={GUIDE_H2}>How it works</h2>
	<p class={GUIDE_P}>Building a gloss takes four steps:</p>
	<ul class={GUIDE_UL}>
		<li>
			Add your lines: the source text, a gloss, and a free translation, plus IPA if you want it.
		</li>
		<li>Mark morpheme boundaries with a hyphen or another split character you choose.</li>
		<li>Click tokens to draw colored links between the words that correspond.</li>
		<li>Export the result as PNG, SVG, PDF, or HTML, or copy a share link.</li>
	</ul>

	<h2 id="features" class={GUIDE_H2}>What it does</h2>
	<p class={GUIDE_P}>
		Each line has its own font, size, spacing, and optional right-to-left layout, so you can mix
		scripts in one diagram. You can hide the connectors between adjacent lines while keeping the
		links in the data, which is how a tight gloss-and-source block reads as one unit. Colors group
		many-to-one correspondences, and palettes adjust how links and tokens are colored. Custom fonts
		upload under Settings → Fonts for invented or less common scripts. Finished diagrams export to
		PNG, SVG, PDF, and self-contained HTML, and a share link encodes the whole layout. There is also
		an <a href="/api" class={GUIDE_LINK}>API</a> for generating alignment URLs programmatically.
	</p>

	<h2 id="standards" class={GUIDE_H2}>It follows Leipzig conventions</h2>
	<p class={GUIDE_P}>
		The tool is built around the standard way linguists write glosses. Hyphens align morphemes, a
		period joins one-to-many correspondences, and grammatical labels follow the usual set. See the
		<a href="/guide/leipzig-glossing-rules" class={GUIDE_LINK}>Leipzig Glossing Rules</a> for the
		conventions and the
		<a href="/guide/glossing-abbreviations" class={GUIDE_LINK}>abbreviations cheat sheet</a> for the
		labels. If you are new to glossing, start with
		<a href="/guide/how-to-read-an-interlinear-gloss" class={GUIDE_LINK}
			>how to read an interlinear gloss</a
		>.
	</p>

	<h2 id="examples" class={GUIDE_H2}>See it on real languages</h2>
	<p class={GUIDE_P}>
		The
		<a href="/examples" class={GUIDE_LINK}>example gallery</a> covers case stacking, reduplication, zero
		morphemes, right-to-left scripts, and constructed languages, each as a finished diagram you can open
		in the editor and change. They double as templates for your own work, whether that is a handout, a
		grammar, a conlang post, or a slide.
	</p>

	<h2 id="alternatives" class={GUIDE_H2}>Compared to markup tools</h2>
	<p class={GUIDE_P}>
		Glossing in a word processor means fighting tab stops, and LaTeX packages or JavaScript
		libraries mean writing markup and compiling it. Those tools work, and some people prefer them. A
		visual editor trades the markup for direct manipulation: you see the alignment as you build it,
		mixed scripts and custom fonts are routine, and the export is a finished image rather than a
		build step. For a conlang in an invented script, that difference is the point, which the
		<a href="/guide/how-to-gloss-a-conlang" class={GUIDE_LINK}>conlang glossing guide</a> covers.
	</p>

	<div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
		<a href="/" class={GUIDE_CTA}>Open the editor</a>
		<a href="/examples" class="{GUIDE_LINK} text-sm">Browse examples →</a>
	</div>
</GuideLayout>
