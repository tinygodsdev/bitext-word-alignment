import { getHomePartnerOrder } from '$lib/partners/home-rotation.js';
import { decodeState } from '$lib/serialization/decode.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const data = url.searchParams.get('data');
	return {
		dataParam: data,
		initialState: data ? decodeState(data) : null,
		homePartnerOrder: getHomePartnerOrder(Date.now())
	};
};
