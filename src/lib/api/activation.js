import { apiFetch } from './client';

// Validate invitation
export function validateInvitation(token) {
	return apiFetch(`/invitations/${token}`);
}

// Activate account
export function activateAccount(token, password) {
	return apiFetch(`/invitations/${token}/activate`, {
		method: 'POST',
		body: JSON.stringify({
			password
		})
	});
}