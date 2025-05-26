<script>
	import { onMount } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { Map } from './Map.js';

	let { mapOpen = $bindable(false) } = $props();

	let mapElement = $state(null);
	let map = undefined;

	onMount(async () => {
		map = new Map(mapElement);
		await map.init();
		busStopsMarker();
	});

	function busStopsMarker() {
		[
			[46.07193775170333, 11.119551927073022],
			[46.07693775170333, 11.120551927073022],
			[46.07993775170333, 11.121551927073022]
		].forEach((coords) => {
			map.addMarker(coords, 'busStopIcon.png');
		});
	}
	function mapClick(open) {
		mapOpen = open;
		mapElement.style.transform = `translateY(-${(!mapOpen && 25) || 0}%)`;
	}
</script>

<div class="relative z-2 h-max flex-grow overflow-hidden transition-all">
	<button
		class="btn absolute right-2 bottom-2 z-10000 p-2"
		hidden={!mapOpen}
		onclick={()=>{mapClick(false)}}><ChevronDown /></button
	>
	<div
		class="block h-full w-full"
		role="button"
		tabindex="0"
		onclick={()=>{mapClick(true)}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				mapClick(true);
			}
		}}
		aria-pressed={mapOpen}
	>
		<div bind:this={mapElement} style="height: 100vh;" class="transition-transform"></div>
	</div>
</div>
