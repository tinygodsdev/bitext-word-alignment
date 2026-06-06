import type { ExampleId } from '$lib/state/examples.js';

export interface GalleryExampleEntry {
	slug: string;
	exampleId: ExampleId;
	title: string;
	description: string;
	body: string;
	imageAlt: string;
}
