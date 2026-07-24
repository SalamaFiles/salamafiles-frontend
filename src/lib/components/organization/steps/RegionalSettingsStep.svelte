<script>
	let { form } = $props();
</script>

<div class="step">

	<h2>Regional Settings</h2>

	<p class="intro">
		Configure your organization's regional preferences.
		These settings determine how dates and language are displayed throughout the platform.
	</p>

	<div class="grid">

		<div class="field">

			<label>Timezone</label>

			<select bind:value={form.timezone}>

				<option value="Africa/Nairobi">
					Africa / Nairobi (GMT +3)
				</option>

				<option value="Africa/Kampala">
					Africa / Kampala
				</option>

				<option value="Africa/Dar_es_Salaam">
					Africa / Dar es Salaam
				</option>

				<option value="Africa/Kigali">
					Africa / Kigali
				</option>

				<option value="Africa/Addis_Ababa">
					Africa / Addis Ababa
				</option>

				<option value="Africa/Johannesburg">
					Africa / Johannesburg
				</option>

				<option value="Africa/Lagos">
					Africa / Lagos
				</option>

			</select>

		</div>

		<div class="field">

			<label>Language</label>

			<select bind:value={form.language}>

				<option value="en">
					English
				</option>

				<option value="sw">
					Kiswahili
				</option>

				<option value="fr">
					French
				</option>

			</select>

		</div>

		<div class="field full">

			<label>Date Format</label>

			<select bind:value={form.dateFormat}>

				<option value="DD/MM/YYYY">
					DD/MM/YYYY
				</option>

				<option value="MM/DD/YYYY">
					MM/DD/YYYY
				</option>

				<option value="YYYY-MM-DD">
					YYYY-MM-DD
				</option>

			</select>

		</div>

	</div>

</div>

<style>

.step{
	display:flex;
	flex-direction:column;
	gap:2rem;
}

.intro{
	color:#64748b;
	line-height:1.6;
	margin:0;
}

.grid{
	display:grid;
	grid-template-columns:repeat(2,1fr);
	gap:1.5rem;
}

.field{
	display:flex;
	flex-direction:column;
}

.field.full{
	grid-column:1 / -1;
}

label{
	font-size:.9rem;
	font-weight:600;
	margin-bottom:.5rem;
	color:#334155;
}

select{
	padding:12px 14px;
	border:1px solid #cbd5e1;
	border-radius:10px;
	font-size:.95rem;
	background:white;
	outline:none;
	transition:.2s;
}

select:focus{
	border-color:#14b8a6;
	box-shadow:0 0 0 3px rgba(20,184,166,.15);
}

@media (max-width:768px){

	.grid{
		grid-template-columns:1fr;
	}

	.field.full{
		grid-column:auto;
	}

}

</style>