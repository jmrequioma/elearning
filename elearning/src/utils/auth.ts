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

export function setAuthToken(accessToken: string) {
	setAccessToken(accessToken);
	setAuthHeaderToken(accessToken);
}

export function removeAccessToken() {
	return localStorage.removeItem('accessToken');
}

export function removeAuthHeaderToken() {
	apiClient.defaults.headers.common['Authorization'] = '';
	delete apiClient.defaults.headers.common['Authorization'];
}

export function removeAuthToken() {
	removeAccessToken();
	removeAuthHeaderToken();
}
