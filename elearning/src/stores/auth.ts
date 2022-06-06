import apiClient from '@/lib/axios-api';
import { setAuthToken, removeAuthToken } from '@/utils/auth';
import type { LoginBody, SignUpBody, ChangePasswordBody, User } from '@/types';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
	id: 'auth',
	state: () => ({
		user: undefined as User | undefined,
		accessToken: localStorage.getItem('accessToken'),
	}),
	getters: {
		loggedInUser: (state) => state.user,
		isAuthenticated: (state) => !!state.accessToken,
	},
	actions: {
		async login(data: LoginBody) {
			try {
				const res = await apiClient.post('/user', data);
				this.user = res.data;
				if (res.data) {
					// set token in local storage
					setAuthToken(res.data.accessToken);
					this.accessToken = res.data.accessToken;
				}
				return res;
			} catch (error) {
				console.error('logging in user failed', error);
			}
		},

		async signup(data: SignUpBody) {
			try {
				const res = await apiClient.post('/signup', data);
				// at this point, the backend sends a verification email
				this.user = res.data;
				return res;
			} catch (error) {
				console.error('signing up user failed', error);
			}
		},

		async requestPasswordReset(data: object) {
			try {
				const res = await apiClient.get('/password', {
					params: data,
				});
				return res;
			} catch (error) {
				console.error('requesting password reset failed.', error);
			}
		},

		async changePassword(data: ChangePasswordBody) {
			try {
				const res = await apiClient.post('/password', data);
				return res;
			} catch (error) {
				console.error('changing password failed. ', error);
			}
		},

		async getLoggedInUserInfo() {
			try {
				const res = await apiClient.get('/me', {
					params: {
						accessToken: this.accessToken,
					},
				});

				this.user = res.data;
			} catch (error) {
				console.error('getting logged in user info failed', error);
			}
		},

		logout() {
			removeAuthToken();
			this.user = undefined;
			this.accessToken = '';
		},
	},
});
