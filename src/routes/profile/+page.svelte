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


	function gotochangePsw() {
		if (token) {
			goto('/profile/changePsw');
		} 
	}
</script>

<div class="flex gap-2 p-2">
	<button onclick={gotologin} class="btn btn-primary flex-1"> Login </button>
	{#if token}
		<button onclick={logout} class="btn btn-secondary flex-1"> Logout </button>
		<button onclick={gotochangePsw} class="btn btn-secondary flex-1"> Cambio password </button>
	{/if}
</div>
