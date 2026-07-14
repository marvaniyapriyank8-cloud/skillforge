import api from './axios';
export const recruiterApi = {
  
  getDashboard: () => api.get('/jobs'),
  
  getJobs: () => api.get('/jobs'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  
  getApplicants: () => api.get('/applications'),
  updateApplicantStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};
