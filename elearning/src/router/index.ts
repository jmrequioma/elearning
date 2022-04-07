import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import authRoutes from './auth/index';
import internalRoutes from './internal/index';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [...authRoutes, ...internalRoutes],
});

router.beforeEach(async (to, from) => {
	const authStore = useAuthStore();
	if (!authStore.isAuthenticated && to.meta.authRequired) {
		return { name: 'login' };
	} else if (authStore.isAuthenticated && to.meta.hideWhenAuthenticated) {
		return { name: 'subjects' };
	}
	document.title = to.meta.title as string;
});

export default router;
