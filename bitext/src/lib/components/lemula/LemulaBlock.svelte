<script lang="ts">
	// Global on purpose: the blocks are plain HTML, and Svelte's scoping would strip their styles.
	import './lemula-banners.css';
	import { lemulaBlockHtml, type LemulaBlockName } from './blocks.js';

	let { name }: { name: LemulaBlockName } = $props();
</script>

<!-- Our own banner markup from `blocks/`; nothing in it comes from users. -->
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html lemulaBlockHtml(name)}
