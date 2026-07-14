import api from './axios';
export const profileApi = {
  getProfile: () => api.get('/profile'),
  createProfile: (data) => api.post('/profile', data),
  updateProfile: (data) => api.put('/profile', data),
};
