<script>
    import { auth } from '$lib/stores/auth.js';

    let {
    reports = [],
    role = "User",
    user = null
} = $props();

    

    /* ----------------------------------
       Dashboard Stats
    ----------------------------------- */

    const pending = $derived(
        reports.filter(r => r.status === "Pending").length
    );

    const assigned = $derived(
        reports.filter(r => r.status === "Assigned").length
    );

    const resolved = $derived(
        reports.filter(r => r.status === "Resolved").length
    );

    const highPriority = $derived(
        reports.filter(
            r => (r.incident?.priority ?? r.urgency) === "High"
        ).length
    );

    /* ----------------------------------
       Banner Content
    ----------------------------------- */

    let greeting = "";
    let title = "";
    let subtitle = "";
    let highlight = "";

    $effect(() => {

        const hour = new Date().getHours();

        if (hour < 12)
            greeting = "Good Morning";
        else if (hour < 17)
            greeting = "Good Afternoon";
        else
            greeting = "Good Evening";

        switch (role) {

            case "PlatformAdmin":

                title = "Platform Administrator";

                subtitle =
                    "Monitor organizations, users and platform activity.";

                highlight =
                    `${reports.length} Reports`;

                break;

            case "Admin":

                title = "Organization Administrator";

                subtitle =
                    user?.organization?.name
                        ? `Managing ${user.organization.name}`
                        : "Manage your organization's reports.";

                highlight =
                    `${pending} Pending`;

                break;

            case "Supervisor":

                title = "Operations Supervisor";

                subtitle =
                    "Review reports and coordinate assignments.";

                highlight =
                    `${pending} Pending`;

                break;

            case "Counselor":

                title = "Counselor";

                subtitle =
                    "Support survivors and manage assigned cases.";

                highlight =
                    `${assigned} Active Cases`;

                break;

            case "Emergency":

                title = "Emergency Response";

                subtitle =
                    "Respond to critical incidents.";

                highlight =
                    `${highPriority} Critical`;

                break;

            default:

                title = "Dashboard";

                subtitle =
                    "Welcome back to SalamaFiles.";

                highlight =
                    `${reports.length} Reports`;

        }

    });

</script>

<section class="welcome">

    <div class="left">

        <div class="greeting">
            {greeting}
        </div>

        <h1>
            {$auth.user?.name ?? "User"}
        </h1>

        <div class="title">
            {title}
        </div>

        {#if role === "Admin" && user?.organization}

            <div class="organization">
                {user.organization.name}
            </div>

        {/if}

        <p>
            {subtitle}
        </p>

    </div>

    <div class="right">

        <div class="focus">

            <span>OVERVIEW</span>

            <strong>{highlight}</strong>

        </div>

    </div>

</section>

<style>

.welcome{

    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:1.5rem;

    padding:1rem 1.5rem;
    margin-bottom:1.5rem;

    background:#f8fafc;

    border:1px solid #e2e8f0;
    border-radius:14px;

}

.left{

    display:flex;
    flex-direction:column;
    gap:.25rem;

}

.greeting{

    font-size:.72rem;
    font-weight:600;

    color:#64748b;

    text-transform:uppercase;
    letter-spacing:.08em;

}

h1{

    margin:0;

    font-size:1.45rem;
    font-weight:700;

    color:#0f172a;

}

.title{

    font-size:.95rem;
    font-weight:600;

    color:#0f766e;

}

.organization{

    font-size:.82rem;
    font-weight:500;

    color:#475569;

}

p{

    margin:0;

    font-size:.88rem;

    color:#64748b;

}

.right{

    display:flex;
    align-items:center;

}

.focus{

    background:#ffffff;

    border:1px solid #e2e8f0;

    border-radius:10px;

    padding:.8rem 1rem;

    min-width:150px;

    text-align:center;

}

.focus span{

    display:block;

    font-size:.68rem;

    color:#94a3b8;

    text-transform:uppercase;

    letter-spacing:.08em;

    margin-bottom:.25rem;

}

.focus strong{

    font-size:1rem;

    font-weight:700;

    color:#0f172a;

}

@media(max-width:900px){

    .welcome{

        flex-direction:column;
        align-items:flex-start;

    }

    .right{

        width:100%;

    }

    .focus{

        width:100%;

    }

}

</style>