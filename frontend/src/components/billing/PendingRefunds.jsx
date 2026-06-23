import React from "react";

export default function PendingRefunds() {
  const data = [
    { name: "Vikram Desai", item: "Tuxedo Return", amount: "5000" },
    { name: "Riya Patel", item: "Lehenga Return", amount: "8500" },
    { name: "Meera Joshi", item: "Saree Return", amount: "3000" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014]">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Pending Refunds</h3>
        <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded">4 Due</span>
      </div>

      <div className="space-y-4">
        {data.map((d, i) => (
          <div key={i} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{d.name}</p>
              <p className="text-xs text-gray-400">
                {d.item} • ₹{d.amount}
              </p>
            </div>

            <button className="border px-3 py-1 rounded text-xs">Refund</button>
          </div>
        ))}
      </div>
    </div>
  );
}
