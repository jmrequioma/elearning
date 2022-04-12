import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';
import type { Subject, SubjectBody } from '@/types/index';

export const useSubjectsStore = defineStore({
	id: 'subject',
	state: () => ({
		subjects: undefined as Subject[] | undefined,
		totalCount: 0,
		page: 1,
	}),
	getters: {
		fetchedSubjects: (state) => state.subjects,
		fetchedTotalCount: (state) => state.totalCount,
		fetchedPage: (state) => state.page,
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
					this.page = res.data.page;
				}
				return res;
			} catch (error) {
				console.error('fetching subjects failed', error);
			}
		},

		async updateSubject(data: SubjectBody) {
			try {
				await apiClient.patch(`/subjects/${data.id}`, data);
			} catch (error) {
				console.error('updating subject failed ', error);
			}
		},
	},
});
