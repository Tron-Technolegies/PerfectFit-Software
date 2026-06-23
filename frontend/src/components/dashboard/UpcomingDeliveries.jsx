import React from "react";
import { RiTShirt2Line } from "react-icons/ri";
import { FiMessageCircle } from "react-icons/fi";

export default function UpcomingDeliveries({ fittings: deliveries = [] }) {
  const handleRemind = (item) => {
    const message = `Hello ${item.customer}, your stitching order for ${item.outfit_type} is scheduled for delivery on ${new Date(item.delivery_date).toLocaleDateString()}. Please contact us if you have any questions. Thank you!`;
    const whatsappUrl = `https://wa.me/${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014] shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-gray-800 tracking-tight">Upcoming Deliveries</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Top 5 Pending Stitching</p>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
        {deliveries.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-gray-400 italic">No upcoming deliveries.</p>
          </div>
        ) : (
          deliveries.map((item, i) => (
            <div key={i} className="group p-3 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-500">
                    <RiTShirt2Line size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.customer}</p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {item.outfit_type} • <span className="text-blue-500 font-bold">Due {new Date(item.delivery_date).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemind(item)}
                  className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                  title="Notify via WhatsApp"
                >
                  <FiMessageCircle size={16} />
                  <span className="text-[9px] font-bold uppercase hidden group-hover:block">Notify</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
