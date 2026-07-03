<script lang="ts">
	import ExportMenu from '$lib/components/share/ExportMenu.svelte';
	import ShareQuickRow from '$lib/components/share/ShareQuickRow.svelte';
</script>

<div class="flex flex-col gap-5">
	<div>
		<p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
			Download
		</p>
		<ExportMenu />
	</div>
	<ShareQuickRow />
</div>
