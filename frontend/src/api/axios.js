import axios from "axios";
import Cookies from "js-cookie";

/**
 * Instancia configurada de Axios para realizar peticiones al backend.
 * Define la URL base y permite el envío de credenciales (cookies) por defecto.
 */
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api", 
  withCredentials: true 
});


/**
 * Interceptor de peticiones:
 * Se ejecuta automáticamente antes de cada petición HTTP que use esta instancia.
 * Su propósito es adjuntar el token JWT (si existe en las cookies) al encabezado de Authorization.
 */
instance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;