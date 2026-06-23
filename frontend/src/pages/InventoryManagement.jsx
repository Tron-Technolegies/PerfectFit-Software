import React, { useState } from "react";
import InventoryStatsCard from "../components/Inventorymanagement/InventoryStatsCard";
import InventoryTable from "../components/Inventorymanagement/InventoryTable";

export default function InventoryManagement() {
  const [items, setItems] = useState([]);

  return (
    <div className="space-y-6 pt-4">
      <InventoryStatsCard items={items} />
      <InventoryTable onItemsChange={setItems} />
    </div>
  );
}
