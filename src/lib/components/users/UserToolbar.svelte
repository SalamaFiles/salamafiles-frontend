<script>
	import Icon from '@iconify/svelte';

	let {
		search = $bindable(),
		onInvite
	} = $props();
</script>

<div class="toolbar">

	<div class="left">

		<div class="heading">
			<h2>User Management</h2>
			<p>Invite, manage and monitor your organization users.</p>
		</div>

		<div class="search-box">

			<Icon
				icon="lucide:search"
				width="18"
				class="search-icon"
			/>

			<input
				type="text"
				placeholder="Search by name, email or role..."
				bind:value={search}
			/>

		</div>

	</div>

	<button
		class="invite-btn"
		onclick={onInvite}
	>

		<Icon
			icon="lucide:user-plus"
			width="18"
		/>

		<span>Invite User</span>

	</button>

</div>

<style>

.toolbar{

	display:flex;
	justify-content:space-between;
	align-items:flex-end;
	gap:1.5rem;
	margin:1.5rem 0;

}

.left{

	flex:1;
	display:flex;
	flex-direction:column;
	gap:1rem;

}

.heading h2{

	margin:0;
	font-size:1.35rem;
	font-weight:700;
	color:#0f172a;

}

.heading p{

	margin:.35rem 0 0;
	color:#64748b;
	font-size:.92rem;

}

/* ===========================
   Search
=========================== */

.search-box{

	display:flex;
	align-items:center;
	gap:.75rem;

	max-width:460px;

	background:#fff;

	padding:.9rem 1rem;

	border:1px solid #dbe3ef;

	border-radius:14px;

	box-shadow:0 3px 10px rgba(15,23,42,.04);

	transition:all .2s ease;

}

.search-box:focus-within{

	border-color:#14b8a6;

	box-shadow:0 0 0 4px rgba(20,184,166,.12);

}

.search-icon{

	color:#94a3b8;

	flex-shrink:0;

}

.search-box input{

	width:100%;
	border:none;
	outline:none;
	background:none;

	font-size:.95rem;
	color:#0f172a;

}

.search-box input::placeholder{

	color:#94a3b8;

}

/* ===========================
   Button
=========================== */

.invite-btn{

	display:flex;
	align-items:center;
	gap:.65rem;

	padding:.9rem 1.35rem;

	border:none;

	border-radius:14px;

	background:linear-gradient(
		135deg,
		#14b8a6,
		#0f766e
	);

	color:white;

	font-weight:600;

	cursor:pointer;

	box-shadow:0 8px 20px rgba(20,184,166,.25);

	transition:.2s;

	white-space:nowrap;

}

.invite-btn:hover{

	transform:translateY(-2px);

	box-shadow:0 14px 28px rgba(20,184,166,.35);

}

.invite-btn:active{

	transform:translateY(0);

}

/* ===========================
   Responsive
=========================== */

@media (max-width:768px){

	.toolbar{

		flex-direction:column;
		align-items:stretch;

	}

	.search-box{

		max-width:100%;

	}

	.invite-btn{

		width:100%;
		justify-content:center;

	}

}

</style>