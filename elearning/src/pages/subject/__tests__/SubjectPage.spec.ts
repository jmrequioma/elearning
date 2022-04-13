import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useSubjectsStore } from '@/stores/subject';
import type { MockStorage, Subject } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import SubjectPage from '../SubjectPage.vue';

describe('SubjectPage', () => {
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
		wrapper = mount(SubjectPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.subject-page');

		expect(container).toBeDefined();
	});

	it('fetches subjects', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();
		const option = wrapper.find('option');
		const optionValue = parseInt(option.element.value);

		const data = {
			limit: parseInt(option.element.value),
		};

		await subjectStore.fetchSubjects(data);

		expect(subjectStore.fetchedSubjects?.length).toBe(optionValue);
	});

	it('fetches subjects using search key', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();

		const data = {
			keyword: 'Subject',
		};

		await subjectStore.fetchSubjects(data);

		const fetchedSubjects = subjectStore.fetchedSubjects;
		expect(fetchedSubjects?.length).toBeGreaterThan(0);
		if (fetchedSubjects) {
			expect(fetchedSubjects[0].title).toContain('Subject');
		}
	});

	it('fetches subjects with published status', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();

		const data = {
			published: true,
		};

		await subjectStore.fetchSubjects(data);

		const fetchedSubjects = subjectStore.fetchedSubjects;
		expect(fetchedSubjects?.length).toBeGreaterThan(0);
		if (fetchedSubjects) {
			expect(fetchedSubjects[0].isPublished).toBe(true);
			expect(fetchedSubjects[fetchedSubjects.length - 1].isPublished).toBe(
				true
			);
		}
	});

	it('fetches subjects with draft status', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();

		const data = {
			published: false,
		};

		await subjectStore.fetchSubjects(data);

		const fetchedSubjects = subjectStore.fetchedSubjects;
		expect(fetchedSubjects?.length).toBeGreaterThan(0);
		if (fetchedSubjects) {
			expect(fetchedSubjects[0].isPublished).toBe(false);
			expect(fetchedSubjects[fetchedSubjects.length - 1].isPublished).toBe(
				false
			);
		}
	});

	it('publishes draft subjects', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();

		const data = {
			published: false,
		};

		await subjectStore.fetchSubjects(data);

		// all the subjects should be drafts, thus no option to 'Unpublish'
		expect(wrapper.html()).not.toContain('Unpublish');

		const fetchedSubjects = subjectStore.fetchedSubjects;
		expect(fetchedSubjects?.length).toBeGreaterThan(0);
		if (fetchedSubjects) {
			const draftSubject = subjectStore.fetchedSubjects[0];
			const dataToUpdate = {
				id: draftSubject.id,
				title: draftSubject.title,
				isPublished: !draftSubject.isPublished,
			};
			await subjectStore.updateSubject(dataToUpdate);
			await subjectStore.fetchSubjects({ published: true });
			// check the status of the subject that was updated from draft to published
			const updatedSubjectStatus: Subject[] =
				subjectStore.fetchedSubjects.filter((subject) => {
					return subject.id === draftSubject.id;
				});

			expect(updatedSubjectStatus[0].isPublished).toBe(true);
		}
		// now, there will be a subject that is already Published
		expect(wrapper.html()).toContain('Unpublish');
	});

	it('unpublishes published subjects', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();

		const data = {
			published: true,
		};

		await subjectStore.fetchSubjects(data);

		// all the subjects should be published, thus no option to 'Publish'
		const menuItemTexts = wrapper.findAll('#menu-item-text');
		menuItemTexts.forEach((item) => {
			expect(item.html()).not.toContain('Publish');
		});
		const fetchedSubjects = subjectStore.fetchedSubjects;
		expect(fetchedSubjects?.length).toBeGreaterThan(0);
		if (fetchedSubjects) {
			const draftSubject = subjectStore.fetchedSubjects[0];
			const dataToUpdate = {
				id: draftSubject.id,
				title: draftSubject.title,
				isPublished: !draftSubject.isPublished,
			};
			await subjectStore.updateSubject(dataToUpdate);
			await subjectStore.fetchSubjects({ published: false });
			// check the status of the subject that was updated from draft to published
			const updatedSubjectStatus: Subject[] =
				subjectStore.fetchedSubjects.filter((subject) => {
					return subject.id === draftSubject.id;
				});

			expect(updatedSubjectStatus[0].isPublished).toBe(false);
		}
		// now, there will be a subject that is already a Draft
		expect(wrapper.html()).toContain('Publish');
	});
});
