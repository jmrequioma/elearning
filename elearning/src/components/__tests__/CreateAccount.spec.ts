import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import apiClient from '@/lib/axios-api';
import { setupTests } from '@/utils/setupTests';
import { faker } from '@faker-js/faker';

import CreateAccount from '../CreateAccount.vue';

describe('CreateAccount', () => {
	let wrapper: VueWrapper;
	setupTests();

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(CreateAccount);
	});

	it('creates a new account', async () => {
		const roleField = wrapper.find('#role');
		const emailField = wrapper.find('#email');
		const fnameField = wrapper.find('#first-name');
		const lnameField = wrapper.find('#last-name');
		const passwordField = wrapper.find('#password');
		const confPasswordField = wrapper.find('#conf-password');

		const registerBtn = wrapper.find('#register-btn');

		let roleValue = (roleField.element as HTMLInputElement).value;
		roleValue = 'student';

		let emailValue = (emailField.element as HTMLInputElement).value;
		emailValue = faker.internet.email();

		let fnameValue = (fnameField.element as HTMLInputElement).value;
		fnameValue = faker.name.firstName();

		let lnameValue = (lnameField.element as HTMLInputElement).value;
		lnameValue = faker.name.lastName();

		let passwordValue = (passwordField.element as HTMLInputElement).value;
		let confPasswordValue = (confPasswordField.element as HTMLInputElement)
			.value;
		const generatedPass = faker.internet.password();

		passwordValue = generatedPass;
		confPasswordValue = generatedPass;

		await registerBtn.trigger('click');

		const res = await apiClient.post('/signup', {
			email: emailValue,
			password: passwordValue,
			verifyPassword: confPasswordValue,
			role: roleValue,
			firstName: fnameValue,
			lastName: lnameValue,
		});
		expect(res.data.email).toEqual(emailValue);
		expect(res.data.password).toEqual(passwordValue);
		expect(res.data.verifyPassword).toEqual(confPasswordValue);
		expect(res.data.role).toEqual(roleValue);
		expect(res.data.firstName).toEqual(fnameValue);
		expect(res.data.lastName).toEqual(lnameValue);
		expect(res.status).toBe(200);
	});

	it('returns an error when email is already taken', async () => {
		const roleField = wrapper.find('#role');
		const emailField = wrapper.find('#email');
		const fnameField = wrapper.find('#first-name');
		const lnameField = wrapper.find('#last-name');
		const passwordField = wrapper.find('#password');
		const confPasswordField = wrapper.find('#conf-password');

		const registerBtn = wrapper.find('#register-btn');

		let roleValue = (roleField.element as HTMLInputElement).value;
		roleValue = 'instructor';

		let emailValue = (emailField.element as HTMLInputElement).value;
		// existing email
		emailValue = 'johndoe@test.com';

		let fnameValue = (fnameField.element as HTMLInputElement).value;
		fnameValue = faker.name.firstName();

		let lnameValue = (lnameField.element as HTMLInputElement).value;
		lnameValue = faker.name.lastName();

		let passwordValue = (passwordField.element as HTMLInputElement).value;
		let confPasswordValue = (confPasswordField.element as HTMLInputElement)
			.value;
		const generatedPass = faker.internet.password();

		passwordValue = generatedPass;
		confPasswordValue = generatedPass;

		await registerBtn.trigger('click');

		const res = await apiClient.post('/signup', {
			email: emailValue,
			password: passwordValue,
			verifyPassword: confPasswordValue,
			role: roleValue,
			firstName: fnameValue,
			lastName: lnameValue,
		});

		console.log(res.data.message);
		expect(res.data.errorMessage).toBe('The email is already registered.');
	});
});
