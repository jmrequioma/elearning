import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { users } from '@/mocks/mockedData';
import { useAuthStore } from '@/stores/auth';
import faker from '@faker-js/faker';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import type { MockStorage } from '@/types/index';

import ChangePassword from '../ChangePassword.vue';

describe('ChangePassword', () => {
	let wrapper: VueWrapper;
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
		wrapper = mount(ChangePassword);
		mockStorage = {};
	});

	it('renders the component', async () => {
		const currPassword = wrapper.find('#curr-password');
		const password = wrapper.find('#password');
		const confPassword = wrapper.find('#conf-password');
		const saveBtn = wrapper.find('#save-btn');

		expect(currPassword).toBeDefined();
		expect(password).toBeDefined();
		expect(confPassword).toBeDefined();
		expect(saveBtn).toBeDefined();
	});

	it('changes the password', async () => {
		const authStore = useAuthStore();

		const accessToken = users[0].accessToken;
		const currPassword = users[0].password;
		const newPassword = faker.internet.password();
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const res = await authStore.changePassword({
			currPassword: currPassword,
			password: newPassword,
			verifyPassword: newPassword,
		});

		expect(res?.data.status).toEqual('success');
		expect(res?.status).toBe(200);
	});

	it('throws error when token is not provided', async () => {
		const authStore = useAuthStore();

		const currPassword = users[0].password;
		const newPassword = faker.internet.password();

		try {
			await authStore.changePassword({
				currPassword: currPassword,
				password: newPassword,
				verifyPassword: newPassword,
			});
		} catch (error) {
			expect((error as Error).message).toContain('401');
		}
	});

	it('checks for invalid token', async () => {
		const authStore = useAuthStore();

		// use some random token
		const accessToken = faker.datatype.uuid();
		const currPassword = users[0].password;
		const newPassword = faker.internet.password();
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		try {
			await authStore.changePassword({
				currPassword: currPassword,
				password: newPassword,
				verifyPassword: newPassword,
			});
		} catch (error) {
			expect((error as Error).message).toContain('401');
		}
	});

	it('checks for wrong current password', async () => {
		const authStore = useAuthStore();

		const accessToken = users[0].accessToken;
		const currPassword = faker.internet.password();
		const newPassword = faker.internet.password();
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const res = await authStore.changePassword({
			currPassword: currPassword,
			password: newPassword,
			verifyPassword: newPassword,
		});

		expect(res?.data.errorMessage).toBe('Current password is incorrect.');
		expect(res?.status).toBe(200);
	});
});
