import React, { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiRefreshCw, FiTruck } from "react-icons/fi";
import { getStitchingOrders } from "../../api/stitchingApi";

export default function StitchingSchedule() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await getStitchingOrders();
        // Sort by delivery date and take top 5 pending/ready
        const upcoming = response.data
          .filter(o => o.status !== 'delivered')
          .sort((a, b) => new Date(a.delivery_date) - new Date(b.delivery_date))
          .slice(0, 5);
        setDeliveries(upcoming);
      } catch (err) {
        console.error("Failed to load stitching schedule", err);
      } finally {
        setLoading(false);
      }
    };
    loadSchedule();
  }, []);

  const statusIcons = {
    pending: <FiClock className="text-pink-400" />,
    in_progress: <FiClock className="text-orange-400" />,
    ready: <FiCheckCircle className="text-green-500" />,
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-[#00000014] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="font-bold text-gray-800 tracking-tight">Upcoming Schedule</h3>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Stitching Deadlines</p>
        </div>
        {!loading && (
            <span className="bg-pink-50 text-pink-500 text-[10px] font-black px-2 py-1 rounded-full uppercase">
              {deliveries.length} Priority
            </span>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center p-4">
            <FiRefreshCw className="animate-spin text-pink-500" />
          </div>
        ) : deliveries.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-4">No upcoming deadlines.</p>
        ) : (
          deliveries.map((d, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-all group">
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                  {statusIcons[d.status] || <FiClock className="text-gray-400" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{d.customer}</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {d.outfit_type} • <span className="text-pink-500 font-bold">Due {new Date(d.delivery_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                 <p className={`text-[9px] font-black uppercase tracking-tighter ${d.due_amount > 0 ? 'text-red-400' : 'text-green-500'}`}>
                    {d.due_amount > 0 ? `₹${d.due_amount} Due` : 'Paid'}
                 </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
