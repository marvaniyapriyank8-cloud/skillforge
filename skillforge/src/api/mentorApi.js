import api from './axios';
export const mentorApi = {
  getDashboard: () => api.get('/feedback'),   // no dashboard endpoint, reuse feedbacks
  getFeedbacks: () => api.get('/feedback'),
  createFeedback: (data) => api.post('/feedback', data),
  updateFeedback: (id, data) => api.put(`/feedback/${id}`, data),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
};
