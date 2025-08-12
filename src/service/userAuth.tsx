import { axiosInstance } from "../config/axios.config";
import { LoginFormData, SignupFormData } from "../types/auth.types";
import { USER_API } from "../utils/apiRoutes";
import Cookies from "js-cookie";

const signup = async (formData: SignupFormData) => {
    try {
        const response = await axiosInstance.post(`${USER_API}/signup`, formData);
        console.log("res",response)
        return response.data; 
      } catch (error: any) {
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      }
};

const verifyOtp = async (otp: string,email:string,purpose:string) => {
    try {
      const response = await axiosInstance.post(`${USER_API}/verify-otp`, { otp ,email,purpose});
      console.log("OTP verify response:", response);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "OTP verification failed",
      };
    }
  };

const login=async (formData:LoginFormData)=>{
  try {
    console.log("login service enterd")
    const response = await axiosInstance.post(`${USER_API}/login`, formData);
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

const resendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post(`${USER_API}/resend-otp`, { email });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Resend OTP failed.",
    };
  }
};

const checkUserExists = async (email: string) => {
  try {
    const res = await axiosInstance.post(`${USER_API}/check-user`, { email });
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error checking user",
    };
  }
};

const resetPassword= async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post(`${USER_API}/reset-password`, {
      email,
      newPassword,
    });

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Server error. Please try again.",
    };
  }
}


const getUserProfile = async () => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await axiosInstance.get(`${USER_API}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error?.response?.data || error.message);
    throw error; 
  }
};

const updateProfile = async (formData: FormData) => {
  try {
    const response = await axiosInstance.patch(`${USER_API}/edit-profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    console.log("respo",response)
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Update failed",
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};



export const userAuthService = {
  signup,
  verifyOtp,
  login,
  resendOtp,
  checkUserExists,
  resetPassword,
  getUserProfile,
  updateProfile
};
