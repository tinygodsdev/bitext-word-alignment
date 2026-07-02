<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';
	import { pendingAlignmentColor, primaryConnectionForToken } from '$lib/domain/alignment.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { getStyle, readableTextOn } from '$lib/domain/styles.js';

	let {
		token,
		lineId,
		textSizePx,
		showNumber,
		index,
		interactive = false,
		joinTightStart = false,
		joinTightEnd = false
	}: {
		token: Token;
		lineId: string;
		textSizePx: number;
		showNumber: boolean;
		index: number;
		interactive?: boolean;
		joinTightStart?: boolean;
		joinTightEnd?: boolean;
	} = $props();

	let hovering = $state(false);

	const palette = $derived(settingsStore.settings.palette);
	const connections = $derived(projectStore.connections);
	const lineIds = $derived(projectStore.lines.map((l) => l.id));
	const pending = $derived(selectionStore.pending);
	const conn = $derived.by(() => primaryConnectionForToken(connections, token.id));

	const linkBgMode = $derived(
		settingsStore.settings.colorTokensByLink &&
			settingsStore.settings.tokenLinkColorMode === 'background'
	);

	const previewSurfaceHex = $derived.by(() => {
		const style = getStyle(settingsStore.settings.style);
		if (style.id !== 'classic') return style.canvas.tintBaseHex;
		return settingsStore.settings.background === 'dark' ? '#1e1e1e' : '#ffffff';
	});

	const textColor = $derived.by(() => {
		if (!settingsStore.settings.colorTokensByLink || !conn?.color || linkBgMode) return null;
		return conn.color;
	});

	const isPinned = $derived(pending != null && pending.tokenId === token.id);

	const accentColor = $derived.by(() => {
		if (!interactive) return null;
		if (isPinned) {
			return pendingAlignmentColor(connections, [token.id], [], palette);
		}
		if (!hovering) return null;
		const pend = pending;
		if (!pend) {
			return pendingAlignmentColor(connections, [token.id], [], palette);
		}
		if (pend.lineId === lineId) {
			return pendingAlignmentColor(connections, [token.id], [], palette);
		}
		const ip = lineIds.indexOf(pend.lineId);
		const it = lineIds.indexOf(lineId);
		if (ip < 0 || it < 0) return null;
		if (Math.abs(ip - it) !== 1) {
			return pendingAlignmentColor(connections, [token.id], [], palette);
		}
		const upperTok = ip < it ? pend.tokenId : token.id;
		const lowerTok = ip < it ? token.id : pend.tokenId;
		return pendingAlignmentColor(connections, [upperTok], [lowerTok], palette);
	});

	const linkFillBackground = $derived.by(() => {
		if (!settingsStore.settings.colorTokensByLink || !linkBgMode) return null;
		const surf = previewSurfaceHex;
		if (interactive && accentColor != null && (isPinned || hovering)) {
			return `color-mix(in srgb, ${accentColor} ${isPinned ? 48 : 38}%, ${surf})`;
		}
		if (conn?.color) {
			return `color-mix(in srgb, ${conn.color} 28%, ${surf})`;
		}
		return null;
	});

	const displayColor = $derived(linkBgMode ? undefined : (accentColor ?? textColor ?? undefined));

	const style = $derived(getStyle(settingsStore.settings.style));

	// Bauhaus-style word cards: linked tokens become solid colored chips with a hard offset shadow.
	const chip = $derived.by(() => {
		if (!style.tokenChips || !conn?.color) return null;
		return {
			bg: conn.color,
			fg: readableTextOn(conn.color),
			shadow: `0.11em 0.11em 0 ${style.tokenChips.shadow}`
		};
	});

	// Neon styles glow the text in its own color.
	const textGlow = $derived.by(() => {
		if (!style.glowText || chip) return undefined;
		const c = displayColor ?? textColor ?? style.canvas.textColor;
		return `0 0 0.5em ${c}`;
	});

	const bgFinal = $derived(chip ? chip.bg : (linkFillBackground ?? undefined));
	const interactiveColor = $derived(linkBgMode ? undefined : displayColor);
	const readonlyColor = $derived(linkBgMode ? undefined : (textColor ?? undefined));

	function onClick() {
		if (!interactive) return;
		selectionStore.previewTokenClick(lineId, token.id);
	}
</script>

{#if interactive}
	<button
		type="button"
		class="token-view token-view--clickable"
		class:token-view--join-before={joinTightStart}
		class:token-view--join-after={joinTightEnd}
		class:token-view--colored={!linkBgMode && textColor && !accentColor}
		class:token-view--accent-sel={!linkBgMode && accentColor !== null && isPinned}
		class:token-view--accent-hover={!linkBgMode && accentColor !== null && !isPinned}
		class:token-view--chip={chip}
		data-token-id={token.id}
		data-line={lineId}
		style:font-size="{textSizePx}px"
		style:--token-accent={accentColor ?? 'transparent'}
		style:background={bgFinal}
		style:color={chip ? chip.fg : interactiveColor}
		style:box-shadow={chip ? chip.shadow : undefined}
		style:text-shadow={textGlow}
		onclick={onClick}
		onmouseenter={() => {
			hovering = true;
		}}
		onmouseleave={() => {
			hovering = false;
		}}
	>
		{#if showNumber}
			<span class="token-view__num">{index + 1}</span>
		{/if}
		<span class="token-view__text">{token.text}</span>
	</button>
{:else}
	<span
		class="token-view"
		class:token-view--join-before={joinTightStart}
		class:token-view--join-after={joinTightEnd}
		class:token-view--colored={!linkBgMode && !!textColor}
		class:token-view--chip={chip}
		data-token-id={token.id}
		data-line={lineId}
		style:font-size="{textSizePx}px"
		style:background={bgFinal}
		style:color={chip ? chip.fg : readonlyColor}
		style:box-shadow={chip ? chip.shadow : undefined}
		style:text-shadow={textGlow}
	>
		{#if showNumber}
			<span class="token-view__num">{index + 1}</span>
		{/if}
		<span class="token-view__text">{token.text}</span>
	</span>
{/if}
