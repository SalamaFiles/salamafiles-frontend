<script>
    import QuickStats from "./QuickStats.svelte";
    import DashboardCharts from "./DashboardCharts.svelte";
    import RecentActivity from "./RecentActivity.svelte";

    let {
        reports = [],
        total = 0,
        high = 0,
        resolved = 0,
        escalated = 0,
        loading = false,
        role = "Admin",
        user = null
    } = $props();
</script>

<div class="dashboard">

    <!-- Quick summary comes immediately after KPIs -->
    <QuickStats
        {reports}
    />

    <DashboardCharts
        {reports}
    />

    <RecentActivity
        {reports}
        {loading}
    />

</div>

<style>
.dashboard{
    display:flex;
    flex-direction:column;
    gap:1.5rem;
    width:100%;
}
</style>