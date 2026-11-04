import api from './axios';

export const studentApi = {
  getFeedbacks: () => api.get('/feedback'),
};