<script>

	let { form } = $props();

</script>

<div class="step">

	<h2>Notification Preferences</h2>

	<p class="description">
		Choose which notifications your organization would like to receive.
	</p>

	<div class="card">

		<label class="toggle">

			<input
				type="checkbox"
				bind:checked={form.notifications.email}
			/>

			<div>
				<strong>Email Notifications</strong>

				<p>
					Send notifications to staff via email.
				</p>
			</div>

		</label>

		<label class="toggle">

			<input
				type="checkbox"
				bind:checked={form.notifications.sms}
			/>

			<div>
				<strong>SMS Notifications</strong>

				<p>
					Send SMS alerts for important updates.
				</p>
			</div>

		</label>

		<label class="toggle">

			<input
				type="checkbox"
				bind:checked={form.notifications.dailySummary}
			/>

			<div>
				<strong>Daily Summary</strong>

				<p>
					Receive a daily report of new and updated cases.
				</p>
			</div>

		</label>

		<label class="toggle">

			<input
				type="checkbox"
				bind:checked={form.notifications.weeklyDigest}
			/>

			<div>
				<strong>Weekly Digest</strong>

				<p>
					Receive a weekly activity summary.
				</p>
			</div>

		</label>

		<label class="toggle">

			<input
				type="checkbox"
				bind:checked={form.notifications.emergencyAlerts}
			/>

			<div>
				<strong>Emergency Alerts</strong>

				<p>
					Immediately notify staff when a high-risk case is reported.
				</p>
			</div>

		</label>

	</div>

</div>

<style>

.step{
	display:flex;
	flex-direction:column;
	gap:1.5rem;
}

.description{
	color:#64748b;
}

.card{
	background:#fff;
	border:1px solid #e2e8f0;
	border-radius:14px;
	padding:1.5rem;
	display:flex;
	flex-direction:column;
	gap:1.25rem;
}

.toggle{
	display:flex;
	align-items:flex-start;
	gap:1rem;
	cursor:pointer;
}

.toggle input{
	margin-top:4px;
	width:18px;
	height:18px;
}

.toggle strong{
	display:block;
	color:#0f172a;
	margin-bottom:.25rem;
}

.toggle p{
	margin:0;
	font-size:.9rem;
	color:#64748b;
	line-height:1.4;
}

</style>