import type { ExampleId } from '$lib/state/examples.js';
import { galleryPreviewImageUrl } from '$lib/examples/cdn.js';
import { CORE_GALLERY } from './catalog/core.js';
import { WIKIPEDIA_GALLERY } from './catalog/wikipedia.js';

export type { GalleryExampleEntry } from './types-gallery.js';

import type { GalleryExampleEntry } from './types-gallery.js';

export const GALLERY_EXAMPLES: readonly GalleryExampleEntry[] = [
	...CORE_GALLERY,
	...WIKIPEDIA_GALLERY
];

export type GallerySlug = (typeof GALLERY_EXAMPLES)[number]['slug'];

export function findGalleryBySlug(slug: string): GalleryExampleEntry | undefined {
	return GALLERY_EXAMPLES.find((e) => e.slug === slug);
}

export function isGallerySlug(slug: string): slug is GallerySlug {
	return GALLERY_EXAMPLES.some((e) => e.slug === slug);
}

export function galleryPreviewImageFor(entry: GalleryExampleEntry): string {
	return galleryPreviewImageUrl(entry.slug);
}
