/**
 * PrepPilot - Dashboard Service
 * Fetches overview metrics and time-series scores for Recharts.
 */

import api from './api';

export const getDashboardMetrics = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
