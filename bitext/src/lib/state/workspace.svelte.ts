/**
 * Drives the canvas-first workspace shell: which editing mode is active.
 *
 * - `link` is the default and means "just the live canvas" (no panel/sheet open).
 * - `text` / `style` / `export` open the matching panel (a bottom sheet on narrow
 *   screens, the docked rail on wide ones).
 */
export type WorkspaceMode = 'link' | 'text' | 'style' | 'export';

class WorkspaceStore {
	mode = $state<WorkspaceMode>('link');

	setMode(mode: WorkspaceMode) {
		this.mode = mode;
	}

	/** Narrow-screen sheet is open for anything other than the bare canvas. */
	get sheetOpen(): boolean {
		return this.mode !== 'link';
	}

	closeSheet() {
		this.mode = 'link';
	}

	toggleExport() {
		this.mode = this.mode === 'export' ? 'link' : 'export';
	}
}

export const workspaceStore = new WorkspaceStore();
