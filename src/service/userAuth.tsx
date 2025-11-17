import { axiosInstance } from "../config/axios.config";
import { LoginFormData, SignupFormData } from "../types/auth.types";
import { USER_API } from "../utils/apiRoutes";

interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}


const signup = async (formData: SignupFormData) => {
    try {
        const response = await axiosInstance.post(`${USER_API}/signup`, formData);
        console.log("res",response)
        return response.data; 
      } catch (error: unknown) {
        const err = error as ApiError;
        return {
          success: false,
          message: err.response?.data?.message || "Something went wrong",
        };
      }
};

const verifyOtp = async (otp: string,email:string,purpose:string) => {
    try {
      const response = await axiosInstance.post(`${USER_API}/verify-otp`, { otp ,email,purpose});
      console.log("OTP verify response:", response);
      return response.data;
    } catch (error: unknown) {
      const err = error as ApiError;
      return {
        success: false,
        message: err.response?.data?.message || "OTP verification failed",
      };
    }
  };

const login=async (formData:LoginFormData)=>{
  try {
    console.log("login service enterd",axiosInstance)
    const response = await axiosInstance.post(`${USER_API}/login`, formData);
    console.log("res",response)
    return response.data
  } catch (error: unknown) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      return {
        success: false,
        message: err.response.data.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}  

const githubAuth=async (code: string) => {
  try {
    console.log("GitHub auth service entered with code:", code);
    const response = await axiosInstance.post(`${USER_API}/github/callback`, { code });
    console.log("GitHub auth response:", response.data);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      return {
        success: false,
        message: err.response.data.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

const linkedinAuth = async (code: string) => {
  try {
      console.log("LinkedIn auth service entered with code:", code);
      
      const response = await axiosInstance.get(`${USER_API}/linkedin/callback`, {
          params: { code }
      });
      
      console.log("LinkedIn auth response:", response.data);
      return response.data;
  } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.data?.message) {
          return {
              success: false,
              message: err.response.data.message,
          };
      }
      return {
          success: false,
          message: "Something went wrong. Please try again.",
      };
  }
};



const resendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post(`${USER_API}/resend-otp`, { email });
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Resend OTP failed.",
    };
  }
};

const checkUserExists = async (email: string) => {
  try {
    const res = await axiosInstance.post(`${USER_API}/check-user`, { email });
    return res.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Error checking user",
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
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Server error. Please try again.",
    };
  }
}


const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(`${USER_API}/user-profile`)
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching user profile:", err.response?.data || err.message);
    throw err;
  }
};

const getUserStats= async () => {
  try {
    const response = await axiosInstance.get(`${USER_API}/user-stats`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user stats:", error.response?.data || error.message);
    throw error;
  }
}

const updateProfile = async (formData: FormData) => {
  try {
    const response = await axiosInstance.patch(`${USER_API}/edit-profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    console.log("respo",response)
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      return {
        success: false,
        message: err.response.data.message,
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
  updateProfile,
  githubAuth,
  linkedinAuth,
  getUserStats
};
