import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';
import type { DataBody } from '@/types/index';

export const useContentsStore = defineStore({
	id: 'content',
	state: () => ({}),
	getters: {},
	actions: {
		createContent(data: DataBody) {
			return apiClient.post('/contents/', data);
		},
	},
});
