<script>
	let { form } = $props();
</script>

<div class="step">

	<h2>Communication Channels</h2>

	<p class="intro">
		Choose how your organization will receive reports from survivors and community members.
	</p>

	<div class="settings">

		<!-- SMS -->

		<div class="channel">

			<div class="channel-header">

				<div>
					<h3>SMS Reporting</h3>
					<p>Allow reports via SMS.</p>
				</div>

				<input
					type="checkbox"
					bind:checked={form.channels.sms.enabled}
				/>

			</div>

			{#if form.channels.sms.enabled}

				<div class="field">

					<label>SMS Shortcode / Number</label>

					<input
						type="text"
						placeholder="e.g. 40123"
						bind:value={form.channels.sms.shortcode}
					/>

				</div>

			{/if}

		</div>

		<!-- WhatsApp -->

		<div class="channel">

			<div class="channel-header">

				<div>
					<h3>WhatsApp Reporting</h3>
					<p>Allow reports through WhatsApp.</p>
				</div>

				<input
					type="checkbox"
					bind:checked={form.channels.whatsapp.enabled}
				/>

			</div>

			{#if form.channels.whatsapp.enabled}

				<div class="field">

					<label>WhatsApp Number</label>

					<input
						type="text"
						placeholder="+254700000000"
						bind:value={form.channels.whatsapp.number}
					/>

				</div>

			{/if}

		</div>

		<!-- Web -->

		<div class="channel">

			<div class="channel-header">

				<div>
					<h3>Web Portal</h3>
					<p>Allow reporting from the web portal.</p>
				</div>

				<input
					type="checkbox"
					bind:checked={form.channels.web.enabled}
				/>

			</div>

		</div>

		<!-- Mobile -->

		<div class="channel">

			<div class="channel-header">

				<div>
					<h3>Mobile App</h3>
					<p>Allow reporting through the mobile application.</p>
				</div>

				<input
					type="checkbox"
					bind:checked={form.channels.mobile.enabled}
				/>

			</div>

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
	gap:1.25rem;
}

.channel{
	border:1px solid #e2e8f0;
	border-radius:12px;
	padding:1.25rem;
	background:white;
}

.channel-header{
	display:flex;
	justify-content:space-between;
	align-items:center;
}

.channel h3{
	margin:0 0 .25rem;
	color:#0f172a;
	font-size:1rem;
}

.channel p{
	margin:0;
	color:#64748b;
	font-size:.9rem;
}

.field{
	margin-top:1rem;
	display:flex;
	flex-direction:column;
}

.field label{
	margin-bottom:.5rem;
	font-size:.9rem;
	font-weight:600;
	color:#334155;
}

.field input{
	padding:12px;
	border:1px solid #cbd5e1;
	border-radius:10px;
	font-size:.95rem;
}

.field input:focus{
	outline:none;
	border-color:#14b8a6;
	box-shadow:0 0 0 3px rgba(20,184,166,.15);
}

input[type="checkbox"]{
	width:22px;
	height:22px;
	accent-color:#14b8a6;
	cursor:pointer;
}

@media(max-width:768px){

	.channel-header{
		flex-direction:column;
		align-items:flex-start;
		gap:1rem;
	}

}

</style>