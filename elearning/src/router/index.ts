import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../pages/HomePage.vue'),
		},
	],
});

router.beforeEach(async (to, from) => {
	const authStore = useAuthStore();
	if (!authStore.isAuthenticated && to.name !== 'home') {
		return { name: 'home' };
	}
});

export default router;
