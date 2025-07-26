import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://ai-component-generator-backend-6yc0.onrender.com"
    : "http://localhost:5000";

export const api = axios.create({
  baseURL,
  // Remove withCredentials for pure token approach
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
    });

    // Clear invalid tokens
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const signup = async (email, password) => {
  const response = await api.post("/api/auth/signup", { email, password });

  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }

  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });

  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }

  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/api/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("authToken");
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    localStorage.removeItem("authToken");
    throw error;
  }
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
