<script>
    import { appState } from "$lib/state.svelte.js";

    let {
        reports = [],
        loading = false
    } = $props();

    function openIssues() {
        appState.mainView = "issues";
    }

    function activityDate(report) {
        return report.timeline?.receivedAt ?? report.createdAt;
    }

    const recent = $derived(
        [...reports]
            .sort(
                (a, b) =>
                    new Date(activityDate(b)) -
                    new Date(activityDate(a))
            )
            .slice(0, 8)
    );

    function statusClass(status) {
        switch (status) {
            case "Resolved":
                return "resolved";
            case "Assigned":
                return "assigned";
            case "Escalated":
                return "escalated";
            default:
                return "pending";
        }
    }

    function priorityClass(priority) {
        switch (priority) {
            case "High":
                return "high";
            case "Medium":
                return "medium";
            default:
                return "low";
        }
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }
</script>

<section class="activity-card">

    <div class="activity-header">

        <div>
            <h2>Recent Activity</h2>
            <p>Latest case updates across SalamaFiles</p>
        </div>

        <button onclick={openIssues}>
            View All
        </button>

    </div>

    {#if loading}

        <div class="empty">
            Loading activity...
        </div>

    {:else if recent.length === 0}

        <div class="empty">
            No recent activity.
        </div>

    {:else}

        <div class="table-wrapper">

            <table>

                <thead>

                    <tr>
                        <th></th>
                        <th>Case</th>
                        <th>Category</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>

                    {#each recent as report}

                        <tr onclick={openIssues}>

                            <td>

                                <span
                                    class="priority {priorityClass(report.incident?.priority)}">
                                </span>

                            </td>

                            <td class="case-number">

                                {report.caseNumber}

                            </td>

                            <td>

                                {report.incident?.category ?? "General"}

                            </td>

                            <td>

                                {report.assignment?.assignedTo?.name ?? "Unassigned"}

                            </td>

                            <td>

                                <span class="status {statusClass(report.status)}">

                                    {report.status}

                                </span>

                            </td>

                            <td class="date">

                                {formatDate(activityDate(report))}

                            </td>

                        </tr>

                    {/each}

                </tbody>

            </table>

        </div>

    {/if}

</section>

<style>

.activity-card{
    background:#fff;
    border:1px solid #e2e8f0;
    border-radius:18px;
    box-shadow:0 6px 18px rgba(15,23,42,.05);
    overflow:hidden;
}

.activity-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:1.5rem;
    border-bottom:1px solid #e2e8f0;
}

.activity-header h2{
    margin:0;
    font-size:1.2rem;
    font-weight:700;
    color:#0f172a;
}

.activity-header p{
    margin:.3rem 0 0;
    color:#64748b;
    font-size:.9rem;
}

.activity-header button{
    border:none;
    background:#14b8a6;
    color:#fff;
    padding:.65rem 1rem;
    border-radius:10px;
    cursor:pointer;
    font-weight:600;
}

.activity-header button:hover{
    background:#0f766e;
}

.table-wrapper{
    overflow-x:auto;
}

table{
    width:100%;
    border-collapse:collapse;
}

thead{
    background:#f8fafc;
}

thead th{
    padding:14px 18px;
    text-align:left;
    font-size:.82rem;
    font-weight:600;
    color:#64748b;
    text-transform:uppercase;
    letter-spacing:.04em;
}

tbody td{
    padding:16px 18px;
    border-top:1px solid #f1f5f9;
    font-size:.95rem;
    color:#334155;
}

tbody tr{
    cursor:pointer;
    transition:.2s;
}

tbody tr:hover{
    background:#f8fafc;
}

.case-number{
    font-weight:700;
    color:#0f172a;
}

.date{
    color:#64748b;
    white-space:nowrap;
}

.priority{
    display:inline-block;
    width:10px;
    height:10px;
    border-radius:50%;
}

.priority.high{
    background:#ef4444;
}

.priority.medium{
    background:#f59e0b;
}

.priority.low{
    background:#22c55e;
}

.status{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:.35rem .8rem;
    border-radius:999px;
    font-size:.78rem;
    font-weight:600;
}

.pending{
    background:#eef2ff;
    color:#475569;
}

.assigned{
    background:#dbeafe;
    color:#2563eb;
}

.resolved{
    background:#dcfce7;
    color:#15803d;
}

.escalated{
    background:#fee2e2;
    color:#dc2626;
}

.empty{
    padding:3rem;
    text-align:center;
    color:#94a3b8;
}

@media(max-width:900px){

thead{
    display:none;
}

table,
tbody,
tr,
td{
    display:block;
    width:100%;
}

tbody tr{
    padding:1rem;
}

tbody td{
    border:none;
    padding:.35rem 0;
}

tbody td::before{
    content:attr(data-label);
    font-weight:600;
    color:#64748b;
    display:block;
    margin-bottom:2px;
}

}

</style>