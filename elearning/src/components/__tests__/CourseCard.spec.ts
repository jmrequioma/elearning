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
import faker from '@faker-js/faker';

import CourseCard from '../CourseCard.vue';

describe('CourseCard', () => {
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
		wrapper = mount(CourseCard, {
			global: {
				plugins: [router],
			},
			props: {
				course: {
					id: 1,
					title: faker.lorem.words(),
					description: faker.lorem.words(),
					duration: faker.datatype.number(100),
					icon: faker.image.imageUrl(),
					isPublished: true,
					createdAt: faker.date.recent(),
					updatedAt: faker.date.recent(),
					subjectId: 1,
					authorId: 1,
				},

				action: 'enroll',
			},
		});
		mockStorage = {};
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.card');

		expect(container).toBeDefined();
	});

	it('emits an event when button is clicked', async () => {
		const button = wrapper.find('ui-button');

		button.trigger('click');
		const emitted = wrapper.emitted('handleAction');
		expect(wrapper.emitted()).toHaveProperty('handleAction');
		expect(emitted).toHaveLength(1);
		expect(emitted ? emitted[0] : '').toEqual([
			{
				courseId: 1,
				enrollmentId: -1,
				action: 'enroll',
			},
		]);
	});
});
