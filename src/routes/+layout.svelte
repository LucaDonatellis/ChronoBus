<script>
	import '../app.css';
	import { TriangleAlert,LayoutDashboard,User,ChartLine,MailWarning } from '@lucide/svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

	{@render children()}
	<div class="fixed bottom-18 right-4 bg-primary rounded-full w-12 h-12 flex items-center justify-center">

		<div class="indicator ">
			<span class="indicator-item indicator-bottom badge badge-secondary badge-xs">1</span>
			<TriangleAlert/>
		</div>
	</div>
<div class="dock dock-md">
  <a class:dock-active={$page.url.pathname === '/dashboard'} href="/dashboard">
    <LayoutDashboard />
    <span class="dock-label">Dashboard</span>
  </a>
  
  <a class:dock-active={$page.url.pathname === '/profile'} href="/profile">
    <User />
	<span class="dock-label">Profilo</span>
  </a>
  
  <a class:dock-active={$page.url.pathname === '/rush-hours'} href="/rush-hours">
    <ChartLine />
	<span class="dock-label">Orari di punta</span>
  </a>
  <a class:dock-active={$page.url.pathname === '/report'} href="/report">
    <MailWarning />
	<span class="dock-label">Segnala</span>
  </a>
</div>