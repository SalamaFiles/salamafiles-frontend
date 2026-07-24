<script>
    import { auth } from "$lib/stores/auth.js";

    import ChartCard from "./charts/ChartCard.svelte";
    import LineChart from "./charts/LineChart.svelte";
    import DoughnutChart from "./charts/DoughnutChart.svelte";
    import BarChart from "./charts/BarChart.svelte";

    let {
        reports = []
    } = $props();

    const user = $derived($auth.user);

    const role = $derived(
        user?.role ?? "Admin"
    );

    /* ============================
       Helpers
    ============================ */

    function receivedDate(report) {

        return (
            report.timeline?.receivedAt ??
            report.createdAt
        );

    }

    function priority(report) {

        return (
            report.incident?.priority ??
            report.urgency ??
            "Low"
        );

    }

    function category(report) {

        return (
            report.incident?.category ??
            "Other"
        );

    }

    /* ============================
       Reports Over Time
    ============================ */

    const trend = $derived.by(() => {

        const map = {};

        reports.forEach(report => {

            const day =
                new Date(receivedDate(report))
                .toLocaleDateString();

            map[day] = (map[day] || 0) + 1;

        });

        return {

            labels: Object.keys(map),

            values: Object.values(map)

        };

    });

    /* ============================
       Priority
    ============================ */

    const priorities = $derived.by(() => {

        const map = {

            High: 0,
            Medium: 0,
            Low: 0

        };

        reports.forEach(report => {

            map[priority(report)]++;

        });

        return map;

    });

    /* ============================
       Categories
    ============================ */

    const categories = $derived.by(() => {

        const map = {};

        reports.forEach(report => {

            const cat = category(report);

            map[cat] =
                (map[cat] || 0) + 1;

        });

        return {

            labels: Object.keys(map),

            values: Object.values(map)

        };

    });

    /* ============================
       Staff Workload
    ============================ */

    const workload = $derived.by(() => {

        const map = {};

        reports.forEach(report => {

            if (!report.assignment?.assignedTo)
                return;

            if (report.status === "Resolved")
                return;

            const staff =
                report.assignment.assignedTo.name;

            map[staff] =
                (map[staff] || 0) + 1;

        });

        return {

            labels: Object.keys(map),

            values: Object.values(map)

        };

    });
</script>

<div class="charts">

    <!-- Reports Trend -->

    <ChartCard
        title="Reports Over Time"
        subtitle="Incoming reports by date"
    >

        <LineChart

            labels={trend.labels}

            values={trend.values}

        />

    </ChartCard>

    <!-- Priority -->

    <ChartCard
        title="Priority Distribution"
        subtitle="Current priority levels"
    >

        <DoughnutChart

            labels={Object.keys(priorities)}

            values={Object.values(priorities)}

            colors={[
                "#ef4444",
                "#f59e0b",
                "#22c55e"
            ]}

        />

    </ChartCard>

    <!-- Categories -->

    <ChartCard
        title="Incident Categories"
        subtitle="Distribution of incidents"
    >

        <BarChart

            labels={categories.labels}

            values={categories.values}

            label="Reports"

            color="#14b8a6"

        />

    </ChartCard>

    <!-- Staff -->

    {#if role === "Admin" || role === "Supervisor"}

        <ChartCard
            title="Staff Workload"
            subtitle="Open cases by staff"
        >

            <BarChart

                labels={workload.labels}

                values={workload.values}

                label="Cases"

                color="#2563eb"

            />

        </ChartCard>

    {/if}

</div>

<style>

.charts{

    display:grid;

    grid-template-columns:
        repeat(
            auto-fit,
            minmax(420px,1fr)
        );

    gap:1.5rem;

}

@media(max-width:900px){

    .charts{

        grid-template-columns:1fr;

    }

}

</style>