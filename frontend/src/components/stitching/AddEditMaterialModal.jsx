import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { createMaterial, updateMaterial } from "../../api/materialApi";

const emptyForm = {
  name: "",
  description: "",
  price_per_meter: "",
  colour: "",
  total_stock: 0,
  available_stock: 0,
};

export default function AddEditMaterialModal({ material, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (material) {
      setForm({
        name: material.name || "",
        description: material.description || "",
        price_per_meter: material.price_per_meter || "",
        colour: material.colour || "",
        total_stock: material.total_stock || 0,
        available_stock: material.available_stock || 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price_per_meter: Number(form.price_per_meter),
        total_stock: Number(form.total_stock),
        available_stock: Number(form.available_stock),
      };

      if (material) {
        await updateMaterial(material.id, payload);
      } else {
        await createMaterial(payload);
      }
      onSave();
      onClose();
    } catch (err) {
      alert("Failed to save material");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-xl"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00000014]">
          <h2 className="font-bold text-gray-800">{material ? "Edit Material" : "Add New Material"}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Material Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Premium Wool, Silk Blend"
              className="w-full border px-4 py-2 rounded-lg outline-none focus:border-pink-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Colour</label>
              <input
                name="colour"
                value={form.colour}
                onChange={handleChange}
                placeholder="e.g. Navy Blue"
                className="w-full border px-4 py-2 rounded-lg outline-none focus:border-pink-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Price per Meter</label>
              <input
                name="price_per_meter"
                type="number"
                value={form.price_per_meter}
                onChange={handleChange}
                placeholder="Rs."
                className="w-full border px-4 py-2 rounded-lg outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Total Stock (Mtrs)</label>
              <input
                name="total_stock"
                type="number"
                value={form.total_stock}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg outline-none focus:border-pink-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Available Stock (Mtrs)</label>
              <input
                name="available_stock"
                type="number"
                value={form.available_stock}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Details about quality, thread count, etc."
              className="w-full border px-4 py-2 rounded-lg outline-none h-24 resize-none focus:border-pink-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-[#00000014] flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-pink-500 text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Material"}
          </button>
        </div>
      </form>
    </div>
  );
}
