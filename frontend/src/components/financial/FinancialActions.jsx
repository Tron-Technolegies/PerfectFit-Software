import React, { useState } from "react";
import { FiPlus, FiFileText, FiDownload } from "react-icons/fi";
import AddExpenseModal from "./AddExpenseModal";
import { getServerUrl } from "../../api/backendApi";

export default function FinancialActions({ onExpenseAdded }) {
  const [open, setOpen] = useState(false);

  const handleAction = (name) => {
    if (name === "Add New Expense") {
      setOpen(true);
    } else if (name === "Export Monthly Data") {
      window.location.href = getServerUrl("/api/export-monthly-data/");
    }
  };

  const actions = [
    { name: "Add New Expense", icon: <FiPlus />, primary: true },
    { name: "Export Monthly Data", icon: <FiDownload /> },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014]">
      <h3 className="font-semibold mb-4">Finance Actions</h3>

      <div className="space-y-3">
        {actions.map((a, i) => (
          <div
            key={i}
            onClick={() => handleAction(a.name)}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
              a.primary ? "bg-pink-500 text-white" : "hover:bg-gray-50 border-[#00000014]"
            }`}
          >
            {a.icon}
            <p className="text-sm">{a.name}</p>
          </div>
        ))}
      </div>
      {open && <AddExpenseModal onClose={() => setOpen(false)} onSuccess={onExpenseAdded} />}
    </div>
  );
}
