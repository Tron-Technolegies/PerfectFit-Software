import React from "react";
import { FiScissors, FiTag, FiCheckSquare, FiCheckCircle } from "react-icons/fi";

export default function StitchingStats({ orders = [] }) {
  const activeOrders = orders.filter(o => o.status === "in_progress" || o.status === "pending").length;
  const readyOrders = orders.filter(o => o.status === "ready").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;

  const stats = [
    {
      title: "Active Custom Orders",
      value: activeOrders,
      sub: "Currently in production",
      icon: <FiScissors />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Ready for Delivery",
      value: readyOrders,
      sub: "Awaiting customer pickup",
      icon: <FiCheckSquare />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Completed This Month",
      value: deliveredOrders,
      sub: "Successfully delivered",
      icon: <FiCheckCircle />,
      color: "bg-pink-100 text-pink-500",
    },
    {
      title: "Total Orders",
      value: orders.length,
      sub: "Across all time",
      icon: <FiTag />,
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
            <h2 className="text-2xl font-semibold">{s.value}</h2>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>

          <div className={`p-3 rounded-lg h-fit ${s.color}`}>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
