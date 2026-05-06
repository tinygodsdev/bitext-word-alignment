/** UI-only state for inline preview editing (text modal). */

class EditorUiStore {
	editingLineId = $state<string | null>(null);

	openEditLine(lineId: string) {
		this.editingLineId = lineId;
	}

	closeEditLine() {
		this.editingLineId = null;
	}
}

export const editorUiStore = new EditorUiStore();
