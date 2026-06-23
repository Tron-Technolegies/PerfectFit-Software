import React, { useState, useEffect, useRef } from "react";
import { FiRefreshCw, FiSearch, FiChevronLeft, FiChevronRight, FiMoreVertical, FiEye, FiScissors, FiPackage, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import ReturnRentalModal from "./ReturnRentalModal";
import { deleteRentalBooking, pickupRental, returnRental } from "../../api/rentalApi";

export default function RentalTable({ rentals, loading, onRefresh, onNewRentalClick, setToast, onDetailClick, onAlterationClick }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const formatDateStr = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const statusStyle = {
    OVERDUE: "bg-red-100 text-red-500",
    ACTIVE: "bg-green-100 text-green-600",
    PRE_BOOKED: "bg-blue-100 text-blue-600",
    RETURNED: "bg-gray-100 text-gray-500",
    CANCELLED: "bg-red-100 text-red-600",
  };

  // Filter Logic
  const filteredRentals = (rentals || []).filter(r => {
    const matchesSearch = r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.order_code?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;

    if (activeTab === "On Rental") {
      return (r.status === "ACTIVE" || r.status === "OVERDUE") && !r.is_returned;
    }
    if (activeTab === "Upcoming") {
      return r.status === "PRE_BOOKED";
    }
    if (activeTab === "Returned") {
      return r.status === "RETURNED" || r.is_returned;
    }
    return true; // "All"
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRentals.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (r) => {
    if (window.confirm(`Are you sure you want to delete Booking ${r.order_code}? This action cannot be undone.`)) {
      try {
        await deleteRentalBooking(r.id);
        setToast({ message: "Booking deleted successfully.", type: "success" });
        onRefresh();
      } catch (err) {
        setToast({ message: "Failed to delete booking.", type: "error" });
      }
    }
    setOpenDropdown(null);
  };

  const handlePickup = async (r) => {
    if (window.confirm("Mark this pre-booking as collected?")) {
      try {
        await pickupRental(r.id);
        setToast({ message: "Rental activated.", type: "success" });
        onRefresh();
      } catch (err) {
        setToast({ message: "Failed to activate rental.", type: "error" });
      }
    }
    setOpenDropdown(null);
  };

  return (
    <div className="bg-white rounded-xl border border-[#00000014] overflow-visible">
      {/* TABS */}
      <div className="flex border-b border-[#00000014] px-4 bg-gray-50/50">
        {["All", "On Rental", "Upcoming", "Returned"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all outline-none ${
                isActive 
                  ? "border-pink-500 text-pink-600 font-extrabold" 
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between gap-3 p-4 border-b border-[#00000014]">
        <div className="flex items-center gap-3 w-full md:max-w-md">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search by customer, order ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="border border-[#00000014] pl-10 pr-4 py-2 rounded-lg w-full outline-none text-sm focus:border-pink-300 transition-all"
            />
          </div>
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition shrink-0"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin text-pink-500" : "text-gray-400"} />
          </button>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onNewRentalClick}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-100 active:scale-95"
          >
            + New Rental
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading && (!rentals || rentals.length === 0) ? (
          <div className="p-10 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
            <FiRefreshCw className="animate-spin text-pink-500 text-xl" />
            Loading rentals...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-400 bg-gray-50/50 border-b border-[#00000014]">
              <tr>
                <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">ORDER ID</th>
                <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">CUSTOMER</th>
                <th className="text-center p-4 font-bold text-[10px] uppercase tracking-wider">ITEMS</th>
                <th className="text-center p-4 font-bold text-[10px] uppercase tracking-wider">ALTS</th>
                <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">STATUS</th>
                <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">PICKUP</th>
                <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">RETURN</th>
                <th className="text-right p-4 font-bold text-[10px] uppercase tracking-wider pr-6">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#00000008]">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-gray-400 italic">No rentals found</td>
                </tr>
              ) : (
                currentItems.map((r) => {
                  const itemCount = r.items ? r.items.length : 1;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition">
                      <td 
                        className="p-4 font-mono text-[11px] text-pink-600 font-bold uppercase cursor-pointer hover:underline"
                        onClick={() => onDetailClick && onDetailClick(r)}
                      >
                        {r.order_code}
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-gray-800">{r.customer_name}</p>
                      </td>

                      <td className="p-4 text-center">
                        <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{itemCount}</span>
                      </td>

                      <td className="p-4 text-center">
                        {r.alterations_count > 0 ? (
                          <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md"><FiScissors className="inline mr-1" /> {r.alterations_count}</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${statusStyle[r.status] || "bg-gray-100 text-gray-500"}`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-gray-700">{formatDateStr(r.rental_date)}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-red-500">{formatDateStr(r.return_date)}</p>
                      </td>

                      <td className="p-4 text-right pr-6 relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === r.id ? null : r.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-all"
                        >
                          <FiMoreVertical />
                        </button>

                        {openDropdown === r.id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-8 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 text-left py-2 overflow-hidden"
                          >
                            <button 
                              onClick={() => { setOpenDropdown(null); onDetailClick(r); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 font-medium transition-colors"
                            >
                              <FiEye className="inline mr-2 mb-0.5" /> View Details
                            </button>
                            <button 
                              onClick={() => { setOpenDropdown(null); onAlterationClick && onAlterationClick(r); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 font-medium transition-colors"
                            >
                              <FiScissors className="inline mr-2 mb-0.5" /> Manage Alterations
                            </button>

                            {r.status === 'PRE_BOOKED' && (
                              <button 
                                onClick={() => handlePickup(r)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                              >
                                <FiPackage className="inline mr-2 mb-0.5" /> Mark as Collected
                              </button>
                            )}

                            {((r.status === 'ACTIVE' || r.status === 'OVERDUE') && !r.is_returned) && (
                              <button 
                                onClick={() => { setOpenDropdown(null); setSelectedRental(r); setShowConfirm(true); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium transition-colors"
                              >
                                <FiCheckCircle className="inline mr-2 mb-0.5" /> Mark Returned
                              </button>
                            )}

                            <div className="h-px bg-gray-100 my-1"></div>
                            
                            <button 
                              onClick={() => handleDelete(r)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                            >
                              <FiTrash2 className="inline mr-2 mb-0.5" /> Delete Booking
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="flex justify-between items-center p-4 border-t border-[#00000014] bg-gray-50/30 mt-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRentals.length)} of {filteredRentals.length} rentals
        </p>
        
        <div className="flex gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft size={16} />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                currentPage === i + 1 
                ? 'bg-pink-500 text-white shadow-md shadow-pink-100' 
                : 'text-gray-400 hover:bg-white border border-transparent hover:border-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => paginate(currentPage + 1)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      {showConfirm && (
        <ReturnRentalModal 
          rental={selectedRental}
          onConfirm={(returnParams) => {
            // Because returnRental takes orderId, data={} we must adapt
            returnRental(selectedRental.id, returnParams).then(() => {
              setToast({ message: "Return processed successfully!", type: "success" });
              onRefresh();
              setShowConfirm(false);
            }).catch(err => {
              setToast({ message: "Failed to process return.", type: "error" });
            });
          }}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
