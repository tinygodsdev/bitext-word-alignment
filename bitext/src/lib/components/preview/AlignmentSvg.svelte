<script lang="ts">
	import { browser } from '$app/environment';
	import LinkPath from './LinkPath.svelte';
	import type { Link } from '$lib/domain/alignment.js';
	import { linkEndpoints, linkPathD } from '$lib/domain/link-geometry.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { linkHover } from '$lib/state/linkHover.svelte.js';
	import { layoutExportStore, type TokenLayout } from '$lib/state/layoutExport.svelte.js';

	let {
		rootEl,
		links
	}: {
		rootEl: HTMLElement | null;
		links: Link[];
	} = $props();

	function measure() {
		if (!rootEl) return;
		const ro = rootEl.getBoundingClientRect();
		const w = ro.width;
		const h = ro.height;
		const tokenLayout: Record<string, TokenLayout> = {};
		const linkPaths: { linkId: string; color: string; d: string }[] = [];

		rootEl.querySelectorAll<HTMLElement>('[data-token-id]').forEach((el) => {
			const id = el.dataset.tokenId;
			if (!id) return;
			const b = el.getBoundingClientRect();
			const x = b.left - ro.left;
			const y = b.top - ro.top;
			tokenLayout[id] = {
				cx: x + b.width / 2,
				cy: y + b.height / 2,
				x,
				y,
				w: b.width,
				h: b.height
			};
		});

		let sourceRowY = 0;
		let targetRowY = 0;
		const sr = rootEl.querySelector('[data-row="source"]');
		const tr = rootEl.querySelector('[data-row="target"]');
		if (sr) {
			const b = sr.getBoundingClientRect();
			sourceRowY = b.top - ro.top + b.height / 2;
		}
		if (tr) {
			const b = tr.getBoundingClientRect();
			targetRowY = b.top - ro.top + b.height / 2;
		}
		let glossSourceRowY: number | null = null;
		let glossTargetRowY: number | null = null;
		const gsr = rootEl.querySelector('[data-gloss-row="source"]');
		if (gsr) {
			const b = gsr.getBoundingClientRect();
			glossSourceRowY = b.top - ro.top + b.height / 2;
		}
		const gtr = rootEl.querySelector('[data-gloss-row="target"]');
		if (gtr) {
			const b = gtr.getBoundingClientRect();
			glossTargetRowY = b.top - ro.top + b.height / 2;
		}

		const style = settingsStore.settings.lineStyle;
		for (const link of links) {
			const p1 = tokenLayout[link.sourceId];
			const p2 = tokenLayout[link.targetId];
			if (!p1 || !p2) continue;
			const { x1, y1, x2, y2 } = linkEndpoints(p1, p2);
			const d = linkPathD(x1, y1, x2, y2, style);
			const color = link.color ?? '#94a3b8';
			linkPaths.push({ linkId: link.id, color, d });
		}

		layoutExportStore.setSnapshot({
			width: w,
			height: h,
			tokenLayout,
			linkPaths,
			sourceRowY,
			targetRowY,
			glossSourceRowY,
			glossTargetRowY
		});
	}

	$effect(() => {
		if (!rootEl) return;
		// Track full link list (not only length) so recolors / same-length edits remeasure.
		for (const l of links) {
			void l.id;
			void l.sourceId;
			void l.targetId;
			void l.color;
		}
		void settingsStore.settings.lineStyle;
		void settingsStore.settings.glossLineGapPx;
		void projectStore.sourceTokens;
		void projectStore.targetTokens;
		/** Two rAFs: wait for style/layout flush after font or DOM updates. */
		function remeasure() {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => measure());
			});
		}
		const ro = new ResizeObserver(() => {
			remeasure();
		});
		ro.observe(rootEl);
		remeasure();
		let cancelled = false;
		if (browser && document.fonts) {
			void document.fonts.ready.then(() => {
				if (!cancelled) remeasure();
			});
			document.fonts.addEventListener('loadingdone', remeasure);
		}
		return () => {
			cancelled = true;
			ro.disconnect();
			if (browser && document.fonts) {
				document.fonts.removeEventListener('loadingdone', remeasure);
			}
		};
	});

	$effect(() => {
		void layoutExportStore.layoutRemeasureTick;
		if (!rootEl) return;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => measure());
		});
	});
</script>

<svg class="preview-svg-layer" aria-hidden="true">
	<g class="link-hit">
		{#each links as link (link.id)}
			{@const p1 = layoutExportStore.tokenLayout[link.sourceId]}
			{@const p2 = layoutExportStore.tokenLayout[link.targetId]}
			{#if p1 && p2}
				{@const pts = linkEndpoints(p1, p2)}
				{@const d = linkPathD(pts.x1, pts.y1, pts.x2, pts.y2, settingsStore.settings.lineStyle)}
				{@const col = link.color ?? '#94a3b8'}
				{@const hi = linkHover.id === link.id}
				<LinkPath
					{d}
					color={col}
					thickness={hi
						? settingsStore.settings.lineThickness + 1
						: settingsStore.settings.lineThickness}
					opacity={hi ? 1 : settingsStore.settings.lineOpacity}
					linkId={link.id}
					onenter={(id) => {
						linkHover.id = id;
					}}
					onleave={() => {
						linkHover.id = null;
					}}
					onclick={(id) => projectStore.removeAlignment(id)}
				/>
			{/if}
		{/each}
	</g>
</svg>
