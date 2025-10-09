import { axiosInstance } from "../config/axios.config";
import { ApiError } from "../models/recruiter";
import { RECRUITER_API, USER_API } from "../utils/apiRoutes";

const scheduleInterview = async (data: {
  applicationId: string;
  date: string;
  time: string;
  duration: number;
  instructions: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `${RECRUITER_API}/scheduleinterview`, 
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    throw error;
  }
};

const viewAllInterview = async (params: {
  page?: number;
  limit?: number;
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    
    const response = await axiosInstance.get(
      `${RECRUITER_API}/allinterviews?${queryParams}`
    );
    return response;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching interviews:", err.response?.data || err.message);
    throw err;
  }
};
const usersViewAllInterview = async (params: {
  page?: number;
  limit?: number;
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    
    const response = await axiosInstance.get(
      `${USER_API}/allinterviews?${queryParams}`
    );
    return response;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching interviews:", err.response?.data || err.message);
    throw err;
  }
};


export const interviewService = {
  scheduleInterview,
  viewAllInterview,
  usersViewAllInterview
};
