import api from './axiosInstance';

export const getAdminSummary = () => api.get('/admin/summary').then((r) => r.data);