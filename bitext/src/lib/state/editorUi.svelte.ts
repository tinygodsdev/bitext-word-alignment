/** UI-only state for inline preview editing (text modal). */

class EditorUiStore {
	editingLineId = $state<string | null>(null);
	lineSettingsId = $state<string | null>(null);

	openEditLine(lineId: string) {
		this.editingLineId = lineId;
	}

	closeEditLine() {
		this.editingLineId = null;
	}

	openLineSettings(lineId: string) {
		this.lineSettingsId = lineId;
	}

	closeLineSettings() {
		this.lineSettingsId = null;
	}
}

export const editorUiStore = new EditorUiStore();
