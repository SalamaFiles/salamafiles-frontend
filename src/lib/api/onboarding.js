import { apiFetch } from './client';

// -------------------------
// Enroll Organization
// -------------------------

export function enrollOrganization(data) {
	return apiFetch('/onboarding/organizations', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}