<script>
    let { reports = [] } = $props();

    const pending = $derived(
        reports.filter(r => r.status === "Pending").length
    );

    const assigned = $derived(
        reports.filter(r => r.status === "Assigned").length
    );

    const escalated = $derived(
        reports.filter(r => r.status === "Escalated").length
    );

    const resolved = $derived(
        reports.filter(r => r.status === "Resolved").length
    );
</script>

<section class="summary">

    <div class="item">
        <span>Pending</span>
        <strong>{pending}</strong>
    </div>

    <div class="item">
        <span>Assigned</span>
        <strong>{assigned}</strong>
    </div>

    <div class="item">
        <span>Escalated</span>
        <strong>{escalated}</strong>
    </div>

    <div class="item">
        <span>Resolved</span>
        <strong>{resolved}</strong>
    </div>

</section>

<style>

.summary{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:1rem;

    margin-top:2rem;

}

.item{

    background:white;

    border-radius:14px;

    padding:1.25rem;

    border:1px solid #e2e8f0;

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.item span{

    color:#64748b;

}

.item strong{

    font-size:1.5rem;

    color:#0f172a;

}

@media(max-width:900px){

.summary{

grid-template-columns:repeat(2,1fr);

}

}

@media(max-width:600px){

.summary{

grid-template-columns:1fr;

}

}

</style>