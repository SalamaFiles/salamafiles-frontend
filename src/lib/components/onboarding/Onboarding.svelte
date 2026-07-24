<script>
	let { onSubmit } = $props();

	let organizationName = $state('');
	let organizationEmail = $state('');
	let phone = $state('');
	let website = $state('');
	let address = $state('');
	let country = $state('');

	let adminName = $state('');
	let adminEmail = $state('');
	let adminPhone = $state('');

	let loading = $state(false);

	async function submit(event) {

		event.preventDefault();

		const form = event.currentTarget;

		// Stop if browser validation fails
		if (!form.reportValidity()) {
			return;
		}

		loading = true;

		try {

			await onSubmit({
				organizationName,
				organizationEmail,
				phone,
				website,
				address,
				country,
				adminName,
				adminEmail,
				adminPhone
			});

			// Clear after successful creation
			organizationName = '';
			organizationEmail = '';
			phone = '';
			website = '';
			address = '';
			country = '';
			adminName = '';
			adminEmail = '';
			adminPhone = '';

		} finally {

			loading = false;

		}
	}
</script>

<div class="container">

	<div class="card">

		<form onsubmit={submit}>

			<h1>Organization Onboarding</h1>

			<p>Create a new organization and invite its administrator.</p>

			<h2>Organization Details</h2>

			<div class="grid">

				<input
					bind:value={organizationName}
					placeholder="Organization Name"
					required
				/>

				<input
					bind:value={organizationEmail}
					type="email"
					placeholder="Organization Email"
					required
				/>

				<input
					bind:value={phone}
					placeholder="Phone"
				/>

				<input
					bind:value={website}
					type="url"
					placeholder="Website"
				/>

				<input
					bind:value={country}
					placeholder="Country"
					required
				/>

				<input
					bind:value={address}
					placeholder="Address"
				/>

			</div>

			<h2>Organization Administrator</h2>

			<div class="grid">

				<input
					bind:value={adminName}
					placeholder="Full Name"
					required
				/>

				<input
					bind:value={adminEmail}
					type="email"
					placeholder="Administrator Email"
					required
				/>

				<input
					bind:value={adminPhone}
					placeholder="Phone Number"
				/>

			</div>

			<button
				type="submit"
				disabled={loading}
			>

				{loading
					? 'Creating Organization...'
					: 'Enroll Organization'}

			</button>

		</form>

	</div>

</div>

<style>
.container {
	max-width: 900px;
	margin: 2rem auto;
	padding: 1rem;
}

.card {
	background: white;
	padding: 2rem;
	border-radius: 14px;
	box-shadow: 0 8px 25px rgba(0,0,0,.08);
}

h1 {
	margin-bottom: .5rem;
	color: #12344d;
}

h2 {
	margin-top: 2rem;
	margin-bottom: 1rem;
	color: #12344d;
	font-size: 1.1rem;
}

.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	margin-bottom: 1.5rem;
}

input {
	padding: .8rem;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: .95rem;
}

input:focus {
	outline: none;
	border-color: #14b8a6;
	box-shadow: 0 0 0 3px rgba(20,184,166,.15);
}

button {
	background: #14b8a6;
	color: white;
	border: none;
	padding: .9rem 1.4rem;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
}

button:hover:not(:disabled) {
	background: #0f766e;
}

button:disabled {
	opacity: .6;
	cursor: not-allowed;
}

@media (max-width: 768px) {
	.grid {
		grid-template-columns: 1fr;
	}
}
</style>