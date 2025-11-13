import { axiosInstance } from "../config/axios.config";
import { ApiError } from "../models/recruiter";
import { ADMIN_API, USER_API } from "../utils/apiRoutes";

const getAllSubscription = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/subscriptions`, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching subscriptions:",
      error.response?.data || error.message
    );
    throw error;
  }
};
const showAllSubscriptions= async () => {
    try {
      const response = await axiosInstance.get(`${USER_API}/showallsubscriptions`);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching subscriptions:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

const addSubscription = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${ADMIN_API}/addsubscription`,
      data
    );
    return response.data
  } catch (error:any) {
    console.error(
        "Error fetching subscriptions:",
        error.response?.data || error.message
      );
      throw error;
  }
};

const makePurcahse=async(planId:string)=>{
  try {
    const response=await axiosInstance.post(`${USER_API}/purchase`,{planId})
    return response.data
  } catch (error:any) {
    console.error(
      "Error fetching subscriptions:",
      error.response?.data || error.message
    );
    throw error;
  }
}

const toggleSubscriptionStatus = async (subscriptionId: string) => {
  try {
    console.log("subscriptionId",subscriptionId)
    const response = await axiosInstance.patch(`${ADMIN_API}/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update status",
    };
  }
};

const updateSubscription = async (subscriptionId: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${ADMIN_API}/editsubscriptions/${subscriptionId}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update subscription",
    };
  }
};


export const subscriptionService = {
  getAllSubscription,
  addSubscription,
  showAllSubscriptions,
  makePurcahse,
  toggleSubscriptionStatus,
  updateSubscription
};
