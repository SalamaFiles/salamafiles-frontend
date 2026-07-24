<script>
	import { forgotPassword } from '$lib/api/auth';
	import { toast } from 'svelte-sonner';
  import Icon from '@iconify/svelte';

	let email = $state('');
	let loading = $state(false);

	async function submit() {
		if (!email) {
			toast.error('Please enter your email address.');
			return;
		}

		loading = true;

		try {
			const result = await forgotPassword(email);

			toast.success(result.message);
		} catch (err) {
			toast.error(
				err.message || 'Failed to send reset email.'
			);
		} finally {
			loading = false;
		}
	}
</script>

<div class="page">
	<div class="card">

		<div class="brand">

			<div class="logo">
	<Icon
		icon="lucide:key-round"
		width="36"
	/>
</div>

			<h1>Forgot Password</h1>

			<p>
				Enter your email address and we'll send you
				a secure password reset link.
			</p>

		</div>

		<div class="form">

			<div class="field">

				<label for="email">
					Email Address
				</label>

				<input
					id="email"
					type="email"
					placeholder="Enter your email"
					bind:value={email}
				/>

			</div>

			<button
				class="primary-btn"
				onclick={submit}
				disabled={loading}
			>
				{#if loading}
					Sending Reset Link...
				{:else}
					Send Reset Link
				{/if}
			</button>

			<a
				class="back-link"
				href="/"
			>
				← Back to Login
			</a>

		</div>

	</div>
</div>

<style>

.page{
	min-height:100vh;

	display:flex;
	align-items:center;
	justify-content:center;

	padding:2rem;

	background:
	linear-gradient(
		135deg,
		#0f172a 0%,
		#1e293b 100%
	);
}

.card{

	width:100%;
	max-width:430px;

	background:white;

	border-radius:20px;

	padding:2.2rem;

	box-shadow:
	0 20px 40px rgba(0,0,0,.25);

	border:1px solid #e2e8f0;
}

.brand{
	text-align:center;
	margin-bottom:2rem;
}

.logo{

	width:72px;
	height:72px;

	margin:auto;
	margin-bottom:1rem;

	display:flex;
	align-items:center;
	justify-content:center;

	border-radius:50%;

	font-size:2rem;

	background:
	linear-gradient(
		135deg,
		#14b8a6,
		#0f766e
	);

	color:white;
}

.brand h1{

	margin:0;

	font-size:2rem;
	font-weight:700;

	color:#0f172a;
}

.brand p{

	margin-top:.8rem;

	color:#64748b;

	font-size:.95rem;

	line-height:1.6;
}

.form{

	display:flex;
	flex-direction:column;
	gap:1rem;
}

.field{

	display:flex;
	flex-direction:column;
	gap:.45rem;
}

label{

	font-weight:600;

	font-size:.85rem;

	color:#334155;
}

input{

	padding:13px 15px;

	border-radius:10px;

	border:1px solid #cbd5e1;

	font-size:.95rem;

	transition:.2s;
}

input:focus{

	outline:none;

	border-color:#14b8a6;

	box-shadow:
	0 0 0 3px rgba(20,184,166,.15);
}

.primary-btn{

	margin-top:.5rem;

	padding:13px;

	border:none;

	border-radius:10px;

	background:#14b8a6;

	color:white;

	font-weight:600;

	cursor:pointer;

	font-size:.95rem;

	transition:.2s;
}

.primary-btn:hover:not(:disabled){

	background:#0f766e;

	transform:translateY(-1px);
}

.primary-btn:disabled{

	opacity:.7;

	cursor:not-allowed;
}

.back-link{

	text-align:center;

	margin-top:.75rem;

	color:#14b8a6;

	font-weight:600;

	text-decoration:none;

	font-size:.9rem;

	transition:.2s;
}

.back-link:hover{

	color:#0f766e;

	text-decoration:underline;
}

</style>