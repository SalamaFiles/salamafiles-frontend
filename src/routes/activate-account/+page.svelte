<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import {
		validateInvitation,
		activateAccount
	} from '$lib/api/activation';

	import { toast } from 'svelte-sonner';

	let loading = $state(true);

	let invitation = $state(null);

	let password = $state('');

	let confirmPassword = $state('');

	let activating = $state(false);

	const token = page.url.searchParams.get('token');

	onMount(async () => {

		try {

			invitation =
				await validateInvitation(token);

		}

		catch (err) {

			toast.error(err.message);

		}

		finally {

			loading = false;

		}

	});

	async function activate() {

		if (password.length < 8) {

			toast.error(
				'Password must be at least 8 characters.'
			);

			return;

		}

		if (password !== confirmPassword) {

			toast.error(
				'Passwords do not match.'
			);

			return;

		}

		activating = true;

		try {

			const result =
				await activateAccount(
					token,
					password
				);

			toast.success(
				result.message ||
				'Account activated successfully.'
			);

			// Redirect to login after a short delay
			setTimeout(() => {

				goto('/');

			}, 1500);

		}

		catch (err) {

			toast.error(err.message);

		}

		finally {

			activating = false;

		}

	}
</script>

{#if loading}

	<div class="loading">

		Loading invitation...

	</div>

{:else if invitation}

	<div class="page">

		<div class="card">

			<h1>Welcome to SalamaFiles</h1>

			<p>

				You have been invited to join

				<strong>{invitation.organization.name}</strong>

			</p>

			<div class="info">

				<label>Name</label>

				<div>{invitation.user.name}</div>

			</div>

			<div class="info">

				<label>Email</label>

				<div>{invitation.invitation.email}</div>

			</div>

			<input
				type="password"
				bind:value={password}
				placeholder="Create Password"
			/>

			<input
				type="password"
				bind:value={confirmPassword}
				placeholder="Confirm Password"
			/>

			<button
				onclick={activate}
				disabled={activating}
			>

				{activating
					? 'Activating...'
					: 'Activate Account'}

			</button>

		</div>

	</div>

{/if}

<style>

.page{

	min-height:100vh;

	display:flex;

	align-items:center;

	justify-content:center;

	background:#f8fafc;

	padding:40px;

}

.card{

	width:480px;

	background:white;

	border-radius:16px;

	padding:40px;

	box-shadow:0 20px 50px rgba(0,0,0,.08);

}

h1{

	margin-bottom:8px;

	font-size:2rem;

	color:#12344d;

}

p{

	color:#64748b;

	margin-bottom:30px;

}

.info{

	margin-bottom:18px;

}

label{

	display:block;

	font-size:.85rem;

	color:#94a3b8;

	margin-bottom:4px;

}

input{

	width:100%;

	padding:14px;

	margin-top:14px;

	border:1px solid #dbe3ea;

	border-radius:10px;

	font-size:.95rem;

	box-sizing:border-box;

}

button{

	width:100%;

	margin-top:24px;

	padding:15px;

	border:none;

	background:#14b8a6;

	color:white;

	border-radius:10px;

	font-size:.95rem;

	font-weight:600;

	cursor:pointer;

}

button:hover:not(:disabled){

	background:#0f766e;

}

button:disabled{

	opacity:.7;

	cursor:not-allowed;

}

.loading{

	padding:80px;

	text-align:center;

}

</style>