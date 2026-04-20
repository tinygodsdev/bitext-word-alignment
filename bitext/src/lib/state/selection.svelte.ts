import { SvelteSet } from 'svelte/reactivity';
import { projectStore } from '$lib/state/project.svelte.js';
import { settingsStore } from '$lib/state/settings.svelte.js';

class SelectionStore {
	selectedSource = $state(new SvelteSet<string>());
	selectedTarget = $state(new SvelteSet<string>());

	private setSingleSelection(side: 'source' | 'target', tokenId: string) {
		if (side === 'source') {
			this.selectedSource = new SvelteSet([tokenId]);
			this.selectedTarget = new SvelteSet();
		} else {
			this.selectedSource = new SvelteSet();
			this.selectedTarget = new SvelteSet([tokenId]);
		}
	}

	private syncSet(side: 'source' | 'target', next: SvelteSet<string>) {
		if (side === 'source') {
			this.selectedSource = next;
		} else {
			this.selectedTarget = next;
		}
	}

	toggleToken(side: 'source' | 'target', tokenId: string) {
		const cur = side === 'source' ? this.selectedSource : this.selectedTarget;
		const next = new SvelteSet(cur);
		if (next.has(tokenId)) next.delete(tokenId);
		else next.add(tokenId);
		this.syncSet(side, next);
	}

	/** Preview mode: first click selects one token, second click on other side creates link immediately. */
	previewTokenClick(side: 'source' | 'target', tokenId: string) {
		const own = side === 'source' ? this.selectedSource : this.selectedTarget;
		const other = side === 'source' ? this.selectedTarget : this.selectedSource;

		// Clicking the already-selected token unselects it.
		if (own.size === 1 && own.has(tokenId) && other.size === 0) {
			this.clear();
			return;
		}

		// First step of a quick 1→1 interaction.
		if (other.size === 0) {
			this.setSingleSelection(side, tokenId);
			return;
		}

		// Second step (click on opposite side) commits immediately.
		this.syncSet(side, new SvelteSet([tokenId]));
		this.commitLink();
	}

	clear() {
		this.selectedSource = new SvelteSet();
		this.selectedTarget = new SvelteSet();
	}

	commitLink() {
		const src = [...this.selectedSource];
		const tgt = [...this.selectedTarget];
		if (src.length === 0 || tgt.length === 0) return;
		projectStore.addAlignment(src, tgt, settingsStore.settings.palette);
		this.clear();
	}

	hasSelection(): boolean {
		return this.selectedSource.size > 0 || this.selectedTarget.size > 0;
	}

	/** Show Create link / Enter when both sides have at least one token */
	needsManualCommit(): boolean {
		return this.selectedSource.size >= 1 && this.selectedTarget.size >= 1;
	}

	showLinkHint(): boolean {
		return (
			(this.selectedSource.size >= 1 && this.selectedTarget.size === 0) ||
			(this.selectedSource.size === 0 && this.selectedTarget.size >= 1)
		);
	}
}

export const selectionStore = new SelectionStore();
