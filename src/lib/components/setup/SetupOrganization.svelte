<script>
    import { createOrganization } from "$lib/api/organization";
    import { organization } from "$lib/stores/organization";
    import { appState } from "$lib/state.svelte.js";
    import { toast } from "svelte-sonner";

    let form = $state({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    let loading = $state(false);

    async function save() {
        loading = true;

        try {
            const org = await createOrganization(form);

            organization.set(org);

            appState.organization = org;

            appState.mainView = "dashboard";

            toast.success("Organization created successfully.");

        } catch (err) {

            toast.error(
                err.message || "Unable to create organization."
            );

        } finally {
            loading = false;
        }
    }
</script>

<div class="setup-page">

    <div class="setup-card">

        <h1>Welcome to SalamaFiles</h1>

        <p>
            Before using the platform, let's set up your
            organization.
        </p>

        <label>Organization Name</label>
        <input bind:value={form.name} />

        <label>Email</label>
        <input bind:value={form.email} />

        <label>Phone</label>
        <input bind:value={form.phone} />

        <label>Address</label>
        <textarea bind:value={form.address}></textarea>

        <button
            onclick={save}
            disabled={loading}
        >
            {loading ? "Saving..." : "Complete Setup"}
        </button>

    </div>

</div>