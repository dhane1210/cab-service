import axios from "axios";

// Dynamically set the base URL based on environment variables
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Allows session cookies
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
