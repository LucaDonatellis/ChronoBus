<script>
	import Map from './Map.svelte';

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
</script>

<div class="flex flex-col h-full">
	<div class="">
		<h2 class=" text-2xl">Fermate più vicine</h2>
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
	<Map searchBar={1} />
</div>
