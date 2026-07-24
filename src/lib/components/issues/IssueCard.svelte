<script>
import Icon from '@iconify/svelte';
import ResolveModal from './ResolveModal.svelte';
import EscalateModal from './EscalateModal.svelte';
import ResolveEscalationModal from './ResolveEscalationModal.svelte';
let showModal = $state(false);
  let {
  r,
  staff,

  handleAssign,
  handleResolve,
  handleEscalate,
  handleResolveEscalation,
  handleEditResolution,
  handleAddNote,
  handleUpdateReport
} = $props();

const emergencyStaff = $derived(
    staff.filter(user => user.role === "Emergency")
);
  let expanded = $state(false);
  let showEscalateModal = $state(false);
  let showResolveEscalationModal = $state(false);
  let showEditResolution = $state(false);
  let showAddNote = $state(false);
  let resolutionText = $state(r.resolution?.notes ?? "");
  let noteText = $state("");
  let editField = $state("");
  let editTitle = $state("");

</script>

<div class="issue-layout">

  <!-- CASE DETAILS -->
  <div class="panel details-panel">

    <div class="panel-title">
      <Icon icon="lucide:file-text" width="18" />
      Case Details
    </div>

    <div class="detail-row">
      <span class="label">Case #</span>
      <span>{r.caseNumber}</span>
    </div>

    <div class="detail-row">
      <span class="label">Reported</span>
      <span>
        {new Date(r.timeline.receivedAt).toLocaleString()}
      </span>
    </div>

    <div class="detail-row">
      <span class="label">Reporter</span>
      <span>{r.reporter?.phone}</span>
    </div>

    {#if r.assignment?.assignedTo}
      <div class="detail-row">
        <span class="label">Assigned To</span>
        <span>{r.assignment?.assignedTo?.name}</span>
      </div>
    {/if}

   

  </div>

  <!-- MESSAGE -->
  <div class="panel message-panel">

    <div class="panel-title">
      <Icon icon="lucide:message-square" width="18" />
      Incident Report
      <span class="label">Status</span>
      <span class="status-badge {r.status.toLowerCase()}">
        {r.status}
      </span>
    </div>

    <div class="message-content">

      {#if expanded}
        {r.incident?.description}

        <button
          class="link"
          onclick={() => expanded = false}
        >
          Show Less
        </button>

      {:else}
        {r.incident?.description}

        {#if r.incident?.description.length > 250}
          <button
            class="link"
            onclick={() => expanded = true}
          >
            Read More
          </button>
        {/if}
      {/if}

{#if r.notes?.length}

<div class="notes-card">

    <p class="notes-subtitle">
        {r.notes.length} note{r.notes.length !== 1 ? 's' : ''}
    </p>

    <div class="notes-list">
        {#each r.notes as note}
            <div class="note-item">

                <div class="note-meta">
                    <strong>{note.author?.name ?? "Staff"}</strong>

                    <span>
                        {note.createdAt
                            ? new Date(note.createdAt).toLocaleString()
                            : "—"}
                    </span>
                </div>

                <div class="note-text">
                    {note.text}
                </div>

            </div>
        {/each}
    </div>

</div>

{/if}

    </div>

  </div>

  <!-- ACTIONS -->
  <div class="panel actions-panel">

    <div class="panel-title">
      <Icon icon="lucide:settings-2" width="16" />
      Actions
          <div class="action-icons">
 <button
  class="icon-btn"
  title="Add Note"
  onclick={() => {
    noteText = "";
    showAddNote = true;
  }}
>
  <Icon icon="lucide:notebook-pen" width="18" />
</button>

<!-- Edit Resolution -->

<!-- Edit Notes -->

{#if r.escalation?.resolved?.notes}

    <!-- Edit Escalation Resolution -->
    <button
        class="icon-btn"
        title="Edit Escalation Resolution"
        onclick={() => {
            editField = "escalationResolvedNotes";
            editTitle = "Edit Escalation Resolution";

            resolutionText =
                r.escalation?.resolved?.notes ?? "";

            showEditResolution = true;
        }}
    >
        <Icon icon="lucide:pencil" width="20" />
    </button>

{:else if r.status === "Escalated"}

    <!-- Edit Escalation Notes -->
    <button
        class="icon-btn"
        title="Edit Escalation Notes"
        onclick={() => {
            editField = "escalationNotes";
            editTitle = "Edit Escalation Notes";

            resolutionText =
                r.escalation?.notes ?? "";

            showEditResolution = true;
        }}
    >
        <Icon icon="lucide:pencil" width="20" />
    </button>

{:else if r.resolution?.notes}

    <!-- Edit Resolution Notes -->
    <button
        class="icon-btn"
        title="Edit Resolution Notes"
        onclick={() => {
            editField = "resolutionNotes";
            editTitle = "Edit Resolution Notes";

            resolutionText =
                r.resolution?.notes ?? "";

            showEditResolution = true;
        }}
    >
        <Icon icon="lucide:pencil" width="20" />
    </button>

{/if}
</div>
    </div>
    <span class="label">Urgency</span>
     <span class="priority-badge {r.incident.priority.toLowerCase()}">
    {r.incident.priority}
  </span>

    {#if r.status === 'Pending'}

   <div class="assign-wrapper">
  <label class="assign-label">
    Assign Case
  </label>

  <select
    class="assign-select"
    onchange={(e) =>
      handleAssign(r._id, e.target.value)}
  >
    <option value="">
      Select Staff Member
    </option>

    {#each staff as s}
      <option value={s._id}>
        {s.name} • {s.role}
      </option>
    {/each}
  </select>
</div>

    {:else if r.status === 'Assigned'}

      <button
        class="resolve-btn"
        onclick={() => showModal = true}
      >
        Resolve Case
      </button>

      <button
        class="escalate-btn"
        onclick={() => showEscalateModal = true}
      >
        Escalate
      </button>

    {:else if r.status === 'Resolved'}


    {:else if r.status === 'Escalated'}


      {#if !r.escalation?.resolved?.notes}
        <button
          class="resolve-btn"
          onclick={() =>
            showResolveEscalationModal = true}
        >
          Resolve Escalation
        </button>
      {/if}

    {/if}

  </div>

</div>
<ResolveModal
    open={showModal}
    onClose={() => showModal = false}
    onSubmit={async ({ notes, resolution }) => {
        await handleResolve(
            r._id,
            notes,
            resolution
        );

        showModal = false;
    }}
/>
<EscalateModal
	open={showEscalateModal}
	emergencyStaff={emergencyStaff}
	onClose={() => showEscalateModal = false}
	onSubmit={async ({ userId, reason, type }) => {
		await handleEscalate(
			r._id,
			userId,
			reason,
			type
		);

		showEscalateModal = false;
	}}
/>
<ResolveEscalationModal
  open={showResolveEscalationModal}
  onClose={() => showResolveEscalationModal = false}
  onSubmit={async ({ notes, resolution }) => {
    await handleResolveEscalation(
      r._id,
      notes,
      resolution
    );

    showResolveEscalationModal = false;
  }}
/>
{#if r.resolution?.notes}
  <div class="resolution-card">
    
    <div class="resolution-header">
   <div class="icon-wrapper">
    <Icon
      icon="lucide:clipboard-check"
      width="20"
      class="icon"
    />
  </div>
       <div>
    <p class="title">Resolution Notes</p>
    <p class="subtitle">
      Case handled by {r.assignment?.assignedTo?.name || 'Staff'}
    </p>
  </div>
    </div>

    <div class="resolution-body">
      {r.resolution?.notes}
    </div>


  </div>
{/if}


{#if r.escalation?.resolved?.notes}
<div class="escalation-card">

    <div class="escalation-header">
        <div>
            <p class="escalation-title">
                Escalated Case
            </p>

            <p class="escalation-subtitle">
                {r.escalation?.type}
            </p>
        </div>
    </div>

    <div class="escalation-body">
        {r.escalation?.notes}
    </div>

</div>
{/if}
{#if r.status === 'Escalated' && !r.escalation?.resolvedAt}

{/if}

{#if r.escalation?.resolved?.notes}
  <div class="escalation-resolution-card">

    <div class="header">

  <div class="icon-wrapper success">
    <Icon
      icon="lucide:shield-check"
      width="20"
      class="icon"
    />
  </div>

  <div>
    <p class="title">Escalation Resolved</p>

    <p class="subtitle">
      {r.escalation?.type?.toUpperCase()}
      •
      {r.incident?.priority} priority
    </p>
  </div>

</div>

    <div class="meta-row">
      <div>
        <span class="label">Escalated At</span>
        <span>{r.escalation?.escalatedAt ? new Date(r.escalation?.escalatedAt).toLocaleString() : '—'}</span>
      </div>

      <div>
        <span class="label">Resolved At</span>
        <span>{new Date(r.escalation?.resolvedAt).toLocaleString()}</span>
      </div>
    </div>

    <div class="meta-row">
      <div>
        <span class="label">Handled By</span>
        <span>
          {r.escalation?.resolvedBy?.name || r.assignment?.assignedTo?.name || 'Staff'}
        </span>
      </div>

      <div>
        <span class="label">Status</span>
        <span class="badge success">

  <Icon
    icon="lucide:check-circle-2"
    width="14"
  />

  Closed

</span>
      </div>
    </div>

    <div class="body">
      {r.escalation?.resolved?.notes}
    </div>

  </div>

{/if}

{#if showEditResolution}
  <div class="modal-backdrop">
    <div class="modal">

      <h3>{editTitle}</h3>

      <textarea
        bind:value={resolutionText}
        rows="6"
        placeholder="Update resolution notes..."
      ></textarea>

      <div class="modal-actions">
        <button class="btn secondary" onclick={() => showEditResolution = false}>
  Cancel
</button>

        <button
    class="btn primary"
    onclick={async () => {
        await handleEditResolution(
            r._id,
            editField,
            resolutionText
        );
        showEditResolution = false;
    }}
>
    Save
</button>
      </div>

    </div>
  </div>
{/if}

{#if showAddNote}
  <div class="modal-backdrop">
    <div class="modal">

      <h3>Add Case Note</h3>

      <textarea
        bind:value={noteText}
        rows="5"
        placeholder="Write a note..."
      ></textarea>

      <div class="modal-actions">
        <button class="btn secondary" onclick={() => showAddNote = false}>
  Cancel
</button>

        <button
	class="btn primary"
	onclick={async () => {
		await handleAddNote(r._id, noteText);

		noteText = '';
		showAddNote = false;
	}}
>
	Add Note
</button>
      </div>

    </div>
  </div>
{/if}

<style>

.resolution-card {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: fadeIn 0.3s ease;
}

.resolution-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
}

.resolution-header .icon {
  font-size: 1.4rem;
}

.resolution-header .title {
  font-weight: 600;
  color: #166534;
}

.resolution-header .subtitle {
  font-size: 0.8rem;
  color: #4b5563;
}

.resolution-body {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  color: #374151;
  line-height: 1.5;
  border: 1px solid #e5e7eb;
}

.resolution-footer {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #16a34a;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.escalation-card {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #fee2e2, #fef2f2);
  border: 1px solid #fecaca;
}

.escalation-body {
  margin-top: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
}

.case-number {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2563eb;
}

.escalation-resolution-card {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border: 1px solid #86efac;
}
.resolve-escalation {
  background: #2563eb;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.resolve-escalation:hover {
  background: #1d4ed8;
}
.escalation-resolution-card {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border: 1px solid #86efac;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: fadeIn 0.3s ease;
}

.escalation-resolution-card .header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.escalation-resolution-card .icon {
  font-size: 1.4rem;
}

.escalation-resolution-card .title {
  font-weight: 600;
  color: #065f46;
}

.escalation-resolution-card .subtitle {
  font-size: 0.8rem;
  color: #4b5563;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #374151;
}

.meta-row .label {
  display: block;
  font-size: 0.7rem;
  color: #6b7280;
}

.body {
  margin-top: 12px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  line-height: 1.5;
}

.badge.success {
  background: #16a34a;
  color: white;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
}

.assign-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}

.assign-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.assign-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  color: #1e293b;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.assign-select:hover {
  border-color: #14b8a6;
}

.assign-select:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.case-number {
  font-weight: 700;
  color: #1e293b;
}

.date {
  font-size: 0.85rem;
  color: #64748b;
}

.meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 2px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* examples */
.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.assigned {
  background: #ccfbf1;
  color: #0f766e;
}

.status-badge.resolved {
  background: #dcfce7;
  color: #166534;
}

.status-badge.escalated {
  background: #fee2e2;
  color: #b91c1c;
}

.issue-layout {
  display: grid;
  grid-template-columns: 280px 1fr 260px;
  gap: 18px;
  margin-top: 1rem;
}

.panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #12344d;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title .label {
	margin-left: auto;
	margin-right: 8px;

	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	color: #64748b;
}

.details-panel {
  background: #f8fafc;
}

.message-panel {
  min-height: 220px;
  display: flex;
  flex-direction: column;
}

.message-content {
  flex: 1;
  line-height: 1.7;
  color: #334155;
  font-size: 0.95rem;
}

.actions-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.detail-row .label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
}

.assign-select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}

.resolve-btn,
.escalate-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border: none;
  border-radius: 12px;

  padding: 10px 18px;

  font-size: 0.9rem;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;

  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Resolve */
.resolve-btn {
 background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.resolve-btn:hover {
  background: #15803d;
  color: #e9dada;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(22,163,74,0.25);
}

/* Escalate */
.escalate-btn {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}

.escalate-btn:hover {
  background: #dc2626;
  color: #f0e6e6;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(239,68,68,0.25);
}

.resolve-btn:active,
.escalate-btn:active {
  transform: translateY(0);
}

.resolve-btn:disabled,
.escalate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.resolved-state {
  background: #dcfce7;
  color: #166534;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
}

.escalated-state {
  background: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 1100px) {
  .issue-layout {
    grid-template-columns: 1fr;
  }
}

.priority-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* HIGH */
.priority-badge.high {
  background: #fee2e2;
  color: #dc2626;
}

/* MEDIUM */
.priority-badge.medium {
  background: #fef3c7;
  color: #d97706;
}

/* LOW */
.priority-badge.low {
  background: #dcfce7;
  color: #16a34a;
}

.assign-wrapper {
  width: 100%;
}

.assign-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.assign-select {
  width: 100%;
  padding: 12px 14px;

  border: 1px solid #cbd5e1;
  border-radius: 12px;

  background: white;

  font-size: 0.9rem;
  font-weight: 500;

  color: #0f172a;

  cursor: pointer;

  transition: all 0.2s ease;
}

.assign-select:hover {
  border-color: #14b8a6;
}

.assign-select:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
}

/* Default */
.tab {
	padding: 8px 14px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	transition: all 0.2s ease;
	color: white;
}

/* Pending / Received */
.tab.received,
.tab.pending {
	background: #64748b;
}

/* Assigned */
.tab.assigned {
	background: #14b8a6;
}

/* Escalated */
.tab.escalated {
	background: #ef4444;
}

/* Resolved */
.tab.resolved {
	background: #22c55e;
}

/* Active state */
.tab.active {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Hover */
.tab:hover {
	opacity: 0.9;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  color: #16a34a;
}

.escalation-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.escalation-icon {
  color: #dc2626;
}

.escalation-title {
  font-weight: 600;
  color: #991b1b;
  margin: 0;
}

.escalation-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.resolve-escalation-btn {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 12px;

  border: none;
  border-radius: 10px;

  background: #14b8a6;
  color: white;

  font-weight: 600;
  cursor: pointer;

  transition: all 0.2s ease;
}

.resolve-escalation-btn:hover {
  background: #14b8a6;
  transform: translateY(-1px);
}

.icon-wrapper.success {
  width: 40px;
  height: 40px;

  border-radius: 10px;

  background: #dcfce7;

  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.success .icon {
  color: #16a34a;
}

.badge.success {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 4px 10px;

  border-radius: 999px;

  background: #dcfce7;
  color: #166534;

  font-size: 0.75rem;
  font-weight: 600;
}

.panel-title.actions-title {
    display: flex;
    align-items: center;
    width: 100%;
}

.action-icons {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto; /* Pushes the icons to the far right */
}

.icon-btn {
    width: 28px;
    height: 28px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid #dbe4ee;
    border-radius: 10px;

    background: #fff;
    color: #475569;

    cursor: pointer;

    transition: all .2s ease;
}

.icon-btn:hover {
    background: #14b8a6;
    color: #fff;
    border-color: #14b8a6;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  width: 420px;
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.modal textarea {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.btn {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.btn.primary {
  background: #14b8a6;
  color: white;
}

.btn.secondary {
  background: #e5e7eb;
}


.notes-card {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
}

.notes-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-item {
  padding: 12px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e5e7eb;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: .8rem;
  color: #64748b;
}

.note-text {
  color: #334155;
  line-height: 1.5;
}

.notes-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}

.notes-subtitle {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #64748b;
}

</style>