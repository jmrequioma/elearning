import axios from 'axios';
import { getAccessToken } from '@/utils/auth';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_APP_ROOT_API,
	timeout: 5000,
});

const accessToken = getAccessToken();
if (accessToken) {
	apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export default apiClient;
