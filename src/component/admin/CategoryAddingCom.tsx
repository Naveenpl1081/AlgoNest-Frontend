import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

interface CategoryAddingComponentProps {
  onAdd: (category: string) => void;
  initialValue?: string;
}

const CategoryAddingComponent: React.FC<CategoryAddingComponentProps> = ({ onAdd, initialValue }) => {
  const [categoryName, setCategoryName] = useState(initialValue || "");

  const handleAdd = () => {
    const trimmed = categoryName.trim();
    const isValid = /^[A-Za-z]+$/.test(trimmed);

    if (!isValid) {
      toast.error("Category name must contain only letters (A-Z)");
      return;
    }

    if (trimmed) {
      onAdd(trimmed);
      setCategoryName("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          {initialValue ? "Edit Category" : "Add Category"}
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name (e.g., Array)"
            className="flex-1 p-3 rounded bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CategoryAddingComponent;
