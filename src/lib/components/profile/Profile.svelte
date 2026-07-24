<script>
	import Icon from '@iconify/svelte';
	import { appState } from '$lib/state.svelte.js';

	import {
		updateProfile,
		changePassword
	} from '$lib/api/profile';
    
    import { toast } from 'svelte-sonner';

	import { auth } from '$lib/stores/auth';
    import { get } from 'svelte/store';

    const authState = $derived($auth);
    const user = $derived(authState.user);

	let editing = $state(false);
	let changingPassword = $state(false);

	let editForm = $state({
		name: '',
		email: '',
		phone: ''
	});

	let passwordForm = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	async function saveProfile() {

    const loading = toast.loading('Updating profile...');

    const current = get(auth);

auth.login(
    current.token,
    response.user
);

    try {

        const response = await updateProfile({
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone
        });

        appState.user = response.user;

        editing = false;

        toast.dismiss(loading);
        toast.success('Profile updated successfully!');

    } catch (err) {

        toast.dismiss(loading);
        toast.error(err.message || 'Failed to update profile.');

    }
}

	async function savePassword() {

    if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
    ) {
        toast.error('Passwords do not match.');
        return;
    }

    const loading = toast.loading('Updating password...');

    try {

        await changePassword(
            passwordForm.currentPassword,
            passwordForm.newPassword
        );

        changingPassword = false;

        passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        toast.dismiss(loading);
        toast.success('Password changed successfully!');

    } catch (err) {

        toast.dismiss(loading);
        toast.error(
            err.message || 'Failed to change password.'
        );

    }
}
</script>

{#if editing}
	<div class="modal-overlay">
		<div class="modal">
			<h2>Edit Profile</h2>

			<label>Name</label>
			<input bind:value={editForm.name} />

			<label>Email</label>
			<input bind:value={editForm.email} />

			<label>Phone</label>
			<input bind:value={editForm.phone} />

			<div class="modal-actions">
				<button
					class="secondary"
					onclick={() => (editing = false)}
				>
					Cancel
				</button>

				<button
					class="primary"
					onclick={saveProfile}
				>
					Save Changes
				</button>
			</div>
		</div>
	</div>
{/if}

{#if changingPassword}
	<div class="modal-overlay">
		<div class="modal">
			<h2>Change Password</h2>

			<input
				type="password"
				placeholder="Current password"
				bind:value={passwordForm.currentPassword}
			/>

			<input
				type="password"
				placeholder="New password"
				bind:value={passwordForm.newPassword}
			/>

			<input
				type="password"
				placeholder="Confirm password"
				bind:value={passwordForm.confirmPassword}
			/>

			<div class="modal-actions">
				<button
					class="secondary"
					onclick={() => (changingPassword = false)}
				>
					Cancel
				</button>

				<button
					class="primary"
					onclick={savePassword}
				>
					Update Password
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="profile-page">
	<div class="page-header">
		<h1>My Profile</h1>
		<p>Manage your account and personal information.</p>
	</div>

	<div class="profile-card">
		<div class="profile-top">
			<div class="avatar">
				{user?.name?.charAt(0)?.toUpperCase() ?? '?'}
			</div>

			<div>
				<h2>{user?.name ?? 'Unknown User'}</h2>

				<span class="role">
					{user?.role ?? 'No Role'}
				</span>
			</div>
		</div>

		<div class="section">
			<h3>
				<Icon icon="lucide:user-round" width="18" />
				Personal Information
			</h3>

			<div class="info-grid">
				<div class="field">
					<label>Name</label>
					<p>{user?.name ?? '-'}</p>
				</div>

				<div class="field">
					<label>Email</label>
					<p>{user?.email ?? '-'}</p>
				</div>

				<div class="field">
					<label>Role</label>
					<p>{user?.role ?? '-'}</p>
				</div>

				<div class="field">
					<label>Phone</label>
					<p>{user?.phone ?? 'Not provided'}</p>
				</div>
			</div>

			<button
				class="primary"
				onclick={() => {
					editForm = {
						name: user?.name || '',
						email: user?.email || '',
						phone: user?.phone || ''
					};

					editing = true;
				}}
			>
				<Icon icon="lucide:pencil" width="18" />
				Edit Profile
			</button>
		</div>

		<div class="section">
			<h3>
				<Icon icon="lucide:shield-check" width="18" />
				Security
			</h3>

			<div class="field">
				<label>Password</label>
				<p>••••••••••••</p>
			</div>

			<button
				class="secondary"
				onclick={() => (changingPassword = true)}
			>
				<Icon icon="lucide:key-round" width="18" />
				Change Password
			</button>
		</div>
	</div>

</div>

<style>
.profile-page{
	max-width:900px;
	margin:auto;
	padding:1rem;
}

.page-header{
	margin-bottom:2rem;
}

.page-header h1{
	margin:0;
	color:#0f172a;
	font-size:2rem;
	font-weight:700;
}

.page-header p{
	color:#64748b;
	margin-top:.4rem;
}

.profile-card{
	background:white;
	border:1px solid #e2e8f0;
	border-radius:18px;
	padding:2rem;
	box-shadow:0 8px 24px rgba(15,23,42,.05);
}

.profile-top{
	display:flex;
	align-items:center;
	gap:20px;
	margin-bottom:2rem;
}

.avatar{
	width:90px;
	height:90px;
	border-radius:50%;
	background:linear-gradient(135deg,#14b8a6,#0f766e);
	display:flex;
	align-items:center;
	justify-content:center;
	color:white;
	font-size:2rem;
	font-weight:700;
	flex-shrink:0;
}

.role{
	display:inline-block;
	margin-top:6px;
	padding:6px 14px;
	border-radius:999px;
	background:#ecfeff;
	color:#0f766e;
	font-weight:600;
	font-size:.85rem;
}

.section{
	margin-top:2rem;
	padding-top:2rem;
	border-top:1px solid #e2e8f0;
}

.section h3{
	display:flex;
	align-items:center;
	gap:8px;
	margin-bottom:1.5rem;
	color:#0f172a;
	font-size:1.1rem;
}

.info-grid{
	display:grid;
	grid-template-columns:repeat(2,1fr);
	gap:1.5rem;
	margin-bottom:1.5rem;
}

.field label{
	display:block;
	font-size:.8rem;
	color:#64748b;
	margin-bottom:.35rem;
	font-weight:500;
}

.field p{
	font-weight:600;
	color:#0f172a;
	margin:0;
}

.primary,
.secondary{
	display:inline-flex;
	align-items:center;
	gap:8px;
	padding:12px 18px;
	border-radius:10px;
	cursor:pointer;
	font-weight:600;
	font-size:.9rem;
	transition:.2s;
}

.primary{
	background:#14b8a6;
	color:white;
	border:none;
}

.primary:hover{
	background:#0f766e;
}

.secondary{
	background:white;
	border:1px solid #cbd5e1;
	color:#0f172a;
}

.secondary:hover{
	background:#f8fafc;
}

.modal-overlay{
	position:fixed;
	inset:0;
	background:rgba(15,23,42,.45);
	display:flex;
	align-items:center;
	justify-content:center;
	z-index:1000;
}

.modal{
	width:450px;
	background:white;
	padding:2rem;
	border-radius:18px;
	box-shadow:0 20px 40px rgba(0,0,0,.2);
	display:flex;
	flex-direction:column;
	gap:1rem;
}

.modal input{
	padding:12px;
	border:1px solid #cbd5e1;
	border-radius:10px;
}

.modal-actions{
	display:flex;
	justify-content:flex-end;
	gap:10px;
	margin-top:10px;
}

@media (max-width:768px){
	.info-grid{
		grid-template-columns:1fr;
	}

	.profile-top{
		flex-direction:column;
		text-align:center;
	}

	.avatar{
		margin-bottom:.5rem;
	}

	.modal{
		width:90%;
	}
}

</style>