import React, { useState, useEffect } from "react";
import {
  FiX,
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiCheck,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTag,
  FiPercent
} from "react-icons/fi";
import { validateCoupon } from "../../api/couponApi";
import { recordAccessorySale, updateAccessorySale } from "../../api/accessoriesApi";
import Toast from "../common/Toast";
import InvoiceModal from "../common/InvoiceModal";
import { FiDownload, FiCheckCircle } from "react-icons/fi";

export default function SellAccessoryModal({ onClose, onSave, accessory, sale = null }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    quantity: 1,
    discount: 0,
  });
  const [saving, setSaving] = useState(false);
  const [payments, setPayments] = useState([{ amount: "", method: "CASH", reference: "" }]);
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const [toast, setToast] = useState(null);


  useEffect(() => {
    if (sale) {
      setForm({
        customer_name: sale.customer_name || "",
        customer_phone: sale.customer_phone || "",
        customer_email: sale.customer_email || "",
        customer_address: sale.customer_address || "",
        quantity: sale.quantity || 1,
        discount: sale.discount || 0,
      });
    }
  }, [sale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      const subtotal = Number(accessory.price) * Number(form.quantity);
      const res = await validateCoupon(couponCode, subtotal);
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

  const totalPrice = (
    Number(accessory.price) * Number(form.quantity) - 
    Number(form.discount || 0) - 
    (couponData?.discount_amount || 0)
  ).toFixed(2);

  useEffect(() => {
    if (payments.length === 1 && (payments[0].amount === "" || Number(payments[0].amount) === 0 || Number(payments[0].amount) !== Number(totalPrice))) {
      setPayments([{ amount: totalPrice, method: payments[0].method, reference: payments[0].reference }]);
    }
  }, [totalPrice]);

  const [successData, setSuccessData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.quantity) return;

    // Check stock only for new sales or if quantity increased
    const stockChange = sale ? Number(form.quantity) - Number(sale.quantity) : Number(form.quantity);
    if (stockChange > accessory.stock) {
      setToast({ message: "Not enough stock available!", type: "error" });
      return;
    }

    setSaving(true);
    try {
      let res;
      const saleData = {
        ...form,
        coupon_id: couponData?.coupon_id,
        total_price: totalPrice,
        payments: payments.filter(p => Number(p.amount) > 0),
      };

      if (sale) {
        res = await updateAccessorySale(sale.id, saleData);
      } else {
        res = await recordAccessorySale({
          accessory_id: accessory.id,
          ...saleData
        });
      }

      setSuccessData({
        ...saleData,
        id: res.data.sale_id || sale?.id,
        accessory_name: accessory.name,
        discount: Number(form.discount || 0) + (couponData?.discount_amount || 0)
      });
      onSave(); // Trigger refresh in parent
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Sale failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (successData) {
    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 text-center space-y-6 animate-in zoom-in duration-300">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={40} className="text-green-500" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Sale Recorded!</h2>
              <p className="text-gray-400 font-medium mt-1">Receipt #{successData.id?.toString().padStart(4, '0')} has been generated.</p>
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
            type="accessory" 
            onClose={() => setShowInvoice(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4 backdrop-blur-sm overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiShoppingCart className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{sale ? "Edit Sale History" : "Sell Accessory"}</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                {sale ? "Correction / Return Adjustment" : "New Sales Entry"}
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

        <div className="p-6 space-y-6">
          {/* PRODUCT INFO PREVIEW */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
                {accessory.image_url ? (
                   <img src={accessory.image_url} className="w-full h-full object-cover" alt="" />
                ) : (
                   <FiPackage className="text-pink-500" size={24} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">{accessory.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  {accessory.category} • Price: ₹{accessory.price}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Current Stock</p>
              <p className="text-lg font-black text-gray-800">{accessory.stock}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* CUSTOMER INFO */}
             <div className="space-y-4">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <FiUser size={12} /> Customer Information
                </h5>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 ml-1">Customer Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-300 outline-none text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-500 ml-1 flex items-center gap-1">
                        <FiPhone size={10} /> Phone
                     </label>
                     <input
                       type="text"
                       name="customer_phone"
                       value={form.customer_phone}
                       onChange={handleChange}
                       placeholder="Phone"
                       className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-green-300 outline-none text-sm transition-all"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-500 ml-1 flex items-center gap-1">
                        <FiMail size={10} /> Email
                     </label>
                     <input
                       type="email"
                       name="customer_email"
                       value={form.customer_email}
                       onChange={handleChange}
                       placeholder="Email"
                       className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-green-300 outline-none text-sm transition-all"
                     />
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 ml-1 flex items-center gap-1">
                     <FiMapPin size={10} /> Address (Optional)
                  </label>
                  <textarea
                    name="customer_address"
                    value={form.customer_address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Billing address..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-300 outline-none text-sm transition-all resize-none"
                  />
                </div>
             </div>

             {/* ORDER DETAILS */}
             <div className="space-y-4">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <FiShoppingCart size={12} /> Order Details
                </h5>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-500 ml-1">Quantity</label>
                     <input
                       type="number"
                       name="quantity"
                       value={form.quantity}
                       onChange={handleChange}
                       min="1"
                       required
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-300 outline-none text-sm"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-500 ml-1 flex items-center gap-1">
                        <FiPercent size={10} /> Discount (₹)
                     </label>
                     <input
                       type="number"
                       name="discount"
                       value={form.discount}
                       onChange={handleChange}
                       min="0"
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-300 outline-none text-sm"
                     />
                   </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-dashed border-gray-200 mt-6">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Subtotal</span>
                      <span className="text-sm font-bold text-gray-600">₹{(Number(accessory.price) * Number(form.quantity)).toFixed(2)}</span>
                   </div>
                   {Number(form.discount) > 0 && (
                     <div className="flex justify-between items-center mb-2 text-red-500">
                       <span className="text-[10px] font-bold uppercase">Manual Discount</span>
                       <span className="text-sm font-bold">- ₹{Number(form.discount).toFixed(2)}</span>
                     </div>
                   )}
                   {couponData && (
                     <div className="flex justify-between items-center mb-2 text-green-600">
                       <span className="text-[10px] font-bold uppercase">Coupon ({couponCode})</span>
                       <span className="text-sm font-bold">- ₹{couponData.discount_amount.toFixed(2)}</span>
                     </div>
                   )}
                   <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-black text-gray-800 uppercase tracking-widest">Total Amount</span>
                      <span className="text-2xl font-black text-green-600 tracking-tight">₹ {totalPrice}</span>
                   </div>
                </div>

                {/* COUPON INPUT */}
                <div className="space-y-2 pt-2">
                   <label className="text-[10px] font-bold text-gray-500 ml-1 flex items-center gap-1">
                      <FiTag size={10} /> Have a Coupon?
                   </label>
                   <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-green-300 outline-none text-xs font-mono font-bold uppercase"
                        placeholder="COUPON CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition disabled:opacity-50"
                      >
                        {validatingCoupon ? "..." : "Apply"}
                      </button>
                   </div>
                   {couponError && <p className="text-[9px] text-red-500 font-bold ml-1">{couponError}</p>}
                   {couponData && <p className="text-[9px] text-green-600 font-bold ml-1">✓ Applied!</p>}
                </div>

                {/* PAYMENT DETAILS */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-gray-500 ml-1 flex items-center gap-1">
                         Payment Details
                      </label>
                      <button 
                         type="button" 
                         onClick={() => setPayments([...payments, { amount: "", method: "CASH", reference: "" }])}
                         className="text-[9px] uppercase font-black text-green-500 bg-green-50 px-2 py-1 rounded hover:bg-green-100"
                      >
                         + Split Mode
                      </button>
                   </div>
                   {payments.map((p, idx) => (
                      <div key={idx} className="flex gap-1.5 items-start">
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
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-green-300 outline-none text-xs font-semibold"
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
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-green-300 outline-none text-xs bg-white"
                            >
                              <option value="CASH">Cash</option>
                              <option value="UPI">UPI / GPay</option>
                              <option value="BANK_TRANSFER">Bank Transfer</option>
                            </select>
                         </div>
                         {payments.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setPayments(payments.filter((_, i) => i !== idx))}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                            >
                              <FiX size={14} />
                            </button>
                         )}
                      </div>
                   ))}
                </div>
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
            disabled={saving || form.quantity > accessory.stock}
            className="px-8 py-2.5 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-sm flex items-center gap-2"
          >
            {saving ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
            {saving ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
