import React from "react";
import CategoryAddingComponent from "../../../component/admin/CategoryAddingCom";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import { categoryService } from "../../../service/categoryService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export interface ICategory {
  _id: string;
  name: string;
}

const CategoryAddingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editCategory: ICategory | undefined = location.state?.category;
  console.log("editcat",editCategory)

  const handleSaveCategory = async (categoryName: string) => {
    try {
      let response;
      if (editCategory) {
        response = await categoryService.updateCategory(editCategory._id, categoryName);
      } else {
        response = await categoryService.addCategories(categoryName);
      }

      if (response.success) {
        toast.success(response.message || (editCategory ? "Category updated!" : "Category added!"));
        navigate("/admin/problemcategory");
      } else {
        toast.error(response.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred!");
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">
          {editCategory ? "Edit Category" : "Add Category"}
        </h1>
        <CategoryAddingComponent
          onAdd={handleSaveCategory}
          initialValue={editCategory?.name}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryAddingPage;
