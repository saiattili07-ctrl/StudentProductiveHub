import api from './api.js';

export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data.user;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put('/profile', payload);
  return data.user;
};

export const changePassword = async (payload) => {
  const { data } = await api.put('/profile/password', payload);
  return data;
};