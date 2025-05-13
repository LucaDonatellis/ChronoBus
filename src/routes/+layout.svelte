<script>
	import '../app.css';
	import { TriangleAlert, LayoutDashboard, User, ChartLine, MailWarning } from '@lucide/svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<div class="" style="height: calc(100vh - 4rem)">
	{@render children()}
</div>
<div class="dock dock-md">
	<a class:dock-active={page.url.pathname === '/dashboard'} href="/dashboard">
		<LayoutDashboard />
		<span class="dock-label">Dashboard</span>
	</a>

	<a class:dock-active={page.url.pathname === '/profile'} href="/profile">
		<User />
		<span class="dock-label">Profilo</span>
	</a>

	<a class:dock-active={page.url.pathname === '/rush-hours'} href="/rush-hours">
		<ChartLine />
		<span class="dock-label">Orari di punta</span>
	</a>
	<a class:dock-active={page.url.pathname === '/report'} href="/report">
		<MailWarning />
		<span class="dock-label">Segnala</span>
	</a>
</div>
