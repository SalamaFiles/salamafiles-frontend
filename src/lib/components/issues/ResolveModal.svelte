<script>
  let { open, onClose, onSubmit } = $props();

  let notes = $state('');
  let resolution = $state('resolved');
  let submitting = $state(false);

  async function submit() {
    if (!notes.trim()) return;

    submitting = true;

    try {
      await onSubmit({
        notes,
        resolution
      });

      notes = '';
      resolution = 'resolved';

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      submitting = false;
    }
  }
</script>

{#if open}
  <div class="modal-backdrop">
    <div class="modal">

      <h3>Resolve Case</h3>

      <div class="field">
        <label>Resolution</label>

        <select bind:value={resolution}>
          <option value="resolved">Resolved</option>
          <option value="not_resolved">Not Resolved</option>
          <option value="false_alarm">False Alarm</option>
        </select>
      </div>

      <div class="field">
        <label>Resolution Notes</label>

        <textarea
          placeholder="Describe what was done, actions taken, recommendations..."
          bind:value={notes}
        ></textarea>
      </div>

      <div class="modal-actions">
        <button
          class="cancel"
          onclick={onClose}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          class="submit"
          onclick={submit}
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Submit'}
        </button>
      </div>

    </div>
  </div>
{/if}

<style>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,.3);
}

.field {
  margin-top: 14px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: .85rem;
  font-weight: 600;
  color: #475569;
}

select,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: .95rem;
}

select {
  height: 42px;
}

textarea {
  height: 160px;
  resize: none;
  margin-top: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.cancel {
  background: #e2e8f0;
  color: #334155;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel:hover {
  background: #cbd5e1;
}

.submit {
  background: #16a34a;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.submit:hover {
  background: #15803d;
}

.submit:disabled,
.cancel:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>