import React from "react";
import BillingStats from "../components/billing/BillingStats";
import TransactionsTable from "../components/billing/TransactionsTable";
import PendingRefunds from "../components/billing/PendingRefunds";
import BillingQuickActions from "../components/billing/BillingQuickActions";

export default function BillingManagement() {
  return (
    <div>
      <div className="space-y-6">
        <BillingStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionsTable />
          </div>
          <div className="space-y-6">
            <BillingQuickActions />
            <PendingRefunds />
          </div>
        </div>
      </div>
    </div>
  );
}
