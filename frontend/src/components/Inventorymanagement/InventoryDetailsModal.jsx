import React, { useEffect, useState } from "react";
import { FiEdit, FiX, FiCheck, FiSettings, FiAlertTriangle, FiTrash2, FiPrinter } from "react-icons/fi";
import { getServerUrl } from "../../api/backendApi";
import { getItemHistory, getItemUnits, updateUnitStatus } from "../../api/rentalApi";
import Loader from "../common/Loader";

const conditionLabel = {
  ready: "Ready",
  washing: "In Washing",
  repair: "Under Repair",
};

const statusStyles = {
  available: "bg-green-100 text-green-600 border-green-200",
  rented: "bg-blue-100 text-blue-600 border-blue-200",
  washing: "bg-orange-100 text-orange-600 border-orange-200",
  repair: "bg-purple-100 text-purple-600 border-purple-200",
  damaged: "bg-red-100 text-red-600 border-red-200",
  retired: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function InventoryDetailsModal({ item, onClose, onEdit }) {
  const [history, setHistory] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [unitForm, setUnitForm] = useState({ status: "", notes: "", size: "" });

  const loadData = async () => {
    if (!item?.id) return;
    setLoading(true);
    setUnitsLoading(true);
    try {
      const [historyRes, unitsRes] = await Promise.all([
        getItemHistory(item.id),
        getItemUnits(item.id)
      ]);
      setHistory(historyRes.data.history || []);
      setUnits(unitsRes.data || []);
    } catch (err) {
      console.error("Failed to load item data", err);
    } finally {
      setLoading(false);
      setUnitsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [item?.id]);

  const handleEditUnit = (unit) => {
    setEditingUnitId(unit.id);
    setUnitForm({ status: unit.status, notes: unit.notes || "", size: unit.size || "" });
  };

  const handleUpdateUnit = async (unitId) => {
    try {
      await updateUnitStatus(unitId, unitForm);
      setEditingUnitId(null);
      // Refresh units
      const response = await getItemUnits(item.id);
      setUnits(response.data);
    } catch (err) {
      alert("Failed to update unit status");
    }
  };

  const handlePrintBarcode = (unit) => {
    const printWindow = window.open("", "_blank", "width=600,height=400");
    const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(unit.barcode || unit.unit_id)}&scale=3&rotate=N&includetext`;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${unit.unit_id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
              margin: 0;
            }
            .sticker {
              border: 2px dashed #ccc;
              padding: 15px;
              display: inline-block;
              border-radius: 8px;
              background: #fff;
              max-width: 300px;
            }
            h1 {
              font-size: 14px;
              margin: 0 0 5px 0;
              color: #333;
            }
            p {
              font-size: 10px;
              margin: 2px 0;
              color: #666;
              font-weight: bold;
            }
            img {
              margin-top: 10px;
              max-width: 100%;
            }
            @media print {
              body { padding: 0; }
              .sticker { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <h1>${item.name}</h1>
            <p>Size: ${unit.size} | Category: ${item.category}</p>
            <img src="${barcodeUrl}" alt="Barcode" onload="window.print(); window.close();" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-[#00000014] overflow-hidden shadow-2xl animate-in zoom-in duration-200 my-8">
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#00000014] bg-gray-50/50">
          <div>
            <h2 className="font-bold text-xl text-gray-800">{item.name}</h2>
            <p className="text-xs text-gray-400">Manage individual units and track performance</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onEdit}
              className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-pink-600 transition-all"
            >
              <FiEdit size={14} /> Edit Catalog
            </button>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
                <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="shrink-0">
              <img 
                src={item.image_url ? getServerUrl(item.image_url) : item.img} 
                alt="" 
                className="w-48 h-48 rounded-2xl object-cover shadow-sm border border-gray-100" 
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  {item.code}
                </span>
              </div>

              <p className="text-gray-500 leading-relaxed text-sm">{item.description || "No description added."}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                  <p className="text-[10px] text-green-600 font-black uppercase mb-1">Rental Price</p>
                  <p className="text-lg font-black text-green-700 font-mono">₹{item.rental_price}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-black uppercase mb-1">Total Pieces</p>
                  <p className="text-lg font-black text-blue-700">{item.total_stock}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                  <p className="text-[10px] text-orange-600 font-black uppercase mb-1">Available Now</p>
                  <p className="text-lg font-black text-orange-700">{item.available_stock}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <p className="text-[10px] text-purple-600 font-black uppercase mb-1">Times Rented</p>
                  <p className="text-lg font-black text-purple-700">{item.times_rented || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
             {/* PHYSICAL UNITS SECTION */}
             <div className="space-y-4">
                <div className="flex justify-between items-center border-l-4 border-blue-500 pl-4 py-1">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Physical Units (Inventory)</h3>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">Tracking Individual IDs</span>
                </div>
                
                {unitsLoading ? (
                    <div className="py-10"><Loader /></div>
                ) : (
                    <div className="space-y-3">
                        {units.map(u => (
                            <div key={u.id} className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <span className="text-[10px] font-black uppercase tracking-tighter">ID</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">{u.unit_id}</p>
                                                <span className="text-[10px] bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded font-black uppercase">Size: {u.size}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-[10px] text-gray-500 font-mono"><FiEdit className="inline mr-1" />Barcode: {u.barcode || u.unit_id}</p>
                                                <button 
                                                    type="button"
                                                    onClick={() => handlePrintBarcode(u)}
                                                    className="p-1 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded transition-all"
                                                    title="Print Barcode Label"
                                                >
                                                    <FiPrinter size={12} />
                                                </button>
                                            </div>
                                            {editingUnitId === u.id ? (
                                                <div className="mt-2 space-y-2">
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text"
                                                            value={unitForm.size}
                                                            onChange={(e) => setUnitForm({...unitForm, size: e.target.value})}
                                                            placeholder="Size (M, XL...)"
                                                            className="text-[11px] border-b border-blue-200 outline-none w-20 focus:border-blue-500 transition-colors"
                                                        />
                                                        <input 
                                                            type="text"
                                                            value={unitForm.notes}
                                                            onChange={(e) => setUnitForm({...unitForm, notes: e.target.value})}
                                                            placeholder="Add condition notes..."
                                                            className="text-[11px] border-b border-blue-200 outline-none flex-1 focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-gray-400 font-medium italic">{u.notes || "No specific condition notes"}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {editingUnitId === u.id ? (
                                            <div className="flex items-center gap-2">
                                                <select 
                                                    value={unitForm.status}
                                                    onChange={(e) => setUnitForm({...unitForm, status: e.target.value})}
                                                    className="text-[10px] font-bold p-1 rounded border border-blue-200 outline-none"
                                                >
                                                    <option value="available">Available</option>
                                                    <option value="rented">Rented</option>
                                                    <option value="washing">Washing</option>
                                                    <option value="repair">Repair</option>
                                                    <option value="damaged">Damaged</option>
                                                    <option value="retired">Retired</option>
                                                </select>
                                                <button onClick={() => handleUpdateUnit(u.id)} className="p-1.5 bg-green-500 text-white rounded-lg"><FiCheck size={12} /></button>
                                                <button onClick={() => setEditingUnitId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg"><FiX size={12} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${statusStyles[u.status]}`}>
                                                    {u.status}
                                                </span>
                                                <button 
                                                    onClick={() => handleEditUnit(u)}
                                                    className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <FiSettings size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>

             {/* RENTAL HISTORY SECTION */}
             <div className="space-y-4">
                <div className="flex justify-between items-center border-l-4 border-pink-500 pl-4 py-1">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Recent Bookings</h3>
                    <span className="text-[10px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full font-bold uppercase">Performance</span>
                </div>

                {loading ? (
                    <div className="py-10"><Loader /></div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-[11px] text-gray-400 font-bold uppercase">No bookings recorded yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                        {history.map((h) => (
                            <div key={h.order_id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <p className="text-sm font-black text-gray-800 uppercase">{h.customer_name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{h.phone}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${h.is_returned ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                                        {h.is_returned ? 'Returned' : 'Active'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                        <span className="font-bold">{h.rental_date}</span>
                                        <span className="text-gray-300 font-black">→</span>
                                        <span className="font-bold">{h.return_date}</span>
                                    </div>
                                    <p className="text-xs font-black text-gray-800">₹{h.rental_amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
