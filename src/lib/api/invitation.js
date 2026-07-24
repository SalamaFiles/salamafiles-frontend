import { apiFetch } from './client';

/**
 * Validate invitation token
 */
export function validateInvitation(token) {
	return apiFetch(`/invitations/${token}`);
}