import { axiosInstance } from "../config/axios.config";
import { ApiError } from "../models/recruiter";
import { USER_API } from "../utils/apiRoutes";

const addQuestion = async (formdata: any) => {
  try {
    console.log("dfv");
    const response = await axiosInstance.post(
      `${USER_API}/addquestion`,
      formdata
    );
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to add question",
    };
  }
};
const getAllQuestions = async ({
  page,
  limit,
  search,
  tags,
}: {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
} = {}) => {
  try {
    const response = await axiosInstance.get(`${USER_API}/getallquestions`, {
      params: { page, limit, search, tags },
    });
    console.log("questions response", response);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch questions",
    };
  }
};

const getQuestionById = async (questionId: string) => {
  try {
    const response = await axiosInstance.get(
      `${USER_API}/getonequestion/${questionId}`
    );
    return response;
  } catch (error) {
    const err = error as ApiError;
    console.error(
      "Error fetching location suggestions:",
      err.response?.data || err.message
    );
    throw err;
  }
};

const addAnswer = async (answerData: { questionId: string; body: string }) => {
  try {
    console.log("ethiiiii");
    const response = await axiosInstance.post(
      `${USER_API}/addAnswer`,
      answerData
    );
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    console.error(
      "Error fetching location suggestions:",
      err.response?.data || err.message
    );
    throw err;
  }
};

const getAnswersByQuestionId = async (
  questionId: string,
  page: number = 1,
  limit: number = 4
) => {
  try {
    const response = await axiosInstance.get(
      `${USER_API}/getallanswers/${questionId}`,
      {
        params: { page, limit },
      }
    );
    console.log("res", response);
    return {
      answers: response.data.data.answers || [],
      pagination: response.data.data.pagination || null,
    };
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching answers:", err.response?.data || err.message);
    throw err;
  }
};

const handleLike=async(answerId:String)=>{
  try {
    const response=await axiosInstance.post(`${USER_API}/answerlike/${answerId}`)
    console.log("res",response)
    return response
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching answers:", err.response?.data || err.message);
    throw err;
  }
}
const handledisLike=async(answerId:String)=>{
  try {
    const response=await axiosInstance.post(`${USER_API}/answerdislike/${answerId}`)
    console.log("res",response)
    return response
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching answers:", err.response?.data || err.message);
    throw err;
  }
}

export const communityService = {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  addAnswer,
  getAnswersByQuestionId,
  handleLike,
  handledisLike
};
