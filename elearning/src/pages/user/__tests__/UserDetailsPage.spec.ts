import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from '@/stores/user';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import UserDetailsPage from '../UserDetailsPage.vue';

describe('UserDetailsPage', () => {
	let wrapper: VueWrapper;
	let router: Router;
	// mock local storage
	let mockStorage: MockStorage = {};

	beforeAll(() => {
		global.Storage.prototype.setItem = vi.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = vi.fn((key) => mockStorage[key]);
	});
	beforeEach(() => {
		setActivePinia(createPinia());
		router = createRouter({
			history: createWebHistory(),
			routes: routes,
		});
		wrapper = mount(UserDetailsPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		router.push({ name: 'view-user', params: { id: 1 } });
		const container = wrapper.find('.user-details');
		const textField = wrapper.find('ui-textfield');

		expect(container).toBeDefined();
		expect(textField).toBeDefined();
	});

	it('fetches the specific user', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const userStore = useUsersStore();
		router.push({ name: 'view-user', params: { id: 1 } });

		// After this line, router is ready
		await router.isReady();

		const data = {
			id: 1,
		};

		const user = await userStore.fetchUserDetails(data);

		expect(user.data.id).toBe(1);
	});
});
