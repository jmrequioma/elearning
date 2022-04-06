import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { setupTests } from '@/utils/setupTests';

import Login from '../Login.vue';
import { useAuthStore } from '@/stores/auth';

describe('Login', () => {
	let wrapper: VueWrapper;
	setupTests();

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(Login);
	});

	it('logs the user in', async () => {
		const authStore = useAuthStore();
		const emailField = wrapper.find('#email');
		const passwordField = wrapper.find('#password');
		const loginBtn = wrapper.find('#login-btn');

		let emailValue = (emailField.element as HTMLInputElement).value;
		emailValue = 'johndoe@test.com';
		let passwordValue = (passwordField.element as HTMLInputElement).value;
		passwordValue = 'pass';
		await loginBtn.trigger('click');

		const res = await authStore.login({
			email: emailValue,
			password: passwordValue,
		});
		expect(res?.data.email).toEqual(emailValue);
		expect(res?.data.password).toEqual(passwordValue);
		expect(res?.status).toBe(200);
	});

	it('returns an error when user creds is invalid', async () => {
		const authStore = useAuthStore();
		const emailField = wrapper.find('#email');
		const passwordField = wrapper.find('#password');
		const loginBtn = wrapper.find('#login-btn');

		let emailValue = (emailField.element as HTMLInputElement).value;
		emailValue = 'johndoe12@test.com';
		let passwordValue = (passwordField.element as HTMLInputElement).value;
		passwordValue = 'pass';
		await loginBtn.trigger('click');

		try {
			await authStore.login({
				email: emailValue,
				password: passwordValue,
			});
		} catch (error) {
			expect((error as Error).message).toContain('401');
		}
	});
});
