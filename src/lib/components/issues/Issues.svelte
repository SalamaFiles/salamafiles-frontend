<script>
  import { appState } from '$lib/state.svelte.js';
  import IssueCard from './IssueCard.svelte';
  import CreateCaseModal from './CreateCaseModal.svelte';

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
    handleUpdateReport,
    handleCreateCase,
    handleUploadEvidence
  } = $props();

  let filteredReports = $state([]);
  let showCreateCase = $state(false);
  let creatingCase = $state(false);

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

 {#if appState.subTab === 'received'}
    <button
      class="add-case-btn"
      onclick={() => showCreateCase = true}
    >
      <span aria-hidden="true">+</span>
      Add New Case
    </button>
  {/if}

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
        {handleUploadEvidence}
      />

    {/each}

  </div>

{/if}

{#if showCreateCase}
  <CreateCaseModal
    saving={creatingCase}
    onClose={() => {
      if (!creatingCase) showCreateCase = false;
    }}
    onSubmit={async (payload) => {
      creatingCase = true;

      try {
        return await handleCreateCase(payload);
      } finally {
        creatingCase = false;
      }
    }}
  />
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

.issues-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.issues-heading .section-title {
  margin-bottom: 0;
}

.add-case-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border: 1px solid #0f766e;
  border-radius: 8px;
  background: #0f766e;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.add-case-btn:hover {
  background: #115e59;
}

@media (max-width: 560px) {
  .issues-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

</style>