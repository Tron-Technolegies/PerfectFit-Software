import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiRefreshCw, FiMessageCircle } from "react-icons/fi";
import { getOverdueItems } from "../../api/rentalApi";

export default function RentalActionRequired() {
  const [overdueItems, setOverdueItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOverdue = async () => {
    setLoading(true);
    try {
      const response = await getOverdueItems();
      setOverdueItems(response.data.overdue_items || []);
    } catch (err) {
      console.error("Failed to load overdue items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverdue();
  }, []);

  const handleRemind = (item) => {
    const message = `Hello ${item.customer_name}, this is a reminder from Perfect Fit regarding your rental of ${item.item_name}. It was due on ${item.return_date}. Please return it at your earliest convenience. Thank you!`;
    const whatsappUrl = `https://wa.me/${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const alertsCount = overdueItems.length;

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014] shadow-sm">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 tracking-tight text-sm">Action Required</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase">Overdue Items</p>
        </div>
        <span className={`text-[10px] font-black px-2 py-1 mb-3 rounded-full ${alertsCount > 0 ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
          {alertsCount} {alertsCount === 1 ? 'Alert' : 'Alerts'}
        </span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center p-4">
            <FiRefreshCw className="animate-spin text-pink-500" />
          </div>
        ) : overdueItems.length === 0 ? (
          <p className="text-[10px] text-gray-400 italic text-center py-4">No urgent items currently.</p>
        ) : (
          overdueItems.map((i, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 rounded-lg border border-gray-50 hover:bg-red-50/30 transition-all group">
              <div className="flex gap-3">
                <FiAlertCircle className={i.is_overdue ? "text-red-500 mt-0.5 shrink-0" : "text-orange-400 mt-0.5 shrink-0"} size={14} />
                <div>
                  <p className="text-xs font-bold text-gray-800">{i.customer_name}</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">
                    {i.item_name} • <span className={i.is_overdue ? "text-red-500 font-black" : "text-orange-500 font-black"}>
                      {i.is_overdue ? `${i.overdue_days} DAYS LATE` : `DUE ${new Date(i.return_date).toLocaleDateString()}`}
                    </span>
                  </p>
                </div>
              </div>

              <button 
                onClick={() => handleRemind(i)}
                className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors flex items-center gap-1"
                title="Remind via WhatsApp"
              >
                <FiMessageCircle size={14} />
                <span className="text-[9px] font-black uppercase hidden group-hover:block">Remind</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
