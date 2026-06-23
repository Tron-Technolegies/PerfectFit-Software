import React, { useState } from "react";

export default function SettingsSidebar({ active, setActive }) {
  const items = [/*"Store Details", "Billing & Tax",*/ "Access & Security"];

  return (
    <div className="w-64 space-y-2">
      {items.map((item) => (
        <div
          key={item}
          onClick={() => setActive(item)}
          className={`px-4 py-3 rounded-lg cursor-pointer text-sm ${
            active === item
              ? "bg-[#FFF5F8] text-pink-600 font-medium"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
