import React from "react";

export default function FinancialTable({ data = [] }) {
  const formatCurrency = (val) => `${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014]">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Recent Expenses</h3>
        <span className="text-sm text-pink-500 cursor-pointer">View All →</span>
      </div>

      <div className="space-y-3">
        {data && data.length > 0 ? data.map((d, i) => (
          <div key={i} className="flex justify-between border-b border-[#00000014] pb-2 text-sm">
            <div>
              <p>{d.date}</p>
              <p className="text-xs text-gray-400">{d.desc}</p>
            </div>

            <p className="capitalize text-gray-700">{d.category}</p>

            <p className="font-medium">₹{formatCurrency(d.amount)}</p>

            <span
              className={`text-xs px-2 py-1 rounded ${
                d.status === "Paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-500"
              }`}
            >
              {d.status}
            </span>
          </div>
        )) : <p className="text-sm text-gray-500 py-4 text-center">No recent expenses.</p>}
      </div>
    </div>
  );
}
