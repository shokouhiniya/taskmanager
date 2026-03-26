import axios from 'axios';

// آدرس API از environment variable یا fallback به همون origin با /api
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor برای اضافه کردن token به هر request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('app_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای مدیریت خطاهای 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('app_token');
      localStorage.removeItem('app_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
