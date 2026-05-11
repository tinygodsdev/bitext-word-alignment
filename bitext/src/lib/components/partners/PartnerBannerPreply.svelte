<script lang="ts">
	import PartnerBannerShell from './PartnerBannerShell.svelte';

	const href =
		'https://preply.com/en/?pref=MjI1NTg5OTI=&id=1778450837.497915&ep=w2';
</script>

<PartnerBannerShell
	title="Preply — language tutors"
	{href}
	ctaLabel="Open Preply"
	partner="preply"
	product="language_tutors"
	toneClass="border-l-[#FF7AAC] bg-[#FF7AAC]/10 dark:bg-[#FF7AAC]/15"
>
	<p class="m-0">
		Personally, I use Preply for language learning. If you want to try an online
		tutor, our link includes{' '}
		<strong class="font-medium text-gray-800 dark:text-gray-200">70% off the trial lesson</strong>. 
		We earn a small bonus if you go on to paid lessons - it helps to keep the site running.
	</p>
</PartnerBannerShell>
