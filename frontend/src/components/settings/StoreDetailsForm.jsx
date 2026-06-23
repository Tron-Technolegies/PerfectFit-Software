import React from "react";

export default function StoreDetailsForm() {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#00000014] space-y-4">
      <h3 className="font-semibold">Store Details</h3>
      <p className="text-xs text-gray-400">
        Basic business information used across invoices and records.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {/* LOGO */}
        <div className="border border-dashed border-[#00000014] rounded-lg flex items-center justify-center h-28 text-gray-400 text-sm">
          Upload Image
        </div>

        {/* NAME */}
        <input className="input" placeholder="Store Name" />

        {/* EMAIL */}
        <input className="input" placeholder="Contact Email" />

        {/* PHONE */}
        <input className="input" placeholder="Phone Number" />

        {/* SUPPORT */}
        <input className="input" placeholder="Support Email" />
      </div>

      {/* ADDRESS */}
      <textarea className="input h-24 resize-none" placeholder="Physical Address" />
    </div>
  );
}
