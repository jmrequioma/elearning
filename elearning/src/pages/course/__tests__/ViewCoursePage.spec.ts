import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useEnrollmentsStore } from '@/stores/enrollment';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import ViewCoursePage from '../ViewCoursePage.vue';

describe('ViewCoursePage', () => {
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
		wrapper = mount(ViewCoursePage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.page');

		expect(container).toBeDefined();
	});

	it("displays modules found in student's enrolled course", async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const enrollmentStore = useEnrollmentsStore();

		// create an enrollment
		const newEnrollment = await enrollmentStore.createEnrollment({
			courseId: 1,
		});
		const res = await enrollmentStore.fetchEnrollmentDetails({
			id: newEnrollment.data.id,
		});

		wrapper.vm.fetchedEnrollment = res.data;
		await flushPromises();

		const header = wrapper.find('.header');
		const moduleItemTitle = wrapper.find('.title');
		expect(moduleItemTitle.html()).toContain(res.data.course.modules[0].title);
		expect(header.html()).toContain(res.data.course.title);
	});

	it("selects a module found in student's enrolled course", async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const enrollmentStore = useEnrollmentsStore();

		// create an enrollment
		const newEnrollment = await enrollmentStore.createEnrollment({
			courseId: 1,
		});
		const res = await enrollmentStore.fetchEnrollmentDetails({
			id: newEnrollment.data.id,
		});

		wrapper.vm.fetchedEnrollment = res.data;
		await flushPromises();

		const moduleItem = wrapper.find('.module-list__item');
		const moduleTitle = wrapper.find('.title');
		await moduleItem.trigger('click');

		expect(moduleItem).toBeTruthy();
		expect(moduleTitle.html()).toContain(wrapper.vm.currentModule.title);
	});
});
