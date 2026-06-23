import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../common/ConfirmModal";
import Loader from "../common/Loader";

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [deletingCategory, setDeletingCategory] = useState(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat.prefix?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-[#00000014] overflow-hidden">
      {/* SEARCH */}
      <div className="p-4 border-b border-[#00000014]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="border border-[#00000014] px-4 py-2 rounded-lg w-full md:max-w-md outline-none text-sm"
        />
      </div>

      {loading ? (
        <Loader />
      ) : filteredCategories.length === 0 ? (
        <div className="p-10 text-center text-gray-500 text-sm">
          No categories found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F9FAFB] text-gray-400 border-b border-[#00000014]">
              <tr>
                <th className="p-4">CATEGORY NAME</th>
                <th className="p-4">PREFIX</th>
                <th className="p-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="border-b border-[#00000014] hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                  <td className="p-4 uppercase text-gray-500">{cat.prefix}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <FiEdit
                        className="cursor-pointer text-gray-400 hover:text-pink-500 transition"
                        onClick={() => onEdit(cat)}
                      />
                      <FiTrash2
                        className="cursor-pointer text-gray-400 hover:text-red-500 transition"
                        onClick={() => setDeletingCategory(cat)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deletingCategory && (
        <ConfirmModal
          title="Delete Category?"
          message={`Are you sure you want to delete "${deletingCategory.name}"? This may affect items assigned to this category.`}
          onConfirm={() => {
            onDelete(deletingCategory.id);
            setDeletingCategory(null);
          }}
          onCancel={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
}
