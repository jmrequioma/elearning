import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';

export const useSubjectsStore = defineStore({
	id: 'subject',
	state: () => ({
		subjects: undefined as Subject[] | undefined,
		totalCount: 0,
	}),
	getters: {
		fetchedSubjects: (state) => state.subjects,
		fetchedTotalCount: (state) => state.totalCount,
	},
	actions: {
		async fetchSubjects(data: object) {
			try {
				const res = await apiClient.get('/subjects', {
					params: data,
				});
				if (res) {
					this.subjects = res.data.data;
					this.totalCount = res.data.totalCount;
				}
				return res;
			} catch (error) {
				console.error('fetching subjects failed', error);
			}
		},
	},
});
