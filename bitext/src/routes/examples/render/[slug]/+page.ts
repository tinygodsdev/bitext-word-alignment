export const prerender = false;

import { error } from '@sveltejs/kit';
import { findGalleryBySlug } from '$lib/examples/catalog.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entry = findGalleryBySlug(params.slug);
	if (!entry) error(404, 'Example not found');
	return { entry };
};
