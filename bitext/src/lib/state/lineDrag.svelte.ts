/** Shared drag state for reordering line rows, so every LineCard can show the same feedback. */
class LineDragStore {
	/** Id of the row currently being dragged (null when idle). */
	draggingId = $state<string | null>(null);
	/** Index of the row the pointer is over — where the dragged row would land. */
	overIndex = $state<number | null>(null);

	start(id: string) {
		this.draggingId = id;
	}

	over(index: number) {
		this.overIndex = index;
	}

	end() {
		this.draggingId = null;
		this.overIndex = null;
	}
}

export const lineDrag = new LineDragStore();
