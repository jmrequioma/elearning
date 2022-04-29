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

import MyCoursesPage from '../MyCoursesPage.vue';

describe('MyCoursesPage', () => {
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
		wrapper = mount(MyCoursesPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.page');
		const header = wrapper.find('.header');

		expect(container).toBeDefined();
		expect(header.html()).toContain('My Courses');
	});

	it('displays courses enrolled in by the student', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const enrollmentStore = useEnrollmentsStore();

		// create an enrollment
		await enrollmentStore.createEnrollment({ courseId: 1 });
		const res = await enrollmentStore.fetchEnrollments({
			full: true,
		});
		wrapper.vm.enrollments.value = res.data.data;
		await flushPromises();
		const card = wrapper.find('.card');
		expect(card).toBeDefined();
	});
});
