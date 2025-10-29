import { axiosInstance } from "../config/axios.config";
import { ApiError } from "../models/recruiter";
import { RECRUITER_API, USER_API } from "../utils/apiRoutes";

const postJobApplication = async (formData: FormData): Promise<any> => {
  try {
    console.log("formData:",formData);
    const response = await axiosInstance.post(
      `${USER_API}/applyjob`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error occurred";

    console.error("Error posting job application:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
};

const getAllApplicants = async ({
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
    const response = await axiosInstance.get(`${RECRUITER_API}/applicants`, {
      params: { page, limit, search, status },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch applicants",
    };
  }
};

const applicationShortlist = async (jobId: string, threshold: string) => {
    try {
      console.log("jobId",jobId)
      const response = await axiosInstance.patch(
        `${RECRUITER_API}/aishortlist/${jobId}`,
        { threshold } 
      );
      return response.data;
    } catch (error) {
      console.error("Error in applicationShortlist:", error);
      throw error; 
    }
  };

  const getAllShortlistApplicants = async ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    try {
      const response = await axiosInstance.get(`${RECRUITER_API}/shortlistapplicants`, {
        params: { page, limit, search },
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as ApiError;
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch applicants",
      };
    }
  };

  const fetchLocationSuggestions= async (query: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        `${USER_API}/locations`,
        {
          params: { query },
        }
      );
      return response;
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error(
        "Error fetching location suggestions:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

export const applicationService = {
  postJobApplication,
  getAllApplicants,
  applicationShortlist,
  getAllShortlistApplicants,
  fetchLocationSuggestions
};
