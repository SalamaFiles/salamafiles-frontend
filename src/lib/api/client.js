
import { API_URL } from '$lib/config';

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const isFormData =
        typeof FormData !== 'undefined' &&
        options.body instanceof FormData;

    const headers = {
        ...(!isFormData && {
            'Content-Type': 'application/json'
        }),

        ...(token && {
            Authorization: `Bearer ${token}`
        }),

        ...(options.headers || {})
    };

    // Let the browser set the multipart boundary.
    if (isFormData) {
        delete headers['Content-Type'];
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        // Some endpoints may return 204 No Content.
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
