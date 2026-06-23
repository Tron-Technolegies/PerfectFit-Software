import React, { useState } from "react";
import { FiSearch, FiShoppingCart, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loader from "../common/Loader";

export default function SalesHistoryTable({ sales, loading, onEditSale, onDeleteSale }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSales = (sales || []).filter((s) =>
    s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.accessory_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* TABLE HEADER */}
      <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sales history..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-100 outline-none transition-all"
          />
        </div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
           <FiShoppingCart className="text-green-500" /> Total Records: {sales.length}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                Date & Customer
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                Product
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">
                Qty
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">
                Discount
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">
                Total (₹)
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <Loader />
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">{s.date}</p>
                      <p className="text-sm font-bold text-gray-800 uppercase">{s.customer_name}</p>
                      {s.customer_phone && <p className="text-[10px] text-gray-400 font-medium">{s.customer_phone}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-pink-600 uppercase tracking-tight">{s.accessory_name}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">{s.quantity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <p className="text-sm font-bold text-red-400">{s.discount > 0 ? `-₹${s.discount}` : "-"}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <p className="text-sm font-black text-gray-800">₹{s.total_price}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditSale(s)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteSale(s)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm font-medium italic">
                  No sales history found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="flex justify-between items-center p-4 border-t border-gray-50 bg-gray-50/30">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSales.length)} of {filteredSales.length} records
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
                ? 'bg-green-500 text-white shadow-md shadow-green-100' 
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
    </div>
  );
}
