<script lang="ts">
	import SentenceField from './SentenceField.svelte';
	import GlossInputRow from './GlossInputRow.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
</script>

<article class="padding border round medium-elevate" aria-labelledby="editor-heading">
	<h5 id="editor-heading" class="no-margin bottom-margin">Editor</h5>
	<nav class="wrap bottom-margin">
		<div class="max">
			<p class="small-text">
				Select any words on the source line and any on the target line, then press <strong
					>Create link</strong
				>
				or <strong>Enter</strong>. You can select several words on one side to link many-to-one or
				one-to-many. The preview uses the same selection.
			</p>
		</div>
		<button type="button" class="small border" onclick={() => projectStore.loadExample()}>
			Load example
		</button>
	</nav>
	<div class="grid medium-space">
		<div class="s12 m6">
			<SentenceField
				label="Source sentence"
				side="source"
				rawText={projectStore.sourceTextRaw}
				tokens={projectStore.sourceTokens}
				onText={(v) => projectStore.setSourceText(v)}
			/>
		</div>
		<div class="s12 m6">
			<SentenceField
				label="Target sentence"
				side="target"
				rawText={projectStore.targetTextRaw}
				tokens={projectStore.targetTokens}
				onText={(v) => projectStore.setTargetText(v)}
			/>
		</div>
	</div>
	{#if settingsStore.settings.showGloss}
		<div class="grid medium-space top-margin">
			<div class="s12 m6">
				<p class="small-text bottom-margin">Source glosses</p>
				<GlossInputRow
					tokens={projectStore.sourceTokens}
					onGloss={(id, v) => projectStore.setSourceGloss(id, v)}
				/>
			</div>
			<div class="s12 m6">
				<p class="small-text bottom-margin">Target glosses</p>
				<GlossInputRow
					tokens={projectStore.targetTokens}
					onGloss={(id, v) => projectStore.setTargetGloss(id, v)}
				/>
			</div>
		</div>
	{/if}
	<nav class="wrap top-margin">
		{#if selectionStore.needsManualCommit()}
			<button type="button" class="small fill primary" onclick={() => selectionStore.commitLink()}>
				Create link
			</button>
		{/if}
		<button type="button" class="small border" onclick={() => selectionStore.clear()}>
			Clear selection
		</button>
		{#if selectionStore.hasSelection()}
			<span class="small-text">Selection active · Enter also creates a link</span>
		{/if}
	</nav>
</article>
