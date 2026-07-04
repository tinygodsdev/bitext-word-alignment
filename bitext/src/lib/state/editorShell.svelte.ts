/**
 * State for the full-screen editor shell (`/editor`).
 *
 * Connecting words is always live on the canvas, so there is no "link mode". The shell only
 * tracks which config panel is shown: Text (the lines), Style (look), or Export (download/share).
 * On wide screens the panel lives in a docked rail; on narrow screens it is a bottom sheet that
 * opens above a pinned bottom bar (`sheetOpen`).
 */
export type EditorTab = 'text' | 'style' | 'export';

class EditorShellStore {
	tab = $state<EditorTab>('text');
	/** Narrow-screen bottom sheet visibility (the rail is always visible on wide screens). */
	sheetOpen = $state(false);

	/** Bottom-bar tap: open the tab, or close the sheet if that tab is already open. */
	toggleTab(tab: EditorTab) {
		if (this.sheetOpen && this.tab === tab) {
			this.sheetOpen = false;
			return;
		}
		this.tab = tab;
		this.sheetOpen = true;
	}

	/** Rail click (wide screens): just switch the panel. */
	selectTab(tab: EditorTab) {
		this.tab = tab;
	}

	closeSheet() {
		this.sheetOpen = false;
	}
}

export const editorShellStore = new EditorShellStore();
