<script>
	import Map from './Map.svelte';
	import { TriangleAlert } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let mapOpen = $state(false);

	let map = $state(undefined);
	let showAnnouncements = $state(false);
	let interval;

	onMount(async () => {
		clearInterval(interval);
		interval = setInterval(async () => {
			updateNearArrivals();
		}, 10000);
		let interval = setInterval(() => {
			if (map && map.userLatLon) {
				updateNearArrivals();
				clearInterval(interval);
			}
		}, 500);
		fetchReports();
	});

	async function updateNearArrivals() {
		let stops = await (
			await fetch(
				`/API/v2/trentino-trasporti/stops/with_arrivals?limit=4&lat=${map && map.userLatLon ? map.userLatLon[0] : 0}&lon=${map && map.userLatLon ? map.userLatLon[1] : 0}`
			)
		).json();
		const groups = {};

		for (let stop of stops) {
			const key = stop.stopCode.slice(0, -1);

			if (!groups[key]) {
				groups[key] = [];
			}

			groups[key].push(stop);
		}
		stopsGroups = Object.values(groups).slice(0, 3);
	}

	let stopsGroups = $state([]);

	$effect(() => {
		stopsGroups;

		const element = document.querySelector('#map');
		if (mapOpen) {
			element.style.height = `${element.scrollHeight}px`;
			setTimeout(() => {
				element.style.height = '0';
			}, 0);
		} else {
			element.style.height = `${element.scrollHeight}px`;
		}
	});

	let announcements = $state([]);

	async function fetchReports() {
		try {
			const res = await fetch('/API/v2/official_report', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			if (res.ok) {
				announcements = await res.json();
			} else if (res.status === 401) {
				//goto('/login');
			}
		} catch (error) {
			console.error('Error fetching reports:', error);
		}
	}
</script>

<div class="toast toast-top toast-start top-2 left-2 gap-1 max-w-9/12" class:hidden={!showAnnouncements}>
	{#each announcements as announcement}
		<div class="alert alert-warning p-2">
			<span>{announcement.text}</span>
		</div>
	{/each}
</div>
<div class="flex h-full flex-col {mapOpen ? '' : 'p-2'}">
	<div class="transition-all" id="map">
		<div class="flex justify-between">
			<h2 class=" text-2xl font-semibold">Fermate più vicine</h2>
			<button class="bg-primary flex h-9 w-9 items-center justify-center rounded-full" onclick={() => (showAnnouncements = !showAnnouncements)} >
				<div class="indicator">
					<span class="indicator-item indicator-bottom badge badge-secondary badge-xs m-0.5 px-1"
						>{announcements.length}</span
					>
					<TriangleAlert />
				</div>
			</button>
		</div>
		{#if stopsGroups.length === 0 || map.userLatLon === null}
			<div class="skeleton h-80 w-full"></div>
		{:else}
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
		{/if}
	</div>
	<Map bind:mapOpen bind:map />
</div>
