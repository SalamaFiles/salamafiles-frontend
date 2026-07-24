import { apiFetch } from './client';

// =====================
// LOGIN
// =====================

export function login(email, password) {
	return apiFetch('/auth/login', {
		method: 'POST',
		body: JSON.stringify({
			email,
			password
		})
	});
}

// =====================
// CURRENT USER
// =====================

export function getMe() {
	return apiFetch('/auth/me');
}

// =====================
// FORGOT PASSWORD
// =====================

export function forgotPassword(email) {
	return apiFetch('/auth/forgot-password', {
		method: 'POST',
		body: JSON.stringify({
			email
		})
	});
}

// =====================
// RESET PASSWORD
// =====================

export function resetPassword(token, password) {
	return apiFetch('/auth/reset-password', {
		method: 'POST',
		body: JSON.stringify({
			token,
			password
		})
	});
}

// =====================
// LOGOUT
// =====================

export function logout() {
	localStorage.removeItem('token');
}