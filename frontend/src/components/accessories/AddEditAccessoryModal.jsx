import React, { useState, useEffect } from "react";
import { FiX, FiPackage, FiTag, FiDollarSign, FiCheck, FiRefreshCw, FiFileText } from "react-icons/fi";
import Toast from "../common/Toast";

export default function AddEditAccessoryModal({ onClose, onSave, accessory = null }) {
  const [form, setForm] = useState({
    name: "",
    category: "Formal",
    price: "",
    stock: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (accessory) {
      setForm({
        name: accessory.name || "",
        category: accessory.category || "Formal",
        price: accessory.price || "",
        stock: accessory.stock || "",
        description: accessory.description || "",
      });
      if (accessory.image_url) {
        setImagePreview(accessory.image_url);
      }
    }
  }, [accessory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return;

    setSaving(true);
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSave(formData);
    setSaving(false);
    onClose();
  };

  const categories = ["Formal", "Casual", "Jewelry", "Essentials", "Other"];

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FiPackage className="text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {accessory ? "Edit Accessory" : "Add New Accessory"}
              </h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                Product Inventory Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-400 hover:text-gray-600"
          >
            <FiX />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: IMAGE */}
          <div className="space-y-4">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                Product Image
             </label>
             <div className="relative group aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center hover:border-pink-300 transition-colors">
                {imagePreview ? (
                   <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                   <div className="text-center p-4">
                      <FiPackage className="mx-auto text-gray-300 mb-2" size={48} />
                      <p className="text-[10px] text-gray-400 font-bold uppercase">No Image Uploaded</p>
                   </div>
                )}
                <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                   <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                   Change Image
                </label>
             </div>
             <p className="text-[10px] text-gray-400 italic text-center">Recommended: Square aspect ratio, under 2MB</p>
          </div>

          {/* RIGHT COLUMN: FIELDS */}
          <div className="space-y-4">
            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FiPackage size={12} /> Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Silk Neck Tie"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-50 outline-none text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* CATEGORY */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FiTag size={12} /> Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FiDollarSign size={12} /> Selling Price
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* STOCK */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FiPackage size={12} /> Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                />
              </div>

              {/* DESCRIPTION (Placeholder space or other field) */}
              <div className="flex items-end text-[10px] text-gray-400 italic pb-2">
                Stock will be updated on every sale automatically.
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FiFileText size={12} /> Description (Optional)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Add some details about the product..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-5 bg-gray-50/30 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-white hover:shadow-sm transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-sm flex items-center gap-2"
          >
            {saving ? (
              <FiRefreshCw className="animate-spin" />
            ) : (
              <FiCheck />
            )}
            {saving ? "Saving..." : accessory ? "Update Accessory" : "Add Accessory"}
          </button>
        </div>
      </form>

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
