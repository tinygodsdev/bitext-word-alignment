<script lang="ts">
	import PartnerBannerShell from './PartnerBannerShell.svelte';

	const href = 'https://wise.com/invite/dlpc/danip204';
</script>

<PartnerBannerShell
	title="Wise — international transfers"
	{href}
	ctaLabel="Open Wise"
	partner="wise"
	product="money_transfer"
	toneClass="border-l-[#9fe870] bg-[#9fe870]/10 dark:bg-[#9fe870]/15"
>
	<p class="m-0">
		Sometimes I have trouble with money transfers in my country. Wise worked for me without too much
		hassle. With this invite, new sign-ups get a
		<strong class="font-medium text-gray-800 dark:text-gray-200">fee-free first transfer</strong>
		up to roughly <strong class="font-medium text-gray-800 dark:text-gray-200">US$600</strong>
		equivalent.
	</p>
</PartnerBannerShell>
