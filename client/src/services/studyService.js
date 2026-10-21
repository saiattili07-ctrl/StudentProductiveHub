import api from "./api.js";

export const getSessions = async (params = {}) => {
  const { data } = await api.get("/study", { params });
  return data;
};

export const getSession = async (id) => {
  const { data } = await api.get(`/study/${id}`);
  return data.session;
};

export const createSession = async (payload) => {
  const { data } = await api.post("/study", payload);
  return data.session;
};

export const updateSession = async (id, payload) => {
  const { data } = await api.put(`/study/${id}`, payload);
  return data.session;
};

export const deleteSession = async (id) => {
  const { data } = await api.delete(`/study/${id}`);
  return data;
};

export const completeSession = async (id) => {
  const { data } = await api.patch(`/study/${id}/complete`);
  return data.session;
};
