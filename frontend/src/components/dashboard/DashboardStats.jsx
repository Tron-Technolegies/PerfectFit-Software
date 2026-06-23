import React, { useEffect, useState } from "react";
import { LuIndianRupee, LuScissors } from "react-icons/lu";
import { FiAlertCircle } from "react-icons/fi";
import { RiTShirt2Line } from "react-icons/ri";
import { RxPeople } from "react-icons/rx";
import { getDashboardStats } from "../../api/rentalApi";
import Loader from "../common/Loader";

export default function DashboardStats({ stats: data }) {
  if (!data) return null;

  const stats = [
    {
      title: "Total Revenue",
      value: data.total_revenue.toLocaleString(),
      change: null, // Backend doesn't provide change yet
      icon: <LuIndianRupee />,
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Active Rentals",
      value: data.rentals.active_orders,
      extra: data.rentals.overdue_orders > 0 ? `${data.rentals.overdue_orders} overdue` : null,
      icon: <RiTShirt2Line />,
      color: "text-pink-600 bg-pink-50"
    },
    {
      title: "Stitching Orders",
      value: data.stitching.pending_count + data.stitching.ready_count,
      extra: `${data.stitching.ready_count} ready to deliver`,
      icon: <LuScissors />,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Low Stock Items",
      value: data.accessories.low_stock_count,
      extra: data.accessories.low_stock_count > 0 ? "Action required" : "Inventory healthy",
      icon: <FiAlertCircle />,
      color: "text-orange-600 bg-orange-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl border border-[#00000010] flex justify-between items-center transition-all hover:shadow-md"
        >
          <div>
            <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
            <h2 className="text-2xl font-black mt-1 text-gray-800">
                {stat.title.includes("Revenue") ? "₹" : ""}{stat.value}
            </h2>

            {stat.change && (
              <p className="text-green-500 text-xs mt-2 font-bold flex items-center gap-1">
                <span>↑</span> {stat.change}
              </p>
            )}

            {stat.extra && (
                <p className={`text-[10px] mt-2 font-black uppercase tracking-wider ${stat.extra.includes("overdue") || stat.extra.includes("Action") ? "text-red-500" : "text-green-500"}`}>
                    {stat.extra}
                </p>
            )}
          </div>

          <div className="bg-[#FFF1F5] text-[#D6336C] p-3 rounded-lg text-lg">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
}
