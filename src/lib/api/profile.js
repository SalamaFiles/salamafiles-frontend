import { apiFetch } from './client';

// =====================
// GET MY PROFILE
// =====================

export function getProfile() {
	return apiFetch('/profile');
}

// =====================
// UPDATE MY PROFILE
// =====================

export function updateProfile(data) {
	return apiFetch('/profile', {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// =====================
// CHANGE PASSWORD
// =====================

export function changePassword(currentPassword, newPassword) {
	return apiFetch('/profile/password', {
		method: 'PUT',
		body: JSON.stringify({
			currentPassword,
			newPassword
		})
	});
}