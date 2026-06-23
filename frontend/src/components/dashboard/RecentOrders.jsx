import RecentOrdersModal from "./RecentOrdersModal";
import { getRentals } from "../../api/rentalApi";
import { getStitchingOrders } from "../../api/stitchingApi";
import { FiRefreshCw } from "react-icons/fi";
import React, { useState } from "react";

export default function RecentOrders() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rentalRes, fetchRes] = await Promise.all([
        getRentals(),
        getStitchingOrders()
      ]);

      // Normalize data for single list
      const rentals = (rentalRes.data || []).map(r => ({
        id: r.order_code || `#RNT-${r.id.toString().padStart(4, '0')}`,
        name: r.customer_name,
        phone: r.customer_phone,
        type: "Rental",
        amount: r.rental_amount,
        status: r.status,
        date: r.rental_date
      }));

      const stitching = (fetchRes.data || []).map(s => ({
        id: `#STC-${s.id.toString().padStart(4, '0')}`,
        name: s.customer,
        phone: s.phone,
        type: "Stitching",
        amount: s.total_amount || 0, // Fallback if missing
        status: s.status,
        date: s.order_date || s.delivery_date
      }));

      // Combine and sort by date descending
      const combined = [...rentals, ...stitching]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Just top 5 for dashboard

      setOrders(combined);
    } catch (err) {
      console.error("Failed to load dashboard orders", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const statusStyle = {
    Completed: "bg-green-100 text-green-600",
    Returned: "bg-green-100 text-green-600",
    "In Progress": "bg-orange-100 text-orange-500",
    in_progress: "bg-orange-100 text-orange-500",
    Reserved: "bg-pink-100 text-pink-500",
    Active: "bg-blue-100 text-blue-500",
    Overdue: "bg-red-100 text-red-500",
    pending: "bg-pink-100 text-pink-500",
    ready: "bg-green-100 text-green-600",
    delivered: "bg-gray-100 text-gray-500",
  };

  const statusLabel = {
    pending: "Pending",
    in_progress: "In Progress",
    ready: "Ready",
    delivered: "Delivered",
  };

  return (
    <>
      <div className="bg-white p-5 rounded-xl border border-[#00000014]">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Recent Orders</h3>
          <button onClick={() => setOpen(true)} className="text-pink-500 text-sm cursor-pointer">
            View All
          </button>
        </div>

        <div className="space-y-4">
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-xs border-b border-[#00000014] items-center">
              <tr>
                <th className="text-left py-2">ORDER ID</th>
                <th className="text-left">CUSTOMER</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400">
                    <FiRefreshCw className="animate-spin inline mr-2" /> Loading recent activity...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400">No recent orders.</td>
                </tr>
              ) : (
                orders.map((o, i) => (
                <tr key={i} className="border-b border-[#00000014] items-center">
                  <td className="py-4">{o.id}</td>

                  <td>
                    <p className="font-medium">{o.name}</p>
                    <p className="text-xs text-gray-400">{o.phone}</p>
                  </td>

                  <td>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{o.type}</span>
                  </td>

                  <td>₹ {o.amount}</td>

                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-tight ${statusStyle[o.status] || "bg-gray-100"}`}>
                      {statusLabel[o.status] || o.status}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {open && <RecentOrdersModal onClose={() => setOpen(false)} />}
    </>
  );
}
