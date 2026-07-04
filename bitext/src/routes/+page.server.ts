import { loadHomePage } from '$lib/server/home-page-load.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => loadHomePage(url);
