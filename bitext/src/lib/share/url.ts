import { browser } from '$app/environment';

export function getShareUrl(dataParam: string): string {
	if (!browser) return '';
	const u = new URL(window.location.href);
	u.searchParams.set('data', dataParam);
	return u.toString();
}
