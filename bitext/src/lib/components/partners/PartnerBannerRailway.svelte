<script lang="ts">
	import PartnerBannerShell from './PartnerBannerShell.svelte';

	const href = 'https://railway.com?referralCode=J6cBod';
</script>

<PartnerBannerShell
	title="Railway - easy deployment"
	{href}
	ctaLabel="Open Railway"
	partner="railway"
	product="hosting"
	toneClass="border-l-[#853bce] bg-[#853bce]/10 dark:bg-[#853bce]/15"
>
	<p class="m-0">
		This project is deployed on Railway. For me it works like a charm: I just add my repo and Railway builds and deploys it by itself. This link gives <strong class="font-medium text-gray-800 dark:text-gray-200"
			>$20 in credits</strong
		>. No pressure - use if it fits your stack.
	</p>
</PartnerBannerShell>
