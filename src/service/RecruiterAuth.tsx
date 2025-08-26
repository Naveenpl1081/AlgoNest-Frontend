import { axiosInstance } from "../config/axios.config";
import { LoginFormData, SignupFormData } from "../types/auth.types";
import { RECRUITER_API } from "../utils/apiRoutes";
import Cookies from "js-cookie";

const signup = async (formData: SignupFormData) => {
  try {
    const response = await axiosInstance.post(
      `${RECRUITER_API}/signup`,
      formData
    );
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

const verifyOtp = async (otp: string, email: string, purpose: string) => {
  try {
    const response = await axiosInstance.post(`${RECRUITER_API}/verify-otp`, {
      otp,
      email,
      purpose,
    });
    console.log("OTP verify response:", response);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "OTP verification failed",
    };
  }
};

const login = async (formData: LoginFormData) => {
  try {
    console.log("login service enterd");
    const response = await axiosInstance.post(
      `${RECRUITER_API}/login`,
      formData
    );
    console.log("res", response);
    return response.data;
  } catch (error: any) {
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
};

const resendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post(`${RECRUITER_API}/resend-otp`, {
      email,
    });
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
    const res = await axiosInstance.post(`${RECRUITER_API}/check-user`, {
      email,
    });
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error checking user",
    };
  }
};

const resetPassword = async (
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post(
      `${RECRUITER_API}/reset-password`,
      {
        email,
        newPassword,
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error. Please try again.",
    };
  }
};

const approveRecruiter = async (formData: FormData) => {
  try {
    const response = await axiosInstance.patch(
      `${RECRUITER_API}/company-verification`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to submit company verification",
    };
  }
};

const getRecruiterProfile= async () => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await axiosInstance.get(`${RECRUITER_API}/recruiter-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching recruiter profile:",
      error?.response?.data || error.message
    );
    throw error;
  }
}
export const recruiterAuthService = {
  signup,
  verifyOtp,
  login,
  resendOtp,
  checkUserExists,
  resetPassword,
  approveRecruiter,
  getRecruiterProfile
};
