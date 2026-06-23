import React, { useState } from "react";
import { FiX, FiUser, FiPhone, FiScissors, FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiTruck, FiRefreshCw, FiPlus } from "react-icons/fi";
import { collectStitchingPayment } from "../../api/stitchingApi";

export default function ViewStitchingOrderModal({ order, onClose, onRefresh }) {
  const [paymentAmount, setPaymentAmount] = useState(order?.due_amount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localOrder, setLocalOrder] = useState(order);

  if (!localOrder) return null;

  const handleCollectPayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) return;
    setIsSubmitting(true);
    try {
      const response = await collectStitchingPayment(localOrder.id, paymentAmount);
      setLocalOrder({
        ...localOrder,
        due_amount: response.data.due_amount,
        advance_payment: response.data.advance_payment
      });
      setPaymentAmount(0);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusIcons = {
    pending: <FiClock className="text-pink-500" />,
    in_progress: <FiScissors className="text-orange-500" />,
    ready: <FiCheckCircle className="text-green-500" />,
    delivered: <FiTruck className="text-gray-500" />,
  };

  const statusLabels = {
    pending: "Pending",
    in_progress: "In Progress",
    ready: "Ready",
    delivered: "Delivered",
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">#ORD-{order.id.toString().padStart(4, '0')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
            <FiX className="text-gray-400" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TOP INFO: STATUS & OUTFIT */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Outfit Type</p>
              <h3 className="text-xl font-bold text-gray-800 leading-tight">{localOrder.outfit_type}</h3>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
              localOrder.status === 'pending' ? 'bg-pink-50 border-pink-100 text-pink-600' :
              localOrder.status === 'in_progress' ? 'bg-orange-50 border-orange-100 text-orange-600' :
              localOrder.status === 'ready' ? 'bg-green-50 border-green-100 text-green-600' :
              'bg-gray-100 border-gray-200 text-gray-600'
            }`}>
              {statusIcons[localOrder.status]}
              {statusLabels[localOrder.status]}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* CUSTOMER INFO */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-pink-500 mb-1">
                  <FiUser size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Customer</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{localOrder.customer}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-pink-500 mb-1">
                  <FiPhone size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Phone</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{localOrder.phone}</p>
              </div>
            </div>
            {/* DATES */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FiCalendar size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Delivery Date</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{localOrder.delivery_date}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FiScissors size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Material</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{localOrder.material || "Own Material"}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{localOrder.material_used} meters used</p>
              </div>
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="pt-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-gray-800">₹ {localOrder.total_amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Advance Paid</span>
                <span className="font-bold text-green-600">- ₹ {localOrder.advance_payment}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                <span className="font-bold text-gray-800">Balance Due</span>
                <div className="flex flex-col items-end">
                  <span className={`text-xl font-black ${localOrder.due_amount > 0 ? 'text-pink-500' : 'text-green-600'}`}>
                    ₹ {localOrder.due_amount}
                  </span>
                  {localOrder.due_amount === 0 && <span className="text-[10px] font-bold text-green-500 uppercase tracking-tight">Fully Paid</span>}
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT COLLECTION SECTION */}
          {localOrder.due_amount > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="flex items-center gap-2 text-pink-500 mb-1">
                  <FiDollarSign size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Collect Remaining Balance</p>
               </div>
               <div className="flex gap-2">
                  <div className="relative flex-1">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                     <input 
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-bold text-gray-700"
                        placeholder="0.00"
                     />
                  </div>
                  <button 
                    onClick={handleCollectPayment}
                    disabled={isSubmitting || !paymentAmount}
                    className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? <FiRefreshCw className="animate-spin" /> : <FiPlus />}
                    Record
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
