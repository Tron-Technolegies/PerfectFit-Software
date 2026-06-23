import React, { useState } from "react";
import { FiFileText } from "react-icons/fi";
import GenerateInvoiceModal from "./GenerateInvoiceModal";

export default function StitchingQuickActions() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h3>

        <div className="space-y-3 relative z-10">
          <div
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center justify-between p-4 bg-pink-50 border border-pink-100 rounded-xl hover:bg-pink-100/50 cursor-pointer transition-all active:scale-[0.98] group/item"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm text-pink-500 group-hover/item:rotate-12 transition-transform">
                <FiFileText size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Generate Invoice</p>
                <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mt-0.5">Billing & Print</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all">
               →
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-50/50 rounded-full blur-2xl pointer-events-none" />
      </div>

      {showInvoiceModal && (
        <GenerateInvoiceModal onClose={() => setShowInvoiceModal(false)} />
      )}
    </>
  );
}
