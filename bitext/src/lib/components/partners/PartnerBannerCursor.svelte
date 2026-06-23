<script lang="ts">
	import PartnerBannerShell from './PartnerBannerShell.svelte';

	const href = 'https://cursor.com/referral?code=T8B3DYFJSOF5';
</script>

<PartnerBannerShell
	title="Cursor — AI code editor"
	{href}
	ctaLabel="Open Cursor"
	partner="cursor"
	product="pro_subscription"
	toneClass="border-l-[#141414] bg-[#141414]/[0.06] dark:border-l-neutral-200 dark:bg-neutral-200/10"
>
	<p class="m-0">
		Cursor is my main AI coding tool. If you were going to try it anyway, this referral gives new
		accounts <strong class="font-medium text-gray-800 dark:text-gray-200"
			>50% off the first month</strong
		>
		of Pro, Pro+, or Ultra (per Cursor’s current offer).
	</p>
</PartnerBannerShell>
