import React from "react";
import StitchingStats from "../components/stitching/StitchingStats";
import StitchingTable from "../components/stitching/StitchingTable";
import StitchingQuickActions from "../components/stitching/StitchingQuickActions";
import StitchingSchedule from "../components/stitching/StitchingSchedule";
import MaterialsSection from "../components/stitching/MaterialsSection";
import { getStitchingOrders } from "../api/stitchingApi";
import Toast from "../components/common/Toast";

export default function StitchingManagement() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("orders"); // "orders" or "materials"
  const [toast, setToast] = React.useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getStitchingOrders();
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-6 pt-4">
      {/* STATS */}
      <StitchingStats orders={orders} />

      {/* TABS */}
      <div className="flex gap-4 border-b border-[#00000014]">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2 px-4 text-sm font-medium transition-all ${
            activeTab === "orders"
              ? "border-b-2 border-pink-500 text-pink-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Stitching Orders
        </button>
        <button
          onClick={() => setActiveTab("materials")}
          className={`pb-2 px-4 text-sm font-medium transition-all ${
            activeTab === "materials"
              ? "border-b-2 border-pink-500 text-pink-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Materials
        </button>
      </div>

      {activeTab === "orders" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <StitchingTable 
              orders={orders} 
              loading={loading} 
              onRefresh={loadOrders} 
              setToast={setToast}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <StitchingQuickActions />
            <StitchingSchedule />
          </div>
        </div>
      ) : (
        <MaterialsSection />
      )}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
