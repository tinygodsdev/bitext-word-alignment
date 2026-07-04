<script lang="ts">
	let {
		options,
		value,
		onSelect,
		label
	}: {
		options: { value: string; label: string }[];
		value: string;
		onSelect: (value: string) => void;
		label: string;
	} = $props();

	const btnBase =
		'flex-1 border px-2 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900';
	const btnOn =
		'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-600';
	const btnOff =
		'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/80';
</script>

<div class="flex" role="radiogroup" aria-label={label}>
	{#each options as opt (opt.value)}
		<button
			type="button"
			role="radio"
			aria-checked={value === opt.value}
			class="{btnBase} {value === opt.value ? btnOn : btnOff} -ml-px first:ml-0"
			onclick={() => onSelect(opt.value)}
		>
			{opt.label}
		</button>
	{/each}
</div>
