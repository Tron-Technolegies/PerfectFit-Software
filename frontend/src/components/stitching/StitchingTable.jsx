import { getStitchingOrders, updateStitchingStatus, deleteStitchingOrder, getStitchingOrder } from "../../api/stitchingApi";
import { FiRefreshCw, FiTrash2, FiCheckCircle, FiEdit2, FiTruck, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import NewStitchingOrderModal from "./NewStitchingOrderModal";
import ViewStitchingOrderModal from "./ViewStitchingOrderModal";
import ConfirmModal from "../common/ConfirmModal";
import { useState } from "react";

export default function StitchingTable({ orders, loading, onRefresh, setToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // VIEWING STATE
  const [viewingOrder, setViewingOrder] = useState(null);
  const [fetchingOrder, setFetchingOrder] = useState(false);

  const handleRowClick = async (id) => {
    setFetchingOrder(true);
    try {
      const response = await getStitchingOrder(id);
      setViewingOrder(response.data);
    } catch (err) {
      setToast({ message: "Failed to load order details", type: "error" });
    } finally {
      setFetchingOrder(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStitchingStatus(id, status);
      setToast({ message: `Order marked as ${statusLabel[status]}`, type: "success" });
      onRefresh();
    } catch (err) {
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedOrderId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrderId) return;
    try {
      await deleteStitchingOrder(selectedOrderId);
      setToast({ message: "Stitching order deleted successfully", type: "success" });
      onRefresh();
    } catch (err) {
      setToast({ message: "Failed to delete order", type: "error" });
    } finally {
      setShowDeleteConfirm(false);
      setSelectedOrderId(null);
    }
  };

  const statusStyle = {
    pending: "bg-pink-100 text-pink-600",
    in_progress: "bg-orange-100 text-orange-500",
    ready: "bg-green-100 text-green-600",
    delivered: "bg-gray-200 text-gray-600",
  };

  const statusLabel = {
    pending: "Pending",
    in_progress: "In Progress",
    ready: "Ready",
    delivered: "Delivered",
  };

  // Filter Logic
  const filteredOrders = (orders || []).filter(o => 
    o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.outfit_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `#ORD-${o.id.toString().padStart(4, '0')}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-xl border border-[#00000014] overflow-hidden">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-3 p-4 border-b border-[#00000014]">
        <div className="flex items-center gap-3 w-full md:max-w-md">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search orders, customers, items..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="border border-[#00000014] pl-10 pr-4 py-2 rounded-lg w-full outline-none text-sm focus:border-pink-300 transition-all"
            />
          </div>
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin text-pink-500" : "text-gray-400"} />
          </button>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-100 active:scale-95"
          >
            + New Order
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 bg-gray-50/50 border-b border-[#00000014]">
            <tr>
              <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">ORDER ID</th>
              <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">CUSTOMER</th>
              <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">TYPE</th>
              <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">GARMENT DETAILS</th>
              <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">STATUS</th>
              <th className="text-left p-4 font-bold text-[10px] uppercase tracking-wider">DUE DATE</th>
              <th className="text-center p-4 font-bold text-[10px] uppercase tracking-wider">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#00000008]">
            {loading && (!orders || orders.length === 0) ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400 flex flex-col items-center gap-2">
                  <FiRefreshCw className="animate-spin text-pink-500 text-xl" />
                  Loading orders...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400 italic">No stitching orders found</td>
              </tr>
            ) : (
              currentItems.map((o) => (
                <tr 
                  key={o.id} 
                  onClick={() => handleRowClick(o.id)}
                  className="hover:bg-gray-50/80 transition cursor-pointer group"
                >
                  <td className="p-6 font-mono text-[10px] text-gray-400 group-hover:text-pink-500 font-bold transition-colors uppercase">#ORD-{o.id.toString().padStart(4, '0')}</td>

                  <td className="p-4">
                    <p className="font-bold text-gray-800">{o.customer}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{o.phone}</p>
                  </td>

                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-gray-500">Custom</span>
                  </td>

                  <td className="p-4">
                    <p className="text-gray-700 font-medium">{o.outfit_type}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{o.material_name || "Own Material"}</p>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusStyle[o.status] || "bg-gray-100 text-gray-500"}`}>
                      {statusLabel[o.status] || o.status}
                    </span>
                  </td>

                  <td className="p-4 text-xs font-bold text-gray-600">
                    {new Date(o.delivery_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>

                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                       {o.status === 'pending' && (
                         <button 
                           onClick={() => handleStatusUpdate(o.id, 'in_progress')}
                           className="p-2 text-orange-400 hover:bg-orange-50 rounded-lg transition"
                           title="Start Progress"
                         >
                           <FiEdit2 size={16} />
                         </button>
                       )}
                       {o.status === 'in_progress' && (
                         <button 
                           onClick={() => handleStatusUpdate(o.id, 'ready')}
                           className="p-2 text-green-400 hover:bg-green-50 rounded-lg transition"
                           title="Mark Ready"
                         >
                           <FiCheckCircle size={16} />
                         </button>
                       )}
                       {o.status === 'ready' && (
                         <button 
                           onClick={() => handleStatusUpdate(o.id, 'delivered')}
                           className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition"
                           title="Mark Delivered"
                         >
                           <FiTruck size={16} />
                         </button>
                       )}
                       
                       <button 
                         onClick={() => handleDeleteClick(o.id)}
                         className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                         title="Delete Order"
                       >
                         <FiTrash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="flex justify-between items-center p-4 border-t border-[#00000014] bg-gray-50/30">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
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

      {isModalOpen && (
        <NewStitchingOrderModal
          onClose={() => setIsModalOpen(false)}
          onSave={onRefresh}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmModal 
          title="Delete Order"
          message="Are you sure you want to delete this stitching order? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      {viewingOrder && (
        <ViewStitchingOrderModal 
          order={viewingOrder} 
          onClose={() => setViewingOrder(null)} 
          onRefresh={onRefresh}
        />
      )}

      {fetchingOrder && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-[1px] flex justify-center items-center z-[60]">
           <FiRefreshCw className="animate-spin text-pink-500 text-2xl" />
        </div>
      )}
    </div>
  );
}
