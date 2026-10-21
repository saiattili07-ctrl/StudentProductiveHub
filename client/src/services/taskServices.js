import api from "./api.js";

export const getTasks = async (params = {}) => {
  const { data } = await api.get("/tasks", { params });
  return data;
};

export const getTaskSubjects = async () => {
  const { data } = await api.get("/tasks/subjects");
  return data.subjects;
};

export const getTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data.task;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data.task;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.task;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

export const completeTask = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/complete`);
  return data.task;
};

export const reopenTask = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/reopen`);
  return data.task;
};
