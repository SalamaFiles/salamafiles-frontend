import { API_URL } from '$lib/config';

export async function apiFetch(endpoint, options = {}) {

	const token = localStorage.getItem('token');

	const response = await fetch(
		`${API_URL}${endpoint}`,
		{
			...options,

			headers: {
				'Content-Type': 'application/json',

				...(token && {
					Authorization: `Bearer ${token}`
				}),

				...(options.headers || {})
			}
		}
	);

	let data = {};

	try {
		data = await response.json();
	} catch {
		// Some endpoints may return 204 No Content
	}

	if (!response.ok) {
		throw new Error(
			data.error ||
			data.message ||
			'Something went wrong'
		);
	}

	return data;
}