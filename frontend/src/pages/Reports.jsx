import React from "react";
import ReportsTabs from "../components/reports/ReportsTabs";
import ReportsTable from "../components/reports/ReportsTable";
import ReportsCards from "../components/reports/ReportsCards";

export default function Reports() {
  return (
    <div className="space-y-4">
      <ReportsTabs />
      <ReportsCards />
      <ReportsTable />
    </div>
  );
}
