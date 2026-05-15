/**
 * Home page shows two partner banners in fixed regions (intro column + settings sidebar).
 * Each hour (UTC, by Unix time) we pick two *distinct* partners from `HOME_PARTNER_IDS`;
 * all ids participate in rotation as the set grows.
 *
 * Order is computed once per request on the server so SSR and hydration match.
 */
export const HOME_PARTNER_IDS = ['preply', 'railway', 'cursor', 'wise'] as const;
export type HomePartnerId = (typeof HOME_PARTNER_IDS)[number];

function mulberry32(seed: number) {
	return function () {
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Uniform random shuffle (Fisher–Yates). Mutates `items`. */
function shuffleInPlace<T>(items: T[], rng: () => number): void {
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
}

/**
 * `[introColumn, settingsSidebar]` — two different partners; every ordered pair among
 * `HOME_PARTNER_IDS` is equally likely for a given draw.
 */
export function getHomePartnerOrder(nowMs: number): [HomePartnerId, HomePartnerId] {
	const bucket = homePartnerHourBucketUtc(nowMs);
	const seed = Math.imul(bucket ^ 0xdeadbeef, 0x9e3779b1) | 0;
	const rng = mulberry32(seed);
	const pool = [...HOME_PARTNER_IDS] as HomePartnerId[];
	shuffleInPlace(pool, rng);
	if (pool.length < 2) {
		throw new Error('HOME_PARTNER_IDS must contain at least two partners for two slots');
	}
	return [pool[0], pool[1]];
}

/** Unix ms → bucket index; advances every 3600 s of Unix time (UTC-hour boundaries). */
export function homePartnerHourBucketUtc(nowMs: number): number {
	return Math.floor(nowMs / 3_600_000);
}
