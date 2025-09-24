<script>
  import { LogIn } from '@lucide/svelte';
  import { successAlert, errorAlert } from '$lib/stores/alert';
  import { goto } from '$app/navigation';
  import { error } from '@sveltejs/kit';
  import { isAdmin } from '$lib/stores/admin';
  import { onMount } from 'svelte';
  import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

  let email = $state('');
  let password = $state('');
  let isGoogleInitialized = $state(false);

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
      errorAlert('Errore di rete');
    }
  }


  async function login() {
    try {
      const res = await fetch('/API/v2/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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


  
  function isGoogleReady() {
    return typeof window !== 'undefined' &&
      window.google?.accounts?.id;
  }

 	onMount(() => {
 	 const script = document.createElement('script');
 	 script.src = 'https://accounts.google.com/gsi/client';
  	script.async = true;
  	script.defer = true;
  	script.onload = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      });
          window.google.accounts.id.disableAutoSelect();

	isGoogleInitialized = true;

    }
  };
  document.head.appendChild(script);
});

  // Handle the response from Google Sign-In / Sign-Up
  async function handleGoogleCredentialResponse(response) {
    const idToken = response.credential;

    // Send the Google token to your backend for verification
     try {
      const res = await fetch('/API/v2/session/loginwithGoogle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        successAlert(data.message || 'Login successful!');
        isAdmin.set(data.isAdmin || false);
        goto('/dashboard');
      } else {
        errorAlert(data.error || 'Google authentication failed');
      }
    } catch (err) {
      errorAlert('Network Error with Google');
    }
  }

  
  async function choice(event) {
    event.preventDefault();
    const buttonValue = event.submitter?.value;
    if (buttonValue == 'signin') {
      await login();
    } else if (buttonValue == 'signup') {
      await register();
    }
  }

 async function continuegoogle(event) {
  event.preventDefault(); // evita il reload della pagina

  if (window.google?.accounts?.id) {
    // Inizializza di nuovo solo se non già inizializzato
    if (!isGoogleInitialized) {
      window.google.accounts.id.initialize({
        client_id: PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        ux_mode: 'popup'
      });
      isGoogleInitialized = true;
    }

    // Mostra il prompt (popup o automatico)
    window.google.accounts.id.prompt(notification => {
      if (notification.isNotDisplayed()) {
        console.warn('Google Sign-In not displayed:', notification.getNotDisplayedReason());
        errorAlert('Google Sign-In non mostrato. Controlla il browser o le impostazioni di blocco popup.');
      }

      if (notification.isSkippedMoment()) {
        console.warn('Google Sign-In was skipped:', notification.getSkippedReason());
      }

      if (notification.isDismissedMoment()) {
        console.warn('Google Sign-In was dismissed');
      }
    });

  } else {
    errorAlert('Google SDK non inizializzato correttamente.');
  }
}


</script>

<div class="min-h-screen grid place-items-center">
  <div class="bg-white max-w-[340px] p-9 px-7 rounded-[10px] shadow-[0_2px_12px_rgba(60,80,120,0.12)]">
    <h2 class="text-center mb-8 text-[#1a274d] font-semibold tracking-[2px]">Auth</h2>
    <form onsubmit={choice} class="flex flex-col gap-4">
      <div class="grid gap-4">
        <label for="username" class="mb-1 text-[#1a274d] text-[15px] font-medium">Email</label>
        <input
          id="username"
          type="email"
          bind:value={email}
          required
          autocomplete="username"
          class="py-2.5 px-3 border border-[#1a274d] rounded-lg text-base outline-none transition-colors duration-200 text-black focus:border-black"
        />
        <label for="password" class="mb-1 text-[#1a274d] text-[15px] font-medium">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          autocomplete="new-password"
          class="py-2.5 px-3 border border-[#1a274d] rounded-lg text-base outline-none transition-colors duration-200 text-black focus:border-black"
        />
      </div>
	  <div class="flex gap-3 mt-4">
        <button type="submit" value="signin" class="flex-1 bg-[#1a274d] text-white font-semibold py-2 rounded-lg transition-colors hover:bg-[#273869]">
          Sign in
        </button>
        <button type="submit" value="signup" class="flex-1 bg-gray-200 text-[#1a274d] font-semibold py-2 rounded-lg border border-[#1a274d] transition-colors hover:bg-gray-300">
          Sign up
        </button>
      </div>
	  <div>
    </form>
	<form onsubmit={continuegoogle} class="flex flex-col gap-4">
		<div class="mt-4">
			<button
			type="submit"
			value="continuewithgoogle"
			name="intent"
			class="w-full flex items-center justify-center gap-3 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition text-sm font-medium"
			disabled={!isGoogleInitialized}
			>
			<img
				src="https://auth-cdn.oaistatic.com/assets/google-logo-NePEveMl.svg"
				width="18"
				height="18"
				alt="Google logo"
			/>
			Continue with Google
			</button>
      </div>
	</form>
  </div>
</div>