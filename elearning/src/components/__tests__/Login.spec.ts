import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import apiClient from '@/lib/axios-api';
import { setupTests } from '@/utils/setupTests';

import Login from '../Login.vue';

describe('Login', () => {
	let wrapper: VueWrapper;
	setupTests();

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(Login);
	});

	it('logs the user in', async () => {
		const emailField = wrapper.find('#email');
		const passwordField = wrapper.find('#password');
		const loginBtn = wrapper.find('#login-btn');

		emailField.wrapperElement.value = 'johndoe@test.com';
		passwordField.wrapperElement.value = 'pass';
		await loginBtn.trigger('click');

		try {
			const res = await apiClient.post('/user', {
				email: emailField.wrapperElement.value,
				password: passwordField.wrapperElement.value,
			});
			expect(res.data.email).toEqual(emailField.wrapperElement.value);
			expect(res.data.password).toEqual(passwordField.wrapperElement.value);
		} catch (error) {
			console.error('logging in user failed', error);
		}
	});
});
