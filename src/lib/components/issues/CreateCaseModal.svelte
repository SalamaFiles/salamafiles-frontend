
<script>
  let {
    onClose,
    onSubmit,
    saving = false
  } = $props();

  let source = $state("Phone");
  let description = $state("");
  let occurredAt = $state("");
  let priority = $state("Medium");
  let anonymous = $state(true);
  let reporterName = $state("");
  let phone = $state("");
  let email = $state("");
  let country = $state("");
  let county = $state("");
  let subCounty = $state("");
  let ward = $state("");
  let village = $state("");
  let errorMessage = $state("");

  async function handleSubmit(event) {
    event.preventDefault();
    errorMessage = "";

    if (description.trim().length < 5) {
      errorMessage = "Please enter an incident description of at least 5 characters.";
      return;
    }

    const location = Object.fromEntries(
      Object.entries({
        country,
        county,
        subCounty,
        ward,
        village
      }).filter(([, value]) => value.trim())
    );

    const payload = {
      channel: source,
      description: description.trim(),
      priority,
      anonymous,
      ...(occurredAt
        ? { occurredAt: new Date(`${occurredAt}T12:00:00`).toISOString() }
        : {}),
      ...(anonymous
        ? {}
        : {
            ...(reporterName.trim()
              ? { reporterName: reporterName.trim() }
              : {}),
            ...(phone.trim() ? { phone: phone.trim() } : {}),
            ...(email.trim() ? { email: email.trim() } : {})
          }),
      ...(Object.keys(location).length ? { location } : {})
    };

    try {
      const result = await onSubmit(payload);

      if (result !== false) {
        onClose();
      }
    } catch (error) {
      errorMessage = error?.message || "Unable to create the case.";
    }
  }
</script>

<div class="modal-backdrop" role="presentation">
  <section
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="create-case-title"
  >
    <header class="modal-header">
      <div>
        <h2 id="create-case-title">Add New Case</h2>
        <p>
          Record a concern received by phone, in person, or from an existing case.
        </p>
      </div>

      <button
        type="button"
        class="close-btn"
        aria-label="Close"
        onclick={onClose}
        disabled={saving}
      >
        &times;
      </button>
    </header>

    <form onsubmit={handleSubmit}>
      <div class="form-grid">
        <div class="field">
          <label for="case-source">Reporting source *</label>
          <select id="case-source" bind:value={source} required>
            <option value="Phone">Phone call</option>
            <option value="In Person">In person</option>
            <option value="Existing Case">Existing / historical case</option>
            <option value="Email">Email</option>
            <option value="Web">Other web report</option>
          </select>
        </div>

        <div class="field">
          <label for="case-priority">Initial priority *</label>
          <select id="case-priority" bind:value={priority} required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div class="field">
          <label for="occurred-at">Incident date</label>
          <input
            id="occurred-at"
            type="date"
            bind:value={occurredAt}
          />
          <small>Leave blank if the date is unknown.</small>
        </div>
      </div>

      <div class="field">
        <label for="case-description">Incident narrative *</label>
        <textarea
          id="case-description"
          bind:value={description}
          rows="6"
          minlength="5"
          maxlength="5000"
          required
          placeholder="Record the information shared and relevant details needed for follow-up."
        ></textarea>
        <small>{description.length}/5000 characters</small>
      </div>

      <div class="field checkbox-field">
        <input
          id="case-anonymous"
          type="checkbox"
          bind:checked={anonymous}
        />
        <label for="case-anonymous">Keep reporter details anonymous</label>
      </div>

      {#if !anonymous}
        <div class="form-grid">
          <div class="field">
            <label for="reporter-name">Reporter name</label>
            <input
              id="reporter-name"
              bind:value={reporterName}
              maxlength="100"
            />
          </div>

          <div class="field">
            <label for="reporter-phone">Phone number</label>
            <input
              id="reporter-phone"
              type="tel"
              bind:value={phone}
              maxlength="30"
            />
          </div>

          <div class="field full-width">
            <label for="reporter-email">Email address</label>
            <input
              id="reporter-email"
              type="email"
              bind:value={email}
            />
          </div>
        </div>
      {/if}

      <h3>Location (optional)</h3>

      <div class="form-grid">
        <div class="field">
          <label for="country">Country</label>
          <input id="country" bind:value={country} />
        </div>

        <div class="field">
          <label for="county">County / region</label>
          <input id="county" bind:value={county} />
        </div>

        <div class="field">
          <label for="subcounty">Sub-county / district</label>
          <input id="subcounty" bind:value={subCounty} />
        </div>

        <div class="field">
          <label for="ward">Ward</label>
          <input id="ward" bind:value={ward} />
        </div>

        <div class="field full-width">
          <label for="village">Village / locality</label>
          <input id="village" bind:value={village} />
        </div>
      </div>

      {#if errorMessage}
        <p class="error-message" role="alert">{errorMessage}</p>
      {/if}

      <footer class="modal-actions">
        <button
          type="button"
          class="btn-secondary"
          onclick={onClose}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          class="btn-primary"
          disabled={saving}
        >
          {saving ? "Creating case..." : "Create Case"}
        </button>
      </footer>
    </form>
  </section>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgb(15 23 42 / 55%);
    overflow-y: auto;
  }

  .modal {
    width: min(100%, 720px);
    max-height: 92vh;
    overflow-y: auto;
    background: white;
    color: #1e293b;
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 20px 60px rgb(0 0 0 / 20%);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  h2, h3 {
    margin: 0 0 0.5rem;
  }

  h2 {
    font-size: 1.35rem;
  }

  h3 {
    margin-top: 1.5rem;
    font-size: 1rem;
  }

  .modal-header p, small {
    color: #64748b;
    font-size: 0.85rem;
  }

  .close-btn {
    align-self: flex-start;
    border: 0;
    background: transparent;
    font-size: 1.7rem;
    cursor: pointer;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .field label {
    font-size: 0.88rem;
    font-weight: 600;
  }

  input, select, textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 0.7rem 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font: inherit;
    color: #1e293b;
    background: white;
  }

  textarea {
    resize: vertical;
  }

  input:focus, select:focus, textarea:focus {
    outline: 2px solid #99f6e4;
    border-color: #0d9488;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .checkbox-field {
    flex-direction: row;
    align-items: center;
    gap: 0.6rem;
  }

  .checkbox-field input {
    width: auto;
  }

  .checkbox-field label {
    font-weight: 500;
  }

  .error-message {
    color: #b91c1c;
    font-size: 0.9rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-primary, .btn-secondary {
    border-radius: 8px;
    padding: 0.7rem 1rem;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-primary {
    color: white;
    background: #0f766e;
    border: 1px solid #0f766e;
  }

  .btn-secondary {
    color: #334155;
    background: white;
    border: 1px solid #cbd5e1;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 560px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .full-width {
      grid-column: auto;
    }

    .modal {
      padding: 1rem;
    }
  }
</style>
