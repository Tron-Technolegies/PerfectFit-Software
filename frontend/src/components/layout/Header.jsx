import { FiMapPin, FiCalendar, FiChevronDown, FiLogOut } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { logout, isPasswordEnabled } = useAuth();

  const getTitle = () => {
    const path = location.pathname.split("/")[1];
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    setCurrentDate(today);
  }, []);

  return (
    <div className="fixed top-0 left-64 right-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-[#00000014]">
      {/* LEFT */}
      <div className="flex gap-4 items-center">
        <h1 className="text-lg font-semibold text-gray-800">{getTitle()}</h1>

        <div className="border border-[#00000014] h-[20px]" />

        <div className="flex items-center gap-2 text-sm text-[#7A2A3F] bg-[#FFF5F8] px-4 py-2 rounded-lg border border-[#00000014]">
          <FiMapPin />
          Chavakkad Branch
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <FiCalendar className="text-pink-500" />
          {currentDate}
        </div>

        <div className="border border-[#00000014] h-[20px]" />

        {/* PROFILE */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-50"
          >
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-500">Store Admin</p>
            </div>
            <FiChevronDown />
          </div>


          {/* DROPDOWN */}
          {open && isPasswordEnabled && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-[#00000014] rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Header;
