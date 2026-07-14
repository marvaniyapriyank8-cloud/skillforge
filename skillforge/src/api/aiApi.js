import api from './axios';
export const aiApi = {
  
  analyzeResume: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/ai/analyze-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  
  getSkillGap: (targetRole) => api.post('/ai/skill-gap', { targetRole }),
  
  getInterviewQuestions: (role) => api.post('/ai/interview-questions', { role }),
  
  getLearningRoadmap: (targetRole) => api.post('/ai/roadmap', { targetRole }),
};
