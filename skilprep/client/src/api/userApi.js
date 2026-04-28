import api from './axiosInstance';

export const getUserProfile = (username) => api.get(`/users/${username}`).then((r) => r.data);
export const getMe = () => api.get('/users/me').then((r) => r.data);