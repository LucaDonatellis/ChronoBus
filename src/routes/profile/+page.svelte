<script>
	import { goto } from '$app/navigation';
	function gotologin() {
		goto('/profile/login');
	}
</script>

<button on:click={gotologin} class="rounded bg-blue-600 px-4 py-2 text-white"> Login  </button>
