import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import { setActivePinia, createPinia } from 'pinia';
import { useSubjectsStore } from '@/stores/subject';
import type { MockStorage } from '@/types/index';
import { getAccessToken, setAccessToken } from '@/utils/auth';
import apiClient from '@/lib/axios-api';
import { users } from '@/mocks/mockedData';

import SubjectDetailsPage from '../SubjectDetailsPage.vue';
import faker from '@faker-js/faker';

describe('SubjectDetailsPage', () => {
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
		wrapper = mount(SubjectDetailsPage, {
			global: {
				plugins: [router],
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		router.push({ name: 'edit-subject', params: { id: 1 } });
		const container = wrapper.find('.subject-details');
		const textField = wrapper.find('ui-textfield');

		expect(container).toBeDefined();
		expect(textField).toBeDefined();
	});

	it('fetches the specific subject', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();
		router.push({ name: 'edit-subject', params: { id: 1 } });

		// After this line, router is ready
		await router.isReady();

		const data = {
			id: 1,
		};

		const subject = await subjectStore.fetchSubjectDetails(data);

		expect(subject.data.id).toBe(1);
	});

	it('adds a new subject', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();

		const data = {
			title: `${faker.random.word} Test`,
			isPublished: false,
		};

		await subjectStore.fetchSubjects({});

		const initialLength = subjectStore.totalCount || 0;
		await subjectStore.createSubject(data);
		await subjectStore.fetchSubjects({});

		const finalLength = subjectStore.totalCount;

		expect(finalLength).toBe(initialLength + 1);
	});

	it('deletes a subject', async () => {
		const accessToken = users[0].accessToken;
		setAccessToken(accessToken);

		apiClient.defaults.headers.common[
			'Authorization'
		] = `Bearer ${getAccessToken()}`;

		const subjectStore = useSubjectsStore();

		await subjectStore.fetchSubjects({});

		const subject = subjectStore.fetchedSubjects
			? subjectStore.fetchedSubjects[0]
			: null;
		const data = {
			id: subject?.id,
		};

		const initialLength = subjectStore.totalCount || 0;
		await subjectStore.deleteSubject(data);
		await subjectStore.fetchSubjects({});

		const finalLength = subjectStore.totalCount;

		expect(finalLength).toBe(initialLength - 1);
	});
});
