<script>
  import { appState } from '$lib/state.svelte.js';
  import IssueCard from './IssueCard.svelte';

  let {
    reports,
    staff,
    loading,
    handleAssign,
    handleResolve,
    handleEscalate,
    handleResolveEscalation,
    handleAddNote,
    handleEditResolution,
    handleUpdateReport
  } = $props();

  let filteredReports = $state([]);

  const normalize = (s) => s?.toLowerCase();

  // ---------------- FILTER REPORTS ----------------

  $effect(() => {

    if (!reports || reports.length === 0) {
      filteredReports = [];
      return;
    }

    switch (appState.subTab) {

      case "received":
        filteredReports = reports.filter(
          r => normalize(r.status) === "pending"
        );
        break;

      case "assigned":
        filteredReports = reports.filter(
          r => normalize(r.status) === "assigned"
        );
        break;

      case "resolved":

        // MVP:
        // Show ALL resolved reports regardless of who resolved them.
        filteredReports = reports.filter(
          r => normalize(r.status) === "resolved"
        );
        break;

      case "escalated":
        filteredReports = reports.filter(
          r => normalize(r.status) === "escalated"
        );
        break;

      default:
        filteredReports = [];
    }

  });

  // ---------------- DEBUG ----------------

  $effect(() => {

    console.log("========== ISSUES ==========");
    console.log("Current Tab:", appState.subTab);

    console.table(
      reports.map(r => ({
        caseNumber: r.caseNumber,
        status: r.status,
        escalationResolvedAt: r.escalation?.resolvedAt,
        escalationResolvedBy: r.escalation?.resolvedBy,
        resolutionNotes: r.resolution?.notes
      }))
    );

    console.table(
      filteredReports.map(r => ({
        caseNumber: r.caseNumber,
        status: r.status
      }))
    );

  });

</script>

<!-- Dynamic Title -->

<h2 class="section-title">

  {#if appState.subTab === 'received'}
    Received Reports

  {:else if appState.subTab === 'assigned'}
    Assigned Reports

  {:else if appState.subTab === 'resolved'}
    Resolved Reports

  {:else if appState.subTab === 'escalated'}
    Escalated Cases

  {/if}

</h2>

<!-- Content -->

{#if loading}

  <p class="empty-state">
    Loading reports...
  </p>

{:else if filteredReports.length === 0}

  <p class="empty-state">
    No reports in this category
  </p>

{:else}

  <div class="issues-list">

    {#each filteredReports as r (r._id)}

      <IssueCard
        {r}
        {staff}
        {handleAssign}
        {handleResolve}
        {handleEscalate}
        {handleResolveEscalation}
        {handleAddNote}
        {handleEditResolution}
        {handleUpdateReport}
      />

    {/each}

  </div>

{/if}

<style>

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  color: #94a3b8;
  font-style: italic;
}

</style>