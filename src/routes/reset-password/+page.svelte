<script>
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	import { resetPassword } from '$lib/api/auth';
  import { onMount } from 'svelte';

	let password = '';
	let confirmPassword = '';

	let loading = false;

	

	let token = $state('');

	onMount(() => {
		token = new URLSearchParams(window.location.search)
			.get('token');
	});

	async function submit() {

		if (!token) {
			toast.error('Invalid password reset link.');
			return;
		}

		if (!password) {
			toast.error('Password is required.');
			return;
		}

		if (password !== confirmPassword) {
			toast.error('Passwords do not match.');
			return;
		}

		loading = true;

		const loadingToast =
			toast.loading('Resetting password...');

		try {

			await resetPassword(token, password);

			toast.dismiss(loadingToast);

			toast.success(
				'Password updated successfully.'
			);

			setTimeout(() => {
				goto('/');
			}, 1500);

		} catch (err) {

			toast.dismiss(loadingToast);

			toast.error(
				err.message ||
				'Unable to reset password.'
			);

		}

		loading = false;
	}
</script>

<div class="page">

	<div class="card">

		<div class="header">

	<div class="icon">
		<Icon
			icon="lucide:key-round"
			width="28"
		/>
	</div>

	<h1>Reset Password</h1>

	<p>
		Choose a new password for your account.
	</p>

</div>

		<div class="form">

			<div class="field">

				<label>New Password</label>

				<input
					type="password"
					bind:value={password}
					placeholder="Enter new password"
				/>

			</div>

			<div class="field">

				<label>Confirm Password</label>

				<input
					type="password"
					bind:value={confirmPassword}
					placeholder="Confirm password"
				/>

			</div>

			<button
				class="primary"
				onclick={submit}
				disabled={loading}
			>

				{#if loading}
					Updating...
				{:else}
					Update Password
				{/if}

			</button>

		</div>

	</div>

</div>

<style>

.page{

	min-height:100vh;

	display:flex;

	justify-content:center;

	align-items:center;

	background:
	linear-gradient(
		135deg,
		#0f172a,
		#1e293b
	);

	padding:2rem;

}

.card{

	width:100%;
	max-width:430px;

	background:white;

	border-radius:20px;

	padding:2rem;

	box-shadow:
	0 20px 40px rgba(0,0,0,.25);

}

.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;

	margin-bottom: 2rem;
}

.icon {
	width: 78px;
	height: 78px;

	display: flex;
	align-items: center;
	justify-content: center;

	border-radius: 50%;

	background: linear-gradient(
		135deg,
		#14b8a6,
		#0f766e
	);

	color: white;

	margin-bottom: 1rem;

	box-shadow:
		0 10px 25px rgba(20, 184, 166, 0.25);
}

.header h1 {
	margin: 0;

	font-size: 2rem;
	font-weight: 700;

	color: #0f172a;
}

.header p {
	margin-top: .75rem;

	max-width: 280px;

	font-size: .95rem;
	line-height: 1.6;

	color: #64748b;
}
.form{

	display:flex;

	flex-direction:column;

	gap:1rem;

}

.field{

	display:flex;

	flex-direction:column;

	gap:.35rem;

}

label{

	font-size:.85rem;

	font-weight:600;

	color:#334155;

}

input{

	padding:12px;

	border-radius:10px;

	border:1px solid #cbd5e1;

	font-size:.95rem;

}

input:focus{

	outline:none;

	border-color:#14b8a6;

	box-shadow:
	0 0 0 3px
	rgba(20,184,166,.15);

}

.primary{

	margin-top:.5rem;

	padding:12px;

	border:none;

	border-radius:10px;

	background:#14b8a6;

	color:white;

	font-weight:600;

	cursor:pointer;

	transition:.2s;

}

.primary:hover{

	background:#0f766e;

}

.primary:disabled{

	opacity:.7;

	cursor:not-allowed;

}

</style>