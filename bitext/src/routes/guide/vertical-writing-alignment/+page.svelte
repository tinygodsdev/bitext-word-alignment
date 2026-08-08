<script lang="ts">
	import GuideLayout from '$lib/components/guide/GuideLayout.svelte';
	import { SITE_NAME } from '$lib/seo/metadata.js';
	import { guideArticle } from '$lib/seo/structured-data.js';
	import { GUIDE_LINK, GUIDE_H2, GUIDE_H3, GUIDE_P, GUIDE_UL, GUIDE_CTA } from '$lib/guide/ui.js';

	const PATH = '/guide/vertical-writing-alignment';
	const TITLE = 'Aligning vertical writing systems';
	const SEO_TITLE = 'Align Vertical Writing Systems: Japanese Tategaki, Chinese, Mongolian';
	const DESCRIPTION =
		'How to build a word alignment diagram for a vertically written script: column layout, stacked versus rotated text, mixing a vertical language with a horizontal translation, and export.';

	const schema = [guideArticle({ headline: TITLE, description: DESCRIPTION, path: PATH })];

	const toc = [
		{ id: 'when', label: 'When to use columns' },
		{ id: 'setup', label: 'Turn on column layout' },
		{ id: 'orientation', label: 'Stacked or rotated' },
		{ id: 'mixing', label: 'Mixing vertical and horizontal' },
		{ id: 'order', label: 'Which column sits where' },
		{ id: 'words', label: 'Splitting text into words' },
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
		Japanese, Chinese, and Mongolian are often written in columns that run top to bottom. Word
		Aligner can stand a whole diagram up the same way, so a vertical text keeps its natural shape
		while its translation stays readable beside it.
	{/snippet}

	<p class={GUIDE_P}>
		Two worked examples follow this guide: a
		<a href="/examples/japanese-vertical-writing-tategaki-alignment" class={GUIDE_LINK}
			>Japanese sentence in tategaki</a
		>
		with an English translation, and a
		<a href="/examples/traditional-mongolian-vertical-alignment" class={GUIDE_LINK}
			>traditional Mongolian phrase</a
		> with a transliteration tier. Open either one to see the finished result before building your own.
	</p>

	<h2 id="when" class={GUIDE_H2}>When to use columns</h2>
	<p class={GUIDE_P}>
		Use column layout when the text you are aligning is genuinely written vertically: Japanese
		tategaki, classical and traditional Chinese, traditional Mongolian, Manchu, or Old Uyghur. A
		modern horizontal Japanese sentence does not need it. Neither does a gloss of a vertical text
		that you intend to print sideways.
	</p>
	<p class={GUIDE_P}>
		The choice is per project, not per line. Every line in a diagram shares one direction, because a
		connector between two lines needs a single consistent gap to cross and the spacing between a
		pair of lines is one number. Within that shared direction, each line still decides how its own
		characters are set.
	</p>

	<h2 id="setup" class={GUIDE_H2}>Turn on column layout</h2>
	<p class={GUIDE_P}>
		Open the <strong>Style</strong> tab. The first section is <strong>Layout</strong>. Set
		<strong>Direction</strong> to <strong>Columns</strong>.
	</p>
	<p class={GUIDE_P}>
		The diagram turns a quarter turn: lines become columns standing side by side, words run down
		each column, and the connectors run sideways between columns. A list of your lines appears
		underneath, headed <strong>Stack characters</strong>. Tick the line whose script is written
		vertically.
	</p>
	<p class={GUIDE_P}>
		Leave the translation line unticked. Its words then stay horizontal and sit one below another as
		whole boxes, which keeps them readable. Ticking a Latin line stacks it letter by letter, which
		is rarely what you want.
	</p>

	<h2 id="orientation" class={GUIDE_H2}>Stacked or rotated</h2>
	<p class={GUIDE_P}>
		Vertical scripts do not all behave the same way, so each line offers three settings. Open a
		line's own settings from the gear beside it in the preview, or from its card in the
		<strong>Text</strong> tab, and look for <strong>Text setting</strong>.
	</p>

	<h3 id="upright" class={GUIDE_H3}>Upright</h3>
	<p class={GUIDE_P}>
		The default. Words render horizontally as usual. In column layout each word becomes an upright
		box and the boxes stack downward. This is what a translation, a gloss, or an IPA tier wants.
	</p>

	<h3 id="stacked" class={GUIDE_H3}>Vertical</h3>
	<p class={GUIDE_P}>
		Characters stack one under another inside each word box. This is correct for Japanese and
		Chinese, where every character occupies its own square and is drawn the same way in horizontal
		and vertical text. The <strong>Stack characters</strong> list in the Style tab is a shortcut to this
		setting.
	</p>

	<h3 id="rotated" class={GUIDE_H3}>Sideways</h3>
	<p class={GUIDE_P}>
		The whole line turns a quarter turn. Traditional Mongolian needs this: its letters join into a
		running vertical stem, and fonts for the script store the glyphs already rotated, expecting
		vertical layout to turn the line back. Stacking Mongolian character by character would break the
		joins.
	</p>
	<p class={GUIDE_P}>
		Sideways also suits a Latin line that you want to read like the spine of a book, which is how
		long runs of Latin usually appear inside vertical Japanese text.
	</p>

	<h2 id="mixing" class={GUIDE_H2}>Mixing a vertical language with a horizontal one</h2>
	<p class={GUIDE_P}>
		A Japanese sentence and its English translation live in the same column diagram. The Japanese
		column stacks its characters. The English column keeps each word horizontal and stacks the
		words. Connectors run across between them, crossing wherever the word order differs.
	</p>
	<p class={GUIDE_P}>
		You cannot give one line columns and another rows in the same diagram. Where you would want
		that, a gloss tier usually does the job: add a line, set it upright, and place it between the
		script and the translation.
	</p>

	<h2 id="order" class={GUIDE_H2}>Which column sits where</h2>
	<p class={GUIDE_P}>
		The first line sits leftmost, the same rule as rows where the first line sits topmost. There is
		no separate direction setting, because reordering the lines already does the job.
	</p>
	<ul class={GUIDE_UL}>
		<li>
			<strong>Japanese and Chinese</strong> read their columns right to left, so put the translation first
			and the script second. The script then lands on the right, where a reader expects it.
		</li>
		<li>
			<strong>Traditional Mongolian</strong> reads its columns left to right, so the script line comes
			first and nothing needs reordering.
		</li>
	</ul>
	<p class={GUIDE_P}>
		Reorder with the arrows beside each column in the preview, or by dragging the line cards in the
		<strong>Text</strong> tab.
	</p>

	<h2 id="words" class={GUIDE_H2}>Splitting text into words</h2>
	<p class={GUIDE_P}>
		Japanese and Chinese are written without spaces, and the tool never guesses word boundaries. You
		decide what counts as one alignment unit, either by typing spaces or by inserting the split
		character from the <strong>Tokens</strong> settings.
	</p>
	<p class={GUIDE_P}>
		Splitting by grammatical unit usually reads best: keep a verb and its inflection together, and
		give particles their own box. A particle with no counterpart in the translation can simply stay
		unlinked, which shows the reader that the other language handles it some other way.
	</p>

	<h2 id="export" class={GUIDE_H2}>Export and share</h2>
	<p class={GUIDE_P}>
		PNG, SVG, PDF, and the self-contained HTML file all reproduce the column layout, including
		stacked and rotated text. A vertical diagram is tall, so the portrait and story presets in the
		<strong>Export</strong> tab fit it better than the wide ones.
	</p>
	<p class={GUIDE_P}>
		The share link carries the direction and each line's text setting, so a link opens on someone
		else's screen exactly as you left it. Uploaded custom fonts are the one gap: their vertical
		forms are not yet shaped in PNG and PDF exports, so a custom font is safest with the Google
		Fonts option or with the SVG export.
	</p>

	<p class={GUIDE_P}>
		<a href="/?example=japanese-vertical-writing-tategaki-alignment" class={GUIDE_CTA}
			>Open the vertical example in the editor</a
		>
	</p>
</GuideLayout>
