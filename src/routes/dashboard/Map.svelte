<script>
	import { onMount } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { Map } from './Map.js';

	let { mapOpen = $bindable(false), map = $bindable(undefined) } = $props();

	let mapElement = $state(null);

	onMount(async () => {
		map = new Map(mapElement);
		await map.init();
		busStopsMarker();
	});

	function busStopsMarker() {
		fetch(`/API/v2/trentino-trasporti/stops`)
			.then((res) => res.json())
			.then((stops) => {
				
				stops.forEach((stop) => {					
					const lines = stop.routes.map((r) => {return {name: r.routeShortName,color:"#"+r.routeColor}}).filter(e=>e.color!="#null");
					if (lines.length > 0) {
						map.addBusStop([stop.stopLat, stop.stopLon], stop.stopName,lines, "#000000",20);
					}
				});
			});
	}
	$effect(() => {
		mapElement.style.transform = `translateY(-${(!mapOpen && 25) || 0}%)`;
	});
</script>

<div class="relative z-2 h-max flex-grow overflow-hidden transition-all">
	<button
		class="btn absolute right-2 bottom-2 z-10000 p-2"
		hidden={!mapOpen}
		onclick={() => {
			mapOpen = false;
		}}><ChevronDown /></button
	>
	<div
		class="block h-full w-full"
		role="button"
		tabindex="0"
		onclick={() => {
			mapOpen = true;
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				mapOpen = true;
			}
		}}
		aria-pressed={mapOpen}
	>
		<div bind:this={mapElement} style="height: 100vh;" class="transition-transform"></div>
	</div>
</div>
