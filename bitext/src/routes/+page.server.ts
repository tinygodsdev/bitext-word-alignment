import { getHomePartnerOrder } from '$lib/partners/home-rotation.js';
import { buildAppStateFromExample } from '$lib/examples/build-app-state.js';
import { findGalleryBySlug } from '$lib/examples/catalog.js';
import { findExample } from '$lib/state/examples.js';
import { decodeState } from '$lib/serialization/decode.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const data = url.searchParams.get('data');
	const exampleParam = url.searchParams.get('example');

	let initialState = data ? decodeState(data) : null;
	let exampleInvalid = false;

	if (!initialState && exampleParam) {
		const gallery = findGalleryBySlug(exampleParam);
		if (gallery) {
			initialState = buildAppStateFromExample(findExample(gallery.exampleId));
		} else {
			exampleInvalid = true;
		}
	}

	return {
		dataParam: data,
		initialState,
		exampleInvalid,
		homePartnerOrder: getHomePartnerOrder(Date.now())
	};
};
