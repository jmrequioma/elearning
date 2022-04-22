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

		async fetchMainCourses(data: object) {
			// function to fetch courses and persist in the store
			try {
				const res = await this.fetchCourses(data);
				if (res) {
					this.courses = res.data.data;
					this.totalCount = res.data.totalCount;
					this.page = res.data.page;
				}
				return res;
			} catch (error) {
				console.error('fetching main courses failed', error);
			}
		},
	},
});
