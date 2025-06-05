<script>
	import '../app.css';
	import { TriangleAlert, LayoutDashboard, User, ChartLine, MailWarning,Bolt } from '@lucide/svelte';
	import { page } from '$app/state';
	import { alert } from '$lib/stores/alert';
	import { isAdmin } from '$lib/stores/admin';

	let { children } = $props();
</script>

{#if $alert}
	<div class="absolute bottom-16 z-10000 w-full p-2">
		<div role="alert" class="alert w-full {$alert.class}">
			<span>{$alert.text}</span>
		</div>
	</div>
{/if}
<div class="relative" style="height: calc(100vh - 4rem)">
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
	{#if $isAdmin}
		<a class:dock-active={page.url.pathname === '/admin'} href="/admin">
			<Bolt />
			<span class="dock-label">Admin</span>
		</a>
	{/if}
</div>
