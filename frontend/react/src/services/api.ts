import axios, { type InternalAxiosRequestConfig } from "axios";

// Puxa a URL do arquivo .env. 
// O "||" funciona como um fallback de segurança caso o .env não seja encontrado.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTADOR DE REQUISIÇÃO
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Busca o token salvo (se houver um sistema de login no futuro)
    const token = localStorage.getItem("user_token");
    
    // O TypeScript exige que verifiquemos se config.headers existe antes de injetar algo nele
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default api;