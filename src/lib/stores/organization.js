import { writable } from 'svelte/store';

function createOrganizationStore() {

	const initialState = {
		organization: null,
		loading: false
	};

	const { subscribe, set, update } = writable(initialState);

	return {

		subscribe,

		restore() {

			const saved = localStorage.getItem('organization');

			if (!saved) return false;

			try {

				const organization = JSON.parse(saved);

				set({
					organization,
					loading: false
				});

				return true;

			} catch {

				localStorage.removeItem('organization');

				return false;

			}
		},

		setLoading(value) {

			update((state) => ({
				...state,
				loading: value
			}));

		},

		setOrganization(organization) {

			localStorage.setItem(
				'organization',
				JSON.stringify(organization)
			);

			update((state) => ({
				...state,
				organization,
				loading: false
			}));

		},

		updateOrganization(data) {

			update((state) => {

				const organization = {
					...state.organization,
					...data
				};

				localStorage.setItem(
					'organization',
					JSON.stringify(organization)
				);

				return {
					...state,
					organization
				};

			});

		},

		clear() {

			localStorage.removeItem('organization');

			set(initialState);

		}

	};

}

export const organization = createOrganizationStore();