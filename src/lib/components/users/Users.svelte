<script>
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { auth } from '$lib/stores/auth';

	import {
		fetchUsers,
		inviteUser,
		updateUser,
		changeUserStatus,
		disableUser,
		resendInvitation
	} from '$lib/api/user';

	import UserStats from './UserStats.svelte';
	import UserToolbar from './UserToolbar.svelte';
	import UserTable from './UserTable.svelte';
	import InviteUserModal from './InviteUserModal.svelte';
	import EditUserModal from './EditUserModal.svelte';
	import EmptyState from './EmptyState.svelte';

	// ------------------------------------
	// State
	// ------------------------------------

	let users = $state([]);
	let loading = $state(true);

	let search = $state('');

	let showInviteModal = $state(false);
	let showEditModal = $state(false);

	let selectedUser = $state(null);

	let savingInvite = $state(false);
	let savingEdit = $state(false);

	const currentUser = $derived($auth.user);

	// ------------------------------------
	// Load Users
	// ------------------------------------

	async function loadUsers() {
		loading = true;

		try {
			users = await fetchUsers();
		} catch (err) {
			toast.error(err.message || 'Unable to load users.');
		} finally {
			loading = false;
		}
	}

	onMount(loadUsers);

	// ------------------------------------
	// Search
	// ------------------------------------

	const filteredUsers = $derived.by(() => {
		const term = search.trim().toLowerCase();

		if (!term) return users;

		return users.filter((user) =>
			`
			${user.name}
			${user.email}
			${user.phone ?? ''}
			${user.role}
			${user.status}
			${user.organization?.name ?? ''}
			`
				.toLowerCase()
				.includes(term)
		);
	});

	// ------------------------------------
	// Statistics
	// ------------------------------------

	const stats = $derived.by(() => ({
		total: users.length,

		active: users.filter((u) => u.status === 'Active').length,

		pending: users.filter((u) => u.status === 'Pending').length,

		emergency: users.filter((u) => u.role === 'Emergency').length
	}));

	// ------------------------------------
	// Invite User
	// ------------------------------------

	async function handleInvite(data) {
		savingInvite = true;

		try {
			await inviteUser(data);

			toast.success('Invitation sent successfully.');

			showInviteModal = false;

			await loadUsers();
		} catch (err) {
			toast.error(err.message);
		} finally {
			savingInvite = false;
		}
	}

	// ------------------------------------
	// Edit User
	// ------------------------------------

	function openEdit(user) {
		selectedUser = user;
		showEditModal = true;
	}

	async function handleUpdate(data) {
		savingEdit = true;

		try {
			await updateUser(selectedUser._id, data);

			toast.success('User updated successfully.');

			showEditModal = false;
			selectedUser = null;

			await loadUsers();
		} catch (err) {
			toast.error(err.message);
		} finally {
			savingEdit = false;
		}
	}

	// ------------------------------------
	// Change Status
	// ------------------------------------

	async function handleStatus(user, status) {
		try {
			await changeUserStatus(user._id, status);

			toast.success(`User ${status.toLowerCase()}.`);

			await loadUsers();
		} catch (err) {
			toast.error(err.message);
		}
	}

	// ------------------------------------
	// Disable User
	// ------------------------------------

	async function handleDelete(user) {
		if (!confirm(`Disable ${user.name}?`)) return;

		try {
			await disableUser(user._id);

			toast.success('User disabled.');

			await loadUsers();
		} catch (err) {
			toast.error(err.message);
		}
	}

	// ------------------------------------
	// Resend Invitation
	// ------------------------------------

	async function handleResend(user) {
		try {
			await resendInvitation(user._id);

			toast.success('Invitation resent.');

			await loadUsers();
		} catch (err) {
			toast.error(err.message);
		}
	}
</script>

<div class="users-page">

	<UserStats {stats} />

	<UserToolbar
		bind:search
		onInvite={() => (showInviteModal = true)}
	/>

	{#if loading}

		<div class="loading-state">
			Loading users...
		</div>

	{:else if filteredUsers.length === 0}

		<EmptyState
			onInvite={() => (showInviteModal = true)}
		/>

	{:else}

		<UserTable
			users={filteredUsers}
			currentUser={currentUser}
			onEdit={openEdit}
			onStatus={handleStatus}
			onDelete={handleDelete}
			onResend={handleResend}
		/>

	{/if}

</div>

<InviteUserModal
	open={showInviteModal}
	saving={savingInvite}
	currentUser={currentUser}
	onSave={handleInvite}
	onCancel={() => (showInviteModal = false)}
/>

<EditUserModal
	open={showEditModal}
	saving={savingEdit}
	user={selectedUser}
	onSave={handleUpdate}
	onCancel={() => {
		showEditModal = false;
		selectedUser = null;
	}}
/>

<style>
.users-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding-bottom: 2rem;
}

.loading-state {
	display: flex;
	align-items: center;
	justify-content: center;

	min-height: 220px;

	background: white;

	border: 1px solid #e2e8f0;
	border-radius: 18px;

	color: #64748b;
	font-size: 0.95rem;
}
</style>