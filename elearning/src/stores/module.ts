import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';
import type { Module, DataBody } from '@/types/index';

export const useModulesStore = defineStore({
	id: 'module',
	state: () => ({
		modules: undefined as Module[] | undefined,
		totalCount: 0,
		page: 1,
	}),
	getters: {
		fetchedModules: (state) => state.modules,
		fetchedTotalCount: (state) => state.totalCount,
		fetchedPage: (state) => state.page,
	},
	actions: {
		fetchModules(data: object) {
			return apiClient.get('/modules', {
				params: data,
			});
		},

		updateModule(data: DataBody) {
			return apiClient.patch(`/modules/${data.id}`, data);
		},

		deleteModule(data: DataBody) {
			return apiClient.delete(`/modules/${data.id}`);
		},

		createModule(data: DataBody) {
			return apiClient.post('/modules/', data);
		},
	},
});
