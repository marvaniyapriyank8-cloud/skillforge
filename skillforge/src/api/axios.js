import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sf_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Session is invalid/expired: drop it everywhere so the app can't loop back to a dashboard.
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf-auth');
      const onAuthPage = ['/login', '/register'].includes(window.location.pathname);
      if (!onAuthPage) window.location.href = '/login';
    } else if (status >= 500) {
      toast.error('Server error. Please try again.', { id: 'server-error' });
    } else if (!error.response) {
      toast.error('Cannot reach the server. Check your connection and try again.', { id: 'network-error' });
    }
    return Promise.reject(error);
  }
);

export default api;
