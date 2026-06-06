export const prerender = true;

import { error } from '@sveltejs/kit';
import { findGalleryBySlug, galleryPreviewImageFor, GALLERY_EXAMPLES } from '$lib/examples/catalog.js';
import { getExamplePagePartnerId } from '$lib/partners/home-rotation.js';
import type { PageLoad } from './$types';

export function entries() {
	return GALLERY_EXAMPLES.map((entry) => ({ slug: entry.slug }));
}

export const load: PageLoad = ({ params }) => {
	const entry = findGalleryBySlug(params.slug);
	if (!entry) error(404, 'Example not found');
	return {
		entry,
		previewImageUrl: galleryPreviewImageFor(entry),
		exampleSlug: entry.slug,
		partnerId: getExamplePagePartnerId(entry.slug)
	};
};
