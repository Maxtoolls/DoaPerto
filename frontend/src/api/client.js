import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  // debug: show when requests are sent and whether a token is present
  // (remove or lower verbosity in production)
  console.debug('[apiClient] Request:', config.method, config.url, 'tokenPresent=', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // log server error body to console for easier debugging
    console.debug('[apiClient] Response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
