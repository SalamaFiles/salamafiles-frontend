<script>
  let { open, onClose, onSubmit } = $props();

  let notes = $state('');
  let resolution = $state('resolved'); 
  let submitting = $state(false);
  let error = $state('');

  async function submit() {
    if (!notes.trim()) {
      error = 'Please enter resolution notes';
      return;
    }

    submitting = true;
    error = '';

    try {
      console.log('Submitting...', { notes, resolution });

      await onSubmit({ notes, resolution });

      //only reset AFTER success
      notes = '';
      resolution = 'resolved';

      onClose();
    } catch (err) {
      console.error(err);
      error = err.message || 'Failed to close case';
    } finally {
      submitting = false;
    }
  }
</script>

{#if open}
  <div class="modal-backdrop">
    <div class="modal">

      <h3>✅ Close Case</h3>

      <!-- Resolution Type -->
      <div class="field">
        <label>Resolution</label>
        <select bind:value={resolution} disabled={submitting}>
          <option value="resolved">Resolved</option>
          <option value="not_resolved">Not Resolved</option>
          <option value="false_alarm">False Alarm</option>
        </select>
      </div>

      <!-- Notes -->
      <div class="field">
        <label>Resolution Notes</label>
        <textarea
          placeholder="Describe how the case was handled and resolved..."
          bind:value={notes}
          disabled={submitting}
        ></textarea>
      </div>

      <!-- Error -->
      {#if error}
        <div class="error">{error}</div>
      {/if}

      <!-- Actions -->
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
          {submitting ? 'Closing...' : 'Close Case'}
        </button>
      </div>

    </div>
  </div>
{/if}

<style>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 480px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  animation: fadeIn 0.2s ease-out;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
}

/* Fields */
.field {
  margin-top: 14px;
}

label {
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
}

select,
textarea {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
  transition: border 0.15s ease, box-shadow 0.15s ease;
}

select:focus,
textarea:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.15);
}

textarea {
  height: 140px;
  resize: vertical;
}

/* Error */
.error {
  margin-top: 10px;
  color: #dc2626;
  font-size: 0.85rem;
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

button {
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

/* Cancel */
.cancel {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 14px;
  border-radius: 8px;
}

.cancel:hover {
  background: #e5e7eb;
}

/* Submit */
.submit {
  background: #16a34a;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
}

.submit:hover {
  background: #15803d;
}

.submit:disabled,
.cancel:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>