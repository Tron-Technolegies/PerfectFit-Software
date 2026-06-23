import React, { useEffect, useState } from "react";
import { FiClock, FiTruck, FiPackage, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { getUrgentAlerts } from "../../api/rentalApi";

export default function RentalTodayWork({ onAlterationClick }) {
  const [alerts, setAlerts] = useState({
    overdue_alterations: [],
    soon_alterations: [],
    pickups_tomorrow: [],
    returns_tomorrow: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await getUrgentAlerts();
        setAlerts(response.data);
      } catch (err) {
        console.error("Failed to fetch urgent alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const totalTasks = 
    alerts.overdue_alterations.length + 
    alerts.soon_alterations.length + 
    alerts.pickups_tomorrow.length + 
    alerts.returns_tomorrow.length;

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014] shadow-sm flex flex-col h-full max-h-[800px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-gray-800 tracking-tight text-sm">Today's Work</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase">Priority Tasks</p>
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${totalTasks > 0 ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`}>
          {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar pb-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-xs font-medium">Loading tasks...</div>
        ) : totalTasks === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <FiCheckCircle className="mx-auto text-3xl text-gray-300 mb-2" />
            <p className="text-gray-500 text-xs font-medium">All caught up for today!</p>
          </div>
        ) : (
          <>
            {alerts.overdue_alterations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-red-100 pb-1">
                  <FiAlertCircle /> Overdue Alterations
                </h4>
                {alerts.overdue_alterations.map(a => (
                  <div key={a.id} className="p-3 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{a.customer_name}</p>
                      <p className="text-[10px] text-red-600 font-medium">{a.product_name} • {a.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {alerts.soon_alterations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-yellow-100 pb-1">
                  <FiClock /> Alterations Due Today
                </h4>
                {alerts.soon_alterations.map(a => (
                  <div key={a.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{a.customer_name}</p>
                      <p className="text-[10px] text-yellow-600 font-medium">{a.product_name} • {a.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {alerts.pickups_tomorrow.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-100 pb-1">
                  <FiTruck /> Pickups Tomorrow
                </h4>
                {alerts.pickups_tomorrow.map(p => (
                  <div key={p.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{p.customer_name}</p>
                      <p className="text-[10px] text-blue-600 font-medium">{p.customer_phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {alerts.returns_tomorrow.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-purple-100 pb-1">
                  <FiPackage /> Returns Tomorrow
                </h4>
                {alerts.returns_tomorrow.map(r => (
                  <div key={r.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{r.customer_name}</p>
                      <p className="text-[10px] text-purple-600 font-medium">{r.customer_phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
