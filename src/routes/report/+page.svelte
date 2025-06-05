<script>
	import { goto } from '$app/navigation';
	import { errorAlert, successAlert } from '$lib/stores/alert';
	import { postfwt } from '$lib/utils/fetch';
	import { OctagonAlert, Bus, BookDashed, Armchair, Users } from '@lucide/svelte';

	const lines = ['1', '2', '3', '4', '5', '5/', 'CM'];
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
</script>

<div class="flex flex-col items-center gap-4 pt-10">
	<div class="w-80">
		<div>
			<h3>Linea</h3>
			<select class="select w-full" bind:value={line}>
				{#each lines as line}
					<option value={line}> {line}</option>
				{/each}
			</select>
		</div>
		<div>
			<h3>Orario</h3>
			<input type="datetime-local" class="w-full" bind:value={time} />
		</div>
		<div class="flex">
			<BookDashed
				onclick={() => {
					crowdedness = 'almost_empty';
				}}
			/>
			<Armchair
				onclick={() => {
					crowdedness = 'empty_seats';
				}}
			/>
			<Bus
				onclick={() => {
					crowdedness = 'seats_full';
				}}
			/>
			<Users
				onclick={() => {
					crowdedness = 'crowded';
				}}
			/>
			<OctagonAlert
				onclick={() => {
					crowdedness = 'overcrowded';
				}}
			/>
		</div>
		<button class="btn w-full" onclick={sendReport}>Invia</button>
	</div>
</div>
