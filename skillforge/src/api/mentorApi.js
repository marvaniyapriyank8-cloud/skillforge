import api from './axios';

export const mentorApi = {
  getDashboard: () => api.get('/feedback'),
  getFeedbacks: () => api.get('/feedback'),
  getStudents: () => api.get('/mentor/students'),
  getStudentProfile: (id) => api.get(`/mentor/students/${id}`),
  createFeedback: (data) => api.post('/feedback', data),
  updateFeedback: (id, data) => api.put(`/feedback/${id}`, data),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
};