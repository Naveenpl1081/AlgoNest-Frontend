import { axiosInstance } from "../config/axios.config";
import { ADMIN_API, USER_API } from "../utils/apiRoutes";
import {
  GetProblemsParams,
  GetProblemsResponse,
  IProblem,
} from "../types/component.types";
import { languages } from "monaco-editor";

interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

const getAllProblems = async ({
  page,
  limit,
  search,
  status,
  verified,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  verified?: string;
} = {}) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/problems`, {
      params: { page, limit, search, status, verified },
    });
    console.log("problem response", response);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch users",
    };
  }
};

const addProblems = async (problems: IProblem) => {
  try {
    console.log("dfv");
    const response = await axiosInstance.post(
      `${ADMIN_API}/addproblems`,
      problems
    );
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to add problem",
    };
  }
};
const updateProblem = async (problemId: string, data: IProblem) => {
  try {
    const response = await axiosInstance.put(
      `${ADMIN_API}/updateproblem/${problemId}`,
      data
    );
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update problem",
    };
  }
};

const getProblems = async (params: {
  visible?: boolean;
  query?: string;
  difficulty: string;
}) => {
  try {
    const response = await axiosInstance.get(`${USER_API}/problems`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching problems:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch problems",
    };
  }
};

const getSingleProblem = async (problemId: string) => {
  try {
    const response = await axiosInstance.get(
      `${USER_API}/singleproblem/${problemId}`
    );
    console.log("problem response", response);
    return response;
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching single problem:", err);
    throw err;
  }
};

const toggleProblemStatus = async (problemId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${ADMIN_API}/problems/${problemId}`
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

const runCode = async (code: string, problemId: string, language: string) => {
  try {
  
    const response = await axiosInstance.post(`${USER_API}/runcode/`, {
      code,
      problemId,
      language,
    });
    console.log("res", response);
    return response.data;
  } catch (error) {
    console.error("Error running code:", error);
    throw error;
  }
};

const submitCode = async (
  code: string,
  problemId: string,
  language: string
) => {
  try {
    console.log("hellooo hoooi");
    const response = await axiosInstance.post(`${USER_API}/submitcode/`, {
      code,
      problemId,
      language,
    });
    console.log("res", response);
    return response.data;
  } catch (error) {
    console.error("Error running code:", error);
    throw error;
  }
};

const allSubmissions=async (problemId:string)=>{
  try {
    console.log("submisison ethii")
    const response= await axiosInstance.get(`${USER_API}/allsubmissions/${problemId}`)
    console.log("allsubmissions response",response)
    return response.data.data
  } catch (error) {
    console.error("Error running code:", error);
    throw error;
  }
}

export const problemService = {
  getAllProblems,
  addProblems,
  updateProblem,
  getProblems,
  getSingleProblem,
  toggleProblemStatus,
  runCode,
  submitCode,
  allSubmissions
};
