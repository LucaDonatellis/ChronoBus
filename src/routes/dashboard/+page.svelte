<script>
	import Map from './Map.svelte';
	import { TriangleAlert } from '@lucide/svelte';

	let mapOpen = $state(false);

	const fermate = [
		{
			name: 'Fermata 1',
			arrivi: [
				{
					nome: 'centro',
					autobus: [
						{ linea: '5/', color: 'f5c500', time: 5 },
						{ linea: '13', color: 'BF6092', time: 12 }
					]
				},
				{
					nome: 'periferia',
					autobus: [
						{ linea: '5', color: 'f5c500', time: 21 },
						{ linea: 'CM', color: '000000', time: 33 }
					]
				}
			]
		},
		{
			name: 'Fermata 2',
			arrivi: [
				{
					nome: 'centro',
					autobus: [
						{ linea: '5/', color: 'f5c500', time: 5 },
						{ linea: '13', color: 'BF6092', time: 12 },
						{ linea: '13', color: 'BF6092', time: 21 }
					]
				}
			]
		},
		{
			name: 'Fermata 3',
			arrivi: [
				{
					nome: 'centro',
					autobus: [
						{ linea: '5/', color: 'f5c500', time: 5 },
						{ linea: '13', color: 'BF6092', time: 12 }
					]
				},
				{
					nome: 'periferia',
					autobus: [
						{ linea: '5', color: 'f5c500', time: 21 },
						{ linea: 'CM', color: '000000', time: 33 }
					]
				}
			]
		}
	];
	$effect(() => {
		const element = document.querySelector('#asd');
		if (mapOpen) {
			element.style.height = `${element.scrollHeight}px`;
			setTimeout(() => {
				element.style.height = '0';
			}, 0);
		} else {
			element.style.height = `${element.scrollHeight}px`;
		}
	});
</script>

<div class="flex h-full flex-col {mapOpen ? '' : 'p-2'}">
	<div class="transition-all" id="asd">
		<div class="flex justify-between overflow-hidden">
			<h2 class=" text-2xl">Fermate più vicine</h2>
			<div class="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
				<div class="indicator">
					<span class="indicator-item indicator-bottom badge badge-secondary badge-xs m-0.5 px-1"
						>23</span
					>
					<TriangleAlert />
				</div>
			</div>
		</div>
		{#each fermate as fermata}
			<div class="">
				<h3 class="text-xl">{fermata.name}</h3>
				<div class="flex">
					{#each fermata.arrivi as arrivo}
						<div class="w-full">
							<p>{arrivo.nome}</p>
							<div class="flex gap-1">
								{#each arrivo.autobus as bus}
									<div class="flex flex-col items-center justify-center">
										<div
											style="background: #{bus.color}"
											class="flex size-8 items-center justify-center rounded"
										>
											{bus.linea}
										</div>
										<p>{bus.time}'</p>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<Map bind:mapOpen />
</div>

