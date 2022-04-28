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

		async fetchMainModules(data: object) {
			// function to fetch modules and persist in the store
			try {
				const res = await this.fetchModules(data);
				if (res) {
					this.modules = res.data.data;
					this.totalCount = res.data.totalCount;
					this.page = res.data.page;
				}
				return res;
			} catch (error) {
				console.error('fetching main modules failed', error);
			}
		},

		fetchModuleDetails(data: DataBody) {
			return apiClient.get(`/modules/${data.id}`);
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
