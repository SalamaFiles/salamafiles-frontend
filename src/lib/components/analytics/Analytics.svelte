<script>
    import Icon from '@iconify/svelte';
	import { appState } from '$lib/state.svelte.js';
	import { tick } from 'svelte';
	import Chart from 'chart.js/auto';

	let { reports = [], staff = [] } = $props();
	let tab = $state('overview');

	// ---------------- FILTER STATE ----------------
	let search = $state('');
	let statusFilter = $state('all');
	let urgencyFilter = $state('all');

	// ---------------- KPI STATE ----------------
	let total = $state(0);
	let high = $state(0);
	let resolved = $state(0);
	let escalated = $state(0);

	const normalize = (s) => s?.toLowerCase();

	$effect(() => {
		if (!reports?.length) {
			total = high = resolved = escalated = 0;
			return;
		}

		total = reports.length;
		high = reports.filter(r => normalize(r.urgency) === 'high').length;
		resolved = reports.filter(r => normalize(r.status) === 'resolved').length;
		escalated = reports.filter(r => normalize(r.status) === 'escalated').length;
	});

	
	
	// ---------------- EXPORT CSV ----------------
	function exportCSV() {
		const data = getFilteredReports();

		const headers = ['Case No.', 'Status', 'Urgency', 'Assigned To', 'Timestamp'];

		const rows = data.map(r => [
			r.caseNumber ?? '',
			r.status ?? '',
			r.urgency ?? '',
			r.assignedTo?.name ?? '',
			r.timestamp ?? ''
		]);

		const csvContent =
			[headers, ...rows]
				.map(e => e.join(','))
				.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'reports.csv';
		a.click();

		URL.revokeObjectURL(url);
	}

	// ---------------- CHART SETUP (unchanged) ----------------
	let timeChartEl, statusChartEl, urgencyChartEl, staffChartEl;
	let timeChart, statusChart, urgencyChart, staffChart;

	function groupByDate(data) {
		const map = {};
		data.forEach(r => {
			const d = new Date(r.timestamp);
			if (!isNaN(d)) {
				const date = d.toLocaleDateString();
				map[date] = (map[date] || 0) + 1;
			}
		});
		return { labels: Object.keys(map), values: Object.values(map) };
	}

	function groupByStatus(data) {
		const map = { Pending: 0, Assigned: 0, Resolved: 0 };
		data.forEach(r => {
			const s = normalize(r.status);
			if (s === 'pending') map.Pending++;
			if (s === 'assigned') map.Assigned++;
			if (s === 'resolved') map.Resolved++;
		});
		return map;
	}

	function groupByUrgency(data) {
		const map = { High: 0, Medium: 0, Low: 0 };
		data.forEach(r => {
			const u = normalize(r.urgency);
			if (u === 'high') map.High++;
			if (u === 'medium') map.Medium++;
			if (u === 'low') map.Low++;
		});
		return map;
	}

	function groupByStaff(data) {
  const map = {};

  data.forEach((r) => {
    const name =
      r.assignedTo?.name ||
      r.assignedTo?.fullName ||
      "Unassigned";

    map[name] = (map[name] || 0) + 1;
  });

  return {
    labels: Object.keys(map),
    values: Object.values(map)
  };
}

	function destroyCharts() {
		timeChart?.destroy();
		statusChart?.destroy();
		urgencyChart?.destroy();
		staffChart?.destroy();
	}

	async function buildCharts() {
		if (!reports?.length) return;
		await tick();
		destroyCharts();

		if (timeChartEl && (tab === 'overview' || tab === 'operations')) {
			const t = groupByDate(reports);
			timeChart = new Chart(timeChartEl, {
				type: 'line',
				data: {
					labels: t.labels,
					datasets: [{ label: 'Reports', data: t.values }]
				}
			});
		}

	if (statusChartEl && (tab === 'overview' || tab === 'operations')) {
	const s = groupByStatus(reports);

	statusChart = new Chart(statusChartEl, {
		type: 'doughnut',
		data: {
			labels: Object.keys(s),
			datasets: [{
				data: Object.values(s),

				backgroundColor: [
					'#64748b', // Pending
					'#14b8a6', // Assigned
					'#22c55e', // Resolved
				],

				borderColor: '#ffffff',
				borderWidth: 3,
				hoverOffset: 12
			}]
		},
		options: {
			responsive: true,
			cutout: '70%',

			plugins: {
				legend: {
					position: 'bottom',
					labels: {
						color: '#475569',
						padding: 20,
						usePointStyle: true,
						pointStyle: 'circle',
						font: {
							size: 12,
							weight: '600'
						}
					}
				},

				tooltip: {
					backgroundColor: '#0f172a',
					titleColor: '#fff',
					bodyColor: '#fff',
					padding: 12,
					borderColor: '#14b8a6',
					borderWidth: 1
				}
			}
		}
	});
}

		if (urgencyChartEl && tab === 'risk') {
			const u = groupByUrgency(reports);
			urgencyChart = new Chart(urgencyChartEl, {
				type: 'bar',
				data: {
					labels: Object.keys(u),
					datasets: [{ data: Object.values(u) }]
				}
			});
		}

		if (staffChartEl && tab === 'team') {
			const st = groupByStaff(reports);
			staffChart = new Chart(staffChartEl, {
				type: 'bar',
				data: {
					labels: st.labels,
					datasets: [{ data: st.values }]
				}
			});
		}
	}

	$effect(async () => {
		if (appState.mainView !== 'analytics') return;
		await buildCharts();
	});

	$effect(() => {
		tab;
		buildCharts();
	});

    let sortKey = $state('timestamp');
let sortAsc = $state(false);

function sortBy(key) {
	if (sortKey === key) {
		sortAsc = !sortAsc;
	} else {
		sortKey = key;
		sortAsc = true;
	}
}

function getFilteredReports() {
	let data = reports.filter(r => {
		const matchSearch =
			!search ||
			JSON.stringify(r).toLowerCase().includes(search.toLowerCase());

		const matchStatus =
			statusFilter === 'all' ||
			normalize(r.status) === statusFilter;

		const matchUrgency =
			urgencyFilter === 'all' ||
			normalize(r.urgency) === urgencyFilter;

		return matchSearch && matchStatus && matchUrgency;
	});

	return data.sort((a, b) => {
		let valA, valB;

		if (sortKey === 'assignedTo') {
			valA = a.assignedTo?.name ?? '';
			valB = b.assignedTo?.name ?? '';
		} else {
			valA = a[sortKey];
			valB = b[sortKey];
		}

		if (sortKey === 'timestamp') {
			valA = new Date(valA);
			valB = new Date(valB);
		}

		if (valA < valB) return sortAsc ? -1 : 1;
		if (valA > valB) return sortAsc ? 1 : -1;
		return 0;
	});
}

plugins: [{
  id: 'centerText',
  beforeDraw(chart) {
    const { width, height, ctx } = chart;

    ctx.restore();
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const total = Object.values(statusData).reduce((a, b) => a + b, 0);

    ctx.fillText(total, width / 2, height / 2);
    ctx.save();
  }
}]
</script>

<div class="page-header">
  <h2 class="title">
    <Icon icon="lucide:chart-column-big" width="24" />
    Operations Intelligence
  </h2>

  <p class="subtitle">
    Monitor incident trends, response performance, staff workload and escalation patterns.
  </p>
</div>

<div class="tabs">
	<button class:active={tab === 'overview'} on:click={() => (tab = 'overview')}>Overview</button>
	<button class:active={tab === 'operations'} on:click={() => (tab = 'operations')}
		>Operations</button
	>
	<button class:active={tab === 'team'} on:click={() => (tab = 'team')}>Team</button>
	<button class:active={tab === 'risk'} on:click={() => (tab = 'risk')}>Risk</button>
    <button class:active={tab === 'records'} on:click={() => (tab = 'records')}>
	Records
</button>
</div>

<!-- KPI STRIP -->
<div class="kpi-grid">

	<div class="kpi-card reported">

		<div>
			<p class="kpi-label">Reported Cases</p>
			<h2>{total}</h2>
		</div>
	</div>

	<div class="kpi-card risk">
	
		<div>
			<p class="kpi-label">High Risk</p>
			<h2>{high}</h2>
		</div>
	</div>

	<div class="kpi-card resolved">
		<div>
			<p class="kpi-label">Resolved</p>
			<h2>{resolved}</h2>
		</div>
	</div>

	<div class="kpi-card escalated">
		
		<div>
			<p class="kpi-label">Escalated</p>
			<h2>{escalated}</h2>
		</div>
	</div>

</div>

<!-- TABS CONTENT -->
{#if tab === 'overview'}
	<div class="grid">
		<div class="card">
			<h3>
	Incident Trend
</h3>
			<canvas bind:this={timeChartEl}></canvas>
		</div>

		 <div class="doughnut-wrapper">
			<h3>
	<Icon icon="lucide:workflow" width="18" />
	Case Pipeline Health
</h3>
			<canvas bind:this={statusChartEl}></canvas>
		</div>
	</div>
{:else if tab === 'operations'}
	<div class="grid">
		<div class="card">
			<h3>
	Incident Trend
</h3>
			<canvas bind:this={timeChartEl}></canvas>
		</div>

		 <div class="doughnut-wrapper">
			<h3>
  <Icon icon="lucide:siren" width="18" />
  Escalation Load
</h3>
			<canvas bind:this={statusChartEl}></canvas>
		</div>
	</div>
{:else if tab === 'team'}
	<div class="grid">
		<div class="card">
			<h3>
	<Icon icon="lucide:users" width="18" />
	Team Workload
</h3>
			<canvas bind:this={staffChartEl}></canvas>
		</div>
	</div>
{:else if tab === 'risk'}
	<div class="grid">
		<div class="card">
			<h3>
	<Icon icon="lucide:shield-alert" width="18" />
	Risk Distribution
</h3>
			<canvas bind:this={urgencyChartEl}></canvas>
		</div>
	</div>

{:else if tab === 'records'}
	<div class="card">

		<div style="display:flex; gap:10px; margin-bottom:10px;">
			<input
				placeholder="Search..."
				bind:value={search}
			/>

			<select bind:value={statusFilter}>
				<option value="all">All Status</option>
				<option value="pending">Pending</option>
				<option value="assigned">Assigned</option>
				<option value="resolved">Resolved</option>
				<option value="escalated">Escalated</option>
			</select>

			<select bind:value={urgencyFilter}>
				<option value="all">All Urgency</option>
				<option value="high">High</option>
				<option value="medium">Medium</option>
				<option value="low">Low</option>
			</select>

			<button on:click={exportCSV}>⬇ Export CSV</button>
		</div>

		<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th on:click={() => sortBy('caseNumber')}>Case No.</th>
				<th on:click={() => sortBy('status')}>Status</th>
				<th on:click={() => sortBy('urgency')}>Urgency</th>
				<th on:click={() => sortBy('assignedTo')}>Assigned</th>
				<th on:click={() => sortBy('timestamp')}>Time</th>
			</tr>
		</thead>

		<tbody>
			{#each getFilteredReports() as r}
				<tr>
					<td>{r.caseNumber}</td>

					<td>
						<span class={"badge " + r.status?.toLowerCase()}>
							{r.status}
						</span>
					</td>

					<td>
						<span class={"badge " + r.urgency?.toLowerCase()}>
							{r.urgency}
						</span>
					</td>

					<td>{r.assignedTo?.name ?? 'Unassigned'}</td>
					<td>{new Date(r.timestamp).toLocaleString()}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
	</div>
{/if}

<style>
	.title {
	font-size: 1.8rem;
	font-weight: 700;
	color: #0f172a;
	margin-bottom: 1.5rem;
}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.card {
	background: white;

	padding: 1.5rem;

	border-radius: 18px;

	border: 1px solid #e2e8f0;

	box-shadow: 0 8px 24px rgba(15,23,42,0.06);

	transition: all 0.2s ease;
}

.card:hover {
	box-shadow: 0 12px 30px rgba(15,23,42,0.1);
}

.card h3 {
	color: #0f172a;
	font-size: 1rem;
	font-weight: 600;
	margin-bottom: 1rem;
}

	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.kpi {
		background: #f8fafc;
		padding: 1rem;
		border-radius: 12px;
		text-align: center;
		border: 1px solid #e2e8f0;
	}

	.kpi p {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.kpi:nth-child(1) {
	border-top: 4px solid #14b8a6;
}

.kpi:nth-child(2) {
	border-top: 4px solid #ef4444;
}

.kpi:nth-child(3) {
	border-top: 4px solid #22c55e;
}

.kpi:nth-child(4) {
	border-top: 4px solid #f59e0b;
}

	.tabs {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.tabs {
	display: flex;
	gap: 10px;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
}

.tabs button {
	padding: 10px 16px;

	border: 1px solid #e2e8f0;
	border-radius: 10px;

	background: white;
	color: #475569;

	font-weight: 600;
	cursor: pointer;

	transition: all 0.2s ease;
}

.tabs button:hover {
	background: #f8fafc;
	border-color: #14b8a6;
}

.tabs button.active {
	background: #14b8a6;
	color: white;
	border-color: #14b8a6;

	box-shadow: 0 4px 12px rgba(20,184,166,0.25);
}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

    /* ---------------- RECORDS TABLE ---------------- */

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

thead {
  background: #f1f5f9;
}

th {
  text-align: left;
  padding: 0.75rem;
  font-weight: 600;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}

tbody tr:hover {
  background: #f8fafc;
}

/* ---------------- FILTER BAR ---------------- */

.card input,
.card select {
	padding: 10px 12px;

	border-radius: 10px;

	border: 1px solid #cbd5e1;

	background: white;

	color: #1e293b;
}

.card input:focus,
.card select:focus {
	border-color: #14b8a6;
	box-shadow: 0 0 0 3px rgba(20,184,166,0.15);
}

.card select {
  min-width: 140px;
}

/* export button */
.card button {
	background: #14b8a6;
	color: white;

	padding: 10px 16px;

	border: none;
	border-radius: 10px;

	font-weight: 600;

	cursor: pointer;

	transition: all 0.2s ease;
}

.card button:hover {
	background: #0f9f91;
	transform: translateY(-1px);
}

/* filter row layout */
.card > div {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0.75rem;
}
/* ---------------- PRO TABLE WRAPPER ---------------- */

.table-wrap {
  max-height: 500px;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

/* sticky header */
thead th {
  position: sticky;
  top: 0;
  background: #f8fafc;
  z-index: 2;
  cursor: pointer;
}

/* row hover upgrade */
tbody tr:hover {
  background: #f1f5f9;
}

/* ---------------- BADGES ---------------- */

.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

/* status colors */
.badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.badge.assigned {
  background: #dbeafe;
  color: #1e40af;
}

.badge.resolved {
  background: #dcfce7;
  color: #166534;
}

.badge.escalated {
  background: #fee2e2;
  color: #991b1b;
}

/* urgency colors */
.badge.high {
  background: #fee2e2;
  color: #991b1b;
}

.badge.medium {
  background: #fef9c3;
  color: #854d0e;
}

.badge.low {
  background: #dcfce7;
  color: #166534;
}

/* clickable headers feel */
th:hover {
  background: #e2e8f0;
}

.chart {
  background: white;
  padding: 1.2rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);

  height: 240px;
}

.chart h4 {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.doughnut-wrapper {
  width: 400px;
  height: 500px;
  margin: 20px auto;
}

.page-header {
	margin-bottom: 1.5rem;
}

.page-title {
	display: flex;
	align-items: center;
	gap: 10px;

	font-size: 1.8rem;
	font-weight: 700;
	color: #0f172a;
	margin-bottom: 4px;
}

.page-subtitle {
	color: #64748b;
	font-size: 0.95rem;
}

/* KPI SECTION */

.kpi-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.kpi-card {
	display: flex;
	align-items: center;
	gap: 14px;

	padding: 20px;

	background: white;
	border-radius: 18px;
	border: 1px solid #e2e8f0;

	box-shadow: 0 4px 12px rgba(0,0,0,0.04);

	transition: all 0.2s ease;
}

.kpi-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 24px rgba(0,0,0,0.08);
}

.kpi-icon {
	width: 52px;
	height: 52px;

	border-radius: 14px;

	display: flex;
	align-items: center;
	justify-content: center;

	flex-shrink: 0;
}

.kpi-label {
	font-size: 0.85rem;
	color: #64748b;
	margin-bottom: 4px;
}

.kpi-card h2 {
	font-size: 1.8rem;
	font-weight: 700;
	color: #0f172a;
	margin: 0;
}

/* COLORS */

.reported .kpi-icon {
	background: #ccfbf1;
	color: #0f766e;
}

.risk .kpi-icon {
	background: #fee2e2;
	color: #dc2626;
}

.resolved .kpi-icon {
	background: #dcfce7;
	color: #166534;
}

.escalated .kpi-icon {
	background: #fef3c7;
	color: #d97706;
}

.card h3,
.doughnut-wrapper h3 {
	display: flex;
	align-items: center;
	gap: 8px;

	font-size: 1rem;
	font-weight: 600;
	color: #0f172a;

	margin-bottom: 1rem;
}

.page-header {
	margin-bottom: 1.5rem;
}

.title {
	display: flex;
	align-items: center;
	gap: 10px;

	font-size: 1.8rem;
	font-weight: 700;
	color: #0f172a;
	margin: 0;
}

.subtitle {
	margin-top: 4px;
	font-size: 0.95rem;
	color: #64748b;
}

</style>
