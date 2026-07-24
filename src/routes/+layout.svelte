<script>
	import './layout.css';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	import Login from '$lib/components/login/Login.svelte';
	import OrganizationSetup from '$lib/components/organization/OrganizationSetup.svelte';

	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import IssueTabs from '$lib/components/layout/IssueTabs.svelte';

	import { auth } from '$lib/stores/auth.js';
	import { organization } from '$lib/stores/organization.js';
	import { appState } from '$lib/state.svelte.js';

	import { page } from '$app/state';

	const publicRoutes = [
		'/forgot-password',
		'/reset-password',
		'/activate-account'
	];

	const isPublicRoute = $derived(
		publicRoutes.includes(page.url.pathname)
	);

	let { children } = $props();

	const authState = $derived($auth);
const organizationState = $derived($organization);

const user = $derived($auth.user);

$effect(() => {

    const currentUser = $auth.user;

    if (!currentUser) {

        appState.user = null;
        organization.clear();

        return;

    }

    appState.user = currentUser;

    if (currentUser.organization) {

        organization.setOrganization(currentUser.organization);

    } else {

        organization.clear();

    }

});

	onMount(() => {
		auth.restore();
	});

	const roleTabs = {
		Admin: ['received', 'assigned', 'resolved', 'escalated'],
		Supervisor: ['received', 'assigned', 'resolved', 'escalated'],
		Counselor: ['assigned', 'resolved'],
		Emergency: ['escalated', 'resolved']
	};

	const tabs = $derived(
		user ? roleTabs[user.role] || [] : []
	);

	const needsOrganizationSetup = $derived.by(() => {

		if (!authState.authenticated) return false;

		if (!user) return false;

		if (user.role === 'PlatformAdmin') return false;

		const org = organizationState.organization;

		if (!org) return true;

		return !(org.setup?.completed ?? false);

	});

	function openCases() {

		appState.mainView = 'issues';

		if (tabs.length) {
			appState.subTab = tabs[0];
		}

	}

	function logout() {

		auth.logout();

		appState.user = null;

		appState.mainView = 'dashboard';
		appState.subTab = 'received';

		organization.clear();

	}
</script>

<Toaster
	position="top-right"
	richColors
	duration={3000}
/>

{#if !authState.authenticated}

	{#if isPublicRoute}
		{@render children()}
	{:else}
		<Login />
	{/if}

{:else if needsOrganizationSetup}

	<OrganizationSetup />

{:else}

	<div class="app">

		<Sidebar
			{user}
			{openCases}
		/>

		<div class="main">

			<TopBar
				{user}
				{logout}
			/>

			{#if appState.mainView === 'issues'}
				<IssueTabs {tabs} />
			{/if}

			<main class="content">
				{@render children()}
			</main>

		</div>

	</div>

{/if}