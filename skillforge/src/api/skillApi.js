import api from './axios';
export const skillApi = {
  getSkills: () => api.get('/skills'),
  addSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};
