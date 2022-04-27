import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';
import type { DataBody } from '@/types/index';

export const useEnrollmentsStore = defineStore({
	id: 'enrollment',
	state: () => ({}),
	getters: {},
	actions: {
		fetchEnrollments(data: object) {
			return apiClient.get('/enrollments', {
				params: data,
			});
		},

		createEnrollment(data: DataBody) {
			return apiClient.post('/enrollments/', data);
		},
	},
});
