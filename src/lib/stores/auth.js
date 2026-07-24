import { writable } from 'svelte/store';

function createAuthStore() {

	const { subscribe, set, update } = writable({
		user: null,
		token: null,
		authenticated: false,
		loading: false
	});

	return {

		subscribe,

		login(token, user) {

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			set({
				token,
				user,
				authenticated: true,
				loading: false
			});

		},

		// NEW
		updateUser(user) {

			update((state) => {

				localStorage.setItem(
					'user',
					JSON.stringify(user)
				);

				return {
					...state,
					user
				};

			});

		},

		logout() {

			localStorage.removeItem('token');
			localStorage.removeItem('user');

			set({
				token: null,
				user: null,
				authenticated: false,
				loading: false
			});

		},

		restore() {

			const token = localStorage.getItem('token');
			const storedUser = localStorage.getItem('user');

			if (!token || !storedUser) return false;

			try {

				const user = JSON.parse(storedUser);

				set({
					token,
					user,
					authenticated: true,
					loading: false
				});

				return true;

			} catch {

				localStorage.removeItem('token');
				localStorage.removeItem('user');

				return false;

			}

		},

		setLoading(value) {

			update((state) => ({
				...state,
				loading: value
			}));

		}

	};

}

export const auth = createAuthStore();