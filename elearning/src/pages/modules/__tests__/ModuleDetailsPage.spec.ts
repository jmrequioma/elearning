import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useModulesStore } from '@/stores/module';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import ModuleDetailsPage from '../ModuleDetailsPage.vue';
import faker from '@faker-js/faker';

describe('ModuleDetailsPage', () => {
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
		wrapper = mount(ModuleDetailsPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		router.push({ name: 'edit-module', params: { id: 1 } });
		const container = wrapper.find('.module-details');
		const textField = wrapper.find('ui-textfield');

		expect(container).toBeDefined();
		expect(textField).toBeDefined();
	});

	it('fetches the specific module', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const moduleStore = useModulesStore();
		router.push({ name: 'edit-module', params: { id: 1 } });

		// After this line, router is ready
		await router.isReady();

		const data = {
			id: 1,
		};

		const module = await moduleStore.fetchModuleDetails(data);

		expect(module.data.id).toBe(1);
	});

	it('adds a new module', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const moduleStore = useModulesStore();

		const data = {
			title: `${faker.random.word} Test`,
			isPublished: false,
		};

		await moduleStore.fetchMainModules({});

		const initialLength = moduleStore.totalCount || 0;
		await moduleStore.createModule(data);
		await moduleStore.fetchMainModules({});

		const finalLength = moduleStore.totalCount;

		expect(finalLength).toBe(initialLength + 1);
	});

	it('deletes a module', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const moduleStore = useModulesStore();

		await moduleStore.fetchMainModules({});

		const subject = moduleStore.fetchedModules
			? moduleStore.fetchedModules[0]
			: null;
		const data = {
			id: subject?.id,
		};

		const initialLength = moduleStore.totalCount || 0;
		await moduleStore.deleteModule(data);
		await moduleStore.fetchMainModules({});

		const finalLength = moduleStore.totalCount;

		expect(finalLength).toBe(initialLength - 1);
	});
});
