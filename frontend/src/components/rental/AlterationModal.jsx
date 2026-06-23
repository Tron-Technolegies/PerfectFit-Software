import React, { useState, useEffect } from "react";
import { FiX, FiCheckCircle, FiClock, FiTool, FiCheck, FiTruck, FiPlus } from "react-icons/fi";
import { getAlterations, getAlterationTypes, createAlteration, updateAlteration } from "../../api/rentalApi";

export default function AlterationModal({ order, onClose }) {
  const [alterations, setAlterations] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // New alteration form state
    const [newAlt, setNewAlt] = useState({
    product_id: "",
    alteration_area: "",
    notes: "",
    expected_completion_date: "",
    restore_after_return: false
  });

  useEffect(() => {
    fetchData();
  }, [order.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const altsRes = await getAlterations(order.id);
      setAlterations(altsRes.data);
      if (order.items && order.items.length === 1) {
          setNewAlt(prev => ({ ...prev, product_id: order.items[0].product_id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (altId, newStatus) => {
    try {
      await updateAlteration(altId, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAlt.product_id || !newAlt.alteration_type_id || !newAlt.expected_completion_date) {
        alert("Please fill all required fields");
        return;
    }
    try {
      await createAlteration({
        booking_id: order.id,
        ...newAlt
      });
      setAdding(false);
            setNewAlt({
        product_id: order.items?.length === 1 ? order.items[0].product.id : "",
        alteration_area: "",
        notes: "",
        expected_completion_date: "",
        restore_after_return: false
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create alteration");
    }
  };

  const getStatusIcon = (status) => {
      switch(status) {
          case 'PENDING': return <FiClock className="text-yellow-500" />;
          case 'IN_PROGRESS': return <FiTool className="text-blue-500" />;
          case 'COMPLETED': return <FiCheckCircle className="text-green-500" />;
          case 'DELIVERED': return <FiTruck className="text-purple-500" />;
          default: return <FiClock className="text-gray-400" />;
      }
  };

  const getStatusColor = (status) => {
    switch(status) {
        case 'PENDING': return "bg-yellow-50 text-yellow-700 border-yellow-200";
        case 'IN_PROGRESS': return "bg-blue-50 text-blue-700 border-blue-200";
        case 'COMPLETED': return "bg-green-50 text-green-700 border-green-200";
        case 'DELIVERED': return "bg-purple-50 text-purple-700 border-purple-200";
        default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/30">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Alterations for ORD-{order.id.toString().padStart(4, '0')}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.customer?.name} - {order.status.replace("_", " ")}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
            <FiX className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-gray-50/20">
          
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700">Existing Alterations</h3>
            {!adding && (
              <button 
                onClick={() => setAdding(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg text-xs font-bold hover:bg-pink-100 transition-colors"
              >
                <FiPlus /> Add Alteration
              </button>
            )}
          </div>

          {adding && (
            <form onSubmit={handleCreate} className="bg-white p-5 rounded-xl shadow-sm border border-pink-100 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-pink-500 uppercase tracking-widest">New Alteration</h4>
                  <button type="button" onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product</label>
                  <select 
                    value={newAlt.product_id}
                    onChange={e => setNewAlt({...newAlt, product_id: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all"
                    required
                  >
                    <option value="">Select product...</option>
                    {order.items?.map(item => (
                      <option key={item.product.id} value={item.product.id}>{item.product.name} ({item.unit?.unit_id})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Alteration Area (e.g. Hip, Sleeve)</label>
                  <input 
                    type="text"
                    value={newAlt.alteration_area}
                    onChange={e => setNewAlt({...newAlt, alteration_area: e.target.value})}
                    placeholder="Describe the area to be altered"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expected Completion</label>
                  <input 
                    type="date"
                    value={newAlt.expected_completion_date}
                    onChange={e => setNewAlt({...newAlt, expected_completion_date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                  <input 
                    type="text"
                    value={newAlt.notes}
                    onChange={e => setNewAlt({...newAlt, notes: e.target.value})}
                    placeholder="e.g. Shorten by 2 inches"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox"
                  id="restore_after_return"
                  checked={newAlt.restore_after_return}
                  onChange={e => setNewAlt({...newAlt, restore_after_return: e.target.checked})}
                  className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="restore_after_return" className="text-xs font-bold text-gray-600 cursor-pointer select-none">
                  Restore after return (Revert alteration)
                </label>
              </div>
              <div className="flex justify-end mt-4">
                  <button type="submit" className="px-5 py-2.5 bg-pink-500 text-white font-bold text-sm rounded-xl hover:bg-pink-600 shadow-md shadow-pink-200 transition-all">
                      Save Alteration
                  </button>
              </div>
            </form>
          )}

          {loading ? (
              <div className="text-center py-10 text-gray-400 text-sm font-medium">Loading alterations...</div>
          ) : alterations.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                  <FiTool className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm font-medium">No alterations recorded for this booking.</p>
              </div>
          ) : (
            <div className="space-y-3">
              {alterations.map(alt => (
                <div key={alt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                      <div className="mt-1">
                          {getStatusIcon(alt.status)}
                      </div>
                      <div>
                          <p className="font-bold text-gray-800 text-sm">{alt.product_name} <span className="text-gray-400 font-medium ml-1">· {alt.alteration_area || alt.alteration_type || 'Alteration'}</span></p>
                          <p className="text-xs text-gray-500 mt-1">Expected: {alt.expected_completion_date} {alt.completed_date && `| Completed: ${alt.completed_date}`}</p>
                          {alt.notes && <p className="text-xs bg-gray-50 text-gray-600 p-2 rounded-lg mt-2 inline-block italic border border-gray-100">{alt.notes}</p>}
                          {alt.restore_after_return && <p className="text-[10px] font-bold text-orange-500 uppercase mt-2">⚠️ Restore after return</p>}
                      </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <select
                          value={alt.status}
                          onChange={(e) => handleStatusChange(alt.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer appearance-none ${getStatusColor(alt.status)}`}
                      >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="DELIVERED">Delivered</option>
                      </select>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
