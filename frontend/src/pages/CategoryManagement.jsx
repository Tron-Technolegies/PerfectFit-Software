import React, { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/categoryApi";
import CategoryTable from "../components/category/CategoryTable";
import AddEditCategoryModal from "../components/category/AddEditCategoryModal";
import Toast from "../components/common/Toast";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
        showToast("Category updated successfully");
      } else {
        await createCategory(payload);
        showToast("Category created successfully");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to save category", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      showToast("Category deleted successfully");
      await loadCategories();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500">Manage item categories and prefixes</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600 transition shadow-sm"
        >
          + Add New Category
        </button>
      </div>

      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={(cat) => {
          setEditingCategory(cat);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <AddEditCategoryModal
          category={editingCategory}
          saving={saving}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
