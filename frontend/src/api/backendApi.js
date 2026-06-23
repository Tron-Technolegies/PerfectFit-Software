import axios from "axios";

export const isElectron = window.navigator.userAgent.toLowerCase().includes("electron");

export const getServerUrl = (path = "") => {
  if (path.startsWith("http")) return path;
  
  const base = isElectron 
    ? "http://127.0.0.1:8765" 
    : (import.meta.env.VITE_API_DOMAIN || ""); // VITE_API_DOMAIN can be empty in dev because of proxy
    
  return `${base}${path}`;
};

const api = axios.create({
  baseURL: isElectron 
    ? "http://127.0.0.1:8765/api" 
    : (import.meta.env.VITE_API_BASE_URL || "/api"),
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
