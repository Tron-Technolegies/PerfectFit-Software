import React, { useEffect, useMemo, useState } from "react";
import { FiEdit, FiEye, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryCategories,
  getInventoryItem,
  getInventoryItems,
  updateInventoryItem,
} from "../../api/inventoryApi";
import AddEditItemModal from "./AddEditItemModal";
import InventoryDetailsModal from "./InventoryDetailsModal";
import Loader from "../common/Loader";
import ConfirmModal from "../common/ConfirmModal";
import Toast from "../common/Toast";
import { getServerUrl } from "../../api/backendApi";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/80?text=Item";

const conditionStyle = {
  ready: "bg-green-100 text-green-600",
  washing: "bg-orange-100 text-orange-500",
  repair: "bg-red-100 text-red-500",
};

const statusStyle = {
  Available: "bg-green-100 text-green-600",
  Unavailable: "bg-red-100 text-red-500",
};

const conditionLabel = {
  ready: "Ready",
  washing: "In Washing",
  repair: "Under Repair",
};

function normalizeItem(item, imagePreview) {
  const totalStock = Number(item.total_stock || 0);
  const availableStock = Number(item.available_stock || 0);

  return {
    ...item,
    code: item.code || "",
    colour: item.colour || "",
    size: item.size || "Free Size",
    description: item.description || "",
    total_stock: totalStock,
    available_stock: availableStock,
    rental_price: Number(item.rental_price || 0),
    status: item.is_available ? "Available" : "Unavailable",
    stock: `${availableStock} / ${totalStock}`,
    img: imagePreview || (item.image_url ? getServerUrl(item.image_url) : PLACEHOLDER_IMAGE),
  };
}

export default function InventoryTable({ onItemsChange }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const loadInventory = async () => {
    setLoading(true);
    setError("");

    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        getInventoryItems(),
        getInventoryCategories(),
      ]);

      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
      onItemsChange?.(itemsResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to load inventory items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Handle reset on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  const normalizedItems = useMemo(
    () => items.map((item) => normalizeItem(item, imagePreviews[item.id])),
    [items, imagePreviews],
  );

  const filteredItems = useMemo(() => {
    return normalizedItems.filter((item) => {
      // 1. Search Query
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || (
        item.name?.toLowerCase().includes(query) ||
        item.code?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );

      // 2. Filter Status
      let matchesFilter = true;
      if (filterStatus === "Available") {
        matchesFilter = item.available_stock > 0;
      } else if (filterStatus === "Rented") {
        matchesFilter = item.has_rented;
      } else if (filterStatus === "Pre-Booked") {
        matchesFilter = item.has_prebooked;
      } else if (filterStatus === "Returned") {
        matchesFilter = item.has_returned;
      } else if (filterStatus === "Under Alteration") {
        matchesFilter = item.has_alteration;
      }

      return matchesSearch && matchesFilter;
    });
  }, [normalizedItems, search, filterStatus]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleRowClick = async (item) => {
    setLoading(true);
    setError("");
    try {
      const response = await getInventoryItem(item.id);
      setSelectedItem(response.data);
    } catch (err) {
      setError("Unable to load item details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload, imagePreview, isMultipart) => {
    setSaving(true);
    setError("");

    let dataToLink = payload;

    if (isMultipart) {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === "image") {
          if (payload.image) {
            formData.append("image", payload.image);
          }
        } else {
          const value = Array.isArray(payload[key]) || (typeof payload[key] === 'object' && payload[key] !== null)
            ? JSON.stringify(payload[key]) 
            : payload[key];
          formData.append(key, value);
        }
      });
      dataToLink = formData;
    }

    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.id, dataToLink, isMultipart);
        if (imagePreview) {
          setImagePreviews((current) => ({
            ...current,
            [editingItem.id]: imagePreview,
          }));
        }
      } else {
        const response = await createInventoryItem(dataToLink);
        if (imagePreview && response.data?.id) {
          setImagePreviews((current) => ({
            ...current,
            [response.data.id]: imagePreview,
          }));
        }
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setToast({ message: editingItem ? "Item updated successfully" : "Item added successfully", type: "success" });
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to save inventory item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    setDeleteTarget(null);

    setError("");

    try {
      await deleteInventoryItem(deleteTarget.id);
      setSelectedItem(null);
      setImagePreviews((current) => {
        const next = { ...current };
        delete next[deleteTarget.id];
        return next;
      });
      setToast({ message: "Item deleted successfully", type: "success" });
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete inventory item.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#00000014] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between gap-3 p-4 border-b border-[#00000014]">
        <div className="flex gap-2 w-full md:max-w-xl">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, code, or category..."
            className="border border-[#00000014] px-4 py-2 rounded-lg w-full outline-none text-sm focus:border-pink-300 transition-all"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-[#00000014] px-3 py-2 rounded-lg outline-none text-sm bg-white font-medium text-gray-700 focus:border-pink-300"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Pre-Booked">Pre-Booked</option>
            <option value="Returned">Returned</option>
            <option value="Under Alteration">Under Alteration</option>
          </select>
        </div>
        <button onClick={openCreateModal} className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-100 active:scale-95 shrink-0">
          + Add New Item
        </button>
      </div>

      {error && <div className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {loading ? (
        <Loader />
      ) : filteredItems.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">No inventory items found.</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 bg-[#F9FAFB] border-b border-[#00000014]">
                <tr>
                  <th className="text-left p-4 font-medium">ITEM</th>
                  <th className="text-left p-4 font-medium">CODE</th>
                  <th className="text-left p-4 font-medium">CATEGORY</th>
                  <th className="text-left p-4 font-medium">TOTAL/AVAILABLE</th>
                  <th className="text-left p-4 font-medium">RENT PRICE</th>
                  <th className="text-left p-4 font-medium">CONDITION</th>
                  <th className="text-left p-4 font-medium">STATUS</th>
                  <th className="p-4 font-medium text-center">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                 {paginatedItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-[#00000014] hover:bg-gray-50/50 transition cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img src={item.img} alt="" className="w-10 h-10 rounded-lg shadow-sm border border-gray-100 object-cover" />
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </td>

                    <td className="p-4 font-mono text-xs text-gray-500 uppercase">{item.code}</td>
                    <td className="p-4 text-gray-600">{item.category}</td>
                    <td className="p-4 text-gray-600">{item.stock}</td>
                    <td className="p-4 font-semibold text-gray-700 font-mono text-xs">Rs. {item.rental_price}</td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          conditionStyle[item.condition] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {conditionLabel[item.condition] || item.condition}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${statusStyle[item.status]}`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-4 justify-center" onClick={(e) => e.stopPropagation()}>
                        <FiEdit 
                          className="cursor-pointer hover:text-pink-500 transition text-gray-400" 
                          onClick={() => openEditModal(item)} 
                        />
                        <FiTrash2
                          className="cursor-pointer text-gray-400 hover:text-red-500 transition"
                          onClick={() => setDeleteTarget(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4 p-4">
            {paginatedItems.map((item) => (
              <div key={item.id} className="border border-[#00000014] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src={item.img} alt="" className="w-10 h-10 rounded object-cover" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.code}</p>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <p>Category: {item.category}</p>
                  <p>Size: <span className="font-bold text-pink-500">{item.size}</span></p>
                  <p>Stock: {item.stock}</p>
                  <p>Price: Rs. {item.rental_price}</p>
                </div>

                <div className="flex justify-between mt-3">
                  <span className={`text-xs px-2 py-1 rounded ${statusStyle[item.status]}`}>
                    {item.status}
                  </span>

                  <div className="flex gap-3">
                    <FiEye className="cursor-pointer" onClick={() => setSelectedItem(item)} />
                    <FiEdit className="cursor-pointer" onClick={() => openEditModal(item)} />
                    <FiTrash2
                      className="cursor-pointer text-red-500"
                      onClick={() => setDeleteTarget(item)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* FOOTER / PAGINATION */}
          {filteredItems.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-[#00000014] bg-gray-50/30">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
              </p>
              
              <div className="flex gap-1">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft size={16} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
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
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedItem && (
        <InventoryDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEdit={() => {
            setEditingItem(selectedItem);
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {isModalOpen && (
        <AddEditItemModal
          categories={categories}
          item={editingItem}
          saving={saving}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title={`Delete ${deleteTarget.name}?`}
          message="Are you sure you want to delete this item? This action will remove it from the inventory permanently."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
