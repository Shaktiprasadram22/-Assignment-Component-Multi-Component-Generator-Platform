import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-domain.com/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth API calls
export const signup = async (email, password) => {
  const response = await api.post("/auth/signup", { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// AI API calls
export const generateComponent = async (prompt) => {
  const response = await api.post("/ai/generate", { prompt });
  return response.data;
};

// Sessions API calls
export const getSessions = async () => {
  const response = await api.get("/sessions");
  return response.data;
};

export const createSession = async (title) => {
  const response = await api.post("/sessions", { title });
  return response.data;
};

export const getSession = async (id) => {
  const response = await api.get(`/sessions/${id}`);
  return response.data;
};

export const updateSession = async (id, data) => {
  const response = await api.put(`/sessions/${id}`, data);
  return response.data;
};

export default api;
