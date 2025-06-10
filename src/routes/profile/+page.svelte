<script>
	import { goto } from '$app/navigation';
	import { isAdmin } from '$lib/stores/admin';
	import { successAlert } from '$lib/stores/alert';
	import { onMount } from 'svelte';

	let token = $state();

	onMount(() => {
		try {
			token = localStorage.getItem('token');
		} catch (e) {}
	});

	function gotologin() {
		goto('/profile/login');
	}

	function gotochangePsw() {
		if (token) {
			goto('/profile/changePsw');
		} 
	}

	function gotopswrec() {
		if (!token) {
			goto('/profile/pswrec');
		} 
	}

	function logout() {
		if (token) {
			successAlert('Logout effettuato con successo');
			localStorage.removeItem('token');
			isAdmin.set(false);
			goto('/profile/login');
		} else {
			errorError('Logout fallito');
		}
	}
</script>

<h2 class="p-2 text-2xl font-semibold text-white ">Profilo</h2>

<div class="flex flex-col gap-2 p-2">
  <div class="flex gap-2">
    <button 
      onclick={gotologin}
      class="flex-1 bg-gray-200 text-[#1a274d] font-semibold py-2 rounded-lg border border-[#1a274d] transition-colors hover:bg-gray-300">
      Login
    </button>
    {#if token}
      <button
        onclick={logout}
        class="flex-1 bg-gray-200 text-[#1a274d] font-semibold py-2 rounded-lg border border-[#1a274d] transition-colors hover:bg-gray-300">
        Logout
      </button>
    {/if}
    {#if !token}
      <button
        onclick={gotopswrec}
        class="flex-1 bg-gray-200 text-[#1a274d] font-semibold py-2 rounded-lg border border-[#1a274d] transition-colors hover:bg-gray-300">
        Password dimenticata
      </button>
    {/if}
  </div>
  {#if token}
    <button
      onclick={gotochangePsw}
      class="w-full bg-gray-200 text-[#1a274d] font-semibold py-2 rounded-lg border border-[#1a274d] transition-colors hover:bg-gray-300">
      Cambio password
    </button>
  {/if}
</div>