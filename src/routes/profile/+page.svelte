<script>
	import { goto } from '$app/navigation';
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
			goto('/profile/login');
		} else {
			errorError('Logout fallito');
		}
	}
</script>

<div>
	<button onclick={gotologin} class="rounded bg-blue-600 px-4 py-2 text-white"> Login </button>
	{#if token}
		<button onclick={logout} class="rounded bg-blue-600 px-4 py-2 text-white"> Logout </button>
	{/if}
</div>
