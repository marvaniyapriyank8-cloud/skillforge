import api from './axios';
export const adminApi = {
  getDashboard: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  blockUser: (id) => api.put(`/admin/block-user/${id}`),
  deleteUser: (id) => api.delete(`/admin/delete-user/${id}`),
  getAllJobs: () => api.get('/admin/jobs'),
  getAllApplications: () => api.get('/admin/applications'),
};
