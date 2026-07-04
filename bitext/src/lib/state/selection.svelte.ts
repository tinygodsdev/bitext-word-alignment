import { projectStore } from '$lib/state/project.svelte.js';
import { settingsStore } from '$lib/state/settings.svelte.js';

class SelectionStore {
	pending: { lineId: string; tokenId: string } | null = $state(null);
	/** Shown when user clicks a non-adjacent line while a token is pending */
	adjacencyHint = $state(false);
	/** Color pre-picked for the selected (still unlinked) token; applied to the next connection. */
	pendingColor = $state<string | null>(null);

	/** First click pins a token; second click on adjacent line creates a connection; same line changes pin. */
	previewTokenClick(lineId: string, tokenId: string) {
		this.adjacencyHint = false;
		const cur = this.pending;
		if (!cur) {
			this.pending = { lineId, tokenId };
			this.pendingColor = null;
			return;
		}
		if (cur.lineId === lineId && cur.tokenId === tokenId) {
			this.clear();
			return;
		}
		if (cur.lineId === lineId) {
			this.pending = { lineId, tokenId };
			this.pendingColor = null;
			return;
		}
		const lineIds = projectStore.lines.map((l) => l.id);
		const ia = lineIds.indexOf(cur.lineId);
		const ib = lineIds.indexOf(lineId);
		if (ia < 0 || ib < 0 || Math.abs(ia - ib) !== 1) {
			this.adjacencyHint = true;
			this.pending = { lineId, tokenId };
			this.pendingColor = null;
			return;
		}
		const palette = settingsStore.settings.palette;
		const pinnedColor = this.pendingColor ?? undefined;
		if (ia < ib) {
			projectStore.addConnection(cur.tokenId, tokenId, palette, pinnedColor);
		} else {
			projectStore.addConnection(tokenId, cur.tokenId, palette, pinnedColor);
		}
		this.clear();
	}

	/** Select a token directly (e.g. clicking a group's pinned-color badge) to open its color popover. */
	selectToken(lineId: string, tokenId: string) {
		this.pending = { lineId, tokenId };
		this.adjacencyHint = false;
		this.pendingColor = null;
	}

	/** Choose a palette color for the current selection without dropping it. */
	setColorForSelection(color: string) {
		const cur = this.pending;
		if (!cur) return;
		if (projectStore.hasGroup(cur.tokenId)) {
			projectStore.pinGroupColor(cur.tokenId, color);
			this.pendingColor = null;
		} else {
			// Unlinked word: remember the color for the link about to be created.
			this.pendingColor = color;
		}
	}

	/** Reset the current selection's group color to automatic (or clear a pre-picked color). */
	resetColorForSelection() {
		const cur = this.pending;
		if (!cur) return;
		if (projectStore.hasGroup(cur.tokenId)) {
			projectStore.unpinGroupColor(cur.tokenId, settingsStore.settings.palette);
		}
		this.pendingColor = null;
	}

	clear() {
		this.pending = null;
		this.adjacencyHint = false;
		this.pendingColor = null;
	}

	showLinkHint(): boolean {
		return this.pending != null;
	}
}

export const selectionStore = new SelectionStore();
