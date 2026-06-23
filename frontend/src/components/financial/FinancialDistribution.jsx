import React from "react";

export default function FinancialDistribution({ data = [] }) {
  const formatCurrency = (val) => `₹ ${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014]">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Expense Distribution</h3>
        <span className="text-xs text-gray-400">This Month</span>
      </div>

      <div className="space-y-4">
        {data && data.length > 0 ? data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm">
              <span>{d.name}</span>
              <span>{d.percent}%</span>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded mt-1">
              <div className="bg-pink-500 h-2 rounded" style={{ width: `${d.percent}%` }} />
            </div>

            <p className="text-xs text-gray-400 mt-1">{formatCurrency(d.amount)}</p>
          </div>
        )) : <p className="text-sm text-gray-500">No expenses recorded this month.</p>}
      </div>
    </div>
  );
}
