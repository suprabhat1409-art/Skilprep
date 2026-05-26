import api from './axiosInstance';

export const getCommunities = () => api.get('/communities').then((r) => r.data);
export const getCommunity = (slug) => api.get(`/communities/${slug}`).then((r) => r.data);
export const createCommunity = (data) => api.post('/communities', data).then((r) => r.data);
export const joinCommunity = (communityId) => api.post(`/communities/${communityId}/join`).then((r) => r.data);
export const createCommunityTest = (communityId, data) => api.post(`/communities/${communityId}/tests`, data).then((r) => r.data);
export const submitCommunityTest = (communityId, testId, data) =>
  api.post(`/communities/${communityId}/tests/${testId}/submissions`, data).then((r) => r.data);
export const reviewCommunitySubmission = (communityId, testId, submissionId, data) =>
  api.patch(`/communities/${communityId}/tests/${testId}/submissions/${submissionId}/review`, data).then((r) => r.data);
export const createCommunityResource = (communityId, data) => api.post(`/communities/${communityId}/resources`, data).then((r) => r.data);
export const uploadCommunityResource = (communityId, formData) =>
  api.post(`/communities/${communityId}/resources/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);

export const generateInvite = (communityId, data) => api.post(`/communities/${communityId}/invites`, data).then((r) => r.data);
export const listInvites = (communityId) => api.get(`/communities/${communityId}/invites`).then((r) => r.data);
export const joinWithCode = (code) => api.post(`/communities/join-code`, { code }).then((r) => r.data);