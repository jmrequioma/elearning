import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';
import type { Course, DataBody } from '@/types/index';

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
		fetchCourses(data: object) {
			return apiClient.get('/courses', {
				params: data,
			});
		},

		updateCourse(data: DataBody) {
			return apiClient.patch(`/courses/${data.id}`, data);
		},

		deleteCourse(data: DataBody) {
			return apiClient.delete(`/courses/${data.id}`);
		},

		createCourse(data: DataBody) {
			return apiClient.post('/courses/', data);
		},

		fetchCourseDetails(data: DataBody) {
			return apiClient.get(`/courses/${data.id}`);
		},
	},
});
