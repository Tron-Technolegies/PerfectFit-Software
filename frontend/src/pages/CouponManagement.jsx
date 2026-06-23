import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiTag, FiCheck, FiX } from "react-icons/fi";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../api/couponApi";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase_amount: 0,
    valid_from: new Date().toISOString().slice(0, 16),
    valid_to: "",
    usage_limit: "",
    active: true,
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await getCoupons();
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_purchase_amount: coupon.min_purchase_amount,
        valid_from: coupon.valid_from.slice(0, 16),
        valid_to: coupon.valid_to.slice(0, 16),
        usage_limit: coupon.usage_limit || "",
        active: coupon.active,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_purchase_amount: 0,
        valid_from: new Date().toISOString().slice(0, 16),
        valid_to: "",
        usage_limit: "",
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, formData);
        setToast({ message: "Coupon updated successfully", type: "success" });
      } else {
        await createCoupon(formData);
        setToast({ message: "Coupon created successfully", type: "success" });
      }
      setIsModalOpen(false);
      loadCoupons();
    } catch (err) {
      setToast({ message: "Error saving coupon", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await deleteCoupon(id);
        setToast({ message: "Coupon deleted", type: "success" });
        loadCoupons();
      } catch (err) {
        setToast({ message: "Error deleting coupon", type: "error" });
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coupons & Offers</h1>
          <p className="text-gray-500 text-sm">Manage discount codes for your customers</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-pink-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-100 hover:bg-pink-600 transition"
        >
          <FiPlus /> Create New Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#00000014] overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-[#00000014] text-xs font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min. Purchase</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000014]">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400 italic">
                    No active coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiTag className="text-pink-500" />
                        <span className="font-mono font-bold text-gray-700">{c.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {c.discount_type === "percentage" ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">₹{c.min_purchase_amount}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <p className="text-gray-400">Ends: {new Date(c.valid_to).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <span className="font-bold text-gray-700">{c.used_count}</span>
                        {c.usage_limit && <span className="text-gray-400"> / {c.usage_limit}</span>}
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Redemptions</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {c.active ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3 text-gray-400">
                        <FiEdit className="cursor-pointer hover:text-pink-500 transition" onClick={() => handleOpenModal(c)} />
                        <FiTrash2 className="cursor-pointer hover:text-red-500 transition" onClick={() => handleDelete(c.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition">
                <FiX className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Coupon Code</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-mono uppercase font-bold"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="E.G. SUMMER2026"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Type</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none"
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Value</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === "percentage" ? "10" : "500"}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Min. Purchase (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Usage Limit</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Infinite if empty"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Valid To (Expiry Date)</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none"
                    value={formData.valid_to}
                    onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  className="w-4 h-4 accent-pink-500"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <label htmlFor="active" className="text-sm text-gray-600 font-medium cursor-pointer">
                  This coupon is currently active and can be used
                </label>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition">
                Cancel
              </button>
              <button type="submit" className="bg-pink-500 text-white px-10 py-2.5 rounded-xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 active:scale-95 transition">
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
