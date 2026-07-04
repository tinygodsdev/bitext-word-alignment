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
	import { linkEndpoints, linkPathD, ribbonPathD } from '$lib/domain/link-geometry.js';
	import { connectedConnectionComponents, connectedConnectionIds } from '$lib/domain/link-graph.js';
	import { connectorColor, getStyle, readableTextOn } from '$lib/domain/styles.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { linkHover } from '$lib/state/linkHover.svelte.js';
	import { layoutExportStore, type TokenLayout } from '$lib/state/layoutExport.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';

	let {
		rootEl,
		connections,
		writesExportLayout = true,
		thicknessScale = 1,
		zoom = 1,
		showPins = false
	}: {
		rootEl: HTMLElement | null;
		connections: Connection[];
		/** When false, this preview only draws links locally (avoids clobbering export layout). */
		writesExportLayout?: boolean;
		/** Auto-fit shrink applied to connector thickness so lines don't look huge on small text. */
		thicknessScale?: number;
		/** Visual pan/zoom scale of the wrapper; measurements are divided by it to stay in layout space. */
		zoom?: number;
		/** Editing affordance only: mark pinned-color groups. Never part of the export. */
		showPins?: boolean;
	} = $props();

	let displayTokenLayout = $state<Record<string, TokenLayout>>({});

	const lineOrder = $derived(projectStore.lines.map((l) => l.id));
	const style = $derived(getStyle(settingsStore.settings.style));

	/** Opacity multiplier for connectors not usable while picking the second token (0 = hidden is wrong; use low alpha). */
	const PENDING_DIM_FACTOR = 0.22;

	/**
	 * A palette badge sits above the top token of every pinned group so it is clear the color is
	 * fixed. The currently selected group is skipped — the color popover already covers it there.
	 */
	const pinnedBadges = $derived.by(() => {
		const pend = selectionStore.pending;
		const selectedComponent = pend ? connectedConnectionIds(connections, [pend.tokenId]) : null;
		const out: { cx: number; y: number; color: string; tokenId: string; lineId: string }[] = [];
		for (const component of connectedConnectionComponents(connections)) {
			const groupConns = connections.filter((c) => component.has(c.id));
			if (!groupConns.some((c) => c.pinned)) continue;
			if (selectedComponent && groupConns.some((c) => selectedComponent.has(c.id))) continue;
			const color = groupConns.find((c) => c.color)?.color ?? '#94a3b8';
			let best: { cx: number; y: number; li: number; x: number; tid: string } | null = null;
			for (const tid of groupConns.flatMap((c) => [c.upperTokenId, c.lowerTokenId])) {
				const layout = displayTokenLayout[tid];
				if (!layout) continue;
				const li = lineOrder.indexOf(tokenLineId(tid));
				if (li < 0) continue;
				if (!best || li < best.li || (li === best.li && layout.x < best.x)) {
					best = { cx: layout.cx, y: layout.y - 12, li, x: layout.x, tid };
				}
			}
			if (best) {
				out.push({
					cx: best.cx,
					y: best.y,
					color,
					tokenId: best.tid,
					lineId: tokenLineId(best.tid)
				});
			}
		}
		return out;
	});

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
		// `rootEl` is the pan/zoom wrapper. Dividing every measured delta/size by the current zoom
		// yields layout-space coordinates (transform-invariant), so connectors and the export are
		// identical at any zoom.
		const z = zoom || 1;
		// Round to hundredths so dividing by the zoom yields the same values at any zoom (no
		// floating-point drift) — keeps the export byte-identical and the SVG small.
		const r2 = (n: number) => Math.round(n * 100) / 100;
		const ro = rootEl.getBoundingClientRect();
		const w = r2(ro.width / z);
		const h = r2(ro.height / z);
		const tokenLayout: Record<string, TokenLayout> = {};
		const linkPaths: { linkId: string; color: string; d: string }[] = [];

		// Scope to `.token-row` so unrelated DOM that re-uses `data-token-id` / `data-line`
		// (e.g. the line settings popover content, which mounts inside this `rootEl`)
		// cannot overwrite layout entries for real preview tokens / rows.
		rootEl.querySelectorAll<HTMLElement>('.token-row [data-token-id]').forEach((el) => {
			const id = el.dataset.tokenId;
			if (!id) return;
			const b = el.getBoundingClientRect();
			const x = r2((b.left - ro.left) / z);
			const y = r2((b.top - ro.top) / z);
			const bw = r2(b.width / z);
			const bh = r2(b.height / z);
			tokenLayout[id] = {
				cx: r2(x + bw / 2),
				cy: r2(y + bh / 2),
				x,
				y,
				w: bw,
				h: bh
			};
		});

		const lineRowY: Record<string, number> = {};
		rootEl.querySelectorAll<HTMLElement>('.token-row[data-line]').forEach((row) => {
			const lineId = row.dataset.line;
			if (!lineId) return;
			const b = row.getBoundingClientRect();
			lineRowY[lineId] = r2((b.top - ro.top + b.height / 2) / z);
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
		void settingsStore.settings.style;
		void settingsStore.settings.previewHideChrome;
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
					{@const pts = linkEndpoints(p1, p2, style.tokenChips ? 0 : undefined)}
					{@const ribbon = style.connector.mode === 'ribbon'}
					{@const d = ribbon
						? ribbonPathD(
								pts.x1,
								pts.y1,
								pts.x2,
								pts.y2,
								settingsStore.settings.lineStyle,
								settingsStore.settings.lineThickness *
									(style.connector.ribbonScale ?? 8) *
									thicknessScale,
								style.connector.taper ?? false
							)
						: linkPathD(pts.x1, pts.y1, pts.x2, pts.y2, settingsStore.settings.lineStyle)}
					{@const col = connectorColor(style, conn.color ?? '#94a3b8')}
					{@const hi = linkHover.id === conn.id}
					{@const pend = selectionStore.pending}
					{@const activeForPending =
						pend == null || connectionIsActiveForPendingSelection(lineOrder, conn, pend.lineId)}
					{@const baseOp = settingsStore.settings.lineOpacity}
					{@const pathOpacity = hi ? 1 : activeForPending ? baseOp : baseOp * PENDING_DIM_FACTOR}
					{@const baseThickness =
						settingsStore.settings.lineThickness *
						(style.connector.widthScale ?? 1) *
						thicknessScale}
					<LinkPath
						{d}
						color={col}
						thickness={hi ? baseThickness + 1 : baseThickness}
						opacity={pathOpacity}
						cap={style.connector.cap}
						dash={style.connector.dash}
						glow={style.connector.glow ?? false}
						fill={ribbon}
					/>
					{#if style.connector.endpointDots}
						{@const dot = style.connector.endpointDots}
						<circle
							cx={pts.x1}
							cy={pts.y1}
							r={dot.r * thicknessScale}
							fill={dot.color ?? col}
							stroke={dot.ring}
							stroke-width={dot.ring ? 1.5 : undefined}
							opacity={pathOpacity}
						/>
						<circle
							cx={pts.x2}
							cy={pts.y2}
							r={dot.r * thicknessScale}
							fill={dot.color ?? col}
							stroke={dot.ring}
							stroke-width={dot.ring ? 1.5 : undefined}
							opacity={pathOpacity}
						/>
					{/if}
				{/if}
			{/if}
		{/each}
	</g>
</svg>

<!-- Interaction layer: a wide transparent hit target along each connector centerline,
     always on top so ribbons (filled) and Bauhaus links (drawn under the cards) stay clickable. -->
<svg class="preview-hit-layer">
	{#each connections as conn (conn.id)}
		{#if shouldDrawPath(conn)}
			{@const p1 = displayTokenLayout[conn.upperTokenId]}
			{@const p2 = displayTokenLayout[conn.lowerTokenId]}
			{#if p1 && p2}
				{@const pts = linkEndpoints(p1, p2, style.tokenChips ? 0 : undefined)}
				{@const hitD = linkPathD(pts.x1, pts.y1, pts.x2, pts.y2, settingsStore.settings.lineStyle)}
				{@const hitWidth = Math.max(settingsStore.settings.lineThickness, 5) + 10}
				<path
					class="link-hit-path"
					d={hitD}
					fill="none"
					stroke="transparent"
					stroke-width={hitWidth}
					stroke-linecap="round"
					role="button"
					tabindex="0"
					aria-label="Remove alignment link"
					data-link-id={conn.id}
					onmouseenter={() => {
						linkHover.id = conn.id;
					}}
					onmouseleave={() => {
						linkHover.id = null;
					}}
					onclick={() => projectStore.removeConnectionById(conn.id)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							projectStore.removeConnectionById(conn.id);
						}
					}}
				/>
			{/if}
		{/if}
	{/each}
</svg>

{#if showPins}
	<!-- Palette badges for pinned groups. Top layer so they stay clickable under any style
	     (e.g. Bauhaus drops the connector layer below the words). Never part of the export. -->
	<svg class="preview-badge-layer">
		{#each pinnedBadges as badge (badge.tokenId)}
			{@const col = badge.color}
			{@const fg = readableTextOn(col)}
			<g
				class="pin-badge"
				data-pin-badge
				transform="translate({badge.cx} {badge.y})"
				role="button"
				tabindex="0"
				aria-label="Edit pinned group color"
				onclick={() => selectionStore.selectToken(badge.lineId, badge.tokenId)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						selectionStore.selectToken(badge.lineId, badge.tokenId);
					}
				}}
			>
				<circle r="8.5" fill={col} stroke={fg} stroke-width="0.75" />
				<ellipse cx="0" cy="0.3" rx="5" ry="4" fill={fg} />
				<circle cx="2.5" cy="2.1" r="1.05" fill={col} />
				<circle cx="-2.5" cy="-0.5" r="0.9" fill={col} />
				<circle cx="-0.4" cy="-1.9" r="0.9" fill={col} />
				<circle cx="1.7" cy="-1.3" r="0.9" fill={col} />
			</g>
		{/each}
	</svg>
{/if}
