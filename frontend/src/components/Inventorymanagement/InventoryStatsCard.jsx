import React from "react";
import { FiBox, FiTrendingUp, FiAlertCircle } from "react-icons/fi";

export default function InventoryStatsCard({ items = [] }) {
  const totalItems = items.length;
  const availableItems = items.filter((item) => item.is_available).length;
  const unavailableItems = totalItems - availableItems;
  const lowStockItems = items.filter((item) => Number(item.available_stock || 0) <= 1).length;

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      sub: "Across all categories",
      icon: <FiBox />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Available",
      value: availableItems,
      sub: "Ready for rental",
      icon: <FiTrendingUp />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Unavailable",
      value: unavailableItems,
      sub: "Rented, washing, or repair",
      icon: <FiBox />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Low Stock",
      value: lowStockItems,
      sub: "Needs attention",
      icon: <FiAlertCircle />,
      color: "bg-orange-100 text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl border border-[#00000014] flex justify-between"
        >
          <div>
            <p className="text-sm text-gray-400">{s.title}</p>
            <h2 className="text-2xl font-semibold mt-1">{s.value}</h2>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>

          <div className={`p-3 rounded-lg h-fit ${s.color}`}>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
