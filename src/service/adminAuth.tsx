import { axiosInstance } from "../config/axios.config";
import { LoginFormData } from "../types/auth.types";
import { ADMIN_API } from "../utils/apiRoutes";

interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}


const login = async (formData: LoginFormData) => {
  try {
    console.log("login service enterd");
    const response = await axiosInstance.post(`${ADMIN_API}/login`, formData);
    console.log("res", response);
    return response.data;
  }catch (error: unknown) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      return {
        success: false,
        message: err.response.data.message,
      };
    }
    return { success: false, message: "Something went wrong. Please try again." };
  }
};

const getAllUsers = async ({
  page,
  limit,
  search,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/userslist`, {
      params: { page, limit, search, status },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch users",
    };
  }
};

const getAllRecruiter = async ({
  page,
  limit,
  search,
  status,
  company
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  company?:string
} = {}) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/recruiterlist`, {
      params: { page, limit, search, status,company },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch recruiters",
    };
  }
};

const toggleUserStatus = async (userId: string) => {
  try {
    console.log("userIddd",userId)
    const response = await axiosInstance.patch(`${ADMIN_API}/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update status",
    };
  }
};

const toggleRecruiterStatus = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${ADMIN_API}/recruiter/${userId}`
    );
    return response.data;
  }  catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update status",
    };
  }
};

const acceptApplicant = async (applicantId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${ADMIN_API}/approve-applicant/${applicantId}`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to accept applicant",
    };
  }
};

const rejectApplicant = async (applicantId: string,rejectReason:string) => {
  try {
    console.log("rejec",rejectReason)
    const response = await axiosInstance.patch(
      `${ADMIN_API}/reject-applicant/${applicantId}`,{rejectReason}
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to reject applicant",
    };
  }
};

const getAllApplicants = async ({
  page,
  limit
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}) => {
  try {
    console.log("entersdddd")
    const response = await axiosInstance.get(`${ADMIN_API}/applicantlist`, {
      params: { page, limit },
    });
    console.log(response)
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch applicants",
    };
  }
};


export const adminAuthService = {
  login,
  getAllUsers,
  toggleUserStatus,
  getAllRecruiter,
  toggleRecruiterStatus,
  acceptApplicant,
  rejectApplicant,
  getAllApplicants,
};
