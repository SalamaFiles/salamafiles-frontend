import { apiFetch } from './client';

// =====================================
// USERS
// =====================================

export function fetchUsers() {
	return apiFetch('/user');
}

export function fetchUser(id) {
	return apiFetch(`/user/${id}`);
}

// =====================================
// INVITE USER
// =====================================

export function inviteUser(data) {
	return apiFetch('/user', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

// =====================================
// UPDATE USER
// =====================================

export function updateUser(id, data) {
	return apiFetch(`/user/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// =====================================
// CHANGE STATUS
// =====================================

export function changeUserStatus(id, status) {
	return apiFetch(`/user/${id}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ status })
	});
}

// =====================================
// DISABLE USER
// =====================================

export function disableUser(id) {
	return apiFetch(`/user/${id}`, {
		method: 'DELETE'
	});
}

// =====================================
// RESEND INVITATION
// =====================================

export function resendInvitation(id) {
    return apiFetch(`/user/${id}/resend-invitation`, {
        method: 'POST',
        body: JSON.stringify({})
    });
}

// =====================================
// EMERGENCY USERS
// =====================================

export function fetchEmergencyUsers() {
	return apiFetch('/user/emergency');
}