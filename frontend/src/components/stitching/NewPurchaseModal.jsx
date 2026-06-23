import React, { useState, useEffect } from "react";
import { FiX, FiShoppingCart, FiDatabase, FiArrowRight, FiCheck, FiRefreshCw } from "react-icons/fi";
import { getMaterials, recordMaterialPurchase } from "../../api/materialApi";
import Toast from "../common/Toast";

export default function NewPurchaseModal({ onClose, onSave, preSelectedMaterialId = "" }) {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    material_id: preSelectedMaterialId,
    quantity: "",
    cost_per_unit: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await getMaterials();
        setMaterials(response.data);
      } catch (err) {
        console.error("Failed to load materials", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.material_id || !form.quantity || !form.cost_per_unit) return;

    setSaving(true);
    try {
      await recordMaterialPurchase({
        material_id: Number(form.material_id),
        quantity: Number(form.quantity),
        cost_per_unit: Number(form.cost_per_unit),
      });
      onSave(); // Refresh both materials list and history
      onClose();
    } catch (err) {
      setToast({
        message: err.response?.data?.error || "Failed to record purchase",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedMaterial = materials.find(m => m.id === Number(form.material_id));
  const totalCost = (Number(form.quantity || 0) * Number(form.cost_per_unit || 0)).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FiShoppingCart className="text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Record Purchase</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Update Material Stock</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-400 hover:text-gray-600">
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* MATERIAL SELECT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Material</label>
            <select
              name="material_id"
              value={form.material_id}
              onChange={handleChange}
              disabled={loading || !!preSelectedMaterialId}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-50 outline-none text-sm transition-all appearance-none bg-no-repeat bg-[right_1rem_center] bg-white disabled:bg-gray-50"
            >
              <option value="">Choose a material...</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
            {selectedMaterial && (
              <div className="flex items-center gap-2 mt-2 ml-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                   Current Stock: {selectedMaterial.available_stock} meters
                </p>
              </div>
            )}
          </div>

          {/* QUANTITY & COST */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Quantity (Mtrs)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-bold text-gray-700"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cost / Meter</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  name="cost_per_unit"
                  value={form.cost_per_unit}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-bold text-gray-700"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-dashed border-gray-200 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                 <FiDatabase size={12} /> New Entry
              </span>
              <div className="flex items-center gap-2 text-pink-500 font-bold">
                 <span>{selectedMaterial ? selectedMaterial.available_stock : 0}</span>
                 <FiArrowRight size={12} />
                 <span className="text-pink-600 underline">
                   {(Number(selectedMaterial?.available_stock || 0) + Number(form.quantity || 0)).toFixed(2)}
                 </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Total Cost</span>
               <span className="text-xl font-black text-gray-800 tracking-tight">₹ {totalCost}</span>
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
            disabled={saving || !form.material_id || !form.quantity || !form.cost_per_unit}
            className="px-8 py-2.5 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-sm flex items-center gap-2"
          >
            {saving ? (
              <FiRefreshCw className="animate-spin" />
            ) : (
              <FiCheck />
            )}
            {saving ? "Processing..." : "Confirm Purchase"}
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
