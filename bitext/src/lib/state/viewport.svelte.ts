import { browser } from '$app/environment';

/** Viewport flags — `isNarrow` means below Tailwind `lg` (1024px). Used for line settings sheet vs popover. */

class ViewportStore {
	isNarrow = $state(false);

	init(): (() => void) | undefined {
		if (!browser) return;
		this.sync();
		const mq = window.matchMedia('(max-width: 1023px)');
		const onChange = () => this.sync();
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}

	sync() {
		if (!browser) return;
		this.isNarrow = window.matchMedia('(max-width: 1023px)').matches;
	}
}

export const viewportStore = new ViewportStore();
