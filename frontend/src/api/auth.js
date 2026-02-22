
import axios from "./axios";

export const registerRequest = (user) => axios.post(`/auth/register`, user);

export const loginRequest = (user) => axios.post(`/auth/login`, user);

export const logoutRequest = () => axios.post(`/auth/logout`);

export const getCurrentUserRequest = () => axios.get(`/me`);

export const googleLoginRequest = (tokenGoogle) => axios.post(`/auth/google`, { credential: tokenGoogle });

export const verifyTokenRequest = (token) => axios.get(`/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const forgotPasswordRequest = (email) => axios.post(`/auth/forgot-password`, { email });

export const resetPasswordRequest = (token, password) => 
    axios.post(`/auth/reset-password/${token}`, { password });