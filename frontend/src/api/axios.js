import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3000/api", 
  withCredentials: true 
});


instance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;