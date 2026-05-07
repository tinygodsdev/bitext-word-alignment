<script lang="ts">
	import { browser } from '$app/environment';
	import LinkPath from './LinkPath.svelte';
	import type { Connection } from '$lib/domain/alignment.js';
	import {
		canonicalPair,
		connectionIsActiveForPendingSelection,
		showConnectorsForPair,
		tokenLineId
	} from '$lib/domain/lines-helpers.js';
	import { linkEndpoints, linkPathD } from '$lib/domain/link-geometry.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { linkHover } from '$lib/state/linkHover.svelte.js';
	import { layoutExportStore, type TokenLayout } from '$lib/state/layoutExport.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';

	let {
		rootEl,
		connections,
		writesExportLayout = true
	}: {
		rootEl: HTMLElement | null;
		connections: Connection[];
		/** When false, this preview only draws links locally (avoids clobbering export layout). */
		writesExportLayout?: boolean;
	} = $props();

	let displayTokenLayout = $state<Record<string, TokenLayout>>({});

	const lineOrder = $derived(projectStore.lines.map((l) => l.id));

	/** Opacity multiplier for connectors not usable while picking the second token (0 = hidden is wrong; use low alpha). */
	const PENDING_DIM_FACTOR = 0.22;

	function shouldDrawPath(conn: Connection): boolean {
		const lineOrder = projectStore.lines.map((l) => l.id);
		const pair = canonicalPair(
			lineOrder,
			tokenLineId(conn.upperTokenId),
			tokenLineId(conn.lowerTokenId)
		);
		if (!pair) return false;
		return showConnectorsForPair(projectStore.pairControls, pair.upperLineId, pair.lowerLineId);
	}

	function measure() {
		if (!rootEl) return;
		const ro = rootEl.getBoundingClientRect();
		const w = ro.width;
		const h = ro.height;
		const tokenLayout: Record<string, TokenLayout> = {};
		const linkPaths: { linkId: string; color: string; d: string }[] = [];

		// Scope to `.token-row` so unrelated DOM that re-uses `data-token-id` / `data-line`
		// (e.g. the line settings popover content, which mounts inside this `rootEl`)
		// cannot overwrite layout entries for real preview tokens / rows.
		rootEl.querySelectorAll<HTMLElement>('.token-row [data-token-id]').forEach((el) => {
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

		const lineRowY: Record<string, number> = {};
		rootEl.querySelectorAll<HTMLElement>('.token-row[data-line]').forEach((row) => {
			const lineId = row.dataset.line;
			if (!lineId) return;
			const b = row.getBoundingClientRect();
			lineRowY[lineId] = b.top - ro.top + b.height / 2;
		});

		const style = settingsStore.settings.lineStyle;
		for (const conn of connections) {
			if (!shouldDrawPath(conn)) continue;
			const p1 = tokenLayout[conn.upperTokenId];
			const p2 = tokenLayout[conn.lowerTokenId];
			if (!p1 || !p2) continue;
			const { x1, y1, x2, y2 } = linkEndpoints(p1, p2);
			const d = linkPathD(x1, y1, x2, y2, style);
			const color = conn.color ?? '#94a3b8';
			linkPaths.push({ linkId: conn.id, color, d });
		}

		displayTokenLayout = tokenLayout;
		if (writesExportLayout) {
			layoutExportStore.setSnapshot({
				width: w,
				height: h,
				tokenLayout,
				linkPaths,
				lineRowY
			});
		}
	}

	$effect(() => {
		if (!rootEl) return;
		for (const c of connections) {
			void c.id;
			void c.upperTokenId;
			void c.lowerTokenId;
			void c.color;
		}
		void projectStore.pairControls;
		void settingsStore.settings.lineStyle;
		void projectStore.lines;
		void writesExportLayout;

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
		{#each connections as conn (conn.id)}
			{#if shouldDrawPath(conn)}
				{@const p1 = displayTokenLayout[conn.upperTokenId]}
				{@const p2 = displayTokenLayout[conn.lowerTokenId]}
				{#if p1 && p2}
					{@const pts = linkEndpoints(p1, p2)}
					{@const d = linkPathD(pts.x1, pts.y1, pts.x2, pts.y2, settingsStore.settings.lineStyle)}
					{@const col = conn.color ?? '#94a3b8'}
					{@const hi = linkHover.id === conn.id}
					{@const pend = selectionStore.pending}
					{@const activeForPending =
						pend == null || connectionIsActiveForPendingSelection(lineOrder, conn, pend.lineId)}
					{@const baseOp = settingsStore.settings.lineOpacity}
					{@const pathOpacity = hi ? 1 : activeForPending ? baseOp : baseOp * PENDING_DIM_FACTOR}
					<LinkPath
						{d}
						color={col}
						thickness={hi
							? settingsStore.settings.lineThickness + 1
							: settingsStore.settings.lineThickness}
						opacity={pathOpacity}
						linkId={conn.id}
						onenter={(id) => {
							linkHover.id = id;
						}}
						onleave={() => {
							linkHover.id = null;
						}}
						onclick={(id) => projectStore.removeConnectionById(id)}
					/>
				{/if}
			{/if}
		{/each}
	</g>
</svg>
