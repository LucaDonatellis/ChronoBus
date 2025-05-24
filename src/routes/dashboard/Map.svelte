<script>
	import { Search } from '@lucide/svelte';

	let { mapOpen = $bindable() } = $props();
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	let mapElement = $state(null);
	let map = null;

	onMount(async () => {
		const L = await import('leaflet');
		mapElement.style.transform = 'translateY(-25%)';

		map = L.map(mapElement, {
			zoomControl: false
		}).setView([46.04, 11.13], 13);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		map.locate({ setView: false, maxZoom: 15 });

		userPositionCircle();
	});
	function userPositionCircle() {
		if (navigator.geolocation) {
			let accuracyCircle = null;
			let userCircle = null;
			navigator.geolocation.watchPosition(
				(pos) => {
					const lat = pos.coords.latitude;
					const lng = pos.coords.longitude;
					const accuracy = pos.coords.accuracy;

					const userLatLng = [lat, lng];

					if (!accuracyCircle) {
						accuracyCircle = L.circle(userLatLng, { radius: accuracy, weight: 2 }).addTo(map);
						userCircle = L.circleMarker(userLatLng, {
							fill: true,
							color: '#ffffff',
							fillOpacity: 1,
							weight: 2,
							fillColor: '#0045ff',
							radius: 8
						}).addTo(map);
						map.setView(userLatLng, 15);
					} else {
						accuracyCircle.setLatLng(userLatLng);
						userCircle.setLatLng(userLatLng);
						accuracyCircle.setRadius(accuracy);
					}
				},
				(err) => {
					console.error('Geolocalization error:', err.message);
				},
				{
					enableHighAccuracy: true,
					maximumAge: 10000,
					timeout: 10000
				}
			);
		}
	}
	function mapClick() {
		mapOpen = !mapOpen;
		mapElement.style.transform = `translateY(-${(!mapOpen && 25) || 0}%)`;
	}
</script>

<div class="relative z-2 h-max flex-grow overflow-hidden transition-all">
	<div class="absolute z-10000 w-full p-2" hidden={!mapOpen}>
		<label class="input w-full rounded-full">
			<Search />
			<input type="search" required placeholder="Cerca" class="w-full" />
		</label>
	</div>
	<div
		class="block h-full w-full"
		role="button"
		tabindex="0"
		onclick={mapClick}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				mapClick();
			}
		}}
		aria-pressed={mapOpen}
	>
		<div bind:this={mapElement} style="height: 100vh;" class="transition-transform"></div>
	</div>
</div>

<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
	integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
	crossorigin=""
/>
