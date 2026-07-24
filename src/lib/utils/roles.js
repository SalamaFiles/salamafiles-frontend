export const isAdmin = (user) =>
	user?.role === 'Admin';

export const isSupervisor = (user) =>
	user?.role === 'Supervisor';

export const isCounselor = (user) =>
	user?.role === 'Counselor';

export const isEmergency = (user) =>
	user?.role === 'Emergency';