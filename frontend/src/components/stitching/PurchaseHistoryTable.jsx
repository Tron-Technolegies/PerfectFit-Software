import React, { useEffect, useState } from "react";
import { getMaterialPurchases } from "../../api/materialApi";
import { FiRefreshCw, FiCalendar, FiPackage, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function PurchaseHistoryTable() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const response = await getMaterialPurchases();
      setPurchases(response.data);
    } catch (err) {
      console.error("Failed to load purchases", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (purchases || []).slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Transaction History</h3>
        <button 
          onClick={loadPurchases}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-pink-500"
          title="Refresh History"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#00000014] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-400 border-b border-[#00000014]">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Date</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Material</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Quantity</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Cost / Unit</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000005]">
              {loading && purchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    <FiRefreshCw className="animate-spin mx-auto mb-2 text-pink-500" size={24} />
                    <p className="text-xs font-medium">Fetching history...</p>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    <FiPackage className="mx-auto mb-2 opacity-20" size={32} />
                    <p className="text-xs font-medium">No purchase records found</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar className="text-gray-300 group-hover:text-pink-400 transition-colors" size={14} />
                        <span className="font-medium">{p.purchase_date}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-800">{p.material}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600 font-medium">{p.quantity} meters</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-500 font-bold font-mono">₹{p.cost_per_unit}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-black text-gray-800 tracking-tight font-mono text-base">₹ {p.total_cost}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER / PAGINATION */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, purchases.length)} of {purchases.length} records
          </p>
          
          <div className="flex gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft size={14} />
            </button>
            
            <button
              onClick={() => paginate(currentPage)}
              className="w-8 h-8 rounded-lg text-xs font-bold bg-pink-500 text-white shadow-md shadow-pink-100"
            >
              {currentPage}
            </button>

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => paginate(currentPage + 1)}
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
