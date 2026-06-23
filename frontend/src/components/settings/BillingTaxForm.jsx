import React from "react";

export default function BillingTaxForm() {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#00000014] space-y-4">
      <h3 className="font-semibold">Billing & Tax</h3>
      <p className="text-xs text-gray-400">Regional settings used for invoices and reports.</p>

      <div className="grid grid-cols-3 gap-4">
        <select className="input">
          <option>USD ($)</option>
          <option>INR (₹)</option>
        </select>

        <select className="input">
          <option>UTC-05:00 Eastern Time</option>
        </select>

        <select className="input">
          <option>MM/DD/YYYY</option>
          <option>DD/MM/YYYY</option>
        </select>
      </div>
    </div>
  );
}
