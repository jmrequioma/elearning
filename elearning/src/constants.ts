export const API_URL = import.meta.env.VITE_APP_ROOT_API;
export const ROLES = [
	{
		label: 'Student',
		value: 'student',
	},
	{
		label: 'Instructor',
		value: 'instructor',
	},
];
export const TOKEN_SECRET = import.meta.env.VITE_APP_TOKEN_SECRET;
export const PAGINATION_OPTIONS = [10, 25, 100];
export const STATUS_OPTIONS = [
	{
		label: 'Draft',
		value: 'Draft',
	},
	{
		label: 'Published',
		value: 'Published',
	},
];
export const USER_STATUS_OPTIONS = [
	{
		label: 'Active',
		value: 'Active',
	},
	{
		label: 'Inactive',
		value: 'Inactive',
	},
];
