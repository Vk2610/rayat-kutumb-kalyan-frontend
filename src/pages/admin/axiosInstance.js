import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://rayat-backend.onrender.com",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

