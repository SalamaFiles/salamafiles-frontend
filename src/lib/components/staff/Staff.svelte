<script>
     import Icon from '@iconify/svelte';
	let { staff, loading, handleAddStaff, handleUpdateStaff } = $props();

	let showForm = $state(false);
	let showEditModal = $state(false);

	let selectedStaff = $state(null);
	let editData = $state({});

	let search = $state('');

	// form fields
	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let password = $state('');
	let role = $state('Counselor');

	// FIXED: include email + safe handling
	let filteredStaff = $derived(
		(staff || []).filter((s) =>
			`${s.name} ${s.phone} ${s.email} ${s.role}`.toLowerCase().includes(search.toLowerCase())
		)
	);

	function resetForm() {
		name = '';
		phone = '';
		email = '';
		password = '';
		role = 'Counselor';
	}

	async function submit() {
		if (!name || !phone || !email || !password) return;

		await handleAddStaff({ name, phone, email, password, role });

		resetForm();
		showForm = false;
	}

	// FIXED: proper edit handling
	function openEdit(s) {
		selectedStaff = s;

		// clone data (IMPORTANT)
		editData = {
			name: s.name,
			phone: s.phone,
			email: s.email,
			role: s.role
		};

		showEditModal = true;
	}

	async function saveEdit() {
		await handleUpdateStaff(selectedStaff._id, editData);
		showEditModal = false;
	}
</script>


<!-- TOP BAR -->
<div class="toolbar">
	<div class="search-box">
		 <Icon
    icon="lucide:search"
    width="18"
    class="search-icon"
  />
		<input placeholder="Search staff..." bind:value={search} />
	</div>

	<button class="add-btn" onclick={() => (showForm = true)}> <Icon icon="lucide:user-plus" width="18" />
Add Staff </button>
</div>

<!-- ADD STAFF MODAL -->
{#if showForm}
	<div class="modal-backdrop">
		<div class="modal">
			<h3>Add Staff</h3>

			<div class="form-grid">
				<input placeholder="Full Name" bind:value={name} />
				<input placeholder="Phone Number" bind:value={phone} />
				<input placeholder="Email" bind:value={email} />
				<input type="password" placeholder="Password" bind:value={password} />

				<select bind:value={role}>
					<option>Counselor</option>
					<option>Admin</option>
					<option>Emergency</option>
					<option>Supervisor</option>
				</select>
			</div>

			<div class="actions">
				<button onclick={() => (showForm = false)}>Cancel</button>
				<button class="submit" onclick={submit}>Save</button>
			</div>
		</div>
	</div>
{/if}

<!-- EDIT MODAL -->
{#if showEditModal}
	<div class="modal-backdrop">
		<div class="modal">
			<h3>Edit Staff</h3>

			<div class="form-grid">
				<input bind:value={editData.name} />
				<input bind:value={editData.phone} />
				<input bind:value={editData.email} />

				<select bind:value={editData.role}>
					<option>Counselor</option>
					<option>Admin</option>
					<option>Emergency</option>
					<option>Supervisor</option>
				</select>
			</div>

			<div class="actions">
				<button onclick={() => (showEditModal = false)}> Cancel </button>
				<button class="submit" onclick={saveEdit}> Save Changes </button>
			</div>
		</div>
	</div>
{/if}

<!-- TABLE -->
{#if loading}
	<p class="empty">Loading staff...</p>
{:else if filteredStaff.length === 0}
	<p class="empty">No staff found</p>
{:else}
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Phone</th>
				<th>Email</th>
				<th>Role</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			{#each filteredStaff as s (s._id)}
				<tr>
					<td>{s.name}</td>
					<td>{s.phone}</td>
					<td>{s.email}</td>
					<td>
						<span class="role {s.role}">
							{s.role}
						</span>
					</td>
					<td>
						<button class="edit-btn" onclick={() => openEdit(s)}> <Icon icon="lucide:pencil" width="16" /> </button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
.title {
	font-size: 1.3rem;
	font-weight: 600;
	color: #1e293b;
	margin-bottom: 1.5rem;
}

	/* Toolbar */
.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
	gap: 12px;
}

	/* Search */
	.search-box {
	display: flex;
	align-items: center;
	gap: 10px;

	background: white;
	border: 1px solid #e2e8f0;

	padding: 10px 14px;
	border-radius: 12px;

	min-width: 280px;

	box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-box span {
	color: #64748b;
}

.search-box input {
	border: none;
	outline: none;
	background: transparent;

	font-size: 0.95rem;
	color: #1e293b;
	width: 100%;
}

.search-box input::placeholder {
	color: #94a3b8;
}
	/* Add button */
.add-btn {
	background: #14b8a6;
	color: white;
	border: none;

	padding: 6px 12px;          
	border-radius: 8px;        

	font-size: 14px;           
	font-weight: 600;

	display: inline-flex;      
	align-items: center;
	gap: 6px;                  

	cursor: pointer;
	transition: 0.2s ease;
}

.add-btn:hover {
	background: #0f9f91;
	transform: translateY(-1px);
}

	/* Table */
	.table {
	width: 100%;
	border-collapse: collapse;

	background: white;
	border-radius: 16px;
	overflow: hidden;

	border: 1px solid #e2e8f0;

	box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
	.table th {
	background: #f8fafc;

	color: #475569;
	font-size: 0.85rem;
	font-weight: 600;

	padding: 14px;

	border-bottom: 1px solid #e2e8f0;
}

.table td {
	padding: 14px;
	color: #334155;
	border-bottom: 1px solid #f1f5f9;
}

.table tr {
	background: white;
	transition: all 0.2s ease;
}

.table tr:hover {
	background: #f8fafc;
}
	/* Role badge */
	.role {
	padding: 6px 12px;
	border-radius: 999px;
	font-size: 0.75rem;
	font-weight: 600;
}

.role.Counselor {
	background: #ccfbf1;
	color: #0f766e;
}

.role.Admin {
	background: #dbeafe;
	color: #1d4ed8;
}

.role.Emergency {
	background: #fee2e2;
	color: #dc2626;
}

.role.Supervisor {
	background: #fef3c7;
	color: #d97706;
}
	/* Edit button */
	.edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    background: #f8fafc;
    color: #334155;   /* add this */

    border: 1px solid #e2e8f0;
    width: 36px;
    height: 36px;
    border-radius: 8px;
}

.edit-btn:hover {
	background: #14b8a6;
	color: white;
	border-color: #14b8a6;
}

	/* Modal backdrop */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(15, 23, 42, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Modal */
	.modal {
	background: white;
	color: #1e293b;

	padding: 1.8rem;
	border-radius: 18px;

	width: 500px;

	border: 1px solid #e2e8f0;

	box-shadow: 0 25px 50px rgba(15,23,42,0.15);
}
	/* Inputs */
	input,
select {
	width: 100%;

	padding: 12px;

	border-radius: 10px;

	border: 1px solid #cbd5e1;
	background: white;

	color: #1e293b;
}

input:focus,
select:focus {
	border-color: #14b8a6;
	box-shadow: 0 0 0 3px rgba(20,184,166,0.15);
}

	/* Form */
	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 1rem;
	}

	/* Buttons */
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 1rem;
	}

	.actions .submit {
	background: #14b8a6;
	color: white;
	font-weight: 600;
}

.actions .submit:hover {
	background: #0f9f91;
}

.actions .submit {
	background: #14b8a6;
	color: white;
	font-weight: 600;
	padding: 10px 18px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
}

.actions .submit:hover {
	background: #0f9f91;
	transform: translateY(-1px);
	box-shadow: 0 6px 18px rgba(20, 184, 166, 0.35);
}

.actions .submit:active {
	transform: translateY(0);
}

.actions button:first-child {
	background: #f1f5f9;
	color: #475569;
	border: 1px solid #e2e8f0;
	font-weight: 500;
	padding: 10px 18px;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.actions button:first-child:hover {
	background: #e2e8f0;
}

.page-header {
	margin-bottom: 1.5rem;
}

.title {
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 1.6rem;
	font-weight: 700;
	color: #0f172a;
	margin-bottom: 4px;
}

.subtitle {
	color: #64748b;
	font-size: 0.9rem;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.stat-card {
	display: flex;
	align-items: center;
	gap: 14px;

	padding: 18px;

	background: white;
	border-radius: 16px;
	border: 1px solid #e2e8f0;

	box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.stat-card h3 {
	font-size: 1.5rem;
	font-weight: 700;
	color: #0f172a;
	margin: 0;
}

.stat-card p {
	margin: 0;
	color: #64748b;
	font-size: 0.85rem;
}

.staff-cell {
	display: flex;
	align-items: center;
	gap: 12px;
}

.avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: #14b8a6;
	color: white;

	display: flex;
	align-items: center;
	justify-content: center;

	font-weight: 700;
}

.staff-name {
	font-weight: 600;
	color: #0f172a;
}

.staff-id {
	font-size: 0.75rem;
	color: #64748b;
}

.search-icon {
	color: #94a3b8;
}

</style>
