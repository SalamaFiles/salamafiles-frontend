<script>
	let { form } = $props();

	const formats = [
		'{PREFIX}-{YEAR}-{NUMBER}',
		'{YEAR}-{NUMBER}',
		'{PREFIX}-{NUMBER}',
		'{NUMBER}'
	];
</script>

<div class="step">

	<h2>Case Settings</h2>

	<p>
		Configure how case numbers are generated within your
		organization.
	</p>

	<div class="grid">

		<div class="field">

			<label>Case Prefix</label>

			<input
				bind:value={form.caseSettings.prefix}
				maxlength="6"
				placeholder="SV"
			/>

			<small>
				Example: SV, GBV, PIN
			</small>

		</div>

		<div class="field">

			<label>Case Number Format</label>

			<select bind:value={form.caseSettings.format}>

				{#each formats as format}

					<option value={format}>
						{format}
					</option>

				{/each}

			</select>

			<small>
				Choose how case IDs should appear.
			</small>

		</div>

	</div>

	<div class="preview">

		<h3>Preview</h3>

		<p class="example">

			{#if form.caseSettings.format === '{PREFIX}-{YEAR}-{NUMBER}'}

				{form.caseSettings.prefix}-2026-0001

			{:else if form.caseSettings.format === '{YEAR}-{NUMBER}'}

				2026-0001

			{:else if form.caseSettings.format === '{PREFIX}-{NUMBER}'}

				{form.caseSettings.prefix}-0001

			{:else}

				0001

			{/if}

		</p>

	</div>

</div>

<style>

.step{
	display:flex;
	flex-direction:column;
	gap:2rem;
}

.step h2{
	margin:0;
	color:#0f172a;
}

.step p{
	color:#64748b;
	margin:0;
}

.grid{
	display:grid;
	grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
	gap:1.5rem;
}

.field{
	display:flex;
	flex-direction:column;
}

.field label{
	font-weight:600;
	margin-bottom:.5rem;
}

.field input,
.field select{
	padding:12px;
	border:1px solid #cbd5e1;
	border-radius:10px;
	font-size:.95rem;
}

.field small{
	margin-top:.4rem;
	color:#64748b;
	font-size:.8rem;
}

.preview{
	padding:1.5rem;
	background:#f8fafc;
	border:1px solid #e2e8f0;
	border-radius:12px;
}

.preview h3{
	margin:0 0 .75rem;
	color:#0f172a;
}

.example{
	font-size:1.3rem;
	font-weight:700;
	color:#14b8a6;
	letter-spacing:1px;
	margin:0;
}

</style>