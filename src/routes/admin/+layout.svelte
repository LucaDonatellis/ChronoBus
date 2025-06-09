<script>
	import { page } from '$app/state';
	let { children } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="p-2">
		<h1 class="text-2xl font-semibold">Pannello Admin</h1>
		<div role="tablist" class="tabs tabs-box">
			<a
				role="tab"
				class="tab"
				href="/admin/announcements"
				class:tab-active={page.url.pathname === '/admin/announcements'}>Annunci</a
			>
			<a
				role="tab"
				class="tab"
				href="/admin/reports"
				class:tab-active={page.url.pathname === '/admin/reports'}>Segnalazioni</a
			>
		</div>
	</div>
	{@render children()}
</div>
