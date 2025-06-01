<script lang="ts">
	import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let newText = $state('');
    let newEndTime = $state('');
    let reports = $state([]);

    // Carica i report all'avvio
    onMount(async () => {
        await fetchReports();
    });

	async function fetchReports() {
        try {
            const res = await fetch('/API/v2/official_report', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                reports = await res.json();
            } else if (res.status === 401) {
                //goto('/login');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }

	async function addReport() {
        if (!newText || !newEndTime) return;

        try {
            const res = await fetch('/API/v2/official_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    text: newText,
                    endingTime: newEndTime
                })
            });

            if (res.ok) {
                await fetchReports();
                newText = '';
                newEndTime = '';
            } else if (res.status === 401) {
                //goto('/login');
            }
        } catch (error) {
            console.error('Error adding report:', error);
        }
    }

	async function deleteReport(id: string) {
        try {
            const res = await fetch(`/API/v2/official_report/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                reports = reports.filter(report => report._id !== id);
            } else if (res.status === 401) {
                //goto('/login');
            }
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    }

    function logout() {
        localStorage.removeItem('token');
        //goto('/login');
    }
</script>

<div class="p-6 space-y-6">
	<h1 class="text-2xl font-bold">Pannello Admin</h1>

	

	<div class="mt-6 space-y-4">
		<h2 class="text-xl font-semibold">Nuova Segnalazione</h2>
		<textarea placeholder="Testo" class="textarea input-bordered w-full" bind:value={newText}></textarea>
		<input type="datetime-local" class="input input-bordered w-full" bind:value={newEndTime} />
		<button class="btn btn-primary mt-2" onclick={addReport}>Aggiungi</button>
	</div>

	<div class="mt-8">
		<h2 class="text-xl font-semibold mb-4">Segnalazioni</h2>
		{#each reports as report (report._id)}
			<div class="card bg-base-200 shadow p-4 mb-3">
				<div class="flex justify-between items-center">
					<div>
						<p><strong>Testo:</strong> {report.text}</p>
						<p><strong>Fine:</strong> {new Date(report.endingTime).toLocaleString()}</p>
					</div>
					<button class="btn btn-sm btn-error" onclick={() => deleteReport(report._id)}>Elimina</button>
				</div>
			</div>
		{/each}
	</div>
    <button class="btn btn-error" onclick={logout}>Logout</button>
</div>
