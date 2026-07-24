<script>
	let { form } = $props();
</script>

<div class="step">

	<h2>Reporting Preferences</h2>

	<p class="intro">
		Choose how people will be allowed to report cases to your organization.
	</p>

	<div class="settings">

		<div class="setting">

			<div>

				<h3>Allow Anonymous Reporting</h3>

				<p>
					People can submit cases without revealing their identity.
				</p>

			</div>

			<input
				type="checkbox"
				bind:checked={form.reporting.allowAnonymous}
			/>

		</div>

		<div class="setting">

			<div>

				<h3>Allow File Attachments</h3>

				<p>
					Allow survivors or reporters to upload photos, documents or evidence.
				</p>

			</div>

			<input
				type="checkbox"
				bind:checked={form.reporting.allowAttachments}
			/>

		</div>

		<div class="setting">

			<div>

				<h3>Require Evidence</h3>

				<p>
					Ask reporters to provide supporting evidence before submitting a case.
				</p>

			</div>

			<input
				type="checkbox"
				bind:checked={form.reporting.requireEvidence}
			/>

		</div>

		<div class="setting">

			<div>

				<h3>Require Location</h3>

				<p>
					Require the incident location when submitting a report.
				</p>

			</div>

			<input
				type="checkbox"
				bind:checked={form.reporting.requireLocation}
			/>

		</div>

		<div class="setting">

			<div>

				<h3>Automatically Assign Cases</h3>

				<p>
					New reports will automatically be assigned to available staff.
				</p>

			</div>

			<input
				type="checkbox"
				bind:checked={form.reporting.autoAssignCases}
			/>

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

.settings{
	display:flex;
	flex-direction:column;
	gap:1rem;
}

.setting{
	display:flex;
	justify-content:space-between;
	align-items:center;
	padding:1.25rem;
	border:1px solid #e2e8f0;
	border-radius:12px;
	background:#fff;
}

.setting h3{
	margin:0 0 .3rem;
	font-size:1rem;
	color:#0f172a;
}

.setting p{
	margin:0;
	color:#64748b;
	font-size:.9rem;
	max-width:500px;
}

input[type="checkbox"]{
	width:22px;
	height:22px;
	accent-color:#14b8a6;
	cursor:pointer;
	flex-shrink:0;
}

@media (max-width:768px){

	.setting{
		flex-direction:column;
		align-items:flex-start;
		gap:1rem;
	}

}

</style>