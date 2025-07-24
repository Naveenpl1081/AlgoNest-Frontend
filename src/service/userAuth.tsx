import { axiosInstance } from "../config/axios.config";
import { SignupFormData } from "../types/auth.types";

const signup = async (formData: SignupFormData) => {
    try {
        const response = await axiosInstance.post("/api/user/signup", formData);
        console.log("res",response)
        return response.data; 
      } catch (error: any) {
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      }
};

const verifyOtp = async (otp: string) => {
    try {
      const response = await axiosInstance.post("/api/user/verify-otp", { otp });
      console.log("OTP verify response:", response);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "OTP verification failed",
      };
    }
  };
  

export const userAuthService = {
  signup,
  verifyOtp
};
