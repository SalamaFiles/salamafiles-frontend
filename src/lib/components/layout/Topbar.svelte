<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { appState } from '$lib/state.svelte.js';

	let { user, logout } = $props();

	let profileMenuRef;
	let showProfileMenu = $state(false);

	function toggleProfileMenu() {
		showProfileMenu = !showProfileMenu;
	}

	function openProfile() {
		appState.mainView = 'profile';
		showProfileMenu = false;
	}

	function handleClickOutside(event) {
		if (
			showProfileMenu &&
			profileMenuRef &&
			!profileMenuRef.contains(event.target)
		) {
			showProfileMenu = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener(
				'click',
				handleClickOutside
			);
		};
	});
</script>

<header class="topbar">
	<div class="header-left">
		<h2 class="page-title">
			{#if appState.mainView === 'dashboard'}
				Dashboard
			{:else if appState.mainView === 'organizations'}
				Organization Management
			{:else if appState.mainView === 'issues'}
				Case Management
			{:else if appState.mainView === 'staff'}
				Staff Management
			{:else if appState.mainView === 'analytics'}
				Analytics & Reports
			{:else if appState.mainView === 'profile'}
				My Profile
			{/if}
		</h2>

		<p class="subtitle">
			Empowering communities to safely report and respond to gender-based violence.
		</p>
	</div>

	<div class="header-right">
		<div
			class="profile-menu-wrapper"
			bind:this={profileMenuRef}
		>
			<button
				class="user-card"
				onclick={(e) => {
					e.stopPropagation();
					toggleProfileMenu();
				}}
			>
				<div class="avatar">
					{user.name?.charAt(0).toUpperCase()}
				</div>

				<div class="user-info">
					<p class="name">{user.name}</p>
					<p class="role">{user.role}</p>
				</div>

				<Icon
					icon={
						showProfileMenu
							? 'lucide:chevron-up'
							: 'lucide:chevron-down'
					}
					width="18"
					class="chevron"
				/>
			</button>

			{#if showProfileMenu}
				<div class="profile-dropdown">
					<button onclick={openProfile}>
						<Icon
							icon="lucide:user-round"
							width="18"
						/>
						<span>My Profile</span>
					</button>

					<button onclick={logout}>
						<Icon
							icon="lucide:log-out"
							width="18"
						/>
						<span>Logout</span>
					</button>
				</div>
			{/if}
		</div>
	</div>
</header>