// src/ApiInterceptor.jsx
import axios from 'axios';

// Axios instance create karo
const api = axios.create({
  baseURL: `${import.meta.env.VITE_APIURL}`, // 🔁 Apne .NET Core API ka base URL daalo
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request Interceptor — token add karega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ya context, Redux se
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ⚠️ Response Interceptor — error handle karega
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired ya unauthorized
      console.warn('Unauthorized! Redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (status === 500) {
      console.log('Server error! Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
