import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';
import type { Course } from '@/types/index';

export const useCoursesStore = defineStore({
	id: 'course',
	state: () => ({
		courses: undefined as Course[] | undefined,
		totalCount: 0,
		page: 1,
	}),
	getters: {
		fetchedCourses: (state) => state.courses,
		fetchedTotalCount: (state) => state.totalCount,
		fetchedPage: (state) => state.page,
	},
	actions: {
		async fetchCourses(data: object) {
			return await apiClient.get('/courses', {
				params: data,
			});
		},
	},
});
