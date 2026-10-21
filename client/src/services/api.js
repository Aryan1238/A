/**
 * PrepPilot - Centralized Axios HTTP Client
 * Automatically attaches JWT Bearer token and standardizes error responses.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 45000 // 45s timeout for AI generation
});

// Request interceptor: attach token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('preppilot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle session expiry (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on login/register, clear token
      const currentUrl = window.location.href;
      if (!currentUrl.includes('/login') && !currentUrl.includes('/register')) {
        localStorage.removeItem('preppilot_token');
        localStorage.removeItem('preppilot_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
