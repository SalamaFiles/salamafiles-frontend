<script>
	import Icon from '@iconify/svelte';
	import { appState } from '$lib/state.svelte.js';

	let { user, openCases } = $props();

	const roleTabs = {
		Admin: ['received', 'assigned', 'resolved', 'escalated'],
		Supervisor: ['received', 'assigned', 'resolved', 'escalated'],
		Counselor: ['assigned', 'resolved'],
		Emergency: ['escalated', 'resolved']
	};
</script>

<aside class="sidebar">

	<div class="logo">
		<img
			src="/logo.png"
			alt="SalamaFiles"
			class="logo-image"
		/>
	</div>

	{#if user.role === 'PlatformAdmin'}

		<div class="section">

			<p class="section-title">Platform</p>

			<button
				class="nav-item"
				class:active={appState.mainView === 'organizations'}
				onclick={() => (appState.mainView = 'organizations')}
			>
				<Icon icon="lucide:building-2" width="18" />
				<span>Organizations</span>
			</button>

		</div>

	{/if}

	<div class="section">

		<p class="section-title">Main</p>

		<button
			class="nav-item"
			class:active={appState.mainView === 'dashboard'}
			onclick={() => (appState.mainView = 'dashboard')}
		>
			<Icon icon="lucide:layout-dashboard" width="18" />
			<span>Dashboard</span>
		</button>

		{#if user.role !== 'PlatformAdmin'}

			<button
				class="nav-item"
				class:active={appState.mainView === 'issues'}
				onclick={openCases}
			>
				<Icon icon="lucide:file-text" width="18" />
				<span>Cases</span>
			</button>

		{/if}

	</div>

	{#if user.role === 'Admin' || user.role === 'Supervisor'}

		<div class="section">

			<p class="section-title">Manage</p>

			<button
				class="nav-item"
				class:active={appState.mainView === 'users'}
				onclick={() => (appState.mainView = 'users')}
			>
				<Icon icon="lucide:users" width="18" />
				<span>Users</span>
			</button>

		</div>

	{/if}

	<div class="section">

		<p class="section-title">Reports</p>

		<button
			class="nav-item"
			class:active={appState.mainView === 'analytics'}
			onclick={() => (appState.mainView = 'analytics')}
		>
			<Icon icon="lucide:chart-column" width="18" />
			<span>Analytics</span>
		</button>

	</div>

</aside>