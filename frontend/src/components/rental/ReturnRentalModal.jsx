import React, { useState, useEffect } from "react";
import { FiX, FiDollarSign, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";

export default function ReturnRentalModal({ rental, onClose, onConfirm }) {
  const [collectedAmount, setCollectedAmount] = useState(rental.due_amount || 0);
  const [collectMethod, setCollectMethod] = useState("CASH");
  const [collectRef, setCollectRef] = useState("");
  const [deductedAmount, setDeductedAmount] = useState(0);
  const [damageNotes, setDamageNotes] = useState("");
  const [refundAmount, setRefundAmount] = useState(rental.security_deposit || 0);
  const [refundMethod, setRefundMethod] = useState("CASH");
  const [refundRef, setRefundRef] = useState("");

  useEffect(() => {
    // Auto calculate refund: Security Deposit - Deduction
    const deposit = Number(rental.security_deposit || 0);
    const deduction = Number(deductedAmount || 0);
    setRefundAmount(Math.max(0, deposit - deduction));
  }, [deductedAmount, rental.security_deposit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      collected_amount: Number(collectedAmount),
      payment_method: collectMethod,
      payment_reference: collectRef,
      deducted_amount: Number(deductedAmount),
      refunded_amount: Number(refundAmount),
      refund_method: refundMethod,
      refund_reference: refundRef,
      damage_notes: damageNotes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Return Item & Final Settlement</h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Order: {rental.order_code}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-400">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* RENTAL BALANCE SECTION */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-pink-500 uppercase tracking-widest flex items-center gap-1">
                <FiDollarSign /> Rental Balance
              </h3>
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100/50 space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-600">
                  <span>Rental Due:</span>
                  <span className="font-bold">₹ {rental.due_amount}</span>
                </div>
                <div className="pt-2 border-t border-pink-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Collect Due (Rs.)</label>
                      <div className="relative group mt-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                           <FiDollarSign size={14} />
                        </div>
                        <input 
                          type="number"
                          step="0.01"
                          value={collectedAmount}
                          onChange={(e) => setCollectedAmount(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-pink-300 transition-all font-bold text-gray-800 text-sm bg-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                      <select
                        value={collectMethod}
                        onChange={(e) => setCollectMethod(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm bg-white font-semibold text-gray-700"
                      >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI / GPay</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                  {Number(collectedAmount) > 0 && (
                    <div className="animate-in slide-in-from-top-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Reference Number (Optional)</label>
                      <input 
                        type="text"
                        value={collectRef}
                        onChange={(e) => setCollectRef(e.target.value)}
                        className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-200 outline-none focus:border-pink-300 text-xs"
                        placeholder="Enter UPI reference / txn ID"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECURITY DEPOSIT SECTION */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                <FiInfo /> Security Deposit
              </h3>
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 space-y-4">
                <div className="flex justify-between text-xs font-medium text-gray-600">
                  <span>Held Deposit:</span>
                  <span className="font-bold text-indigo-600 font-mono">₹ {rental.security_deposit}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Deduction (Rs.)</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={deductedAmount}
                      onChange={(e) => setDeductedAmount(e.target.value)}
                      className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-200 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-red-500 text-sm bg-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">To Refund (Rs.)</label>
                    <div className="w-full px-4 py-2.5 mt-1 rounded-xl bg-white border border-gray-200 font-bold text-green-600 text-sm">
                      ₹ {refundAmount}
                    </div>
                  </div>
                </div>

                {Number(refundAmount) > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-1 animate-in slide-in-from-top-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Refund Method</label>
                      <select
                        value={refundMethod}
                        onChange={(e) => setRefundMethod(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 outline-none text-sm bg-white font-semibold text-gray-700"
                      >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI / GPay</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Refund Ref (Opt)</label>
                      <input 
                        type="text"
                        value={refundRef}
                        onChange={(e) => setRefundRef(e.target.value)}
                        className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-200 outline-none focus:border-indigo-300 text-xs"
                        placeholder="Txn ID"
                      />
                    </div>
                  </div>
                )}

                {Number(deductedAmount) > 0 && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Damage/Deduction Notes</label>
                    <textarea 
                      value={damageNotes}
                      onChange={(e) => setDamageNotes(e.target.value)}
                      className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-200 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all text-sm h-20 resize-none"
                      placeholder="Explain the reason for deduction (e.g. minor stain, late return fee)..."
                      required={Number(deductedAmount) > 0}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SUMMARY BOX */}
            <div className="p-4 rounded-xl bg-gray-900 text-white space-y-2 shadow-xl">
               <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold opacity-60">
                  <span>Net Settlement</span>
                  <span>Amount</span>
               </div>
               <div className="flex justify-between text-sm font-medium">
                  <span>Cash to Collect (Due):</span>
                  <span className="text-pink-400 font-mono">+ ₹ {collectedAmount}</span>
               </div>
               <div className="flex justify-between text-sm font-medium">
                  <span>Cash to Give (Refund):</span>
                  <span className="text-green-400 font-mono">- ₹ {refundAmount}</span>
               </div>
               <div className="pt-2 border-t border-white/10 flex justify-between items-center font-black">
                  <span className="uppercase tracking-tighter text-xs">Total Customer Payback</span>
                  <span className="text-lg">₹ {Number(collectedAmount) - Number(refundAmount)}</span>
               </div>
               <p className="text-[9px] text-white/40 italic">* Positive value means customer pays you. Negative means you pay customer back.</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-white hover:shadow-sm transition-all text-sm border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <FiCheck /> Finalize Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
