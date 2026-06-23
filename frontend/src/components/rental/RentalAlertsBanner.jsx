import React, { useState, useEffect } from "react";
import { getUrgentAlerts } from "../../api/rentalApi";
import { FiAlertCircle, FiClock, FiTruck, FiPackage } from "react-icons/fi";

export default function RentalAlertsBanner() {
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await getUrgentAlerts();
        setAlerts(response.data);
      } catch (err) {
        console.error("Failed to fetch urgent alerts", err);
      }
    };
    fetchAlerts();
  }, []);

  if (!alerts) return null;

  const totalAlerts = 
    alerts.overdue_alterations.length + 
    alerts.soon_alterations.length + 
    alerts.pickups_tomorrow.length + 
    alerts.returns_tomorrow.length;

  if (totalAlerts === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {alerts.overdue_alterations.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-4 items-start">
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <FiAlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-red-800 font-bold text-sm">Overdue Alterations ({alerts.overdue_alterations.length})</h4>
            <div className="mt-2 space-y-2">
              {alerts.overdue_alterations.slice(0, 2).map(a => (
                <div key={a.id} className="bg-white/60 p-2 rounded border border-red-100">
                  <p className="text-xs font-bold text-gray-800">{a.customer_name}</p>
                  <p className="text-[10px] text-gray-600">{a.product_name} • {a.type}</p>
                </div>
              ))}
              {alerts.overdue_alterations.length > 2 && <p className="text-[10px] text-red-600 font-medium">+{alerts.overdue_alterations.length - 2} more</p>}
            </div>
          </div>
        </div>
      )}

      {alerts.soon_alterations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-4 items-start">
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
            <FiClock size={20} />
          </div>
          <div>
            <h4 className="text-yellow-800 font-bold text-sm">Alterations Due Soon ({alerts.soon_alterations.length})</h4>
            <div className="mt-2 space-y-2">
              {alerts.soon_alterations.slice(0, 2).map(a => (
                <div key={a.id} className="bg-white/60 p-2 rounded border border-yellow-100">
                  <p className="text-xs font-bold text-gray-800">{a.customer_name}</p>
                  <p className="text-[10px] text-gray-600">{a.product_name} • {a.type}</p>
                </div>
              ))}
              {alerts.soon_alterations.length > 2 && <p className="text-[10px] text-yellow-600 font-medium">+{alerts.soon_alterations.length - 2} more</p>}
            </div>
          </div>
        </div>
      )}

      {alerts.pickups_tomorrow.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-start">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <FiTruck size={20} />
          </div>
          <div>
            <h4 className="text-blue-800 font-bold text-sm">Pickups Tomorrow ({alerts.pickups_tomorrow.length})</h4>
            <div className="mt-2 space-y-2">
              {alerts.pickups_tomorrow.slice(0, 2).map(p => (
                <div key={p.id} className="bg-white/60 p-2 rounded border border-blue-100">
                  <p className="text-xs font-bold text-gray-800">{p.customer_name}</p>
                  <p className="text-[10px] text-gray-600">{p.customer_phone}</p>
                </div>
              ))}
              {alerts.pickups_tomorrow.length > 2 && <p className="text-[10px] text-blue-600 font-medium">+{alerts.pickups_tomorrow.length - 2} more</p>}
            </div>
          </div>
        </div>
      )}

      {alerts.returns_tomorrow.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-4 items-start">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <FiPackage size={20} />
          </div>
          <div>
            <h4 className="text-purple-800 font-bold text-sm">Returns Tomorrow ({alerts.returns_tomorrow.length})</h4>
            <div className="mt-2 space-y-2">
              {alerts.returns_tomorrow.slice(0, 2).map(r => (
                <div key={r.id} className="bg-white/60 p-2 rounded border border-purple-100">
                  <p className="text-xs font-bold text-gray-800">{r.customer_name}</p>
                  <p className="text-[10px] text-gray-600">{r.customer_phone}</p>
                </div>
              ))}
              {alerts.returns_tomorrow.length > 2 && <p className="text-[10px] text-purple-600 font-medium">+{alerts.returns_tomorrow.length - 2} more</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
