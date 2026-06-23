import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const emptyForm = {
  name: "",
  prefix: "",
};

export default function AddEditCategoryModal({ category, saving, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!category) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: category.name || "",
      prefix: category.prefix || "",
    });
  }, [category]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-xl border border-[#00000014] overflow-hidden"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00000014]">
          <h2 className="font-semibold">{category ? "Edit Category" : "Add New Category"}</h2>
          <FiX onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-gray-700 mb-1">Category Name</label>
            <input
              className="input w-full"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Casual, Formal"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Prefix</label>
            <input
              className="input w-full"
              name="prefix"
              value={form.prefix}
              onChange={handleChange}
              placeholder="e.g., CAS, FOR"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Used for generating item codes.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#00000014]">
          <button type="button" onClick={onClose} className="border px-4 py-2 rounded-lg text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : category ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
