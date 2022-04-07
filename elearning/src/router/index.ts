import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import authRoutes from './auth/index';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [...authRoutes],
});

router.beforeEach(async (to, from) => {
	const authStore = useAuthStore();
	if (!authStore.isAuthenticated && to.meta.authRequired) {
		return { name: 'login' };
	} else if (to.meta.hideWhenAuthenticated) {
		// return user's homepage
	}
	document.title = to.meta.title as string;
});

export default router;
