import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useCoursesStore } from '@/stores/course';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import CourseDetailsPage from '../CourseDetailsPage.vue';
import faker from '@faker-js/faker';

describe('CourseDetailsPage', () => {
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
		wrapper = mount(CourseDetailsPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		router.push({ name: 'edit-course', params: { id: 1 } });
		const container = wrapper.find('.course-details');
		const textField = wrapper.find('ui-textfield');

		expect(container).toBeDefined();
		expect(textField).toBeDefined();
	});

	it('fetches the specific course', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const courseStore = useCoursesStore();
		router.push({ name: 'edit-course', params: { id: 1 } });

		// After this line, router is ready
		await router.isReady();

		const data = {
			id: 1,
		};

		const course = await courseStore.fetchCourseDetails(data);

		expect(course.data.id).toBe(1);
	});

	it('adds a new course', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const courseStore = useCoursesStore();

		const data = {
			title: `${faker.random.word} Test`,
			isPublished: false,
		};

		await courseStore.fetchMainCourses({});

		const initialLength = courseStore.totalCount || 0;
		await courseStore.createCourse(data);
		await courseStore.fetchMainCourses({});

		const finalLength = courseStore.totalCount;

		expect(finalLength).toBe(initialLength + 1);
	}, 10000);

	it('deletes a course', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const courseStore = useCoursesStore();

		await courseStore.fetchMainCourses({});

		const subject = courseStore.fetchedCourses
			? courseStore.fetchedCourses[0]
			: null;
		const data = {
			id: subject?.id,
		};

		const initialLength = courseStore.totalCount || 0;
		await courseStore.deleteCourse(data);
		await courseStore.fetchMainCourses({});

		const finalLength = courseStore.totalCount;

		expect(finalLength).toBe(initialLength - 1);
	}, 10000);
});
