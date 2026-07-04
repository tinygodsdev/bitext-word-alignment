/** Shared drag state for reordering line rows, so every LineCard can show the same feedback. */
class LineDragStore {
	/** Id of the row currently being dragged (null when idle). */
	draggingId = $state<string | null>(null);
	/** Index of the row the pointer is over. */
	overIndex = $state<number | null>(null);
	/** Whether the drop lands above or below that row (chosen by pointer position within it). */
	overPos = $state<'before' | 'after'>('before');

	start(id: string) {
		this.draggingId = id;
	}

	over(index: number, pos: 'before' | 'after') {
		this.overIndex = index;
		this.overPos = pos;
	}

	end() {
		this.draggingId = null;
		this.overIndex = null;
	}
}

export const lineDrag = new LineDragStore();
