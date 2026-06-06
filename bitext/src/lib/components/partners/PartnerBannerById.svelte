<script lang="ts">
	import type { HomePartnerId } from '$lib/partners/home-rotation.js';
	import PartnerBannerCursor from './PartnerBannerCursor.svelte';
	import PartnerBannerPreply from './PartnerBannerPreply.svelte';
	import PartnerBannerRailway from './PartnerBannerRailway.svelte';
	import PartnerBannerWise from './PartnerBannerWise.svelte';

	let { partnerId }: { partnerId: HomePartnerId } = $props();

	const bannerById = {
		preply: PartnerBannerPreply,
		railway: PartnerBannerRailway,
		cursor: PartnerBannerCursor,
		wise: PartnerBannerWise
	} as const;

	const Banner = $derived(bannerById[partnerId]);
</script>

<Banner />
