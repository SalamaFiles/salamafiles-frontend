<script>
	let { open, emergencyStaff = [], onClose, onSubmit } = $props();

	let selectedUser = $state("");
	let notes = $state("");
	let type = $state("Emergency");
	let submitting = $state(false);

	async function submit() {
		if (!selectedUser) {
			alert("Please select an Emergency Officer.");
			return;
		}

		if (!notes.trim()) {
			alert("Please provide a reason for escalation.");
			return;
		}

		submitting = true;

		try {
			await await onSubmit({
    userId: selectedUser,
    reason: notes,
    type
});

			selectedUser = "";
			notes = "";
			type = "Emergency";

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

		<h3>Escalate Case</h3>

		<div class="field">

			<label>Escalation Type</label>

			<select bind:value={type}>
				<option value="Emergency">Emergency</option>
				<option value="Supervisor">Supervisor</option>
				<option value="External">External Partner</option>
			</select>

		</div>

		<div class="field">

			<label>Assign To</label>

			<select bind:value={selectedUser}>

				<option value="">
					Select Emergency Officer
				</option>

				{#each emergencyStaff as user}

					<option value={user._id}>
						{user.name} • {user.role}
					</option>

				{/each}

			</select>

		</div>

		<div class="field">

			<label>Reason</label>

			<textarea
				bind:value={notes}
				placeholder="Explain why this case is being escalated..."
			></textarea>

		</div>

		<div class="modal-actions">

			<button class="cancel" onclick={onClose}>
				Cancel
			</button>

			<button
				class="escalate"
				onclick={submit}
				disabled={submitting}
			>
				{submitting ? "Escalating..." : "Escalate"}
			</button>

		</div>

	</div>

</div>
{/if}

<style>
.modal-backdrop{
	position:fixed;
	inset:0;
	background:rgba(0,0,0,.55);
	display:flex;
	align-items:center;
	justify-content:center;
	z-index:999;
}

.modal{
	width:500px;
	background:white;
	padding:24px;
	border-radius:16px;
	box-shadow:0 10px 40px rgba(0,0,0,.2);
}

.field{
	margin-top:18px;
	display:flex;
	flex-direction:column;
}

label{
	font-size:.85rem;
	font-weight:600;
	color:#475569;
	margin-bottom:6px;
}

select,
textarea{
	width:100%;
	padding:10px 12px;
	border:1px solid #d1d5db;
	border-radius:10px;
	font-size:.9rem;
}

textarea{
	min-height:140px;
	resize:vertical;
}

.modal-actions{
	display:flex;
	justify-content:flex-end;
	gap:10px;
	margin-top:24px;
}

.cancel{
	padding:10px 18px;
	border:none;
	border-radius:10px;
	background:#e5e7eb;
	cursor:pointer;
}

.escalate{
	padding:10px 18px;
	border:none;
	border-radius:10px;
	background:#dc2626;
	color:white;
	font-weight:600;
	cursor:pointer;
}

.escalate:disabled{
	opacity:.6;
	cursor:not-allowed;
}
</style>