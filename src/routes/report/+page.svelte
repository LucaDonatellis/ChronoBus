<script>
	import { goto } from '$app/navigation';
	import { errorAlert, successAlert } from '$lib/stores/alert';
	import { postfwt } from '$lib/utils/fetch';
	import { TriangleAlert, Bus, BookDashed, Armchair, Users } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let lines = $state([]);
	let line = $state();
	let time = $state();
	let crowdedness = $state();

	async function sendReport() {
		postfwt('reports', { line, time, crowdedness })
			.then((data) => {
				successAlert(data.message || 'Report inviato con successo!');
				goto('/dashboard');
			})
			.catch((err) => {
				errorAlert(err || 'Errore backend');
				if (err.status === 401) {
					goto('/profile/login');
				}
			});
	}
	onMount(() => {
		fetch('/API/v2/trentino-trasporti/lines')
			.then((response) => response.json())
			.then((data) => {
				lines = data;
			})
			.catch((err) => {
				errorAlert(err || 'Errore nel caricamento delle linee');
			});
	});
</script>

<div class="flex flex-col items-center gap-4 pt-10">
	<div class="flex w-80 flex-col gap-2">
		<h2 class=" text-2xl font-semibold">Segnalazione</h2>
		<div>
			<h3 class="font-medium">Linea</h3>
			<div class="flex flex-wrap gap-2">
				{#each lines as l}
					<label class="flex cursor-pointer items-center">
						<input
							type="radio"
							name="line"
							class="hidden"
							bind:group={line}
							value={l.routeShortName}
						/>
						<span
							class="size-7 rounded text-center font-semibold text-white"
							style="border: 2px solid #{l.routeColor};background:{line === l.routeShortName
								? '#' + l.routeColor
								: ''}; opacity: {line === l.routeShortName ? 1 : 0.6};"
						>
							{l.routeShortName}
						</span>
					</label>
				{/each}
			</div>
		</div>
		<div>
			<h3 class="font-medium">Orario</h3>
			<input type="datetime-local" class="input w-full" bind:value={time} />
		</div>
		<h3 class="font-medium">Affollamento</h3>
		<div class="flex flex-col items-center gap-1">
			{#each [{ value: 'almost_empty', label: 'quasi vuoto', color: 'blue', size: 'radio-xs' }, { value: 'empty_seats', label: 'posti liberi', color: 'green', size: 'radio-sm' }, { value: 'seats_full', label: 'posti pieni', color: 'yellow', size: 'radio-md' }, { value: 'crowded', label: 'affollato', color: 'orange', size: 'radio-lg' }, { value: 'overcrowded', label: 'sovraffollato', color: 'red', size: 'radio-xl' }] as c}
				<label class="flex w-full flex-row items-center justify-start">
					<div class="flex items-center justify-center" style="min-width: 2.5rem;">
						<input
							type="radio"
							name="crowdedness"
							class={`radio ${c.size} border-${c.color}-500 checked:bg-${c.color}-300 checked:text-${c.color}-500`}
							bind:group={crowdedness}
							value={c.value}
						/>
					</div>
					<span class="label-text">{c.label}</span>
				</label>
			{/each}
		</div>
		<button class="btn btn-success mt-2 w-full" onclick={sendReport}>Invia</button>
	</div>
</div>
