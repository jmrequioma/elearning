import apiClient from '@/lib/axios-api';
import { setAccessToken } from '@/utils/auth';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
	id: 'auth',
	state: () => ({
		user: null,
		accessToken: localStorage.getItem('accessToken'),
	}),
	getters: {
		loggedInUser: (state) => state.user,
		isAuthenticated: (state) => !!state.accessToken,
	},
	actions: {
		async login(data: LoginBody) {
			try {
				const res = await apiClient.post('/user', {
					email: data.email,
					password: data.password,
				});
				this.user = res.data;
				if (res.data) {
					// set token in local storage
					setAccessToken(res.data.accessToken);
				}
				return res;
			} catch (error) {
				console.error('logging in user failed', error);
			}
		},

		async signup(data: SignUpBody) {
			try {
				const res = await apiClient.post('/signup', {
					email: data.email,
					password: data.password,
					verifyPassword: data.verifyPassword,
					role: data.role,
					firstName: data.firstName,
					lastName: data.lastName,
				});
				this.user = res.data;
				if (!res.data.errorMessage) {
					// send verification email
				}
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
				console.error('requesting password reset failed.');
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
	},
});
