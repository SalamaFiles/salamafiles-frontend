<script>
	let {
		form
	} = $props();

	function triggerUpload() {
		// File upload will be implemented later
		alert("Logo upload coming soon.");
	}
</script>

<div class="step">

	<div class="intro">
		<h2>Organization Branding</h2>

		<p>
			Customize the appearance of your platform. These settings
			will be visible throughout your organization.
		</p>
	</div>

	<div class="grid">

		<!-- Logo -->

		<div class="card full">

			<h3>Organization Logo</h3>

			<div class="logo-upload">

				{#if form.branding.logo}

					<img
						src={form.branding.logo}
						alt="Organization Logo"
					/>

				{:else}

					<div class="placeholder">

						<div class="icon">🏢</div>

						<p>No logo uploaded</p>

					</div>

				{/if}

				<button
					type="button"
					class="upload-btn"
					onclick={triggerUpload}
				>
					Upload Logo
				</button>

			</div>

		</div>

		<!-- Primary Color -->

		<div class="card">

			<h3>Primary Color</h3>

			<div class="color-field">

				<input
					type="color"
					bind:value={form.branding.primaryColor}
				/>

				<input
					type="text"
					bind:value={form.branding.primaryColor}
				/>

			</div>

		</div>

		<!-- Secondary Color -->

		<div class="card">

			<h3>Secondary Color</h3>

			<div class="color-field">

				<input
					type="color"
					bind:value={form.branding.secondaryColor}
				/>

				<input
					type="text"
					bind:value={form.branding.secondaryColor}
				/>

			</div>

		</div>

	</div>

	<!-- Preview -->

	<div class="preview">

		<h3>Live Preview</h3>

		<div class="preview-card">

			<div
				class="preview-header"
				style={`background:${form.branding.primaryColor}`}
			>

				<div class="logo-mini">

					{#if form.branding.logo}

						<img
							src={form.branding.logo}
							alt=""
						/>

					{:else}

						🏢

					{/if}

				</div>

				<div>

					<h4>SalamaFiles</h4>

					<p>Your Organization</p>

				</div>

			</div>

			<div class="preview-body">

				<button
					class="primary-btn"
					style={`background:${form.branding.primaryColor}`}
				>
					Primary Button
				</button>

				<button
					class="secondary-btn"
					style={`
						background:${form.branding.secondaryColor};
						border-color:${form.branding.secondaryColor};
					`}
				>
					Secondary Button
				</button>

				<div class="sample-card">

					<div class="status"
						style={`background:${form.branding.primaryColor}`}
					>
						New Case
					</div>

					<p>
						Example incident reported by a survivor.
					</p>

				</div>

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

.intro h2{
	margin:0;
	font-size:1.8rem;
	color:#0f172a;
}

.intro p{
	margin-top:.5rem;
	color:#64748b;
	line-height:1.6;
}

.grid{
	display:grid;
	grid-template-columns:1fr 1fr;
	gap:1.5rem;
}

.card{
	background:white;
	border:1px solid #e2e8f0;
	border-radius:16px;
	padding:1.5rem;
}

.card.full{
	grid-column:1/-1;
}

.card h3{
	margin-top:0;
	margin-bottom:1rem;
	color:#0f172a;
}

.logo-upload{
	display:flex;
	align-items:center;
	gap:2rem;
}

.placeholder{
	width:120px;
	height:120px;
	border:2px dashed #cbd5e1;
	border-radius:16px;
	display:flex;
	flex-direction:column;
	align-items:center;
	justify-content:center;
	color:#94a3b8;
}

.placeholder .icon{
	font-size:2rem;
	margin-bottom:.5rem;
}

.logo-upload img{
	width:120px;
	height:120px;
	object-fit:contain;
	border-radius:12px;
	border:1px solid #e2e8f0;
	background:white;
}

.upload-btn{
	padding:12px 20px;
	border:none;
	border-radius:10px;
	background:#14b8a6;
	color:white;
	font-weight:600;
	cursor:pointer;
}

.upload-btn:hover{
	background:#0f766e;
}

.color-field{
	display:flex;
	align-items:center;
	gap:1rem;
}

.color-field input[type="color"]{
	width:60px;
	height:45px;
	border:none;
	background:none;
	cursor:pointer;
}

.color-field input[type="text"]{
	flex:1;
	padding:12px;
	border-radius:10px;
	border:1px solid #cbd5e1;
	font-family:monospace;
}

.preview{
	background:white;
	border:1px solid #e2e8f0;
	border-radius:18px;
	padding:2rem;
}

.preview h3{
	margin-top:0;
}

.preview-card{
	border:1px solid #e2e8f0;
	border-radius:16px;
	overflow:hidden;
}

.preview-header{
	display:flex;
	align-items:center;
	gap:1rem;
	padding:1rem;
	color:white;
}

.logo-mini{
	width:48px;
	height:48px;
	background:white;
	border-radius:12px;
	display:flex;
	align-items:center;
	justify-content:center;
	font-size:1.4rem;
	color:#0f172a;
	overflow:hidden;
}

.logo-mini img{
	width:100%;
	height:100%;
	object-fit:contain;
}

.preview-header h4{
	margin:0;
}

.preview-header p{
	margin:.2rem 0 0;
	color:rgba(255,255,255,.9);
	font-size:.9rem;
}

.preview-body{
	padding:2rem;
	display:flex;
	flex-direction:column;
	gap:1rem;
}

.primary-btn,
.secondary-btn{
	padding:12px;
	border-radius:10px;
	color:white;
	font-weight:600;
	border:none;
	cursor:pointer;
}

.secondary-btn{
	border:1px solid;
}

.sample-card{
	padding:1rem;
	border-radius:12px;
	border:1px solid #e2e8f0;
}

.status{
	display:inline-block;
	padding:6px 12px;
	border-radius:999px;
	color:white;
	font-size:.8rem;
	margin-bottom:1rem;
}

@media(max-width:768px){

	.grid{
		grid-template-columns:1fr;
	}

	.logo-upload{
		flex-direction:column;
		align-items:flex-start;
	}

}

</style>