<script>
	import Icon from '@iconify/svelte';

	let {
		users = [],
		loading = false,
		currentUser,
		onEdit,
		onStatus,
		 onResend,
		onDelete
	} = $props();

	function initials(name = '') {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.substring(0, 2)
			.toUpperCase();
	}

	function badge(role) {
		switch (role) {
			case 'PlatformAdmin':
				return 'platform';
			case 'Admin':
				return 'admin';
			case 'Supervisor':
				return 'supervisor';
			case 'Emergency':
				return 'emergency';
			default:
				return 'counselor';
		}
	}

	function statusClass(status) {
		switch (status) {
			case 'Active':
				return 'active';
			case 'Pending':
				return 'pending';
			case 'Suspended':
				return 'suspended';
			default:
				return 'disabled';
		}
	}

	function formatDate(date) {
		if (!date) return 'Never';

		return new Date(date).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

{#if loading}

<div class="empty">

	Loading users...

</div>

{:else if users.length === 0}

<div class="empty">

	<Icon icon="lucide:users" width="52" />

	<h2>No users yet</h2>

	<p>Invite your first user to start collaborating.</p>

</div>

{:else}

<div class="table-card">

<div class="table-wrapper">

<table>

<thead>

<tr>

<th>User</th>

{#if currentUser?.role === 'PlatformAdmin'}
<th>Organization</th>
{/if}

<th>Role</th>

<th>Status</th>

<th>Last Login</th>

<th class="actions-header">Actions</th>

</tr>

</thead>

<tbody>

{#each users as user (user._id)}

<tr>

<td>

<div class="user">

<div class="avatar">

{initials(user.name)}

</div>

<div>

<div class="name">{user.name}</div>

<div class="email">{user.email}</div>

{#if user.phone}
<div class="phone">{user.phone}</div>
{/if}

</div>

</div>

</td>

{#if currentUser?.role === 'PlatformAdmin'}

<td>

{user.organization?.name || "-"}

</td>

{/if}

<td>

<span class="role {badge(user.role)}">

{user.role}

</span>

</td>

<td>

<span class="status {statusClass(user.status)}">

{user.status}

</span>

</td>

<td>

{formatDate(user.lastLogin)}

</td>

<td>

<div class="actions">

<button title="Edit" onclick={() => onEdit(user)}>

<Icon icon="lucide:pencil" width="16"/>

</button>

{#if user.status === "Pending"}

<button
    title="Resend Invitation"
    onclick={() => onResend(user)}
>
    <Icon icon="lucide:mail" width="16"/>
</button>

{/if}

<button
	title="Status"
	onclick={() => onStatus(user)}
>

<Icon icon="lucide:shield-check"/>

</button>

<button
	class="danger"
	title="Disable"
	onclick={() => onDelete(user)}
>

<Icon icon="lucide:trash-2"/>

</button>

</div>

</td>

</tr>

{/each}

</tbody>

</table>

</div>

</div>

{/if}

<style>

.table-card{
	background:white;
	border-radius:18px;
	border:1px solid #e2e8f0;
	box-shadow:0 8px 24px rgba(15,23,42,.05);
	overflow:hidden;
}

.table-wrapper{
	overflow-x:auto;
}

table{
	width:100%;
	border-collapse:collapse;
	min-width:900px;
}

thead{
	background:#f8fafc;
}

th{
	padding:18px 24px;
	text-align:left;
	font-size:.82rem;
	text-transform:uppercase;
	letter-spacing:.05em;
	color:#64748b;
	font-weight:700;
}

td{
	padding:18px 24px;
	border-top:1px solid #f1f5f9;
}

tbody tr{
	transition:.2s;
}

tbody tr:hover{
	background:#f8fafc;
}

.user{
	display:flex;
	align-items:center;
	gap:14px;
}

.avatar{
	width:48px;
	height:48px;
	border-radius:50%;
	background:linear-gradient(135deg,#14b8a6,#0f766e);
	color:white;
	display:flex;
	align-items:center;
	justify-content:center;
	font-weight:700;
	font-size:.95rem;
	flex-shrink:0;
}

.name{
	font-weight:700;
	color:#0f172a;
}

.email{
	font-size:.88rem;
	color:#64748b;
	margin-top:2px;
}

.phone{
	font-size:.8rem;
	color:#94a3b8;
	margin-top:2px;
}

.role,
.status{
	padding:6px 14px;
	border-radius:999px;
	font-size:.78rem;
	font-weight:600;
	display:inline-flex;
	align-items:center;
}

.platform{
	background:#ede9fe;
	color:#6d28d9;
}

.admin{
	background:#dbeafe;
	color:#1d4ed8;
}

.supervisor{
	background:#fef3c7;
	color:#b45309;
}

.counselor{
	background:#ccfbf1;
	color:#0f766e;
}

.emergency{
	background:#fee2e2;
	color:#dc2626;
}

.active{
	background:#dcfce7;
	color:#15803d;
}

.pending{
	background:#fef3c7;
	color:#b45309;
}

.suspended{
	background:#fee2e2;
	color:#dc2626;
}

.disabled{
	background:#e2e8f0;
	color:#475569;
}

.actions{
	display:flex;
	gap:8px;
}

.actions button{
	width:36px;
	height:36px;
	border:none;
	border-radius:10px;
	background:#f8fafc;
	color:#64748b;
	cursor:pointer;
	display:flex;
	align-items:center;
	justify-content:center;
	transition:.2s;
}

.actions button:hover{
	background:#14b8a6;
	color:white;
	transform:translateY(-2px);
}

.actions .danger:hover{
	background:#dc2626;
}

.empty{
	padding:80px;
	text-align:center;
	display:flex;
	flex-direction:column;
	align-items:center;
	gap:14px;
	color:#64748b;
}

.empty h2{
	margin:0;
	color:#0f172a;
}

.empty p{
	margin:0;
}

</style>