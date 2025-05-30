<script>
	import Map from './Map.svelte';
	import { TriangleAlert } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let mapOpen = $state(false);

	onMount(() => {
		fetch('/API/v2/trentino-trasporti/stops?limit=4&lat=46.071850157579426&lon=11.120294030730001').then(
			async (res) => {
				let stops = await res.json();
				const groups = {};

				for (let stop of stops) {
					console.log("trips",(
						await (
							await fetch(`/API/v2/trentino-trasporti/trips_new?limit=2&stopId=${stop.stopId}`)
						).json()
					));
					
					stop.arrivals = (
						await (
							await fetch(`/API/v2/trentino-trasporti/trips_new?limit=2&stopId=${stop.stopId}`)
						).json()
					).map((arr) => ({
						ritardo: Math.round((new Date(arr.oraArrivoEffettivaAFermataSelezionata) -
							new Date()) /
							60000),
						routeColor: (stop.routes.find(
							(route) => route.routeId === arr.routeId
						)||{roudeColor:"000000"}).routeColor,
						routeShortName: (stop.routes.find(
							(route) => route.routeId === arr.routeId
						)||{routeShortName:"?"}).routeShortName,
					}));
					const key = stop.stopCode.slice(0, -1);

					if (!groups[key]) {
						groups[key] = [];
					}

					groups[key].push(stop);
				}
				stopsGroups = Object.values(groups).slice(0,3);
			}
		);
	});

	let stopsGroups = $state([]);
  
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
		{#each stopsGroups as stopsGroup}
			<div class="">
				<h3 class="text-xl">{stopsGroup[0].stopName}</h3>
				<div class="flex">
					{#each stopsGroup as stop}
						<div class="w-full">
							<p class="whitespace-nowrap">{stop.stopName}</p>
							<div class="flex gap-1">
								{#each stop.arrivals as arrival}
									<div class="flex flex-col items-center justify-center">
										<div
											style="background: #{arrival.routeColor}"
											class="flex size-8 items-center justify-center rounded"
										>
											{arrival.routeShortName}
										</div>
										<p>{arrival.ritardo}'</p>
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

