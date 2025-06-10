<script>
	import { LogIn } from '@lucide/svelte';
	import { successAlert, errorAlert } from '$lib/stores/alert';
	import { goto } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import { isAdmin } from '$lib/stores/admin';

	let email = $state('');
    let codice = $state('');
    let password = $state('');
    
    async function pswrec() {
		try {
			const res = await fetch('/API/v2/session/pswrec/modulecheck', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, codice, password})
			});
			const data = await res.json();

			if (res.ok) {
				successAlert(data.message || 'Password modificata con successo');
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

<div class="min-h-screen grid place-items-center">
	<div class="bg-white max-w-[340px] p-9 px-7 rounded-[10px] shadow-[0_2px_12px_rgba(60,80,120,0.12)]">
	  <h2 class="text-center mb-8 text-[#1a274d] font-semibold tracking-[2px]">
		Password dimenticata
	  </h2>
	  <form onsubmit={pswrec} class="flex flex-col gap-4">
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
  
		  <label for="code" class="mb-1 text-[#1a274d] text-[15px] font-medium">Codice</label>
		  <input
			id="code"
			type="text"
			bind:value={codice}
			required
			class="py-2.5 px-3 border border-[#1a274d] rounded-lg text-base outline-none transition-colors duration-200 text-black focus:border-black"
		  />
  
		  <label for="password" class="mb-1 text-[#1a274d] text-[15px] font-medium">Nuova password</label>
		  <input
			id="password"
			type="password"
			bind:value={password}
			required
			autocomplete="new-password"
			class="py-2.5 px-3 border border-[#1a274d] rounded-lg text-base outline-none transition-colors duration-200 text-black focus:border-black"
		  />
		</div>
		<button
		  type="submit"
		  value="pswrec"
		  class="mt-4 bg-[#1a274d] text-white font-semibold py-2 rounded-lg transition-colors hover:bg-[#273869]">
		  Cambio password
		</button>
	  </form>
	</div>
  </div>

