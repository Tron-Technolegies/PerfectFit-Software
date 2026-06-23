import React, { useState } from "react";
import SettingsHeader from "../components/settings/SettingsHeader";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import StoreDetailsForm from "../components/settings/StoreDetailsForm";
import BillingTaxForm from "../components/settings/BillingTaxForm";
import AccessSecurityForm from "../components/settings/AccessSecurityForm";

export default function Settings() {
  const [active, setActive] = useState("Access & Security");

  return (
    <div className="space-y-6">
      <SettingsHeader />

      <div className="flex gap-6">
        {/* SIDEBAR */}
        <SettingsSidebar active={active} setActive={setActive} />

        {/* CONTENT */}
        <div className="flex-1 space-y-6">
          {/* {active === "Store Details" && <StoreDetailsForm />}
          {active === "Billing & Tax" && <BillingTaxForm />} */}
          {active === "Access & Security" && <AccessSecurityForm />}
        </div>
      </div>
    </div>
  );
}
