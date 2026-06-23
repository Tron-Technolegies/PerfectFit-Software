import React from "react";
import { FiTrendingUp, FiClock, FiAlertCircle, FiShield } from "react-icons/fi";

export default function BillingStats() {
  const stats = [
    {
      title: "Total Revenue (Month)",
      value: "₹ 1,42,500",
      sub: "+15% vs last month",
      icon: <FiTrendingUp />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Pending Receivables",
      value: "₹ 38,000",
      sub: "Across 12 invoices",
      icon: <FiClock />,
      color: "bg-orange-100 text-orange-500",
    },
    {
      title: "Overdue Payments",
      value: "₹ 15,400",
      sub: "5 invoices require attention",
      icon: <FiAlertCircle />,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "Pending Deposit Refunds",
      value: "₹ 25,000",
      sub: "From returned rentals",
      icon: <FiShield />,
      color: "bg-pink-100 text-pink-500",
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
