<script>
	import { LogIn } from '@lucide/svelte';
	import { successAlert, errorAlert } from '$lib/stores/alert';
	import { goto } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import { isAdmin } from '$lib/stores/admin';

	let email = $state('');
	let oldpassword = $state('');
    let newpassword = $state('');
    
    async function changepsw() {
		try {
			const res = await fetch('/API/v2/session/changePsw', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, oldpassword, newpassword})
			});
			const data = await res.json();

			if (res.ok) {
				successAlert(data.message || 'Cambio password eseguito!');
				isAdmin.set(data.isAdmin || false);

				goto('/dashboard');
			} else {
				errorAlert(data.error || 'Cambio password fallito');
			}
		} catch (err) {
			errorAlert('Errore di rete');
		}
	}
</script>

<div class="register-container">
	<h2>Cambio password</h2>
	<form onsubmit={changepsw}>
		<div style="display: grid; gap: 1rem; ">
			<label for="username">Email</label>
			<input id="username" type="email" bind:value={email} required autocomplete="username" />
			<label for="oldpassword">Vecchia password</label>
			<input
				id="oldpassword"
				type="password"
				bind:value={oldpassword}
				required
			/>
            <label for="newpassword">Nuova password</label>
			<input
				id="newpassword"
				type="password"
				bind:value={newpassword}
				required
			/>
		</div>
		<button type="submit" value="changepsw" class="btn btn-primary">cambio</button>
	</form>
</div>

