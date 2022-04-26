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
import faker from '@faker-js/faker';

import ModulePage from '../ModulePage.vue';

describe('ModulePage', () => {
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
		wrapper = mount(ModulePage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.module-page');

		expect(container).toBeDefined();
	});

	it('fetches modules', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const moduleStore = useModulesStore();
		const option = wrapper.find('option');
		const optionValue = parseInt(option.element.value);

		const data = {
			limit: parseInt(option.element.value),
		};

		await moduleStore.fetchMainModules(data);

		expect(moduleStore.fetchedModules?.length).toBe(optionValue);
	});

	it('fetches modules using search key', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const moduleStore = useModulesStore();

		const data = {
			keyword: 'Module',
		};

		await moduleStore.fetchMainModules(data);

		const fetchedModules = moduleStore.fetchedModules;
		expect(fetchedModules?.length).toBeGreaterThan(0);
		if (fetchedModules) {
			expect(fetchedModules[0].title).toContain('Module');
		}
	});

	// it('fetches courses with published status', async () => {
	// 	const accessToken = users[0].accessToken;
	// 	setAccessToken(accessToken);

	// 	apiClient.defaults.headers.common[
	// 		'Authorization'
	// 	] = `Bearer ${getAccessToken()}`;

	// 	const courseStore = useCoursesStore();

	// 	const data = {
	// 		published: true,
	// 	};

	// 	await courseStore.fetchMainCourses(data);

	// 	const fetchedCourses = courseStore.fetchedCourses;
	// 	expect(fetchedCourses?.length).toBeGreaterThan(0);
	// 	if (fetchedCourses) {
	// 		expect(fetchedCourses[0].isPublished).toBe(true);
	// 		expect(fetchedCourses[fetchedCourses.length - 1].isPublished).toBe(true);
	// 	}
	// });

	// it('fetches courses with draft status', async () => {
	// 	const accessToken = users[0].accessToken;
	// 	setAccessToken(accessToken);

	// 	apiClient.defaults.headers.common[
	// 		'Authorization'
	// 	] = `Bearer ${getAccessToken()}`;

	// 	const courseStore = useCoursesStore();

	// 	const data = {
	// 		published: false,
	// 	};

	// 	// create a draft course
	// 	await courseStore.createCourse({
	// 		title: `${faker.random.word()} Test Course`,
	// 		subjectId: 1,
	// 	});

	// 	await courseStore.fetchMainCourses(data);

	// 	const fetchedCourses = courseStore.fetchedCourses;
	// 	expect(fetchedCourses?.length).toBeGreaterThan(0);
	// 	if (fetchedCourses) {
	// 		expect(fetchedCourses[0].isPublished).toBe(false);
	// 		expect(fetchedCourses[fetchedCourses.length - 1].isPublished).toBe(false);
	// 	}
	// });

	// it('publishes draft courses', async () => {
	// 	const accessToken = users[0].accessToken;
	// 	setAccessToken(accessToken);

	// 	apiClient.defaults.headers.common[
	// 		'Authorization'
	// 	] = `Bearer ${getAccessToken()}`;

	// 	const courseStore = useCoursesStore();

	// 	const data = {
	// 		published: false,
	// 	};

	// 	// create a draft course
	// 	await courseStore.createCourse({
	// 		title: `${faker.random.word()} Test Course`,
	// 		subjectId: 1,
	// 	});

	// 	await courseStore.fetchMainCourses(data);
	// 	// all the courses should be drafts, thus no option to 'Unpublish'
	// 	expect(wrapper.html()).not.toContain('Unpublish');

	// 	const fetchedCourses = courseStore.fetchedCourses;
	// 	expect(fetchedCourses?.length).toBeGreaterThan(0);
	// 	if (fetchedCourses) {
	// 		const draftCourse = courseStore.fetchedCourses[0];
	// 		const dataToUpdate = {
	// 			id: draftCourse.id,
	// 			title: draftCourse.title,
	// 			isPublished: true,
	// 		};
	// 		await courseStore.updateCourse(dataToUpdate);
	// 		const res = await courseStore.fetchCourseDetails({ id: draftCourse.id });
	// 		// check the status of the course that was updated from draft to published

	// 		expect(res.data.id).toBe(draftCourse.id);
	// 		expect(res.data.isPublished).toBe(true);
	// 	}
	// });

	// it('unpublishes published courses', async () => {
	// 	const accessToken = users[0].accessToken;
	// 	setAccessToken(accessToken);

	// 	apiClient.defaults.headers.common[
	// 		'Authorization'
	// 	] = `Bearer ${getAccessToken()}`;

	// 	const courseStore = useCoursesStore();

	// 	const data = {
	// 		published: true,
	// 	};

	// 	await courseStore.fetchMainCourses(data);

	// 	// all the courses should be published, thus no option to 'Publish'
	// 	const menuItemTexts = wrapper.findAll('#menu-item-text');
	// 	menuItemTexts.forEach((item) => {
	// 		expect(item.html()).not.toContain('Publish');
	// 	});
	// 	const fetchedCourses = courseStore.fetchedCourses;
	// 	expect(fetchedCourses?.length).toBeGreaterThan(0);
	// 	if (fetchedCourses) {
	// 		const draftCourse = courseStore.fetchedCourses[0];
	// 		const dataToUpdate = {
	// 			id: draftCourse.id,
	// 			title: draftCourse.title,
	// 			isPublished: !draftCourse.isPublished,
	// 		};
	// 		await courseStore.updateCourse(dataToUpdate);
	// 		const res = await courseStore.fetchCourseDetails({ id: draftCourse.id });
	// 		// check the status of the course that was updated from draft to published

	// 		expect(res.data.isPublished).toBe(false);
	// 	}
	// 	// now, there will be a course that is already a Draft
	// 	expect(wrapper.html()).toContain('Publish');
	// });
});
