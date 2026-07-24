<script>
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	function stopPropagation(event) {
	event.stopPropagation();
}

	let {
		open = false,
		saving = false,
		currentUser,
		organizations = [],
		onSave,
		onCancel
	} = $props();

	let form = $state({
		name: '',
		email: '',
		phone: '',
		role: 'Counselor',
		organization: ''
	});

	function submit() {
		if (!form.name.trim()) {
			toast.error('Full name is required.');
			return;
		}

		if (!form.email.trim()) {
			toast.error('Email address is required.');
			return;
		}

		if (
			currentUser?.role === 'PlatformAdmin' &&
			!form.organization
		) {
			toast.error('Please select an organization.');
			return;
		}

		onSave({
			...form
		});
	}

	$effect(() => {
		if (!open) {
			form = {
				name: '',
				email: '',
				phone: '',
				role: 'Counselor',
				organization: ''
			};
		}
	});
</script>

{#if open}
<div class="backdrop" onclick={onCancel}>
	<div
	class="modal"
	onclick={stopPropagation}
>

		<div class="header">

			<div>
				<h2>Invite User</h2>
				<p>
					Send an invitation to join SalamaFiles.
				</p>
			</div>

			<button
				class="close"
				type="button"
				onclick={onCancel}
			>
				<Icon icon="lucide:x" width="20" />
			</button>

		</div>

<form
	onsubmit={(e) => {
		e.preventDefault();
		submit();
	}}
>

			<div class="body">

				<div class="grid">

					<div class="field">
						<label>
							Full Name <span>*</span>
						</label>

						<div class="input">
							<Icon icon="lucide:user" width="18" />
							<input
								bind:value={form.name}
								placeholder="Jane Doe"
							/>
						</div>
					</div>

					<div class="field">
						<label>
							Email Address <span>*</span>
						</label>

						<div class="input">
							<Icon icon="lucide:mail" width="18" />
							<input
								type="email"
								bind:value={form.email}
								placeholder="jane@example.org"
							/>
						</div>
					</div>

					<div class="field">
						<label>Phone Number</label>

						<div class="input">
							<Icon icon="lucide:phone" width="18" />
							<input
								bind:value={form.phone}
								placeholder="+254..."
							/>
						</div>
					</div>

					<div class="field">
						<label>
							Role <span>*</span>
						</label>

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

						<small>
							{#if form.role === 'Admin'}
								Can manage users, reports and settings.
							{:else if form.role === 'Supervisor'}
								Assigns and oversees cases.
							{:else if form.role === 'Counselor'}
								Handles assigned survivor cases.
							{:else}
								Responds to emergency escalations.
							{/if}
						</small>
					</div>

					{#if currentUser?.role === 'PlatformAdmin'}

						<div class="field full">
							<label>
								Organization <span>*</span>
							</label>

							<select bind:value={form.organization}>
								<option value="">
									Select organization
								</option>

								{#each organizations as org}
									<option value={org._id}>
										{org.name}
									</option>
								{/each}
							</select>
						</div>

					{/if}

				</div>

				<div class="info">
					<Icon icon="lucide:info" width="18" />

					<div>
						The invited user will receive an email containing
						an activation link to create their password and
						access SalamaFiles.
					</div>
				</div>

			</div>

			<div class="footer">

				<button
					type="button"
					class="secondary"
					onclick={onCancel}
					disabled={saving}
				>
					Cancel
				</button>

				<button
					type="submit"
					class="primary"
					disabled={saving}
				>
					{#if saving}
						<Icon
							icon="lucide:loader-circle"
							class="spin"
							width="18"
						/>

						Sending Invitation...

					{:else}

						<Icon
							icon="lucide:user-plus"
							width="18"
						/>

						Invite User

					{/if}
				</button>

			</div>

		</form>

	</div>
</div>
{/if}

<style>

.backdrop{
	position:fixed;
	inset:0;
	background:rgba(15,23,42,.55);
	backdrop-filter:blur(6px);
	display:flex;
	align-items:center;
	justify-content:center;
	padding:1.5rem;
	z-index:1000;
}

.modal{
	width:720px;
	max-width:100%;
	background:white;
	border-radius:20px;
	overflow:hidden;
	box-shadow:0 30px 70px rgba(15,23,42,.22);
	border:1px solid #e2e8f0;
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
	font-size:1.4rem;
	color:#0f172a;
}

.header p{
	margin-top:.45rem;
	color:#64748b;
	font-size:.95rem;
}

.close{
	background:none;
	border:none;
	cursor:pointer;
	color:#64748b;
}

.body{
	padding:24px;
}

.grid{
	display:grid;
	grid-template-columns:1fr 1fr;
	gap:20px;
}

.full{
	grid-column:1/-1;
}

.field{
	display:flex;
	flex-direction:column;
	gap:8px;
}

.field label{
	font-weight:600;
	color:#334155;
	font-size:.9rem;
}

.field label span{
	color:#dc2626;
}

.field small{
	color:#64748b;
	font-size:.78rem;
}

.input{
	display:flex;
	align-items:center;
	gap:10px;
	padding:0 14px;
	border:1px solid #cbd5e1;
	border-radius:12px;
	background:white;
}

.input:focus-within{
	border-color:#14b8a6;
	box-shadow:0 0 0 3px rgba(20,184,166,.15);
}

.input svg{
	color:#94a3b8;
	flex-shrink:0;
}

.input input{
	width:100%;
	border:none;
	outline:none;
	padding:13px 0;
	font-size:.95rem;
	background:transparent;
}

select{
	padding:13px 14px;
	border-radius:12px;
	border:1px solid #cbd5e1;
	font-size:.95rem;
	background:white;
}

select:focus{
	outline:none;
	border-color:#14b8a6;
	box-shadow:0 0 0 3px rgba(20,184,166,.15);
}

.info{
	margin-top:24px;
	display:flex;
	gap:12px;
	padding:16px;
	border-radius:14px;
	background:#ecfeff;
	border:1px solid #a5f3fc;
	color:#155e75;
	font-size:.9rem;
}

.footer{
	display:flex;
	justify-content:flex-end;
	gap:12px;
	padding:20px 24px;
	border-top:1px solid #e2e8f0;
	background:#fafafa;
	position:sticky;
	bottom:0;
}

.secondary{
	padding:11px 18px;
	border-radius:10px;
	border:1px solid #cbd5e1;
	background:white;
	cursor:pointer;
	font-weight:600;
}

.primary{
	display:flex;
	align-items:center;
	gap:8px;
	padding:11px 20px;
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

.spin{
	animation:spin 1s linear infinite;
}

@keyframes spin{
	from{
		transform:rotate(0deg);
	}
	to{
		transform:rotate(360deg);
	}
}

@media (max-width:700px){

	.grid{
		grid-template-columns:1fr;
	}

	.full{
		grid-column:auto;
	}

	.footer{
		flex-direction:column-reverse;
	}

	.footer button{
		width:100%;
		justify-content:center;
	}

}
</style>