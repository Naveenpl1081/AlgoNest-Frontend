
import getENV from "./env.config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: getENV(), 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json" 
  }
});
