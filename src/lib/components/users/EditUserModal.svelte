<script>
	import Icon from '@iconify/svelte';

	let {
		open = false,
		saving = false,
		user = null,
		onSave,
		onCancel
	} = $props();

	let form = $state({
		name: '',
		email: '',
		phone: '',
		role: 'Counselor'
	});

	$effect(() => {

		if (!user) return;

		form = {
			name: user.name ?? '',
			email: user.email ?? '',
			phone: user.phone ?? '',
			role: user.role ?? 'Counselor'
		};

	});

	function save() {

		if (!form.name.trim()) return;

		onSave({
			name: form.name,
			phone: form.phone,
			role: form.role
		});

	}
</script>

{#if open}

<div class="backdrop">

	<div class="modal">

		<div class="header">

			<div>

				<h2>Edit User</h2>

				<p>
					Update the user's information.
				</p>

			</div>

			<button
				class="close"
				onclick={onCancel}
			>

				<Icon
					icon="lucide:x"
					width="20"
				/>

			</button>

		</div>

		<div class="body">

			<div class="field">

				<label>Full Name</label>

				<input
					bind:value={form.name}
				/>

			</div>

			<div class="field">

				<label>Email Address</label>

				<input
					value={form.email}
					disabled
				/>

				<small>
					Email cannot be changed.
				</small>

			</div>

			<div class="field">

				<label>Phone Number</label>

				<input
					bind:value={form.phone}
				/>

			</div>

			<div class="field">

				<label>Role</label>

				<select bind:value={form.role}>

					<option value="Admin">
						Admin
					</option>

					<option value="Supervisor">
						Supervisor
					</option>

					<option value="Counselor">
						Counselor
					</option>

					<option value="Emergency">
						Emergency
					</option>

				</select>

			</div>

		</div>

		<div class="footer">

			<button
				class="secondary"
				onclick={onCancel}
				disabled={saving}
			>

				Cancel

			</button>

			<button
				class="primary"
				onclick={save}
				disabled={saving}
			>

				{#if saving}

					Saving...

				{:else}

					<Icon
						icon="lucide:save"
						width="18"
					/>

					Save Changes

				{/if}

			</button>

		</div>

	</div>

</div>

{/if}

<style>

.backdrop{
	position:fixed;
	inset:0;
	background:rgba(15,23,42,.55);
	backdrop-filter:blur(5px);
	display:flex;
	align-items:center;
	justify-content:center;
	z-index:1000;
}

.modal{
	width:560px;
	max-width:95vw;
	background:white;
	border-radius:18px;
	border:1px solid #e2e8f0;
	box-shadow:0 30px 60px rgba(15,23,42,.18);
	overflow:hidden;
}

.header{
	display:flex;
	justify-content:space-between;
	align-items:flex-start;
	padding:24px;
	border-bottom:1px solid #e2e8f0;
}

.header h2{
	margin:0;
	color:#0f172a;
	font-size:1.3rem;
}

.header p{
	margin-top:6px;
	color:#64748b;
	font-size:.9rem;
}

.close{
	background:none;
	border:none;
	cursor:pointer;
	color:#64748b;
}

.body{
	padding:24px;
	display:flex;
	flex-direction:column;
	gap:18px;
}

.field{
	display:flex;
	flex-direction:column;
	gap:8px;
}

.field label{
	font-size:.85rem;
	font-weight:600;
	color:#334155;
}

input,
select{
	padding:12px 14px;
	border:1px solid #cbd5e1;
	border-radius:10px;
	font-size:.95rem;
	background:white;
}

input:focus,
select:focus{
	outline:none;
	border-color:#14b8a6;
	box-shadow:0 0 0 3px rgba(20,184,166,.15);
}

input:disabled{
	background:#f8fafc;
	color:#64748b;
	cursor:not-allowed;
}

small{
	color:#94a3b8;
	font-size:.75rem;
}

.footer{
	display:flex;
	justify-content:flex-end;
	gap:12px;
	padding:20px 24px;
	border-top:1px solid #e2e8f0;
	background:#fafafa;
}

.secondary{
	padding:10px 18px;
	border-radius:10px;
	border:1px solid #cbd5e1;
	background:white;
	cursor:pointer;
}

.primary{
	display:flex;
	align-items:center;
	gap:8px;
	padding:10px 18px;
	border:none;
	border-radius:10px;
	background:#14b8a6;
	color:white;
	font-weight:600;
	cursor:pointer;
}

.primary:hover{
	background:#0f766e;
}

button:disabled{
	opacity:.6;
	cursor:not-allowed;
}

</style>