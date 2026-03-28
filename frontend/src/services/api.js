import axios from "axios";

// In development, we proxy /api to http://localhost:5000 via Vite,
// so the browser never talks to the backend origin directly (no CORS issue).

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("Axios Base URL:", baseURL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;