import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { addExpense } from "../../api/financialApi";

export default function AddExpenseModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      await addExpense({
        amount: Number(amount),
        category,
        description
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl border border-[#00000014] overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00000014]">
          <h2 className="font-semibold text-lg">Add New Expense</h2>
          <FiX onClick={onClose} className="cursor-pointer text-gray-500" />
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {/* CATEGORY */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input w-full"
            >
              <option value="salary">Salary</option>
              <option value="rent">Shop Rent</option>
              <option value="purchase">Material Purchase</option>
              <option value="other">Other Expense</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter expense description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full h-20 resize-none"
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full" 
            />
          </div>
        </form>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#00000014]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#00000014] rounded-lg text-sm cursor-pointer"
          >
            Cancel
          </button>

          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2 bg-pink-500 text-white rounded-lg text-sm cursor-pointer hover:bg-pink-600 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
