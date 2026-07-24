<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	import Onboarding from '$lib/components/onboarding/Onboarding.svelte';

	import { enrollOrganization } from '$lib/api/onboarding.js';

	import {
		fetchOrganizations
	} from '$lib/api/organization.js';

	let organizations = $state([]);

	let showOnboarding = $state(false);

	let loading = $state(false);

	// Dashboard statistics
	let totalOrganizations = $state(0);
	let activeOrganizations = $state(0);
	let pendingOrganizations = $state(0);
	let suspendedOrganizations = $state(0);

	async function loadOrganizations() {

		loading = true;

		try {

			const data = await fetchOrganizations();

			console.log('Organizations:', data);

			// Handles either:
			// [ ... ]
			// OR
			// { organizations:[...] }

			organizations = data.organizations ?? data;

			totalOrganizations = organizations.length;

			activeOrganizations =
				organizations.filter(org => org.isActive).length;

			suspendedOrganizations =
				organizations.filter(org => !org.isActive).length;

			// Pending = admin invitation not activated yet
			pendingOrganizations =
				organizations.filter(org => !org.isActive).length;

		} catch (err) {

			console.error(err);

			toast.error(err.message);

		} finally {

			loading = false;

		}

	}

	async function handleEnroll(data) {

		loading = true;

		try {

			const result = await enrollOrganization(data);

			toast.success(result.message);

			showOnboarding = false;

			await loadOrganizations();

		} catch (err) {

			toast.error(err.message);

		} finally {

			loading = false;

		}

	}

	onMount(async () => {

		await loadOrganizations();

	});
</script>

<div class="page">

	<!-- HEADER -->

	<div class="page-header">

		<div>

			<h1>Organizations</h1>

			<p>
				Manage organizations onboarded onto the SalamaFiles platform.
			</p>

		</div>

		<button
			class="primary"
			onclick={() => (showOnboarding = true)}
		>

			<Icon icon="lucide:plus" width="18" />

			<span>Enroll Organization</span>

		</button>

	</div>

	<!-- STATS -->

	<div class="stats">

		<div class="card">

			<h2>{totalOrganizations}</h2>

			<p>Total Organizations</p>

		</div>

		<div class="card">

			<h2>{activeOrganizations}</h2>

			<p>Active</p>

		</div>

		<div class="card">

			<h2>{pendingOrganizations}</h2>

			<p>Pending</p>

		</div>

		<div class="card">

			<h2>{suspendedOrganizations}</h2>

			<p>Suspended</p>

		</div>

	</div>

	<!-- TABLE -->

	<div class="table-card">

		<table>

			<thead>

				<tr>

					<th>Organization</th>

					<th>Country</th>

					<th>Plan</th>

					<th>Status</th>

					<th>Created</th>

					<th></th>

				</tr>

			</thead>

			<tbody>

	{#if organizations.length === 0}

		<tr>

			<td colspan="6" class="empty">

				<Icon
					icon="lucide:building-2"
					width="36"
				/>

				<p>No organizations have been enrolled yet.</p>

			</td>

		</tr>

	{:else}

		{#each organizations as organization}

			<tr>

				<td>

					<strong>{organization.name}</strong>

				</td>

				<td>

					{organization.country}

				</td>

				<td>

					{organization.subscription?.plan ?? 'Free'}

				</td>

				<td>

					{#if organization.isActive}

						<span class="status active">

							Active

						</span>

					{:else}

						<span class="status inactive">

							Pending

						</span>

					{/if}

				</td>

				<td>

					{new Date(
						organization.createdAt
					).toLocaleDateString()}

				</td>

				<td>

				</td>

			</tr>

		{/each}

	{/if}

</tbody>

		</table>

	</div>

</div>

<!-- MODAL -->

{#if showOnboarding}

	<div
		class="overlay"
		onclick={() => (showOnboarding = false)}
	>

		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
		>

			<div class="modal-header">

				<div>

					<h2>Enroll Organization</h2>

					<p>
						Create a new organization and invite the administrator.
					</p>

				</div>

				<button
					class="close"
					onclick={() => (showOnboarding = false)}
				>

					<Icon
						icon="lucide:x"
						width="20"
					/>

				</button>

			</div>

			<div class="modal-body">

				<Onboarding
					onSubmit={handleEnroll}
					onClose={() => (showOnboarding = false)}
				/>

			</div>

		</div>

	</div>

{/if}

<style>

.page{
	display:flex;
	flex-direction:column;
	gap:24px;
}

.page-header{

	display:flex;

	justify-content:space-between;

	align-items:center;

}

.page-header h1{

	margin:0;

	font-size:2rem;

	font-weight:700;

	color:#0f172a;

}

.page-header p{

	margin-top:6px;

	font-size:.95rem;

	color:#64748b;

}

.primary{

	display:flex;

	align-items:center;

	gap:10px;

	padding:12px 20px;

	background:#14b8a6;

	color:white;

	border:none;

	border-radius:10px;

	font-size:.95rem;

	font-weight:600;

	cursor:pointer;

	transition:.2s;

}

.primary:hover{

	background:#0f766e;

}

.stats{

	display:grid;

	grid-template-columns:repeat(4,1fr);

	gap:20px;

}

.card{

	background:white;

	border:1px solid #e2e8f0;

	border-radius:14px;

	padding:24px;

}

.card h2{

	margin:0;

	font-size:2rem;

	font-weight:700;

	color:#12344d;

}

.card p{

	margin-top:8px;

	font-size:.9rem;

	color:#64748b;

}

.table-card{

	background:white;

	border:1px solid #e2e8f0;

	border-radius:14px;

	overflow:hidden;

}

table{

	width:100%;

	border-collapse:collapse;

}

th{

	background:#f8fafc;

	padding:16px;

	text-align:left;

	font-size:.9rem;

	font-weight:600;

	color:#334155;

}

td{

	padding:18px 16px;

	border-top:1px solid #f1f5f9;

	font-size:.92rem;

	color:#334155;

}

.empty{

	text-align:center;

	padding:70px 20px;

	color:#94a3b8;

}

.empty p{

	margin-top:12px;

	font-size:.95rem;

}

.overlay{

	position:fixed;

	inset:0;

	background:rgba(15,23,42,.55);

	display:flex;

	align-items:center;

	justify-content:center;

	z-index:9999;

}

.modal{

	width:980px;

	max-width:96vw;

	max-height:92vh;

	overflow:hidden;

	background:white;

	border-radius:18px;

	box-shadow:0 25px 70px rgba(0,0,0,.25);

	display:flex;

	flex-direction:column;

}

.modal-header{

	display:flex;

	justify-content:space-between;

	align-items:flex-start;

	padding:24px 28px;

	border-bottom:1px solid #e2e8f0;

}

.modal-header h2{

	margin:0;

	font-size:1.4rem;

	font-weight:700;

	color:#12344d;

}

.modal-header p{

	margin-top:6px;

	font-size:.92rem;

	color:#64748b;

}

.modal-body{

	padding:24px;

	overflow:auto;

}

.close{

	width:40px;

	height:40px;

	border:none;

	background:#f8fafc;

	border-radius:10px;

	display:flex;

	align-items:center;

	justify-content:center;

	cursor:pointer;

	transition:.2s;

}

.close:hover{

	background:#eef2f7;

}

@media(max-width:900px){

	.stats{

		grid-template-columns:repeat(2,1fr);

	}

}

@media(max-width:700px){

	.page-header{

		flex-direction:column;

		align-items:flex-start;

		gap:16px;

	}

	.stats{

		grid-template-columns:1fr;

	}

	.modal{

		width:100%;

		height:100%;

		max-width:none;

		max-height:none;

		border-radius:0;

	}

}

.status{

	display:inline-flex;

	align-items:center;

	padding:6px 12px;

	border-radius:999px;

	font-size:.8rem;

	font-weight:600;

}

.status.active{

	background:#dcfce7;

	color:#166534;

}

.status.inactive{

	background:#fef3c7;

	color:#92400e;

}

</style>