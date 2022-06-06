import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import authRoutes from './auth/index';
import internalRoutes from './internal/index';

declare module 'vue-router' {
	interface RouteMeta {
		// is optional
		allowedRoles?: Array<string>;
	}
}

export const routes = [...authRoutes, ...internalRoutes];
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes,
});

router.beforeEach(async (to, from) => {
	const authStore = useAuthStore();

	if (!authStore.isAuthenticated && to.meta.authRequired) {
		return { name: 'login' };
	} else if (authStore.isAuthenticated) {
		await authStore.getLoggedInUserInfo();
		if (to.meta.hideWhenAuthenticated) {
			const routeName = getUserRoleRoute();
			return { name: routeName };
		} else {
			// check if logged in user is allowed to view page
			if (!to.meta.allowedRoles?.includes(authStore.loggedInUser?.role || '')) {
				return false;
			}
		}
	}
	document.title = to.meta.title as string;
});

/**
 * Helper function to redirect user to appropriate route
 * based on role
 *
 */
function getUserRoleRoute() {
	const authStore = useAuthStore();

	const role = authStore.loggedInUser?.role;
	switch (role) {
		case 'instructor':
			return 'subjects';
		case 'admin':
			return 'users';
		case 'student':
			return 'student-courses';
		default:
			return '';
	}
}

export default router;
