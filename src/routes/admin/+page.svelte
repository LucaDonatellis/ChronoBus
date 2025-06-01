<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getfwt, postfwt, deletefwt } from '$lib/utils/fetch.js';
	import { errorAlert } from '$lib/stores/alert';

	let newText = $state('');
	let newEndTime = $state('');
	let reports = $state([]);

	onMount(async () => {
		fetchReports();
	});

	function fetchReports() {
		getfwt('official_report')
			.then((data) => {
				reports = data;
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	}

	async function addReport() {
		if (!newText || !newEndTime){
			errorAlert('Testo e data di scadenza sono obbligatori.');
			return;
		};

		postfwt('official_report', {
			text: newText,
			expireAt: newEndTime
		})
			.then(() => {
				fetchReports();
				newText = '';
				newEndTime = '';
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	}

	async function deleteReport(id: string) {
		deletefwt(`official_report/${id}`)
			.then(() => {
				reports = reports.filter((report) => report._id !== id);
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	}

	function logout() {
		localStorage.removeItem('token');
		goto('/profile/login');
	}
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-bold">Pannello Admin</h1>

	<div class="mt-6 space-y-4">
		<h2 class="text-xl font-semibold">Nuova Segnalazione</h2>
		<textarea placeholder="Testo" class="textarea input-bordered w-full" bind:value={newText}
		></textarea>
		<input type="datetime-local" class="input input-bordered w-full" bind:value={newEndTime} />
		<button class="btn btn-primary mt-2" onclick={addReport}>Aggiungi</button>
	</div>

	<div class="mt-8">
		<h2 class="mb-4 text-xl font-semibold">Segnalazioni</h2>
		{#each reports as report (report._id)}
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
	<button class="btn btn-error" onclick={logout}>Logout</button>
</div>
