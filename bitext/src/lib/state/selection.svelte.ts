import { projectStore } from '$lib/state/project.svelte.js';
import { settingsStore } from '$lib/state/settings.svelte.js';

class SelectionStore {
	pending: { lineId: string; tokenId: string } | null = $state(null);
	/** Shown when user clicks a non-adjacent line while a token is pending */
	adjacencyHint = $state(false);

	/** First click pins a token; second click on adjacent line creates a connection; same line changes pin. */
	previewTokenClick(lineId: string, tokenId: string) {
		this.adjacencyHint = false;
		const cur = this.pending;
		if (!cur) {
			this.pending = { lineId, tokenId };
			return;
		}
		if (cur.lineId === lineId && cur.tokenId === tokenId) {
			this.pending = null;
			return;
		}
		if (cur.lineId === lineId) {
			this.pending = { lineId, tokenId };
			return;
		}
		const lineIds = projectStore.lines.map((l) => l.id);
		const ia = lineIds.indexOf(cur.lineId);
		const ib = lineIds.indexOf(lineId);
		if (ia < 0 || ib < 0 || Math.abs(ia - ib) !== 1) {
			this.adjacencyHint = true;
			this.pending = { lineId, tokenId };
			return;
		}
		const palette = settingsStore.settings.palette;
		if (ia < ib) {
			projectStore.addConnection(cur.tokenId, tokenId, palette);
		} else {
			projectStore.addConnection(tokenId, cur.tokenId, palette);
		}
		this.pending = null;
	}

	clear() {
		this.pending = null;
		this.adjacencyHint = false;
	}

	showLinkHint(): boolean {
		return this.pending != null;
	}
}

export const selectionStore = new SelectionStore();
