import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://ai-component-generator-backend-6yc0.onrender.com" // Your actual deployed backend URL
    : "http://localhost:5000";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - REMOVED automatic redirect
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't automatically redirect on 401 - let the calling component handle it
    // The _app.js already handles auth redirects properly
    return Promise.reject(error);
  }
);

// Auth API calls
export const signup = async (email, password) => {
  const response = await api.post("/api/auth/signup", { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

// AI API calls
export const generateComponent = async (prompt) => {
  const response = await api.post("/api/ai/generate", { prompt });
  return response.data;
};

// Sessions API calls
export const getSessions = async () => {
  const response = await api.get("/api/sessions");
  return response.data;
};

export const createSession = async (title) => {
  const response = await api.post("/api/sessions", { title });
  return response.data;
};

export const getSession = async (id) => {
  const response = await api.get(`/api/sessions/${id}`);
  return response.data;
};

export const updateSession = async (id, data) => {
  const response = await api.put(`/api/sessions/${id}`, data);
  return response.data;
};

export default api;
