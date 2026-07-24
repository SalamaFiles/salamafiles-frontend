<script>
	import Icon from '@iconify/svelte';

	let { stats } = $props();

	const cards = $derived([
		{
			title: 'Total Users',
			value: stats.total,
			icon: 'lucide:users',
			color: 'blue'
		},
		{
			title: 'Active Users',
			value: stats.active,
			icon: 'lucide:user-check',
			color: 'green'
		},
		{
			title: 'Pending Invitations',
			value: stats.pending,
			icon: 'lucide:mail',
			color: 'amber'
		},
		{
			title: 'Emergency Responders',
			value: stats.emergency,
			icon: 'lucide:siren',
			color: 'red'
		}
	]);
</script>

<div class="page-header">
	<div>
		<h1>Users</h1>
		<p>Manage your organization's users, roles and permissions.</p>
	</div>
</div>

<div class="stats-grid">
	{#each cards as card}
		<div class="stat-card">
			<div class="top">
				<div class="value">{card.value}</div>

				<div class="icon {card.color}">
					<Icon icon={card.icon} width="20" />
				</div>
			</div>

			<div class="label">{card.title}</div>
		</div>
	{/each}
</div>

<style>
.page-header {
	margin-bottom: 1rem;
}

.page-header h1 {
	margin: 0;
	font-size: 2rem;
	font-weight: 700;
	color: #0f172a;
}

.page-header p {
	margin-top: .35rem;
	color: #64748b;
	font-size: .95rem;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1rem;

	/* Prevent cards from stretching vertically */
	align-items: start;
}

.stat-card {
	background: #fff;
	border: 1px solid #e2e8f0;
	border-radius: 16px;
	padding: 1.25rem;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	/* Fixed compact height */
	height: 120px;

	box-shadow: 0 2px 8px rgba(15, 23, 42, .05);
	transition: all .2s ease;
}

.stat-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(15, 23, 42, .08);
}

.top {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.value {
	font-size: 2rem;
	font-weight: 700;
	color: #0f172a;
	line-height: 1;
}

.label {
	font-size: .92rem;
	color: #64748b;
	margin-top: auto;
}

.icon {
	width: 46px;
	height: 46px;
	border-radius: 12px;

	display: flex;
	align-items: center;
	justify-content: center;

	flex-shrink: 0;
}

.icon.blue {
	background: #dbeafe;
	color: #2563eb;
}

.icon.green {
	background: #dcfce7;
	color: #16a34a;
}

.icon.amber {
	background: #fef3c7;
	color: #d97706;
}

.icon.red {
	background: #fee2e2;
	color: #dc2626;
}

@media (max-width: 768px) {
	.stats-grid {
		grid-template-columns: 1fr;
	}

	.stat-card {
		height: auto;
		min-height: 110px;
	}
}
</style>