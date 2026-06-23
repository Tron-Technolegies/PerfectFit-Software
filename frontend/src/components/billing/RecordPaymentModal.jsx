import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";

export default function RecordPaymentModal({ module, moduleId, dueAmount, onClose, onSave }) {
  const [method, setMethod] = useState("CASH");
  const [amount, setAmount] = useState(dueAmount || "");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);

  const methods = [
    { id: "CASH", label: "Cash" },
    { id: "UPI", label: "UPI" },
    { id: "BANK_TRANSFER", label: "Bank Transfer" }
  ];

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");
    setSaving(true);
    try {
      await axios.post("http://localhost:8000/api/payments/record/", {
        module: module,
        module_id: moduleId,
        amount: Number(amount),
        method: method,
        reference: reference
      });
      onSave(); // Trigger refresh
    } catch (err) {
      alert(err.response?.data?.error || "Failed to record payment");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 min-h-screen flex justify-center items-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-800">Record Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <FiX className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Balance Due</p>
              <p className="font-black text-2xl text-red-600 mt-1">₹{dueAmount}</p>
            </div>
            <button 
              onClick={() => setAmount(dueAmount)} 
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-sm transition-colors"
            >
              Pay Full
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount to Pay</label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-bold text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Method</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`border rounded-xl p-3 text-center transition-all font-bold text-xs ${
                    method === m.id ? "bg-pink-50 border-pink-300 text-pink-600 shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reference ID (Optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="UPI Txn ID or Cheque No."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all mt-2"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex-[2] py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 hover:shadow-pink-300 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
