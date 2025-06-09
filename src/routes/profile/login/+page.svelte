<script>
	import { LogIn } from '@lucide/svelte';
	import { successAlert, errorAlert } from '$lib/stores/alert';
	import { goto } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import { isAdmin } from '$lib/stores/admin';

	let email = $state('');
	let password = $state('');

	async function register() {
		try {
			const res = await fetch('/API/v2/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();

			if (res.ok && data.token) {
				email = '';
				password = '';
				localStorage.setItem('token', data.token);
				successAlert(data.message || 'Registrazione effettuata con successo.');
				goto('/dashboard');
			} else if (data.error && data.error.toLowerCase().includes('registrata')) {
				errorAlert("L'email inserita è già registrata. Prova con un'altra email.");
			} else {
				errorAlert(data.error || 'Errore backend');
			}
		} catch (e) {
			errorAlert('Errore di rete.');
		}
	}

	async function login() {
		try {
			const res = await fetch('/API/v2/session/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();

			if (res.ok && data.token) {
				successAlert(data.message || 'Login eseguito!');
				isAdmin.set(data.isAdmin || false);

				localStorage.setItem('token', data.token);
				goto('/dashboard');
			} else {
				errorAlert(data.error || 'Login fallito');
			}
		} catch (err) {
			errorAlert('Errore di rete');
		}
	}

	function choice(event) {
		event.preventDefault();
		const buttonValue = event.submitter?.value;
		if (buttonValue == 'signin') {
			login();
		} else if (buttonValue == 'signup') {
			register();
		}
	}
</script>

<div class="register-container">
	<h2>Auth</h2>
	<form onsubmit={choice}>
		<div style="display: grid; gap: 1rem; ">
			<label for="username">Email</label>
			<input id="username" type="email" bind:value={email} required autocomplete="username" />
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				required
				autocomplete="new-password"
			/>
		</div>
		<button type="submit" value="signin" class="btn btn-primary">Sign in</button>
		<button type="submit" value="signup" class="btn btn-secondary">Sign up</button>
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
