import { axiosInstance } from "../config/axios.config";
import { USER_API } from "../utils/apiRoutes";

const getExplainedError = async ({
  code,
  errorLog,
  problemStatement,
}: {
  code: string;
  errorLog: string;
  problemStatement: string;
}) => {
  try {
    const response = await axiosInstance.post(`${USER_API}/aidebugger`, {
      code,
      errorLog,
      problemStatement,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching AI explanation:",
      error.response?.data || error.message
    );

    // Re-throw with additional context
    if (error.response) {
      // Server responded with error
      throw error;
    } else if (error.request) {
      // Network error
      const networkError = new Error("Network connection failed");
      (networkError as any).code = "NETWORK_ERROR";
      throw networkError;
    } else {
      // Other error
      throw error;
    }
  }
};

const getAiAnswers = async (data: {
  message: string;
  conversationHistory: Array<{ role: string; content: string }>;
  language?: string;
  topic?: string;
}) => {
  try {
    const response = await axiosInstance.post(`${USER_API}/aitutor`, data);
    return response.data;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw error.response?.data || error;
  }
};

const checkPremium = async () => {
  try {
    const res = await axiosInstance.get(`${USER_API}/ispremium`);

    return res.data;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw error.response?.data || error;
  }
};


const checkStandard = async () => {
  try {
    const res = await axiosInstance.get(`${USER_API}/isstandard`);

    return res.data;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw error.response?.data || error;
  }
};

const checkBasic = async () => {
  try {
    const res = await axiosInstance.get(`${USER_API}/isbasic`);

    return res.data;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw error.response?.data || error;
  }
};
export const aiAuthService = {
  getExplainedError,
  getAiAnswers,
  checkPremium,
  checkStandard,
  checkBasic
};
