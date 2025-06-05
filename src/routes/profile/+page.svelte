<script>
	import { goto } from '$app/navigation';
	import { successAlert } from '$lib/stores/alert';

	let token = $state();
	let error = $state();

	try {
		token = localStorage.getItem('token');
	} catch (error) {
		console.error(error);
	}
	function gotologin() {
		goto('/profile/login');
	}
	let success = $state(false);
	let message = $state('');

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
	{#if success && message}
		<div class="success-message">{message}</div>
	{/if}

	<button onclick={gotologin} class="rounded bg-blue-600 px-4 py-2 text-white"> Login </button>
	{#if token}
		<button onclick={logout} class="rounded bg-blue-600 px-4 py-2 text-white"> Logout </button>
	{/if}
</div>
