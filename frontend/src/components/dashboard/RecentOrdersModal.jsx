import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function RecentOrdersModal({ onClose }) {
  const [search, setSearch] = useState("");

  const orders = [
    {
      id: "#ORD-9021",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      type: "Rental",
      amount: "3,500",
      status: "Completed",
    },
    {
      id: "#ORD-9022",
      name: "Amit Kumar",
      phone: "+91 98765 43211",
      type: "Custom Stitching",
      amount: "12,000",
      status: "In Progress",
    },
    {
      id: "#ORD-9023",
      name: "Sneha Desai",
      phone: "+91 98765 43212",
      type: "Rental",
      amount: "2,800",
      status: "Reserved",
    },
  ];

  const statusStyle = {
    Completed: "bg-green-100 text-green-600",
    "In Progress": "bg-orange-100 text-orange-500",
    Reserved: "bg-pink-100 text-pink-500",
    "Pending Fitting": "bg-red-100 text-red-500",
  };

  const filtered = orders.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-5xl rounded-xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Recent Orders</h2>
          <FiX className="cursor-pointer" onClick={onClose} />
        </div>

        {/* SEARCH */}
        <div className="flex items-center border border-[#00000014] rounded-lg px-3 py-2 mb-4">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name..."
            className="ml-2 outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-xs border-b border-[#00000014] items-center">
              <tr>
                <th className="text-left py-2">ORDER ID</th>
                <th className="text-left">CUSTOMER</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((o, i) => (
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
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyle[o.status]}`}>
                      {o.status}
                    </span>
                  </td>

                  <td>
                    <button className="text-pink-500 text-xs cursor-pointer">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-gray-400">Showing {filtered.length} orders</p>

          <button
            onClick={onClose}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
