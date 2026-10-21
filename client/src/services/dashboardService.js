import api from './api.js';

export const getAnalytics = async (days = 7) => {
  const { data } = await api.get('/dashboard/analytics', { params: { days } });
  return data;
};