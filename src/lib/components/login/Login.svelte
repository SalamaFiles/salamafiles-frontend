<script>
	import { appState } from '$lib/state.svelte.js';
	import { login as loginUser } from '$lib/api/auth.js';
	import { auth } from '$lib/stores/auth.js';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function login() {
	error = '';
	loading = true;

	try {
		const data = await loginUser(
			email,
			password
		);

		auth.login(
			data.token,
			data.user
		);

		appState.mainView = 'dashboard';

	} catch (err) {
		error = err.message || 'Login failed';
	} finally {
		loading = false;
	}
}
</script>

<div class="page">
	<div class="login-card">

		<div class="brand">
			<div class="logo"></div>

			<h1>SalamaFiles</h1>

			<p>
				Secure Gender-Based Violence Reporting &
				Response Management Platform
			</p>
		</div>

		<div class="form">

			<div class="field">
				<label>Email Address</label>

				<input
					type="email"
					placeholder="Enter your email"
					bind:value={email}
				/>
			</div>

			<div class="field">
				<label>Password</label>

				<input
					type="password"
					placeholder="Enter your password"
					bind:value={password}
				/>
			</div>
			{#if error}
				<div class="error">
					⚠️ {error}
				</div>
			{/if}

			<button
				class="login-btn"
				onclick={login}
				disabled={loading}
			>
				{#if loading}
					Logging in...
				{:else}
					Login
				{/if}
			</button>

		</div>
		<div>
		<a
  href="/forgot-password"
  class="text-blue-600 hover:underline"
>
  Forgot Password?
</a>
</div>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;

		background:
			linear-gradient(
				135deg,
				#0f172a 0%,
				#1e293b 100%
			);
	}

	.login-card {
		width: 100%;
		max-width: 420px;

		background: white;
		border-radius: 20px;
		padding: 2rem;

		box-shadow:
			0 20px 40px rgba(0, 0, 0, 0.25);

		border: 1px solid #e2e8f0;
	}

	.brand {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo {
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	.brand h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: #0f172a;
	}

	.brand p {
		margin-top: 0.75rem;
		font-size: 0.9rem;
		line-height: 1.5;
		color: #64748b;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #334155;
	}

	input {
		padding: 12px 14px;

		border-radius: 10px;
		border: 1px solid #cbd5e1;

		font-size: 0.95rem;

		transition: all 0.2s ease;
	}

	input:focus {
		outline: none;

		border-color: #14b8a6;

		box-shadow:
			0 0 0 3px
			rgba(20, 184, 166, 0.15);
	}

	.login-btn {
		margin-top: 0.5rem;

		padding: 12px;

		border: none;
		border-radius: 10px;

		background: #14b8a6;
		color: white;

		font-size: 0.95rem;
		font-weight: 600;

		cursor: pointer;

		transition: all 0.2s ease;
	}

	.login-btn:hover:not(:disabled) {
		background: #0f766e;
		transform: translateY(-1px);
	}

	.login-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.error {
		background: #fef2f2;
		color: #dc2626;

		border: 1px solid #fecaca;

		padding: 10px;
		border-radius: 8px;

		font-size: 0.85rem;
	}
</style>