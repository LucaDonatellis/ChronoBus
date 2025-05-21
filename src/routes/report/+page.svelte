<script>
    import {OctagonAlert, Bus, BookDashed, Armchair, Users} from "@lucide/svelte"
	const lines = ['1', '2', '3', '4', '5', '5/', 'CM'];
	let line = $state();
	let time = $state();
	let crowdedness = $state();

    let message = $state();
    let success = $state();
    let error = $state();

    async function sendReport() {
		try {
			const res = await fetch('/API/v1/reports', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ line, time,crowdedness })
			});
			const data = await res.json();

			if (res.ok) {
				message = data.message || 'Report inviato con successo!';
				success = true;
				setTimeout(() => {
					window.location.href = '/dashboard';
				}, 1200); 
			} else {
			}
		} catch (err) {
            console.log(err);
            
			success = false;
			error = 'Errore di rete';
		}
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
{crowdedness}
{error} {message} {success}