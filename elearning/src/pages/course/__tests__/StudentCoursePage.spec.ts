import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useCoursesStore } from '@/stores/course';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import StudentCoursePage from '../StudentCoursePage.vue';

describe('StudentCoursePage', () => {
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
		wrapper = mount(StudentCoursePage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.student-course');

		expect(container).toBeDefined();
	});

	it('displays courses', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const search = wrapper.find('ui-textfield');
		const subject = wrapper.find('ui-select#subject');
		const instructor = wrapper.find('ui-select#instructor');

		const courseStore = useCoursesStore();
		wrapper.vm.courses.value = await courseStore.fetchCourses({
			full: true,
			isPublished: true,
		});

		await flushPromises();

		expect(search.html()).toContain('Search for a course');
		expect(subject.html()).toContain('Subject');
		expect(instructor.html()).toContain('Instructor');
		// check if course card is displayed
		const card = wrapper.find('.card');
		expect(card).toBeDefined();
	});
});
