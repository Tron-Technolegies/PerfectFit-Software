import React from "react";

export default function ReportsTable() {
  const data = [
    {
      name: "Monthly P&L - September",
      type: "Financial",
      date: "Oct 24, 2023, 10:30 AM",
      status: "Ready",
    },
    {
      name: "Inventory Stock Count Q3",
      type: "Inventory",
      date: "Oct 22, 2023, 04:15 PM",
      status: "Ready",
    },
    {
      name: "Overdue Rentals List",
      type: "Rentals",
      date: "Oct 20, 2023",
      status: "Ready",
    },
    {
      name: "Custom Stitching Performance",
      type: "Sales",
      date: "Just now",
      status: "Processing",
    },
  ];

  const statusStyle = {
    Ready: "bg-green-100 text-green-600",
    Processing: "bg-orange-100 text-orange-500",
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014]">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Recently Generated Reports</h3>

        <input
          placeholder="Search reports..."
          className="border border-[#00000014] px-3 py-2 rounded-lg text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="space-y-3">
        {data.map((r, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b border-[#00000014] pb-3"
          >
            <div>
              <p className="text-sm font-medium">{r.name}</p>
              <p className="text-xs text-gray-400">{r.type}</p>
            </div>

            <p className="text-xs">{r.date}</p>

            <span className={`text-xs px-2 py-1 rounded-full ${statusStyle[r.status]}`}>
              {r.status}
            </span>

            <button className="text-gray-400 cursor-pointer">⬇</button>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400 mt-4 cursor-pointer">Load More</div>
    </div>
  );
}
