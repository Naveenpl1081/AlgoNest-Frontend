import { axiosInstance } from "../config/axios.config";
import { ApiError, JobPost } from "../models/recruiter";
import { RECRUITER_API, USER_API } from "../utils/apiRoutes";

const postJobDetails = async (jobDetails: JobPost): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${RECRUITER_API}/jobpost`,
      jobDetails
    );

    return response;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error(
      "Error posting job details:",
      err.response?.data || err.message
    );
    throw err;
  }
};

const updateJobDetails = async (
  jobId: string,
  jobDetails: JobPost
): Promise<any> => {
  try {
    const response = await axiosInstance.put(
      `${RECRUITER_API}/updatejobpost/${jobId}`,
      jobDetails
    );
    return response;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error(
      "Error posting job details:",
      err.response?.data || err.message
    );
    throw err;
  }
};
const toggleJobStatus = async (jobId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${RECRUITER_API}/jobstatus/${jobId}`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update status",
    };
  }
};

const viewAllJobs = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  workmode?: string;
  worktime?: string;
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v) as [string, string][]
    ).toString();
    const response = await axiosInstance.get(
      `${RECRUITER_API}/alljobpost?${queryParams}`
    );
    return response;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching jobs:", err.response?.data || err.message);
    throw err;
  }
};

const jobDetails = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  workmode?: string;
  worktime?: string;
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v) as [string, string][]
    ).toString();
    const response = await axiosInstance.get(
      `${USER_API}/alljobpost?${queryParams}`
    );
    return response;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching jobs:", err.response?.data || err.message);
    throw err;
  }
};

export const jobService = {
  postJobDetails,
  viewAllJobs,
  updateJobDetails,
  toggleJobStatus,
  jobDetails,
};
