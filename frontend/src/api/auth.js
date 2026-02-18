
import axios from "./axios";

export const registerRequest = (user) => axios.post(`/register`, user);

export const loginRequest = (user) => axios.post(`/login`, user);

export const logoutRequest = () => axios.post(`/logout`);

export const getCurrentUserRequest = () => axios.get(`/me`);

export const googleLoginRequest = (token) => axios.post(`/auth`, { token });

