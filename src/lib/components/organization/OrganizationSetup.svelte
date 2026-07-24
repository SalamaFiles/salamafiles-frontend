<script>
	import { toast } from 'svelte-sonner';

	import {
		completeOrganizationSetup
	} from '$lib/api/organization';

	import { auth } from '$lib/stores/auth';

	import { organization } from '$lib/stores/organization';
	import { appState } from '$lib/state.svelte.js';
	import BrandingStep from './steps/BrandingStep.svelte';
	import RegionalSettingsStep from './steps/RegionalSettingsStep.svelte';
	import ReportingStep from './steps/ReportingStep.svelte';
	import CommunicationStep from './steps/CommunicationStep.svelte';
	import CaseSettingsStep from './steps/CaseSettingsStep.svelte';
	import NotificationsStep from './steps/NotificationsStep.svelte';

	let org = $derived($organization.organization);

	let saving = $state(false);

	const steps = [
		'Welcome',
		'Branding',
		'Regional Settings',
		'Reporting',
		'Communication',
		'Case Settings',
		'Notifications'
	];

	let currentStep = $state(0);

	const progress = $derived(
		((currentStep + 1) / steps.length) * 100
	);

	let form = $state({
		branding: {
			logo: '',
			primaryColor:
				org?.branding?.primaryColor ?? '#14b8a6',
			secondaryColor:
				org?.branding?.secondaryColor ?? '#334155'
		},

		timezone:
			org?.timezone ?? 'Africa/Nairobi',

		language:
			org?.language ?? 'en',

		dateFormat:
			org?.dateFormat ?? 'DD/MM/YYYY',

		reporting: {
			allowAnonymous:
				org?.reporting?.allowAnonymous ?? true,

			allowAttachments:
				org?.reporting?.allowAttachments ?? true,

			requireEvidence:
				org?.reporting?.requireEvidence ?? false,

			requireLocation:
				org?.reporting?.requireLocation ?? false,

			autoAssignCases:
				org?.reporting?.autoAssignCases ?? false
		},

		channels: {
			sms: {
				enabled:
					org?.channels?.sms?.enabled ?? false,

				shortcode:
					org?.channels?.sms?.shortcode ?? ''
			},

			whatsapp: {
				enabled:
					org?.channels?.whatsapp?.enabled ?? false,

				number:
					org?.channels?.whatsapp?.number ?? ''
			},

			web: {
				enabled:
					org?.channels?.web?.enabled ?? true
			},

			mobile: {
				enabled:
					org?.channels?.mobile?.enabled ?? true
			}
		},

		caseSettings: {
			prefix:
				org?.caseSettings?.prefix ?? 'SV',

			format:
				org?.caseSettings?.format ??
				'{PREFIX}-{YEAR}-{NUMBER}'
		},

		notifications: {
			email:
				org?.notifications?.email ?? true,

			sms:
				org?.notifications?.sms ?? false,

			dailySummary:
				org?.notifications?.dailySummary ?? true,

			weeklyDigest:
				org?.notifications?.weeklyDigest ?? false,

			emergencyAlerts:
				org?.notifications?.emergencyAlerts ?? true
		}
	});

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	function previousStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	async function finishSetup() {
		saving = true;

		try {
			const result =
				await completeOrganizationSetup(
					org._id,
					form
				);

			organization.setOrganization(result.organization);

const updatedUser = {
	...$auth.user,
	organization: result.organization
};

auth.updateUser(updatedUser);

appState.user = updatedUser;

appState.mainView = 'dashboard';

			toast.success(
				'Organization setup completed successfully.'
			);
		} catch (err) {
			toast.error(
				err.message ||
					'Unable to complete setup.'
			);
		} finally {
			saving = false;
		}
	}
</script>

<div class="page">

	<div class="wizard">

		<div class="header">

			<h1>Organization Setup</h1>

			<p>
				Step {currentStep + 1} of {steps.length}
			</p>

			<div class="progress">

				<div
					class="progress-fill"
					style={`width:${progress}%`}
				/>

			</div>

		</div>
<div class="content">

	{#if currentStep === 0}

		<h2>Welcome to SalamaFiles</h2>

		<p class="intro">
			Your organization has already been registered.

			Let's configure how SalamaFiles will work for your organization.
		</p>

		<div class="summary">

			<div>
				<label>Organization</label>
				<p>{org?.name}</p>
			</div>

			<div>
				<label>Organization Code</label>
				<p>{org?.organizationCode}</p>
			</div>

			<div>
				<label>Country</label>
				<p>{org?.country}</p>
			</div>

			<div>
				<label>Subscription</label>
				<p>{org?.subscription?.plan ?? 'Free'}</p>
			</div>

		</div>

	{:else if currentStep === 1}

		<BrandingStep {form} />

	{:else if currentStep === 2}

		<RegionalSettingsStep {form} />

	{:else if currentStep === 3}

		<ReportingStep {form} />

	{:else if currentStep === 4}

		
	<CommunicationStep {form} />

	{:else if currentStep === 5}

		<CaseSettingsStep {form} />


	{:else if currentStep === 6}

		<NotificationsStep {form} />

	{/if}

</div>

		<div class="footer">

			<button
				class="secondary"
				onclick={previousStep}
				disabled={currentStep === 0}
			>
				Previous
			</button>

			{#if currentStep < steps.length - 1}

				<button
					class="primary"
					onclick={nextStep}
				>
					Next
				</button>

			{:else}

				<button
					class="primary"
					onclick={finishSetup}
					disabled={saving}
				>
					{saving
						? 'Saving...'
						: 'Finish Setup'}
				</button>

			{/if}

		</div>

	</div>

</div>

<style>

.page{
	max-width:900px;
	margin:auto;
	padding:3rem 1rem;
}

.wizard{
	background:white;
	border:1px solid #e2e8f0;
	border-radius:18px;
	box-shadow:0 10px 30px rgba(15,23,42,.05);
	overflow:hidden;
}

.header{
	padding:2rem;
	border-bottom:1px solid #e2e8f0;
}

.header h1{
	margin:0;
	color:#0f172a;
}

.header p{
	color:#64748b;
	margin:.5rem 0 1rem;
}

.progress{
	height:10px;
	background:#e2e8f0;
	border-radius:999px;
	overflow:hidden;
}

.progress-fill{
	height:100%;
	background:#14b8a6;
	transition:.3s;
}

.content{
	padding:2rem;
	min-height:420px;
}

.intro{
	color:#64748b;
	margin-bottom:2rem;
}

.summary{
	display:grid;
	grid-template-columns:repeat(2,1fr);
	gap:1.5rem;
	margin-top:2rem;
}

.summary label{
	font-size:.8rem;
	color:#64748b;
	font-weight:600;
}

.summary p{
	margin-top:.35rem;
	font-size:1rem;
	font-weight:600;
	color:#0f172a;
}

.placeholder{
	display:flex;
	flex-direction:column;
	align-items:center;
	justify-content:center;
	height:300px;
	text-align:center;
	color:#64748b;
}

.footer{
	display:flex;
	justify-content:space-between;
	padding:1.5rem 2rem;
	border-top:1px solid #e2e8f0;
	background:#fafafa;
}

.primary,
.secondary{
	padding:12px 22px;
	border-radius:10px;
	font-weight:600;
	cursor:pointer;
	transition:.2s;
}

.primary{
	background:#14b8a6;
	color:white;
	border:none;
}

.primary:hover{
	background:#0f766e;
}

.secondary{
	background:white;
	border:1px solid #cbd5e1;
}

.secondary:hover{
	background:#f8fafc;
}

button:disabled{
	opacity:.5;
	cursor:not-allowed;
}

@media(max-width:768px){

	.summary{
		grid-template-columns:1fr;
	}

	.footer{
		flex-direction:column;
		gap:1rem;
	}

	.footer button{
		width:100%;
	}

}

</style>