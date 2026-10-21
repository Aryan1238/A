/**
 * PrepPilot - Mock Interview Service
 * Communicates with backend for session creation, progressive answering, and final reports.
 */

import api from './api';

export const startInterviewSession = async (role, difficulty) => {
  const response = await api.post('/interview/start', { role, difficulty });
  return response.data;
};

export const submitInterviewAnswer = async (interviewId, userAnswer) => {
  const response = await api.post(`/interview/${interviewId}/answer`, { userAnswer });
  return response.data;
};

export const getAllInterviews = async () => {
  const response = await api.get('/interview');
  return response.data;
};

export const getInterviewReport = async (id) => {
  const response = await api.get(`/interview/${id}`);
  return response.data;
};

export const deleteInterviewById = async (id) => {
  const response = await api.delete(`/interview/${id}`);
  return response.data;
};
