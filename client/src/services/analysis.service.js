/**
 * PrepPilot - Analysis Service
 * Handles resume uploads, fetching past analyses, and deleting records.
 */

import api from './api';

export const uploadResumeAnalysis = async (file, jobTitle, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobTitle', jobTitle);
  formData.append('jobDescription', jobDescription);

  const response = await api.post('/analysis/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getAllAnalyses = async () => {
  const response = await api.get('/analysis');
  return response.data;
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

export const deleteAnalysisById = async (id) => {
  const response = await api.delete(`/analysis/${id}`);
  return response.data;
};
