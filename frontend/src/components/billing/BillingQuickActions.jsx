import React, { useState } from "react";
import { FiCreditCard, FiFileText, FiRotateCcw, FiBell } from "react-icons/fi";
import RecordPaymentModal from "./RecordPaymentModal";

export default function BillingQuickActions() {
  const [open, setOpen] = useState(false);

  const actions = [
    { name: "Record Payment", icon: <FiCreditCard />, primary: true },
    { name: "Create Invoice", icon: <FiFileText /> },
    { name: "Issue Refund", icon: <FiRotateCcw /> },
    { name: "Send Reminders", icon: <FiBell /> },
  ];

  return (
    <>
      <div className="bg-white p-5 rounded-xl border border-[#00000014]">
        <h3 className="font-semibold mb-4">Quick Actions</h3>

        <div className="space-y-3">
          {actions.map((a, i) => (
            <div
              key={i}
              onClick={() => a.name === "Record Payment" && setOpen(true)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                a.primary ? "bg-pink-500 text-white" : "hover:bg-gray-50 border-[#00000014]"
              }`}
            >
              {a.icon}
              <p className="text-sm">{a.name}</p>
            </div>
          ))}
        </div>
      </div>

      {open && <RecordPaymentModal onClose={() => setOpen(false)} />}
    </>
  );
}
