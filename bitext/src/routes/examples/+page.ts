export const prerender = true;

import { GALLERY_EXAMPLES, galleryPreviewImageFor } from '$lib/examples/catalog.js';

export function load() {
	return {
		examples: GALLERY_EXAMPLES.map((entry) => ({
			slug: entry.slug,
			title: entry.title,
			description: entry.description,
			imageAlt: entry.imageAlt,
			previewImageUrl: galleryPreviewImageFor(entry)
		}))
	};
}
