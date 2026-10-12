<script>
	import { auth } from '$lib/stores/auth.js';
	import { appState } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';

	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import Issues from '$lib/components/issues/Issues.svelte';
	import Users from '$lib/components/users/Users.svelte';
	import Analytics from '$lib/components/analytics/Analytics.svelte';
	import Profile from '$lib/components/profile/Profile.svelte';
	import OrganizationManagement from '$lib/components/organization/OrganizationManagement.svelte';
	import { toast } from 'svelte-sonner';

	import {
		createReport,
		fetchReports,
		assignReport,
		resolveReport,
		escalateReport,
		resolveEscalation,
		addNote,
        updateReport,
		uploadReportAttachment
	} from '$lib/api/reports.js';

	import { fetchUsers } from '$lib/api/user.js';

import { enrollOrganization } from '$lib/api/onboarding.js';

	async function handleEnroll(data) {
		try {
			const result = await enrollOrganization(data);

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	}

	let view = $derived(appState.mainView);

	let reports = $state([]);
	let users = $state([]);
	let loading = $state(true);

	let total = $state(0);
	let high = $state(0);
	let resolved = $state(0);
	let escalated = $state(0);
	let escalationResolved = $state(0);

	const normalize = (s) => s?.toLowerCase();

	// ---------------- LOAD REPORTS ----------------

	async function loadReports() {
	try {
		loading = true;

		const data = await fetchReports();

		console.log("Reports loaded:", reports.length);

console.table(
    reports.map(r => ({
        case: r.caseNumber,
        status: r.status,
        subStatus: r.escalation?.resolvedAt ? "Escalation Resolved" : "",
        resolvedAt: r.escalation?.resolvedAt
    }))
);

		reports = data.data;

		total = data.pagination.total;

		high = reports.filter(
			(r) => normalize(r.urgency) === 'high'
		).length;

		resolved = reports.filter(
			(r) => normalize(r.status) === 'resolved'
		).length;

		escalated = reports.filter(
			(r) => normalize(r.status) === 'escalated'
		).length;

		// Escalations that have been resolved
		escalationResolved = reports.filter(
			(r) =>
				r.escalation?.resolutionNotes?.trim() ||
				r.escalation?.resolved?.notes?.trim()
		).length;

	} catch (err) {

		console.error(
			'Failed to load reports:',
			err.message
		);

	} finally {

		loading = false;

	}
}
	// ---------------- LOAD STAFF ----------------

	async function loadUsers() {
    try {
        users = await fetchUsers();
    } catch (err) {
        console.error(err);
    }
}

	// ---------------- REPORT ACTIONS ----------------

	async function handleAssign(id, staffId) {
		if (!staffId) return;

		try {
			await assignReport(id, staffId);
			await loadReports();
		} catch (err) {
			console.error(err);
		}
	}

	async function handleResolve(id, notes, resolution) {

    try {

        await resolveReport(
            id,
            notes,
            resolution
        );

        await loadReports();

    } catch (err) {

        console.error(err);

    }

}

	async function handleEscalate(reportId, userId, reason, type) {
	try {
		await escalateReport(
			reportId,
			userId,
			reason,
			type
		);

		await loadReports();
	} catch (err) {
		console.error(err);
	}
}

	async function handleResolveEscalation(id, notes, resolution) {
		try {
			await resolveEscalation(
    id,
    notes,
    resolution
);

			await loadReports();
		} catch (err) {
			console.error(err);
		}
	}

// ---------------- HANDLE NOTES/ UPDATE RESOLUTIONS ----------------

	async function handleAddNote(id, note) {

    const loading = toast.loading('Saving note...');

    try {

        await addNote(id, note);

        await loadReports();

        toast.dismiss(loading);

        toast.success('Note added successfully.');

    } catch (err) {

        toast.dismiss(loading);

        toast.error('Failed to add note.');

    }
}

async function handleEditResolution(id, field, value) {

    const loading = toast.loading('Updating...');

    try {

        await updateReport(id, {
            [field]: value
        });

        await loadReports();

        toast.dismiss(loading);

        toast.success('Updated successfully.');

    } catch (err) {

        toast.dismiss(loading);

        toast.error('Unable to update.');

        console.error(err);

    }

}

async function handleUpdateReport(id, payload) {
    try {
        await updateReport(id, payload);
        await loadReports();
    } catch (err) {
        console.error(err);
    }
}


async function handleUploadEvidence(reportId, file) {
    const toastId = toast.loading('Uploading evidence...');

    try {
        await uploadReportAttachment(reportId, file);

        await loadReports();

        toast.dismiss(toastId);
        toast.success('Evidence uploaded successfully.');

        return true;
    } catch (err) {
        toast.dismiss(toastId);

        toast.error(
            err?.message || 'Failed to upload evidence.'
        );

        console.error('Evidence upload failed:', err);

        return false;
    }
}

	// ---------------- INIT ----------------

	onMount(async () => {
		const restored = auth.restore();

		if (!restored) {
			console.warn(
				'No authenticated session found'
			);
			return;
		}

		await loadReports();
		await loadUsers();
	});

	
async function handleCreateCase(payload) {
  const toastId = toast.loading('Creating case...');

  try {
    await createReport(payload);

    // Show the Received Reports tab.
    appState.mainView = 'issues';
    appState.subTab = 'received';

    // Refresh the list so the new Pending case appears.
    await loadReports();

    toast.dismiss(toastId);
    toast.success('Case created successfully.');

    return true;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err?.message || 'Failed to create case.');

    console.error('Failed to create manual case:', err);

    return false;
  }
}

</script>



<!-- ---------------- VIEW RENDERING ---------------- -->

{#if view === 'dashboard'}
  <Dashboard
    {total}
    {high}
    {resolved}
    {escalated}
    {loading}
    escalationResolved={escalationResolved}
    {reports}

  />

{:else if view === 'issues'}
  <Issues
    {reports}
    staff={users}
    {loading}
    {handleAssign}
    {handleResolve}
    {handleEscalate}
    {handleResolveEscalation}
	{handleAddNote}
	{handleEditResolution}
    {handleUpdateReport}
	{handleCreateCase}
	{handleUploadEvidence}
  />
{:else if view === 'organizations'}

	<OrganizationManagement />
{:else if view === 'users'}

<Users />

  {:else if view === 'analytics'}
  <Analytics
    {reports}
    staff={users}
/>

 {:else if view === 'profile'}
    <Profile />
{/if}
