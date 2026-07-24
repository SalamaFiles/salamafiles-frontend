<script>
	import Icon from "@iconify/svelte";

	let { onInvite } = $props();
</script>

<div class="empty-state">

<div class="icon">
	<Icon icon="lucide:users" width="36" />
</div>

	<h2>No users found</h2>

	<p>
		There are no users matching your search, or your organization
		hasn't invited anyone yet.
	</p>

	<button
		class="primary-btn"
		onclick={onInvite}
	>
		Invite User
	</button>

</div>

<style>

.empty-state{

	display:flex;
	flex-direction:column;
	align-items:center;
	justify-content:center;

	padding:4rem 2rem;

	background:white;

	border:1px solid #e2e8f0;

	border-radius:18px;

	text-align:center;

}

.icon{

	width:72px;
	height:72px;

	border-radius:50%;

	background:#eff6ff;

	display:flex;
	align-items:center;
	justify-content:center;

	font-size:2rem;

	margin-bottom:1.5rem;

}

h2{

	margin:0;

	font-size:1.5rem;

	color:#0f172a;

}

p{

	margin:1rem 0 2rem;

	max-width:420px;

	color:#64748b;

	line-height:1.6;

}

.primary-btn{

	background:#2563eb;

	color:white;

	border:none;

	padding:.85rem 1.4rem;

	border-radius:10px;

	font-weight:600;

	cursor:pointer;

	transition:.2s;

}

.primary-btn:hover{

	background:#1d4ed8;

	transform:translateY(-1px);

}

</style>