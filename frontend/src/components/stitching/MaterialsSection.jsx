import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiShoppingCart, FiList, FiClock, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getMaterials, deleteMaterial } from "../../api/materialApi";
import { getServerUrl } from "../../api/backendApi";
import AddEditMaterialModal from "./AddEditMaterialModal";
import NewPurchaseModal from "./NewPurchaseModal";
import PurchaseHistoryTable from "./PurchaseHistoryTable";

export default function MaterialsSection() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [activeTab, setActiveTab] = useState("inventory"); // "inventory" or "history"
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const response = await getMaterials();
      setMaterials(response.data);
    } catch (err) {
      console.error("Failed to load materials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      await deleteMaterial(id);
      loadMaterials();
    } catch (err) {
      alert("Failed to delete material");
    }
  };

  // Filter Logic
  const filteredMaterials = (materials || []).filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.colour.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      {/* TABS */}
      <div className="flex gap-4 border-b border-[#00000014]">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-2 px-4 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "inventory"
              ? "border-b-2 border-pink-500 text-pink-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <span className="flex items-center gap-2 small-caps">
            <FiList size={14} /> Inventory
          </span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-2 px-4 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "history"
              ? "border-b-2 border-pink-500 text-pink-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <span className="flex items-center gap-2">
            <FiClock size={14} /> Purchase History
          </span>
        </button>
      </div>

      {activeTab === "inventory" ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text"
                  placeholder="Search fabric code, name..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-pink-300 transition-all"
               />
            </div>
            <button
              onClick={() => {
                setEditingMaterial(null);
                setIsModalOpen(true);
              }}
              className="bg-pink-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-pink-600 shadow-lg shadow-pink-100 transition active:scale-95"
            >
              <FiPlus /> Add Material
            </button>
          </div>

      <div className="bg-white rounded-xl border border-[#00000014] overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-400 border-b border-[#00000014]">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Image</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Code</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Material Name</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Colour</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Price/Mtr</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Available Stock</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-center">Actions</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-[#00000005]">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400">Loading materials...</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400 italic">No materials found in library</td>
              </tr>
            ) : (
              currentItems.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    {m.image_url ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white">
                        <img 
                          src={getServerUrl(m.image_url)} 
                          alt={m.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-[8px] text-gray-300 font-bold uppercase text-center leading-tight">
                        No<br/>Img
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-mono text-[10px] text-pink-500 font-bold uppercase tracking-tight">{m.code}</td>
                  <td className="p-4 font-bold text-gray-800">{m.name}</td>
                  <td className="p-4 text-gray-600 font-medium">{m.colour}</td>
                  <td className="p-4 text-gray-600 font-bold font-mono text-xs">₹ {m.price_per_meter}</td>
                  <td className="p-4">
                    <span className={`font-black text-xs px-2 py-1 rounded-lg ${m.available_stock < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                      {m.available_stock} mtrs
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedMaterialId(m.id);
                          setIsPurchaseModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                        title="Purchase Stock"
                      >
                        <FiShoppingCart size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingMaterial(m);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Info"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* FOOTER / PAGINATION */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMaterials.length)} of {filteredMaterials.length} fabrics
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
        ) : (
          <PurchaseHistoryTable />
        )}

      {isModalOpen && (
        <AddEditMaterialModal
          material={editingMaterial}
          onClose={() => setIsModalOpen(false)}
          onSave={loadMaterials}
        />
      )}

      {isPurchaseModalOpen && (
        <NewPurchaseModal
          preSelectedMaterialId={selectedMaterialId}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setSelectedMaterialId("");
          }}
          onSave={loadMaterials}
        />
      )}
    </div>
  );
}
