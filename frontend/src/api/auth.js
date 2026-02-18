// src/api/auth.js
import axios from "./axios";

// Ajustá las rutas ("/login", "/register") según como las definiste en tu backend
// Si en tu backend es /api/auth/login, ponelo así.
// Según lo que vimos antes, era directo /login y /register

export const registerRequest = (user) => axios.post(`/register`, user);

export const loginRequest = (user) => axios.post(`/login`, user);

// Esta servirá para verificar si el token sigue vivo al recargar página
export const verifyTokenRequest = () => axios.get(`/verify`);