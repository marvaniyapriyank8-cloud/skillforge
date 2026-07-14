import api from './axios';
export const projectApi = {
  getProjects: () => api.get('/projects'),
  addProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};
