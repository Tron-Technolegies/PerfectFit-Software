import React, { useState, useEffect } from "react";
import FinancialStats from "../components/financial/FinancialStats";
import FinancialActions from "../components/financial/FinancialActions";
import FinancialDistribution from "../components/financial/FinancialDistribution";
import FinancialTable from "../components/financial/FinancialTable";
import FinancialChart from "../components/financial/FinancialCharts";
import { getDashboardData } from "../api/financialApi";

export default function FinancialManagement() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [range, setRange] = useState("6m");
  const [dashboardData, setDashboardData] = useState({
    chartData: [],
    distribution: [],
    recentExpenses: []
  });

  useEffect(() => {
    getDashboardData(range)
      .then(res => setDashboardData(res.data))
      .catch(err => console.error("Error fetching dashboard data:", err));
  }, [refreshTrigger, range]);


  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <FinancialStats refreshTrigger={refreshTrigger} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FinancialChart 
            data={dashboardData.chartData} 
            range={range}
            onRangeChange={setRange}
          />
          <FinancialTable data={dashboardData.recentExpenses} />
        </div>


        <div className="space-y-6">
          <FinancialActions onExpenseAdded={handleRefresh} dashboardData={dashboardData} />
          <FinancialDistribution data={dashboardData.distribution} />
        </div>
      </div>
    </div>
  );
}
