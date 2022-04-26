import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';

import HomePage from '../HomePage.vue';
import { useAuthStore } from '@/stores/auth';
import faker from '@faker-js/faker';

describe('HomePage', () => {
	let wrapper: VueWrapper;
	let router: Router;
	let authStore;

	beforeEach(() => {
		setActivePinia(createPinia());
		authStore = useAuthStore();
		authStore.accessToken = faker.datatype.uuid();
		// set user
		authStore.user = {
			accessToken: faker.datatype.uuid(),
			id: 1,
			email: faker.internet.email(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			role: 'instructor',
			isActive: true,
		};
		router = createRouter({
			history: createWebHistory(),
			routes: routes,
		});
		wrapper = mount(HomePage, {
			global: {
				plugins: [router],
			},
		});
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.homepage');

		expect(container).toBeDefined();
	});

	it('tests the navigation', async () => {
		const link = wrapper.find('.nav-drawer__link');
		link.trigger('click');
		await flushPromises();
		await router.isReady();
		expect(router.currentRoute.value.name).toBe('subjects');
	});
});
