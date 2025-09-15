import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import Button from "../../../component/common/Button";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../../../service/categoryService";
import { Column } from "../../../types/component.types";
import Table from "../../../component/common/Table";
import { Search } from "../../../component/common/Search";
import Pagination from "../../../component/common/Pagination";
import { ConfirmModal } from "../../../component/common/ConfirmModal";

interface ICategory {
  _id: string;
  name: string;
  status: "Active" | "InActive";
}

export const CategoriesListPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const limit = 5;
  const navigate = useNavigate();

  const openConfirmModal = (user: ICategory) => {
    setSelectedCategory(user);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
      });
      if (res.success && res.data) {
        setCategories(res.data.categories || []);
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setCategories([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleEdit = (item: ICategory) => {
    navigate("/admin/editcategory", { state: { category: item } });
  };

  const handleConfirmToggle = async () => {
    if (!selectedCategory) return;

    try {
      const res = await categoryService.toggleCategoryStatus(selectedCategory._id);
      if (res.success) {
        await fetchCategories();
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleAddProblemCat = () => {
    navigate("/admin/editcategory"); 
  };

  const columns: Column<ICategory>[] = [
    {
      key: "name",
      label: "Category Name",
      render: (item) => item.name,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : item.status === "InActive"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <Button variant="primary" size="sm" onClick={() => handleEdit(item)}>
          Edit
        </Button>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item: ICategory) => (
        <Button
          variant={item.status === "Active" ? "secondary" : "primary"}
          size="sm"
          onClick={() => openConfirmModal(item)}
        >
          {item.status === "Active" ? "Block" : "Unblock"}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <Button variant="primary" onClick={handleAddProblemCat}>
            Add Category
          </Button>
        </div>

        <div className="mb-6 w-full lg:w-1/3">
          <Search
            value={searchTerm}
            onChange={(val) => {
              setCurrentPage(1);
              setSearchTerm(val);
            }}
            placeholder="Search by category name"
          />
        </div>

        <Table
          data={categories}
          columns={columns}
          currentPage={currentPage}
          pageSize={limit}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ConfirmModal
          isOpen={modalOpen}
          title={
            selectedCategory?.status === "Active" ? "Block User" : "Unblock User"
          }
          message={`Are you sure you want to ${
            selectedCategory?.status === "Active" ? "block" : "unblock"
          } this user?`}
          confirmText={selectedCategory?.status === "Active" ? "Block" : "Unblock"}
          onConfirm={handleConfirmToggle}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};
