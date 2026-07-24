<script>
    import { auth } from '$lib/stores/auth.js';

    let {
        reports = [],
        total = 0,
        high = 0,
        resolved = 0,
        escalated = 0,
        loading = false
    } = $props();

    const user = $derived($auth.user);

    const role = $derived(
        user?.role ?? "User"
    );

    /* -----------------------------
       Counts
    ----------------------------- */

    const pending = $derived(
        reports.filter(r => r.status === "Pending").length
    );

    const assigned = $derived(
        reports.filter(r => r.status === "Assigned").length
    );

    const underReview = $derived(
        reports.filter(r => r.status === "Under Review").length
    );

    const archived = $derived(
        reports.filter(r => r.status === "Archived").length
    );

    const myCases = $derived(
        reports.filter(
            r => r.assignment?.assignedTo?._id === user?._id
        ).length
    );

    const myResolved = $derived(
        reports.filter(
            r =>
                r.assignment?.assignedTo?._id === user?._id &&
                r.status === "Resolved"
        ).length
    );

    const criticalCases = $derived(
        reports.filter(
            r =>
                (r.incident?.priority ?? r.urgency) === "High"
        ).length
    );

    /* -----------------------------
       Cards
    ----------------------------- */

    const cards = $derived.by(() => {

        switch (role) {

            case "Admin":

                return [

                    {
                        label: "Total Reports",
                        value: total,
                        icon: "📄",
                        color: "primary"
                    },

                    {
                        label: "High Priority",
                        value: high,
                        icon: "🚨",
                        color: "danger"
                    },

                    {
                        label: "Resolved",
                        value: resolved,
                        icon: "✅",
                        color: "success"
                    },

                    {
                        label: "Escalated",
                        value: escalated,
                        icon: "⚠️",
                        color: "warning"
                    }

                ];

            case "Supervisor":

                return [

                    {
                        label: "Pending Review",
                        value: pending,
                        icon: "📥",
                        color: "primary"
                    },

                    {
                        label: "Assigned",
                        value: assigned,
                        icon: "👤",
                        color: "success"
                    },

                    {
                        label: "Under Review",
                        value: underReview,
                        icon: "📝",
                        color: "warning"
                    },

                    {
                        label: "Escalated",
                        value: escalated,
                        icon: "🚨",
                        color: "danger"
                    }

                ];

            case "Counselor":

                return [

                    {
                        label: "My Cases",
                        value: myCases,
                        icon: "👥",
                        color: "primary"
                    },

                    {
                        label: "Open Cases",
                        value: myCases - myResolved,
                        icon: "📂",
                        color: "warning"
                    },

                    {
                        label: "Resolved",
                        value: myResolved,
                        icon: "✅",
                        color: "success"
                    },

                    {
                        label: "High Priority",
                        value: criticalCases,
                        icon: "🚨",
                        color: "danger"
                    }

                ];

            case "Emergency":

                return [

                    {
                        label: "Critical Alerts",
                        value: criticalCases,
                        icon: "🚨",
                        color: "danger"
                    },

                    {
                        label: "Escalated",
                        value: escalated,
                        icon: "⚠️",
                        color: "warning"
                    },

                    {
                        label: "Pending",
                        value: pending,
                        icon: "📥",
                        color: "primary"
                    },

                    {
                        label: "Resolved",
                        value: resolved,
                        icon: "✅",
                        color: "success"
                    }

                ];

            case "OrganizationAdmin":

                return [

                    {
                        label: "Reports",
                        value: total,
                        icon: "📄",
                        color: "primary"
                    },

                    {
                        label: "Pending",
                        value: pending,
                        icon: "📥",
                        color: "warning"
                    },

                    {
                        label: "Resolved",
                        value: resolved,
                        icon: "✅",
                        color: "success"
                    },

                    {
                        label: "Archived",
                        value: archived,
                        icon: "📦",
                        color: "primary"
                    }

                ];

            default:

                return [

                    {
                        label: "Reports",
                        value: total,
                        icon: "📄",
                        color: "primary"
                    }

                ];

        }

    });
</script>

<div class="cards">

    {#each cards as card}

        <div class="card {card.color}">

            <div class="top">

                <div class="icon">
                    {card.icon}
                </div>

                <div class="label">
                    {card.label}
                </div>

            </div>

            <div class="value">
                {loading ? "..." : card.value}
            </div>

        </div>

    {/each}

</div>

<style>

.cards{

    display:grid;

    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));

    gap:1.5rem;

    margin-bottom:2rem;

}

.card{

    background:white;

    border-radius:18px;

    padding:1.5rem;

    border:1px solid #e2e8f0;

    border-left:6px solid #cbd5e1;

    box-shadow:0 8px 20px rgba(15,23,42,.06);

    transition:.25s;

}

.card:hover{

    transform:translateY(-4px);

    box-shadow:0 14px 30px rgba(15,23,42,.12);

}

.top{

    display:flex;

    align-items:center;

    gap:1rem;

    margin-bottom:1rem;

}

.icon{

    width:50px;

    height:50px;

    border-radius:14px;

    display:flex;

    justify-content:center;

    align-items:center;

    font-size:1.5rem;

    background:#f8fafc;

}

.label{

    font-size:.9rem;

    font-weight:600;

    color:#64748b;

}

.value{

    font-size:2.3rem;

    font-weight:700;

    color:#0f172a;

}

/* COLORS */

.primary{

    border-left-color:#2563eb;

}

.primary .icon{

    background:#dbeafe;

}

.success{

    border-left-color:#16a34a;

}

.success .icon{

    background:#dcfce7;

}

.warning{

    border-left-color:#d97706;

}

.warning .icon{

    background:#fef3c7;

}

.danger{

    border-left-color:#dc2626;

}

.danger .icon{

    background:#fee2e2;

}

@media(max-width:700px){

    .cards{

        grid-template-columns:1fr;

    }

}

</style>