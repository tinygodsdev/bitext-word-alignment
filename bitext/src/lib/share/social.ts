export function shareTwitterUrl(text: string, url: string): string {
	const u = new URL('https://twitter.com/intent/tweet');
	u.searchParams.set('text', text);
	u.searchParams.set('url', url);
	return u.toString();
}

export function shareFacebookUrl(url: string): string {
	const u = new URL('https://www.facebook.com/sharer/sharer.php');
	u.searchParams.set('u', url);
	return u.toString();
}

export function shareRedditUrl(title: string, url: string): string {
	const u = new URL('https://www.reddit.com/submit');
	u.searchParams.set('title', title);
	u.searchParams.set('url', url);
	return u.toString();
}
