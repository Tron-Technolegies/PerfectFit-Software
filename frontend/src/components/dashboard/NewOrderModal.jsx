import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function NewOrderModal({ onClose }) {
  return (
    <div className="fixed inset-0 h-screen bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-[#00000014] overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00000014]">
          <h2 className="font-semibold text-lg">New Custom Stitching Order</h2>
          <FiX onClick={onClose} className="cursor-pointer text-gray-500" />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 text-sm">
          {/* CUSTOMER */}
          <div>
            <p className="font-medium mb-3">Customer Information</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center border border-[#00000014] rounded-lg px-3 py-2">
                <input placeholder="Enter customer name" className="w-full outline-none" />
                <FiSearch />
              </div>

              <input
                placeholder="+91 98765 43210"
                className="border border-[#00000014] rounded-lg px-3 py-2"
              />
            </div>

            <input
              placeholder="customer@example.com"
              className="border border-[#00000014] rounded-lg px-3 py-2 mt-3 w-full"
            />
          </div>

          {/* ORDER */}
          <div>
            <p className="font-medium mb-3">Order Details</p>

            <div className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="Order Type" />
              <input className="input" placeholder="Item Description" />
              <input className="input" placeholder="Order Date" />
              <input className="input" placeholder="Expected Delivery" />
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <p className="font-medium mb-3">Payment & Measurements</p>

            <div className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="₹ 12000" />
              <input className="input" placeholder="₹ 6000" />
            </div>

            <p className="text-xs text-gray-400 mt-3">Measurements taken</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#00000014]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#00000014] rounded-lg text-sm cursor-pointer"
          >
            Cancel
          </button>

          <button className="px-5 py-2 bg-pink-500 text-white rounded-lg text-sm cursor-pointer hover:bg-pink-600">
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
