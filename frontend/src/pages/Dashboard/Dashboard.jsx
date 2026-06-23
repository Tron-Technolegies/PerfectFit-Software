import React, { useEffect, useState } from "react";
import DashboardStats from "../../components/dashboard/DashboardStats";
import OverviewGraph from "../../components/dashboard/OverviewGraph";
import RecentOrders from "../../components/dashboard/RecentOrders";
import QuickActions from "../../components/dashboard/QuickActions";
import ActionRequired from "../../components/dashboard/ActionRequired";
import UpcomingDeliveries from "../../components/dashboard/UpcomingDeliveries";
import UpcomingRentals from "../../components/dashboard/UpcomingRentals";
import { getDashboardStats } from "../../api/rentalApi";
import Loader from "../../components/common/Loader";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await getDashboardStats();
      setData(response.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  if (!data) return <div className="p-10 text-center text-gray-500">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-6 pt-4">
      <DashboardStats stats={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OverviewGraph history={data.revenue_history} />
          <RecentOrders />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <ActionRequired items={data.action_required} />
          <UpcomingRentals rentals={data.upcoming_rentals} />
          <UpcomingDeliveries fittings={data.upcoming_deliveries} />
        </div>
      </div>
    </div>
  );
}
