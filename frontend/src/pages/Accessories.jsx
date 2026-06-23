import React, { useState, useEffect } from "react";
import AccessoriesTable from "../components/accessories/AccessoriesTable";
import SalesHistoryTable from "../components/accessories/SalesHistoryTable";
import AddEditAccessoryModal from "../components/accessories/AddEditAccessoryModal";
import SellAccessoryModal from "../components/accessories/SellAccessoryModal";
import ConfirmModal from "../components/common/ConfirmModal";
import Toast from "../components/common/Toast";
import { FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import { getAccessories, createAccessory, updateAccessory, deleteAccessory, getAccessorySales, recordAccessorySale, updateAccessorySale, deleteAccessorySale } from "../api/accessoriesApi";

export default function Accessories() {
  const [activeTab, setActiveTab] = useState("products"); // "products" or "sales"
  const [accessories, setAccessories] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSaleModalOpen, setIsDeleteSaleModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "products") {
        const response = await getAccessories();
        setAccessories(response.data);
      } else {
        const response = await getAccessorySales();
        setSales(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch accessories data:", error);
      setToast({ message: "Failed to load data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Product Handlers
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (selectedProduct) {
        await updateAccessory(selectedProduct.id, formData);
        setToast({ message: "Product updated successfully!", type: "success" });
      } else {
        await createAccessory(formData);
        setToast({ message: "Product added to inventory!", type: "success" });
      }
      fetchData();
    } catch (error) {
      setToast({ message: error.response?.data?.error || "Action failed", type: "error" });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteAccessory(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setToast({ message: "Product removed from inventory", type: "success" });
      fetchData();
    } catch (error) {
      setToast({ message: "Failed to delete product", type: "error" });
    }
  };

  // Sale Handlers
  const handleSellProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSale(null);
    setIsSellModalOpen(true);
  };

  const handleEditSale = (sale) => {
    const product = accessories.find(a => a.id === sale.accessory_id);
    setSelectedProduct(product);
    setSelectedSale(sale);
    setIsSellModalOpen(true);
  };

  const handleDeleteSaleClick = (sale) => {
    setSelectedSale(sale);
    setIsDeleteSaleModalOpen(true);
  };

  const handleCompleteSale = async (saleData) => {
    try {
      let res;
      if (selectedSale) {
        res = await updateAccessorySale(selectedSale.id, saleData);
        setToast({ message: "Sale updated successfully!", type: "success" });
      } else {
        res = await recordAccessorySale({
          accessory_id: selectedProduct.id,
          ...saleData
        });
        setToast({ message: "Sale recorded successfully!", type: "success" });
      }
      fetchData();
      return res;
    } catch (error) {
      setToast({ message: error.response?.data?.error || "Sale failed", type: "error" });
      throw error;
    }
  };

  const confirmDeleteSale = async () => {
    try {
      await deleteAccessorySale(selectedSale.id);
      setIsDeleteSaleModalOpen(false);
      setToast({ message: "Sale record deleted and stock restored", type: "success" });
      fetchData();
    } catch (error) {
      setToast({ message: "Failed to delete sale record", type: "error" });
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* HEADER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="p-4 bg-pink-50 rounded-xl text-pink-500 group-hover:scale-110 transition-transform">
            <FiShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
              Accessories Studio
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Manage your retail inventory
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50/20 rounded-full translate-x-16 -translate-y-16" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="p-4 bg-green-50 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
              ₹ {sales.reduce((sum, s) => sum + s.total_price, 0).toLocaleString()}
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-green-600">
              Total Sales Revenue
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/10 rounded-full translate-x-16 -translate-y-16" />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-gray-100 px-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-6 text-sm font-medium cursor-pointer transition-all relative ${
            activeTab === "products" ? "text-pink-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Product List
          {activeTab === "products" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-t-full shadow-lg shadow-pink-200" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-2 px-4 text-sm font-medium transition-all ${
            activeTab === "sales" ? "text-pink-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Sales History
          {activeTab === "sales" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-t-full shadow-lg shadow-pink-200" />
          )}
        </button>
      </div>

      {/* TABLE CONTENT */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "products" ? (
          <AccessoriesTable
            accessories={accessories}
            loading={loading}
            onAddClick={handleAddProduct}
            onEditClick={handleEditProduct}
            onSellClick={handleSellProduct}
            onDeleteClick={handleDeleteClick}
          />
        ) : (
          <SalesHistoryTable 
            sales={sales} 
            loading={loading} 
            onEditSale={handleEditSale}
            onDeleteSale={handleDeleteSaleClick}
          />
        )}
      </div>

      {/* MODALS */}
      {isProductModalOpen && (
        <AddEditAccessoryModal
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          accessory={selectedProduct}
        />
      )}

      {isSellModalOpen && (
        <SellAccessoryModal
          onClose={() => setIsSellModalOpen(false)}
          onSave={handleCompleteSale}
          accessory={selectedProduct}
          sale={selectedSale}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Remove Product?"
          message={`Are you sure you want to remove "${selectedProduct?.name}" from your inventory? This action cannot be undone.`}
        />
      )}

      {isDeleteSaleModalOpen && (
        <ConfirmModal
          isOpen={isDeleteSaleModalOpen}
          onClose={() => setIsDeleteSaleModalOpen(false)}
          onConfirm={confirmDeleteSale}
          title="Delete Sale Record?"
          message={`Are you sure you want to delete this sale record for "${selectedSale?.customer_name}"? The stock for "${selectedSale?.accessory_name}" will be restored automatically.`}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
