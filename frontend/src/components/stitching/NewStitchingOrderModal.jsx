import { FiX, FiScissors, FiTag, FiCheckCircle, FiDownload } from "react-icons/fi";
import { getMaterials } from "../../api/materialApi";
import { createStitchingOrder } from "../../api/stitchingApi";
import { validateCoupon } from "../../api/couponApi";
import Toast from "../common/Toast";
import InvoiceModal from "../common/InvoiceModal";
import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  material_id: "",
  outfit_type: "",
  material_used: 0,
  measurements_taken: false,
  order_date: new Date().toISOString().split("T")[0],
  delivery_date: "",
  total_amount: "",
  advance_payment: 0,
};

export default function NewStitchingOrderModal({ onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [materials, setMaterials] = useState([]);
  const [saving, setSaving] = useState(false);
  const [payments, setPayments] = useState([{ amount: "", method: "CASH", reference: "" }]);
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await getMaterials();
        setMaterials(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await validateCoupon(couponCode, form.total_amount);
      if (res.data.valid) {
        setCouponData(res.data);
      } else {
        setCouponError(res.data.message);
        setCouponData(null);
      }
    } catch (err) {
      setCouponError("Invalid coupon code");
      setCouponData(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const [successData, setSuccessData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const total = Number(form.total_amount);
      const payload = {
        ...form,
        material_id: form.material_id ? Number(form.material_id) : null,
        material_used: Number(form.material_used),
        total_amount: total,
        payments: payments.filter(p => Number(p.amount) > 0),
        coupon_id: couponData?.coupon_id,
      };

      const res = await createStitchingOrder(payload);
      setSuccessData({ 
        ...payload, 
        id: res.data.order_id, 
        customer: form.name, 
        material_name: materials.find(m => m.id === Number(form.material_id))?.name 
      });
      onSave();
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.error || "Failed to create stitching order",
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  if (successData) {
    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 text-center space-y-6 animate-in zoom-in duration-300">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={40} className="text-green-500" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Order Created!</h2>
              <p className="text-gray-400 font-medium mt-1">Stitching order #ORD-{successData.id.toString().padStart(4, '0')} has been recorded.</p>
           </div>
           
           <div className="flex flex-col gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setShowInvoice(true)}
                className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                <FiDownload /> Download Invoice
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
              >
                Done
              </button>
           </div>
        </div>
        {showInvoice && (
          <InvoiceModal 
            order={successData} 
            type="stitching" 
            onClose={() => setShowInvoice(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/30">
          <div>
            <h2 className="text-xl font-bold text-gray-800">New Stitching Order</h2>
            <p className="text-xs text-gray-400 mt-0.5">Record custom measurements and material usage</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
            <FiX className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto">
          {/* CUSTOMER SECTION */}
          <section>
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Customer Name"
                required
              />
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
              <div className="md:col-span-2">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address (Optional)"
                />
              </div>
            </div>
          </section>

          {/* OUTFIT & MATERIAL SECTION */}
          <section className="pt-4 border-t border-gray-50">
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Garment & Fabric</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                name="outfit_type"
                value={form.outfit_type}
                onChange={handleChange}
                placeholder="Outfit Type (e.g. 3-Piece Suit)"
                required
              />
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm bg-white"
                name="material_id"
                value={form.material_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Material...</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} - {m.colour} ({m.available_stock}m available)
                  </option>
                ))}
              </select>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Material Used (Mtrs)</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                    name="material_used"
                    type="number"
                    step="0.1"
                    value={form.material_used}
                    onChange={handleChange}
                    placeholder="0.0"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="measurements"
                    name="measurements_taken"
                    checked={form.measurements_taken}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-pink-500 cursor-pointer"
                  />
                  <label htmlFor="measurements" className="text-sm text-gray-600 font-medium cursor-pointer">
                    Measurements Taken
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* COUPON SECTION */}
          <section className="pt-4 border-t border-gray-50">
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Offers & Coupons</h3>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-mono font-bold"
                  placeholder="ENTER COUPON CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={validatingCoupon || !couponCode}
                className="px-6 py-2 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-black transition disabled:opacity-50"
              >
                {validatingCoupon ? "..." : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{couponError}</p>}
            {couponData && (
              <p className="text-[10px] text-green-600 font-bold mt-1 ml-1 flex items-center gap-1">
                <FiCheckCircle /> Coupon Applied: ₹{couponData.discount_amount} off
              </p>
            )}
          </section>

          {/* DATES & PRICING */}
          <section className="pt-4 border-t border-gray-50">
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Timeline & Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Order Date</label>
                <input
                  name="order_date"
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
                  value={form.order_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Delivery Date</label>
                <input
                  name="delivery_date"
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
                  value={form.delivery_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Total Amount (Rs.)</label>
                <input
                  name="total_amount"
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none"
                  value={form.total_amount}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Payment Details</label>
                <button 
                  type="button" 
                  onClick={() => setPayments([...payments, { amount: "", method: "CASH", reference: "" }])}
                  className="text-[10px] uppercase font-black text-pink-500 bg-pink-50 px-2 py-1 rounded-lg hover:bg-pink-100"
                >
                  + Add Payment
                </button>
              </div>
              {payments.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={p.amount}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[idx].amount = e.target.value;
                        setPayments(newP);
                      }}
                      placeholder="Amount"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-semibold"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={p.method}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[idx].method = e.target.value;
                        setPayments(newP);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm bg-white"
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI / GPay</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="flex-[1.5]">
                    <input
                      type="text"
                      value={p.reference}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[idx].reference = e.target.value;
                        setPayments(newP);
                      }}
                      placeholder="Ref # (Optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                    />
                  </div>
                  {payments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPayments(payments.filter((_, i) => i !== idx))}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal:</span>
                <span>Rs. {form.total_amount || 0}</span>
              </div>
              {couponData && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>- Rs. {couponData.discount_amount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-gray-800 font-bold">Total Payable:</span>
                <span className="text-xl font-black text-pink-600">
                  Rs. {(form.total_amount || 0) - (couponData?.discount_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Advance Paid:</span>
                <span>Rs. {totalPaid}</span>
              </div>
              <div className="pt-1 flex justify-between items-center font-bold text-gray-800">
                <span className="text-sm">Balance Due:</span>
                <span>Rs. {(form.total_amount || 0) - (couponData?.discount_amount || 0) - totalPaid}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-white hover:transition-all text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-2.5 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-sm flex items-center gap-2"
          >
            {saving ? "Creating..." : "Confirm & Save Order"}
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
