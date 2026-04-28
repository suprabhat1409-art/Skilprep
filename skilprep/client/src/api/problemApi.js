import api from './axiosInstance';

export const getProblems = (params) => api.get('/problems', { params }).then((r) => r.data);
export const getProblemBySlug = (slug) => api.get(`/problems/${slug}`).then((r) => r.data);
