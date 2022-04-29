import axios from 'axios';
import { API_URL } from '@/constants';
import { getAccessToken } from '@/utils/auth';

const apiClient = axios.create({
	baseURL: API_URL,
	timeout: 8000,
});

const accessToken = getAccessToken();
if (accessToken) {
	apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export default apiClient;
