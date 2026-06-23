import React from "react";
import { FiAlertCircle, FiMessageCircle } from "react-icons/fi";

export default function ActionRequired({ items = [] }) {
  const handleRemind = (item) => {
    const message = `Hello ${item.customer}, this is a reminder from Perfect Fit regarding your rental of ${item.item}. It is due on ${item.due_date}. Please return it at your earliest convenience. Thank you!`;
    const whatsappUrl = `https://wa.me/${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014] shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-gray-800 tracking-tight">Action Required</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Upcoming & Overdue Returns</p>
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${items.length > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
          {items.length} {items.length === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-gray-400 italic">All caught up! No urgent returns.</p>
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="group p-3 rounded-xl border border-gray-50 hover:border-orange-100 hover:bg-orange-50/30 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${item.is_overdue ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
                    <FiAlertCircle size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.customer}</p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {item.item} • <span className={item.is_overdue ? 'text-red-500 font-bold' : 'text-orange-500 font-bold'}>
                        {item.is_overdue ? 'Overdue' : `Due ${new Date(item.due_date).toLocaleDateString()}`}
                      </span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemind(item)}
                  className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                  title="Remind via WhatsApp"
                >
                  <FiMessageCircle size={16} />
                  <span className="text-[10px] font-bold uppercase hidden group-hover:block">Remind</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
