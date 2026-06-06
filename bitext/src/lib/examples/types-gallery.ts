import type { ExampleId } from '$lib/state/examples.js';

export interface GallerySourceAttribution {
	url: string;
	title: string;
}

export interface GalleryExampleEntry {
	slug: string;
	exampleId: ExampleId;
	title: string;
	description: string;
	body: string;
	imageAlt: string;
	/** External source for adapted examples (e.g. Wikipedia). */
	sourceAttribution?: GallerySourceAttribution;
}
