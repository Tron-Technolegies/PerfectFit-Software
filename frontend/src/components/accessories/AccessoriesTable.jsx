import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiShoppingCart, FiPackage, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loader from "../common/Loader";

export default function AccessoriesTable({ accessories, loading, onAddClick, onEditClick, onSellClick, onDeleteClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAccessories = (accessories || []).filter((acc) =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.code && acc.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccessories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* TABLE HEADER */}
      <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search accessories..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all"
          />
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-95 whitespace-nowrap"
        >
          <FiPlus />
          Add Accessory
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                Product Info
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                Category
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">
                Price (₹)
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">
                Stock
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <Loader />
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform overflow-hidden border border-gray-100">
                        {acc.image_url ? (
                           <img src={acc.image_url} alt={acc.name} className="w-full h-full object-cover" />
                        ) : (
                           <FiPackage size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">{acc.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{acc.code || `#${acc.id}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                      {acc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <p className="text-sm font-black text-gray-800">₹{acc.price}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-bold ${acc.stock < 5 ? "text-red-500" : "text-gray-600"}`}>
                      {acc.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                       <button
                        onClick={() => onSellClick(acc)}
                        title="Quick Sell"
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <FiShoppingCart size={16} />
                      </button>
                      <button
                        onClick={() => onEditClick(acc)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(acc)}
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
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm font-medium italic">
                  No accessories found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="flex justify-between items-center p-4 border-t border-gray-50 bg-gray-50/30">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAccessories.length)} of {filteredAccessories.length} items
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
    </div>
  );
}
