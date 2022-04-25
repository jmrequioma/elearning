import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useSubjectsStore } from '@/stores/subject';
import { useCoursesStore } from '@/stores/course';
import { useModulesStore } from '@/stores/module';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import SubjectModulesPage from '../SubjectModulesPage.vue';
import faker from '@faker-js/faker';

describe('SubjectModulesPage', () => {
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
		wrapper = mount(SubjectModulesPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		router.push({
			name: 'edit-subject-add-module',
			params: { subjectId: 1, courseId: 1 },
		});
		const container = wrapper.find('.subject-details');
		const textField = wrapper.find('ui-textfield');

		expect(container).toBeDefined();
		expect(textField).toBeDefined();
	});

	it('fetches the specific subject, course, and module', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();
		const courseStore = useCoursesStore();
		const moduleStore = useModulesStore();
		router.push({
			name: 'edit-subject-edit-module',
			params: { subjectId: 1, courseId: 1, moduleId: 1 },
		});

		// After this line, router is ready
		await router.isReady();

		const data = {
			id: 1,
		};

		const subject = await subjectStore.fetchSubjectDetails(data);
		const course = await courseStore.fetchCourseDetails(data);
		const module = await moduleStore.fetchModuleDetails(data);

		const title = wrapper.find('h6');
		expect(title.html()).toContain(module.data.title);
		expect(subject.data.id).toBe(1);
		expect(course.data.id).toBe(1);
		expect(module.data.id).toBe(1);
		expect(course.data.subjectId).toBe(subject.data.id);
		expect(module.data.courseId).toBe(course.data.id);
	});
});
