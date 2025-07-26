
import getENV from "./env.config";
import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: getENV(), 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json" 
  }
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("user_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.get("/api/user/refresh-token");
        console.log("refresh toke response",res)
        const newAccessToken = res.data.access_token;

        Cookies.set("user_access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("🔐 Refresh token failed", refreshError);
        window.location.href = "/user/login";
      }
    }

    return Promise.reject(error);
  }
);
