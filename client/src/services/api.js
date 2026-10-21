/**
 * PrepPilot - Centralized Axios HTTP Client
 * Automatically attaches JWT Bearer token, normalizes backend API base URLs,
 * and provides clear diagnostic error messaging for static host mismatches.
 */

import axios from 'axios';

/**
 * Resolves and normalizes the backend API base URL.
 * Automatically handles:
 * - Trailing slashes (https://host/api/ -> https://host/api)
 * - Missing /api subpath (https://host -> https://host/api)
 * - Localhost development fallback (/api with Vite dev proxy)
 */
export const getBaseURL = () => {
  const raw = import.meta.env.VITE_API_URL;
  if (raw && typeof raw === 'string' && raw.trim()) {
    const trimmed = raw.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // Running on static hosting (like GitHub Pages) without VITE_API_URL configured
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    console.warn(
      '⚠️ [PrepPilot Config]: VITE_API_URL is not set for production. ' +
      'Requests to relative /api will hit GitHub Pages static CDN and fail with HTTP 405. ' +
      'Configure VITE_API_URL in GitHub Actions Repository Variables (e.g. https://your-backend.onrender.com/api).'
    );
  }

  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
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

// Response interceptor: handle session expiry (401) and static host 405 errors
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

    // Clarify HTTP 405 Method Not Allowed caused by static host routing
    if (error.response && error.response.status === 405) {
      error.message =
        'Backend API endpoint not reachable (HTTP 405 Method Not Allowed). ' +
        'The request was sent to the GitHub Pages static host instead of your deployed Render backend. ' +
        'Please set the VITE_API_URL repository variable in GitHub (Settings > Secrets and variables > Actions > Variables) to your Render backend URL (e.g. https://your-backend.onrender.com/api) and re-run the deployment workflow.';
    }

    return Promise.reject(error);
  }
);

export default api;
