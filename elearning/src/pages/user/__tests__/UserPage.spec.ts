import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/user';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';
import faker from '@faker-js/faker';

import UserPage from '../UserPage.vue';

describe('UserPage', () => {
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
		wrapper = mount(UserPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.user-page');

		expect(container).toBeDefined();
	});

	it('fetches users', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const userStore = useUsersStore();
		const option = wrapper.find('option');
		const optionValue = parseInt(option.element.value);

		const data = {
			limit: parseInt(option.element.value),
		};

		await userStore.fetchUsers(data);

		expect(userStore.fetchedUsers?.length).toBeLessThanOrEqual(optionValue);
	});

	it('fetches users using search key', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const userStore = useUsersStore();

		const data = {
			keyword: 'John',
		};

		await userStore.fetchUsers(data);

		const fetchedUsers = userStore.fetchedUsers;
		expect(fetchedUsers?.length).toBeGreaterThan(0);
		if (fetchedUsers) {
			expect(fetchedUsers[0].firstName).toContain('John');
		}
	});

	it('fetches users with admin role', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const userStore = useUsersStore();
		const role = 'admin';

		const data = {
			role: 'admin',
		};

		await userStore.fetchUsers(data);

		const fetchedUsers = userStore.fetchedUsers;
		expect(fetchedUsers?.length).toBeGreaterThan(0);
		if (fetchedUsers) {
			expect(fetchedUsers[0].role).toBe(role);
			expect(fetchedUsers[fetchedUsers.length - 1].role).toBe(role);
			const roleRow = wrapper.find('td.capitalize');
			expect(roleRow.html()).toContain(role);
		}
	});

	it('fetches users with instructor role', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const authStore = useAuthStore();
		const userStore = useUsersStore();
		const role = 'instructor';
		const data = {
			role: role,
		};

		// create an inactive instructor user
		const password = faker.internet.password();
		await authStore.signup({
			email: faker.internet.email(),
			password: password,
			verifyPassword: password,
			role: role,
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
		});

		await userStore.fetchUsers(data);

		const fetchedUsers = userStore.fetchedUsers;
		expect(fetchedUsers?.length).toBeGreaterThan(0);
		if (fetchedUsers) {
			expect(fetchedUsers[0].role).toBe(role);
			expect(fetchedUsers[fetchedUsers.length - 1].role).toBe(role);
			const roleRow = wrapper.find('td.capitalize');
			expect(roleRow.html()).toContain(role);
		}
	});

	it('fetches users with student role', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const authStore = useAuthStore();
		const userStore = useUsersStore();
		const role = 'student';

		const data = {
			role: role,
		};

		// create an inactive user
		const password = faker.internet.password();
		await authStore.signup({
			email: faker.internet.email(),
			password: password,
			verifyPassword: password,
			role: role,
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
		});

		await userStore.fetchUsers(data);

		const fetchedUsers = userStore.fetchedUsers;
		expect(fetchedUsers?.length).toBeGreaterThan(0);
		if (fetchedUsers) {
			expect(fetchedUsers[0].role).toBe(role);
			expect(fetchedUsers[fetchedUsers.length - 1].role).toBe(role);
			const roleRow = wrapper.find('td.capitalize');
			expect(roleRow.html()).toContain(role);
		}
	});
});
