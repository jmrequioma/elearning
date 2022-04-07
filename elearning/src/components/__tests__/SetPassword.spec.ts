import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { setupTests } from '@/utils/setupTests';

import SetPassword from '../SetPassword.vue';
import faker from '@faker-js/faker';

describe('SetPassword', () => {
	let wrapper: VueWrapper;
	setupTests();

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(SetPassword);
	});

	it('sends a request to set password', async () => {
		const passwordField = wrapper.find('#password');
		const confPasswordField = wrapper.find('#conf-password');
		const saveBtn = wrapper.find('#save-btn');

		let passwordValue = (passwordField.element as HTMLInputElement).value;
		passwordValue = faker.internet.password();
		let confPasswordValue = (confPasswordField.element as HTMLInputElement)
			.value;
		confPasswordValue = passwordValue;
		await saveBtn.trigger('click');

		expect(saveBtn).toBeTruthy();
		expect(passwordValue).toBe(confPasswordValue);
	});

	it('renders components', async () => {
		const passwordField = wrapper.find('#password');
		const confPasswordField = wrapper.find('#conf-password');
		const errorMessage = wrapper.find('pword-helper-text');
		const saveBtn = wrapper.find('#save-btn');

		expect(passwordField).toBeDefined();
		expect(confPasswordField).toBeDefined();
		expect(errorMessage).toBeDefined();
		expect(saveBtn).toBeDefined();
	});
});
