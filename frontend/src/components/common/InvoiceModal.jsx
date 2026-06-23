import React from "react";
import { FiX, FiDownload } from "react-icons/fi";
import { getServerUrl } from "../../api/backendApi";

export default function InvoiceModal({ order, onClose, type = "stitching" }) {
  const handleDownload = () => {
    const url = getServerUrl(`/api/invoices/${type}/${order.id}/`);
    window.location.href = url;
  };

  // Helper to format currency
  const formatCurrency = (val) => `₹${Number(val).toLocaleString()}`;

  // Normalize order data based on type
  const billTo = {
    name: order.customer_name || order.customer || "Walk-in Customer",
    phone: order.customer_phone || order.phone || "N/A",
  };

  const invoiceDetails = {
    number: order.order_code || `#ORD-${order.id?.toString().padStart(4, "0")}`,
    date: order.order_date || order.rental_date || new Date().toISOString().split("T")[0],
    dueDate: order.delivery_date || order.return_date || "N/A",
  };

  const items = [];
  if (type === "stitching") {
    items.push({
      description: order.outfit_type,
      note: order.material_name || order.material || "Custom Stitching",
      type: "Custom Stitch",
      amount: order.total_amount,
    });
  } else if (type === "rental") {
    items.push({
      description: order.item_name,
      note: `Unit: ${order.item_code}`,
      type: "Rental",
      amount: order.rental_amount,
    });
  } else if (type === "accessory") {
    items.push({
      description: order.accessory_name,
      note: `Quantity: ${order.quantity}`,
      type: "Purchase",
      amount: order.total_price,
    });
  }

  const subtotal = order.total_amount || order.rental_amount || order.total_price || 0;
  const paid = order.advance_payment || order.advance_paid || order.paid_amount || 0;
  const discount = order.discount_amount || order.discount || 0;
  const totalPayable = subtotal - discount;
  const balance = totalPayable - paid;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Generate Invoice</h2>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
            <FiX className="text-gray-400" />
          </button>
        </div>
        {/* INVOICE CONTENT (PREVIEW) */}
        <div className="flex-1 overflow-y-auto p-12 bg-gray-50 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <FiDownload className="text-3xl text-pink-500" />
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-2">Invoice Ready</h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">
            The invoice for <span className="font-bold text-gray-800">{order.customer_name || order.customer || "the order"}</span> has been generated and is ready for download.
          </p>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full max-w-sm text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</span>
              <span className="text-sm font-bold text-gray-800">{order.order_code || `#ORD-${order.id}`}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Amount</span>
              <span className="text-lg font-black text-pink-600">{formatCurrency(order.total_amount || order.rental_amount || order.total_price)}</span>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-8 py-2 bg-slate-700 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all text-sm flex items-center gap-2 active:scale-95"
          >
            <FiDownload /> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
