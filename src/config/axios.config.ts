import { envConfig } from "./env.config";
import axios from "axios";
import Cookies from "js-cookie";
import { Role } from "../types/auth.types";




export const axiosInstance = axios.create({
  baseURL: envConfig.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getRoleFromUrl = (url: string): Role => {
  if (url.includes("/api/user/")) {
    return "USER";
  } else if (url.includes("/api/recruiter/")) {
    return "RECRUITER";
  } else {
    return "ADMIN";
  }
};

let isRefresh = false;
let pendingRequests: ((token: string | null) => void)[] = [];

export const newAccessToken = async () => {
  try {
    if (isRefresh) {
      console.log("new accesstoken enterd")
      return new Promise<string | null>((resolve) => {
        pendingRequests.push(resolve);
      });
    }

    isRefresh = true;
    console.log("before i reahced the refreshtokenhandler");
    const response = await axiosInstance.get("/api/refresh-token");
    console.log("responseee",response)
    if (response.data?.access_token) {
     
      const { access_token } = response.data;

      Cookies.set("access_token", access_token, { path: "/" });

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;

      pendingRequests.forEach((resolve) => resolve(access_token));
      pendingRequests = [];
      isRefresh = false;
      return access_token;
    } else {
      pendingRequests.forEach((resolve) => resolve(null));
      pendingRequests = [];
      isRefresh = false;
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    pendingRequests.forEach((resolve) => resolve(null));
    pendingRequests = [];
    isRefresh = false;
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("entering to the request intersepter");
    const token = Cookies.get("access_token");
    console.log("token attached by the requst interseprter", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("config", config);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const urlpath = error.config?.url || "";
    const role = getRoleFromUrl(urlpath);
    console.log("extracted role from the url path", role);
    if (error.response?.status === 403 && error.response?.data?.message) {

      Cookies.remove(`access_token`);
      delete axiosInstance.defaults.headers.common["Authorization"];

      window.location.href = `/${role.toLowerCase()}/login?blocked=true`;
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/api/refresh-token")
    ) {
      try {
        const accessToken = await newAccessToken();
        if (accessToken) {
          const newConfig = { ...error.config };
          if (!newConfig.headers) {
            newConfig.headers = {};
          }
          newConfig.headers["Authorization"] = `Bearer ${accessToken}`;

          return axios(newConfig);
        } else {
          throw new Error("Could not get a new token");
        }
      } catch (refreshError) {
        console.error("Could not refresh token, logging out...");
        Cookies.remove(`access_token`);
        window.location.href = `/${role.toLowerCase()}/login`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
