import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import { getProfit } from "../../api/financialApi";

export default function FinancialStats({ refreshTrigger }) {
  const [data, setData] = useState({ income: 0, expense: 0, profit: 0 });

  useEffect(() => {
    getProfit()
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching profit:", err));
  }, [refreshTrigger]);

  const formatCurrency = (val) => `₹ ${Number(val).toLocaleString('en-IN')}`;

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(data.income),
      sub: "All time income",
      icon: <FiTrendingUp />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(data.expense),
      sub: "All time expenses",
      icon: <FiTrendingDown />,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "Net Profit",
      value: formatCurrency(data.profit),
      sub: data.profit >= 0 ? "Profitable" : "Operating at loss",
      icon: <FiDollarSign />,
      color: data.profit >= 0 ? "bg-pink-100 text-pink-600" : "bg-red-100 text-red-600",
    },
    {
      title: "Cash & Bank Balance",
      value: formatCurrency(data.profit),
      sub: "Current liquid assets",
      icon: <FiDollarSign />,
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
