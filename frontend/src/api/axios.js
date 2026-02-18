import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", 
  withCredentials: true // Esto sirve si usas cookies, pero no molesta si usas headers
});

// INTERCEPTOR: Antes de cada petición, inyectamos el token si existe
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;