<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getfwt, postfwt, deletefwt } from '$lib/utils/fetch.js';
	import { errorAlert, successAlert } from '$lib/stores/alert';
	import { browser } from '$app/environment';
	import { get } from 'mongoose';

	let newText = $state('');
	let newEndTime = $state('');
	let officialReports = $state([]);

	onMount(async () => {
		fetchReports();
	});

	function fetchReports() {
		getfwt('official_report')
			.then((data) => {
				officialReports = data;
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	}

	async function addReport() {
		if (!newText || !newEndTime) {
			errorAlert('Testo e data di scadenza sono obbligatori.');
			return;
		}

		postfwt('official_report', {
			text: newText,
			expireAt: newEndTime
		})
			.then(() => {
				fetchReports();
				newText = '';
				newEndTime = '';
				successAlert('Segnalazione aggiunta con successo.');
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	}

	async function deleteReport(id) {
		deletefwt(`official_report/${id}`)
			.then(() => {
				officialReports = officialReports.filter((report) => report._id !== id);
				successAlert('Segnalazione eliminata con successo.');
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	}
</script>

<div class="flex flex-1 flex-col overflow-hidden p-2">
	<div class="space-y-2">
		<h2 class="text-xl font-semibold">Nuova Segnalazione</h2>
		<h3 class="h3 font-medium">Annuncio</h3>
		<textarea placeholder="Testo" class="textarea input-bordered w-full" bind:value={newText}
		></textarea>
		<h3 class="h3 font-medium">Scadenza</h3>
		<input type="datetime-local" class="input input-bordered w-full" bind:value={newEndTime} />
		<button class="btn btn-primary w-full" onclick={addReport}>Aggiungi</button>
	</div>

	<h2 class="mt-2 mb-2 text-xl font-semibold">Segnalazioni</h2>
	<div class="flex-1 overflow-scroll">
		{#if officialReports.length === 0}
			<p>Nessuna segnalazione presente.</p>
		{/if}
		{#each officialReports as report (report._id)}
			<div class="card bg-base-200 mb-3 p-4 shadow">
				<div class="flex items-center justify-between">
					<div>
						<p><strong>Testo:</strong> {report.text}</p>
						<p><strong>Fine:</strong> {new Date(report.expireAt).toLocaleString()}</p>
					</div>
					<button class="btn btn-sm btn-error" onclick={() => deleteReport(report._id)}
						>Elimina</button
					>
				</div>
			</div>
		{/each}
	</div>
</div>
