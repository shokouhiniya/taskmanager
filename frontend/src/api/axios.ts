import axios from 'axios';

// تشخیص محیط Telegram Mini App
const isTelegramWebApp = window.Telegram?.WebApp?.platform !== 'unknown';

// در Telegram از proxy استفاده می‌کنیم (/api -> localhost:3000)
const api = axios.create({
  baseURL: isTelegramWebApp 
    ? '/api' 
    : 'http://localhost:3000',
});

console.log('🌐 API Base URL:', api.defaults.baseURL);
console.log('📱 Is Telegram WebApp:', isTelegramWebApp);

// Interceptor برای اضافه کردن token به هر request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
