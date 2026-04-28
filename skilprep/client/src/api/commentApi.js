import api from './axiosInstance';

export const getProblemComments = (problemId) => api.get(`/comments/problem/${problemId}`).then((r) => r.data);
export const createProblemComment = (problemId, data) => api.post(`/comments/problem/${problemId}`, data).then((r) => r.data);
export const voteComment = (commentId, direction) => api.put(`/comments/${commentId}/vote`, { direction }).then((r) => r.data);