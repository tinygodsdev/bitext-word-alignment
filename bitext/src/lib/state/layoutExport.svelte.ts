import type { TokenLayout } from '$lib/types/layout.js';

export type { TokenLayout };

export interface LinkLayout {
	linkId: string;
	color: string;
	d: string;
}

class LayoutExportStore {
	width = $state(0);
	height = $state(0);
	tokenLayout = $state<Record<string, TokenLayout>>({});
	linkPaths = $state<LinkLayout[]>([]);
	/** Vertical center Y of each line’s token row, keyed by line id */
	lineRowY = $state<Record<string, number>>({});
	/** Bumped so preview layout is remeasured (e.g. before export) with up-to-date font metrics. */
	layoutRemeasureTick = $state(0);

	requestRemeasure() {
		this.layoutRemeasureTick++;
	}

	/** After popovers, flex reflow, or toggling connectors — measure on the next paint frames. */
	requestRemeasureAfterLayout() {
		if (typeof window === 'undefined') {
			this.layoutRemeasureTick++;
			return;
		}
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.layoutRemeasureTick++;
			});
		});
	}

	setSnapshot(s: {
		width: number;
		height: number;
		tokenLayout: Record<string, TokenLayout>;
		linkPaths: LinkLayout[];
		lineRowY: Record<string, number>;
	}) {
		this.width = s.width;
		this.height = s.height;
		this.tokenLayout = s.tokenLayout;
		this.linkPaths = s.linkPaths;
		this.lineRowY = s.lineRowY;
	}
}

export const layoutExportStore = new LayoutExportStore();
