
import axios from "./axios";

export const registerRequest = (user) => axios.post(`/auth/register`, user);

export const loginRequest = (user) => axios.post(`/auth/login`, user);

export const logoutRequest = () => axios.post(`/logout`);

export const getCurrentUserRequest = () => axios.get(`/me`);

export const googleLoginRequest = (tokenGoogle) => axios.post(`/auth/google`, { credential: tokenGoogle });

export const verifyTokenRequest = () => axios.get(`/auth/verify`);

