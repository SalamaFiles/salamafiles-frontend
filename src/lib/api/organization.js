import { apiFetch } from './client';

// Fetch all organizations
export function fetchOrganizations() {
	return apiFetch('/organizations');
}

// Fetch a single organization
export function fetchOrganization(id) {
	return apiFetch(`/organizations/${id}`);
}

// Update organization
export function updateOrganization(id, data) {
	return apiFetch(`/organizations/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// Complete first-time setup
export function completeOrganizationSetup(id, data) {
	return apiFetch(`/organizations/${id}/setup`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
}

// Activate / Suspend organization
export function updateOrganizationStatus(id, isActive) {
	return apiFetch(`/organizations/${id}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ isActive })
	});
}