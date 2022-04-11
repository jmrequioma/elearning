import apiClient from '@/lib/axios-api';

export function setAccessToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export function getAccessToken() {
	return localStorage.getItem('accessToken');
}

export function setAuthHeaderToken(token: string) {
	apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
