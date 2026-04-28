import api from './axiosInstance';

export const getLeaderboard = (field) => api.get('/leaderboard', { params: field ? { field } : {} }).then((r) => r.data);