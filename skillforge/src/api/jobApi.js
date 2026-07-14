import api from './axios';
export const jobApi = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  applyJob: (id) => api.post(`/jobs/apply/${id}`),
};
