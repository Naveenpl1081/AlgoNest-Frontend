
import { axiosInstance } from "../config/axios.config";
import { LoginFormData,} from "../types/auth.types";
import {  ADMIN_API} from "../utils/apiRoutes";


const login=async (formData:LoginFormData)=>{
    try {
      console.log("login service enterd")
      const response = await axiosInstance.post(`${ ADMIN_API}/login`, formData);
      console.log("res",response)
      return response.data
    } catch (error:any) {
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || "Login failed",
        };
      }
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  }  


  const getAllUsers = async () => {
    try {
      console.log("Fetching all users...");
      const response = await axiosInstance.get(`${ADMIN_API}/users`);
      console.log("Users response:", response);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || "Failed to fetch users",
        };
      }
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      console.log("reached")
      const response = await axiosInstance.patch(
        `${ADMIN_API}/users/${userId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || "Failed to update status",
        };
      }
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  };
  export const adminAuthService={
    login,
    getAllUsers,
    toggleUserStatus
  }