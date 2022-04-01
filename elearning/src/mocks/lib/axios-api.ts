import axios from 'axios';

const getAPI = axios.create({
  baseURL: import.meta.env.VITE_APP_ROOT_API,
  timeout: 5000,
});

export default getAPI;
