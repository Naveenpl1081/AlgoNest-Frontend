import { axiosInstance } from "../config/axios.config";
import { LoginFormData } from "../types/auth.types";
import { ADMIN_API } from "../utils/apiRoutes";

const login = async (formData: LoginFormData) => {
  try {
    console.log("login service enterd");
    const response = await axiosInstance.post(`${ADMIN_API}/login`, formData);
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

const getAllRecruiter = async ({
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
    const response = await axiosInstance.get(`${ADMIN_API}/recruiterlist`, {
      params: { page, limit, search, status },
    });
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
    const response = await axiosInstance.patch(`${ADMIN_API}/users/${userId}`);
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

const toggleRecruiterStatus = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${ADMIN_API}/recruiter/${userId}`
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

const acceptApplicant = async (applicantId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${ADMIN_API}/approve-applicant/${applicantId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Failed to accept applicant",
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

const rejectApplicant = async (applicantId: string,rejectReason:string) => {
  try {
    console.log("rejec",rejectReason)
    const response = await axiosInstance.patch(
      `${ADMIN_API}/applicants/${applicantId}/reject`,rejectReason
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Failed to reject applicant",
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

const getAllApplicants = async ({
  page,
  limit
}: {
  page?: Number;
  limit?: Number;
  search?: String;
  status?: String;
} = {}) => {
  try {
    console.log("entersdddd")
    const response = await axiosInstance.get(`${ADMIN_API}/applicantlist`, {
      params: { page, limit },
    });
    console.log(response)
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
