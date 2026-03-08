import axios from "axios";

// In development, we proxy /api to http://localhost:5000 via Vite,
// so the browser never talks to the backend origin directly (no CORS issue).

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
// Add token automatically if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;