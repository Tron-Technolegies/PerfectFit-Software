import React, { useState, useEffect, useRef } from "react";
import { FiX, FiDownload, FiSearch } from "react-icons/fi";
import { getServerUrl } from "../../api/backendApi";
import { getStitchingOrders } from "../../api/stitchingApi";
import { getRentals } from "../../api/rentalApi";
import { getAccessorySales } from "../../api/accessoriesApi";

export default function GenerateInvoiceModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("stitching");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        let res;
        if (activeTab === "stitching") res = await getStitchingOrders();
        else if (activeTab === "rental") res = await getRentals();
        else if (activeTab === "accessory") res = await getAccessorySales();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
    setSelectedOrder(null);
  }, [activeTab]);

  const handleDownload = () => {
    if (!selectedOrder) return;
    const typeMap = {
      stitching: "stitching",
      rental: "rental",
      accessory: "accessory",
    };
    const orderType = typeMap[activeTab];
    const url = getServerUrl(`/api/invoices/${orderType}/${selectedOrder.id}/`);
    window.location.href = url;
  };

  const formatCurrency = (val) => `₹${Number(val).toLocaleString()}`;

  // Invoice Logic
  const getInvoiceData = () => {
    if (!selectedOrder) return null;
    
    let billTo = selectedOrder.customer_name || selectedOrder.customer || "Walk-in Customer";
    let phone = selectedOrder.customer_phone || selectedOrder.phone || "N/A";
    let number = selectedOrder.order_code || `#ORD-${selectedOrder.id?.toString().padStart(4, "0")}`;
    let date = selectedOrder.order_date || selectedOrder.rental_date || selectedOrder.date || "N/A";
    let dueDate = selectedOrder.delivery_date || selectedOrder.return_date || "N/A";

    let itemDesc = "";
    let itemNote = "";
    let itemType = "";
    let itemAmount = 0;

    if (activeTab === "stitching") {
      itemDesc = selectedOrder.outfit_type;
      itemNote = selectedOrder.material_name || "Custom Stitching";
      itemType = "Custom Stitch";
      itemAmount = selectedOrder.total_amount;
    } else if (activeTab === "rental") {
      itemDesc = selectedOrder.item_name;
      itemNote = `Unit: ${selectedOrder.item_code}`;
      itemType = "Rental";
      itemAmount = selectedOrder.rental_amount;
    } else if (activeTab === "accessory") {
      itemDesc = selectedOrder.accessory_name;
      itemNote = `Quantity: ${selectedOrder.quantity}`;
      itemType = "Purchase";
      itemAmount = selectedOrder.total_price;
    }

    const subtotal = itemAmount;
    const paid = selectedOrder.advance_payment || selectedOrder.advance_paid || selectedOrder.paid_amount || 0;
    const discount = selectedOrder.discount_amount || selectedOrder.discount || 0;
    const totalPayable = subtotal - discount;
    const balance = totalPayable - paid;

    return { billTo, phone, number, date, dueDate, itemDesc, itemNote, itemType, itemAmount, subtotal, paid, discount, balance };
  };

  const inv = getInvoiceData();

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/30">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Generate Invoice</h2>
            <p className="text-xs text-gray-400 mt-0.5">Select an order to view and download invoice</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
            <FiX className="text-gray-400" />
          </button>
        </div>

        {/* SELECTOR */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 space-y-4">
          <div className="flex gap-2 p-1 bg-gray-200/50 rounded-xl w-fit">
            {["stitching", "rental", "accessory"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? "bg-white text-pink-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}s
              </button>
            ))}
          </div>

          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none text-sm font-bold text-gray-700 focus:border-pink-300 transition-all bg-white appearance-none"
              onChange={(e) => setSelectedOrder(orders.find(o => o.id === Number(e.target.value)))}
              value={selectedOrder?.id || ""}
            >
              <option value="">Select Order *</option>
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.order_code || `#ORD-${o.id}`} - {o.customer_name || o.customer} ({o.outfit_type || o.item_name || o.accessory_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {selectedOrder ? (
            <div
              ref={invoiceRef}
              className="bg-white mx-auto w-full p-16 font-sans relative overflow-hidden"
              style={{ minHeight: "297mm", color: '#1f2937', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
            >
              {/* Watermark/Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-30" style={{ backgroundColor: '#fdf2f8' }} />
              <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full -ml-48 -mb-48 opacity-30" style={{ backgroundColor: '#f8fafc' }} />

              {/* INVOICE HEADER */}
              <div className="flex justify-between items-start mb-16 relative z-10 text-left">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="Perfect Fit Logo" className="h-20 object-contain" />
                  <div>
                    {/* <h1 className="text-4xl font-black tracking-tighter leading-none" style={{ color: '#111827' }}>PERFECT<br/><span style={{ color: '#db2777' }}>FIT</span></h1> */}
                    {/* <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2" style={{ color: '#9ca3af' }}>Bespoke Excellence</p> */}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white px-6 py-2 rounded-bl-2xl rounded-tr-2xl inline-block mb-4" style={{ backgroundColor: '#db2777', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h2 className="text-xl font-black uppercase tracking-widest">INVOICE</h2>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Chavakkad, Thrissur</p>
                  <p className="text-xs font-bold" style={{ color: '#9ca3af' }}>GSTIN: 29AAAAA0000A1Z5</p>
                </div>
              </div>

              {/* BILLING INFO */}
              <div className="grid grid-cols-2 gap-12 mb-16 relative z-10 text-left">
                <div className="p-8 rounded-3xl border" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)', borderColor: '#f3f4f6' }}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#db2777' }}>Customer Details</h3>
                  <p className="text-xl font-black leading-tight mb-2 uppercase" style={{ color: '#111827' }}>{inv.billTo}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#6b7280' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#db2777' }}></span> {inv.phone}
                    </p>
                    <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#6b7280' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d1d5db' }}></span> Secured Transaction
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center text-right pr-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Invoice Identification</p>
                      <p className="text-lg font-black" style={{ color: '#111827' }}>{inv.number}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Issue Date</p>
                        <p className="text-sm font-bold" style={{ color: '#374151' }}>{inv.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Delivery/Return</p>
                        <p className="text-sm font-bold" style={{ color: '#374151' }}>{inv.dueDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="mb-16 relative z-10 text-left">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: '#111827' }}>
                      <th className="py-6 text-left text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#111827' }}>Service Description</th>
                      <th className="py-6 text-center text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#111827' }}>Category</th>
                      <th className="py-6 text-right text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#111827' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td className="py-10">
                        <p className="text-lg font-black uppercase tracking-tight mb-2" style={{ color: '#111827' }}>{inv.itemDesc}</p>
                        <p className="text-xs font-bold italic" style={{ color: '#9ca3af' }}>Reference: {inv.itemNote}</p>
                      </td>
                      <td className="py-10 text-center">
                        <span className="px-5 py-2 text-white rounded-full uppercase tracking-widest" style={{ backgroundColor: '#0f172a' }}>
                          {inv.itemType}
                        </span>
                      </td>
                      <td className="py-10 text-right font-black text-2xl tracking-tighter" style={{ color: '#111827' }}>{formatCurrency(inv.itemAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SUMMARY */}
              <div className="flex justify-end relative z-10 text-left">
                <div className="w-80 p-8 text-white rounded-3xl transform transition-transform" style={{ backgroundColor: '#0f172a', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs opacity-60 uppercase tracking-widest font-bold">
                      <span>Subtotal</span>
                      <span>{formatCurrency(inv.subtotal)}</span>
                    </div>
                    {inv.discount > 0 && (
                      <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold" style={{ color: '#f472b6' }}>
                        <span>Discount Applied</span>
                        <span>-{formatCurrency(inv.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs opacity-60 uppercase tracking-widest font-bold">
                      <span>Amount Received</span>
                      <span>{formatCurrency(inv.paid)}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                      <span className="text-sm font-black uppercase tracking-[0.2em]">Balance Due</span>
                      <span className="text-3xl font-black tracking-tighter" style={{ color: '#db2777' }}>{formatCurrency(inv.balance)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-32 pt-12 border-t-2 flex justify-between items-end relative z-10 text-left" style={{ borderColor: '#f3f4f6' }}>
                <div className="max-w-xs">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#111827' }}>Notice & Terms</p>
                  <p className="text-[9px] leading-relaxed font-medium" style={{ color: '#9ca3af' }}>
                    This invoice is computer generated and does not require a physical signature. Goods once sold/delivered are subject to store policies. For support, reach us at support@perfectfit.com.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black uppercase italic tracking-widest mb-1" style={{ color: '#db2777' }}>Perfect Fit Bespoke</p>
                  <p className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: '#9ca3af' }}>Confidence in every stitch.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-2xl py-20">
              <FiSearch size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">No Order Selected</p>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-white hover:transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={!selectedOrder}
            className="px-10 py-2.5 bg-slate-700 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all text-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <FiDownload /> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
