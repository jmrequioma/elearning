import apiClient from '@/lib/axios-api';
import { defineStore } from 'pinia';
import type { User, DataBody } from '@/types/index';

export const useUsersStore = defineStore({
	id: 'user',
	state: () => ({
		users: undefined as User[] | undefined,
		totalCount: 0,
		page: 1,
	}),
	getters: {
		fetchedUsers: (state) => state.users,
		fetchedTotalCount: (state) => state.totalCount,
		fetchedPage: (state) => state.page,
	},
	actions: {
		async fetchUsers(data: object) {
			try {
				const res = await apiClient.get('/users', {
					params: data,
				});
				if (res) {
					this.users = res.data.data;
					this.totalCount = res.data.totalCount;
					this.page = res.data.page;
				}
				return res;
			} catch (error) {
				console.error('fetching users failed', error);
			}
		},

		fetchUserDetails(data: DataBody) {
			return apiClient.get(`/users/${data.id}`);
		},
	},
});
