import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-[80px] h-screen overflow-y-auto bg-[#FFFDFC] p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
