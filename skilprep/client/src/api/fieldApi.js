import api from './axiosInstance';

export const getFields = () => api.get('/fields').then((r) => r.data);
export const getFieldBySlug = (slug) => api.get(`/fields/${slug}`).then((r) => r.data);
