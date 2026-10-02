import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const previewUserId = localStorage.getItem("schoolhub-dev-preview-user");
  if (previewUserId && !config.url?.startsWith("/dev-preview/users")) {
    config.headers["X-Dev-Preview-User"] = previewUserId;
  }
  return config;
});

export default api;
