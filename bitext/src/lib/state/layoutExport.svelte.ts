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
	sourceRowY = $state(0);
	targetRowY = $state(0);
	glossRowY = $state<number | null>(null);
	/** Bumped so preview layout is remeasured (e.g. before export) with up-to-date font metrics. */
	layoutRemeasureTick = $state(0);

	/** Request a fresh token bounding-box snapshot; wait for `tick()` + fonts + rAF before reading layout. */
	requestRemeasure() {
		this.layoutRemeasureTick++;
	}

	setSnapshot(s: {
		width: number;
		height: number;
		tokenLayout: Record<string, TokenLayout>;
		linkPaths: LinkLayout[];
		sourceRowY: number;
		targetRowY: number;
		glossRowY: number | null;
	}) {
		this.width = s.width;
		this.height = s.height;
		this.tokenLayout = s.tokenLayout;
		this.linkPaths = s.linkPaths;
		this.sourceRowY = s.sourceRowY;
		this.targetRowY = s.targetRowY;
		this.glossRowY = s.glossRowY;
	}
}

export const layoutExportStore = new LayoutExportStore();
