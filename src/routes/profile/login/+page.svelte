<script>
	import { LogIn } from "@lucide/svelte";

	let email = '';
	let password = '';
	let error = '';
	let success = false;
	let message = '';

	async function register() {
		error = '';
		message = '';
		success = false;
		try {
			const res = await fetch('/API/v1/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();

			if (res.ok && data.token) {
				email = '';
				password = '';
				localStorage.setItem('token', data.token);
				success = true;
				error = '';
				message = data.message || 'Registrazione effettuata con successo.';
				setTimeout(() => {
					window.location.href = '/dashboard';
				}, 1200); // attendo un secondo per mostrare il messaggio
			} else if (data.error && data.error.toLowerCase().includes('registrata')) {
				// Errore: email già esistente
				error = "L'email inserita è già registrata. Prova con un'altra email.";
				success = false;
			} else {
				error = data.error || 'Errore backend';
				success = false;
			}
		} catch (e) {
			error = 'Errore di connessione.';
			success = false;
		}
	}

	async function login() {
    try {
      const res = await fetch('/API/v1/session/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        message = data.message || 'Login eseguito!';
		success = true;

        localStorage.setItem('token', data.token);
		setTimeout(() => {
			window.location.href = '/dashboard';
		}, 1200); 
      } else {
		success = false;
        error = data.error || 'Login fallito';
      }
    } catch (err) {
	  success = false;
      error = 'Errore di rete';
    }
  }

	function choice(event){
		event.preventDefault();
    	const buttonValue = event.submitter?.value;
    	if(buttonValue=="signin"){
			login();
		}else if(buttonValue=="signup"){
			register();
		}
	}
</script>

<div class="register-container">
	<h2>Auth</h2>
	<form on:submit|preventDefault={choice}>
		{#if error}
			<div class="error-message">{error}</div>
		{/if}
		{#if success && message}
			<div class="success-message">{message}</div>
		{/if}
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
		<button type="submit" value="signin">Sign in</button>
		<button type="submit" value="signup">Sign up</button>
	</form>
</div>

<style>
	body {
		background: #f3f6fa;
		font-family: 'Segoe UI', Arial, sans-serif;
	}

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

	.error-message {
		color: #e82c2a;
		background: #fff2f2;
		padding: 8px 10px;
		border-radius: 4px;
		margin-bottom: 4px;
		font-size: 14px;
		text-align: center;
	}

	.success-message {
		color: #208229;
		background: #ebfaef;
		padding: 8px 12px;
		border-radius: 4px;
		margin-bottom: 4px;
		font-size: 15px;
		text-align: center;
		margin-top: 12px;
	}

	button {
		background: #385ad1;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 11px 0;
		font-size: 17px;
		cursor: pointer;
		font-weight: 500;
		letter-spacing: 1px;
		transition: background 0.2s;
	}

	button:hover {
		background: #2745a6;
	}
</style>
