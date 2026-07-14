import api from './axios';
export const uploadApi = {
  uploadResume: (file) => {
    const fd = new FormData();
    fd.append('file', file);   
    return api.post('/upload/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadPhoto: (file) => {
    const fd = new FormData();
    fd.append('file', file);  
    return api.post('/upload/profile-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadCertificate: (file) => {
    const fd = new FormData();
    fd.append('file', file);   
    return api.post('/upload/certificate', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
