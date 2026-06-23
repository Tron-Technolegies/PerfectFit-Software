import React, { useState } from "react";
import { FiX, FiCheckCircle, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { returnRental } from "../../api/rentalApi";
import Toast from "../common/Toast";

export default function ReturnDetailsModal({ data, onClose, onBack }) {
  const [condition, setCondition] = useState("Excellent");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const [collectedAmount, setCollectedAmount] = useState(data?.due_amount || 0);

/* 
  const conditions = [
    { name: "Excellent", icon: <FiCheckCircle /> },
    { name: "Good", icon: <FiCheckCircle /> },
    { name: "Damaged", icon: <FiAlertTriangle /> },
  ];
  */

  const handleProcessReturn = async () => {
    setProcessing(true);
    try {
      await returnRental(data.id, collectedAmount);
      setToast({ message: "Item returned successfully!", type: "success" });
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to update stats
      }, 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Failed to process return", type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 h-screen flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-[#00000014] overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00000014]">
          <h2 className="font-semibold text-gray-800">Receive Return</h2>
          <FiX onClick={onClose} className="cursor-pointer text-gray-500" />
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* SELECTED ORDER */}
          <div className="border border-[#00000014] rounded-lg p-4 bg-gray-50/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-pink-600 font-semibold">{data?.order_code || "#ORD-0000"}</p>
                <p className="text-gray-700 text-sm font-bold uppercase tracking-tight">{data?.customer_name}</p>
                <p className="text-xs text-gray-400">{data?.item_name}</p>
              </div>

              <button onClick={onBack} className="text-xs text-pink-500 font-medium hover:underline">
                Change Order
              </button>
            </div>

            {/* ORDER DETAILS */}
            <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-gray-500">
              <div>
                <p>Rent Amount</p>
                <p className="font-medium text-gray-800">₹{data?.rental_amount}</p>
              </div>
              <div>
                <p>Remaining Due</p>
                <p className="font-medium text-red-500 font-mono">₹{data?.due_amount}</p>
              </div>
              <div>
                <p>Return Date</p>
                <p className="font-medium text-gray-800">{data?.return_date}</p>
              </div>
            </div>
          </div>

          {/* PAYMENT COLLECTION */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
              Payment Collection
            </h4>
            <div className="bg-[#FFF5F8] border border-pink-100 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-pink-600 font-bold uppercase tracking-wider">Amount to Collect</p>
                  <p className="text-[10px] text-pink-400 font-medium mt-0.5">Collect the remaining due from customer</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input 
                    type="number"
                    value={collectedAmount}
                    onChange={(e) => setCollectedAmount(e.target.value)}
                    className="pl-7 pr-4 py-2 border border-pink-200 rounded-lg outline-none w-32 font-bold text-gray-800 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* INSPECTION - Placeholder for visual completeness */}
          <div className="opacity-50 pointer-events-none">
            <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Inspection Details
            </h4>
            <div className="grid grid-cols-3 gap-3">
                {['Excellent', 'Good', 'Damaged'].map(c => (
                    <div key={c} className={`p-2 border border-gray-200 rounded-lg text-center text-xs ${c === condition ? 'bg-gray-100' : ''}`}>
                        {c}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#00000014]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#00000014] rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button 
            onClick={handleProcessReturn}
            disabled={processing}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {processing ? <FiRefreshCw className="animate-spin" /> : null}
            Process Return
          </button>
        </div>
      </div>

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
