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
				autocomplete="old-password"
			/>
            <label for="newpassword">Nuova password</label>
			<input
				id="newpassword"
				type="password"
				bind:value={newpassword}
				required
				autocomplete="new-password"
			/>
		</div>
		<button type="submit" value="changepsw" class="btn btn-primary">cambio</button>
	</form>
</div>

<style>
	.register-container {
		background: #fff;
		max-width: 340px;
		margin: 80px auto;
		padding: 36px 28px;
		border-radius: 10px;
		box-shadow: 0 2px 12px rgba(60, 80, 120, 0.12);
	}

	h2 {
		text-align: center;
		margin-bottom: 32px;
		color: #1a274d;
		font-weight: 600;
		letter-spacing: 2px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	label {
		margin-bottom: 4px;
		color: #1a274d;
		font-size: 15px;
		font-weight: 500;
	}

	input[type='email'],
	input[type='password'] {
		padding: 10px 12px;
		border: 1px solid #1a274d;
		border-radius: 6px;
		font-size: 16px;
		outline: none;
		transition: border 0.2s;
		color: #000;
	}

	input[type='email']:focus,
	input[type='password']:focus {
		border-color: black;
	}
</style>
