import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { setupTests } from '@/utils/setupTests';
import { users } from '@/mocks/mockedData';
import { useAuthStore } from '@/stores/auth';

import RecoverPassword from '../RecoverPassword.vue';

describe('RecoverPassword', () => {
	let wrapper: VueWrapper;
	setupTests();

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(RecoverPassword);
	});

	it('sends a request for password recovery', async () => {
		const authStore = useAuthStore();
		const emailField = wrapper.find('#email');
		const resetBtn = wrapper.find('#reset-btn');

		let emailValue = (emailField.element as HTMLInputElement).value;
		emailValue = users[0].email;
		await resetBtn.trigger('click');

		const res = await authStore.requestPasswordReset({ email: emailValue });

		expect(res?.data.status).toEqual('success');
		expect(res?.status).toBe(200);
	});

	it('returns an error when email is not found in the records', async () => {
		const authStore = useAuthStore();
		const emailField = wrapper.find('#email');
		const resetBtn = wrapper.find('#reset-btn');

		let emailValue = (emailField.element as HTMLInputElement).value;
		emailValue = 'johndoe12@test.com';
		await resetBtn.trigger('click');

		const res = await authStore.requestPasswordReset({ email: emailValue });

		expect(res).toBeUndefined();
	});
});
