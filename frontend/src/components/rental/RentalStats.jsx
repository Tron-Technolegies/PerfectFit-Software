import React from "react";
import { FiBox, FiAlertCircle, FiClock, FiCalendar } from "react-icons/fi";

export default function RentalStats({ rentals = [] }) {
  const activeRentals = rentals.filter(r => r.status === "ACTIVE").length;
  const overdueRentals = rentals.filter(r => r.status === "OVERDUE").length;
  const returnedRentals = rentals.filter(r => r.status === "RETURNED").length;
  const preBooked = rentals.filter(r => r.status === "PRE_BOOKED");
  
  // Calculate upcoming pickups (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingPickups = preBooked.filter(r => {
    const pickupDate = new Date(r.rental_date);
    return pickupDate >= today && pickupDate <= nextWeek;
  }).length;
  
  const stats = [
    {
      title: "Pre-Bookings",
      value: preBooked.length,
      sub: `${upcomingPickups} pickups next 7 days`,
      icon: <FiCalendar />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Rentals",
      value: activeRentals,
      sub: "Currently with customers",
      icon: <FiBox />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Overdue Returns",
      value: overdueRentals,
      sub: "Immediate attention required",
      icon: <FiAlertCircle />,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "Recent Returns",
      value: returnedRentals,
      sub: "Successfully returned",
      icon: <FiClock />,
      color: "bg-purple-100 text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl border border-[#00000014] flex justify-between"
        >
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-tight">{s.title}</p>
            <h2 className="text-2xl font-semibold mt-1">{s.value}</h2>
            <p className="text-[10px] font-medium text-gray-500 mt-1">{s.sub}</p>
          </div>

          <div className={`p-3 rounded-lg h-fit ${s.color}`}>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
