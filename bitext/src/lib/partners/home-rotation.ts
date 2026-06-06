/**
 * Partner banner rotation.
 *
 * Home: two distinct partners per UTC hour (`getHomePartnerOrder`).
 * Example gallery pages: one partner per slug, stable across prerender/build (`getExamplePagePartnerId`).
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

/** FNV-1a 32-bit — stable string → integer for seeded picks. */
function hashSeedString(input: string): number {
	let h = 0x811c9dc5;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h | 0;
}

/** Uniform random shuffle (Fisher–Yates). Mutates `items`. */
function shuffleInPlace<T>(items: T[], rng: () => number): void {
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
}

/**
 * One partner for a prerendered example page. Seed with gallery `slug` so each page keeps
 * the same banner across visits and SSR/hydration match; partners are spread across slugs.
 */
export function getExamplePagePartnerId(slug: string): HomePartnerId {
	const seed = Math.imul(hashSeedString(`example:${slug}`), 0x9e3779b1) | 0;
	const rng = mulberry32(seed);
	const index = Math.floor(rng() * HOME_PARTNER_IDS.length);
	return HOME_PARTNER_IDS[index]!;
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
