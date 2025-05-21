<script>
	let token= $state();
	let error = $state();
	
	try {
 	token = localStorage.getItem('token');
	} catch (error) {
  	console.error(error); 
	}
	import { goto } from '$app/navigation';
	function gotologin() {
		goto('/profile/login');
	}
	let success=$state(false);
	let message=$state('');

	function logout() {
      if (token) {
        message = 'Logout eseguito!';
		localStorage.removeItem('token');
		success = true;
		setTimeout(() => {
			window.location.href = '/dashboard';
		}, 1200); 
      } else {
		success = false;
        error = 'Logout fallito';
      }
  }

</script>
<div>
	{#if success && message}
			<div class="success-message">{message}</div>
	{/if}

	<button on:click={gotologin} class="rounded bg-blue-600 px-4 py-2 text-white"> Login  </button>
	{#if token}
	<button on:click={logout} class="rounded bg-blue-600 px-4 py-2 text-white"> Logout  </button>
	{/if}
	
</div>

