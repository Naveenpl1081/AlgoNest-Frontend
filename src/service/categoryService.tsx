import { axiosInstance } from "../config/axios.config";
import { ICategory } from "../pages/admin/adminPages/CategoryAddingPage";
import { ADMIN_API } from "../utils/apiRoutes";
interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}
const addCategories = async (name: string) => {
  try {
    console.log("Adding category...");
    const response = await axiosInstance.post(`${ADMIN_API}/addcategory`, {
      name,
    });
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to add category",
    };
  }
};

const getAllCategories = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/categorylist`, {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch categories",
    };
  }
};

const getAllCategory = async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_API}/allcategory`);
      return response.data;
    } catch (error) {
      const err = error as ApiError;
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch categories",
      };
    }
  };

  const updateCategory = async (categoryId: string, data: string) => {
    try {
      console.log("catId",categoryId)
      console.log("data",data)
      const response = await axiosInstance.put(`${ADMIN_API}/updatecategory/${categoryId}`, {name:data});
      return response.data;
    } catch (error) {
      const err = error as ApiError;
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update category",
      };
    }
  };

  const toggleCategoryStatus = async (categoryId: string) => {
    try {
      const response = await axiosInstance.patch(`${ADMIN_API}/category/${categoryId}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as ApiError;
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update status",
      };
    }
  };

export const categoryService = {
  addCategories,
  getAllCategories,
  getAllCategory,
  updateCategory,
  toggleCategoryStatus
};
