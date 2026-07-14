import api from './axios';
export const applicationApi = {
  getApplications: () => api.get('/applications'),
  createApplication: (jobId) => api.post('/applications', { jobId }),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};
