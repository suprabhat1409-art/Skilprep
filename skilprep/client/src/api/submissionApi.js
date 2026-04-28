import api from './axiosInstance';

export const submitSolution = (data) => api.post('/submissions', data).then((r) => r.data);
export const getSubmission = (id) => api.get(`/submissions/${id}`).then((r) => r.data);
export const runCode = (data) => api.post('/submissions/run', data).then((r) => r.data);
export const getMySubmissions = (problemId) => api.get(`/submissions/problem/${problemId}`).then((r) => r.data);
