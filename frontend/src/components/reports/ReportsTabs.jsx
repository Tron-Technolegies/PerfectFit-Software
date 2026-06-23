import React, { useState } from "react";

export default function ReportsTabs() {
  const [active, setActive] = useState("Overview");

  const tabs = ["Overview", "Financial", "Sales & Rentals", "Inventory", "Customers"];

  return (
    <div className="flex gap-6 border-b border-[#00000014] mb-4 pt-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`pb-2 text-sm ${
            active === tab ? "text-pink-600 border-b-2 border-pink-500" : "text-gray-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
