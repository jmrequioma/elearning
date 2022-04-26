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
			const role = authStore.loggedInUser?.role;
			let routeName = '';
			if (role === 'instructor') {
				routeName = 'subjects';
			} else if (role === 'admin') {
				routeName = 'users';
			}
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

export default router;
