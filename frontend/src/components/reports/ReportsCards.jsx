import React from "react";
import { FiTrendingUp, FiRefreshCw, FiScissors, FiBox } from "react-icons/fi";

export default function ReportsCards() {
  const cards = [
    {
      title: "Profit & Loss",
      desc: "Comprehensive statement of income, expenses, and net profit.",
      icon: <FiTrendingUp />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Rental Returns",
      desc: "Track overdue items, upcoming returns, and rental metrics.",
      icon: <FiRefreshCw />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Stitching Backlog",
      desc: "Pending custom stitching orders and timelines.",
      icon: <FiScissors />,
      color: "bg-orange-100 text-orange-500",
    },
    {
      title: "Inventory Valuation",
      desc: "Stock levels, fabric roll status, and alerts.",
      icon: <FiBox />,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-[#00000014]">
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${c.color}`}>
            {c.icon}
          </div>

          <h3 className="mt-4 font-semibold text-sm">{c.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{c.desc}</p>

          <div className="flex justify-between items-center mt-4 text-xs">
            <span className="text-gray-400">Updated 2h ago</span>
            <span className="text-pink-500 cursor-pointer">View Report</span>
          </div>
        </div>
      ))}
    </div>
  );
}
