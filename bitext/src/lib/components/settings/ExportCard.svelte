<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import ExportMenu from '$lib/components/share/ExportMenu.svelte';
</script>

<Card class="w-full p-4 sm:p-6">
	<h2 class="font-heading mb-2 text-lg font-semibold text-gray-900 dark:text-white">Export</h2>
	<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
		Exports match the preview area (measured after layout).
	</p>
	<ExportMenu />
</Card>
