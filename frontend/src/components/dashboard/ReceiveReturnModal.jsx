import React, { useEffect, useState } from "react";
import { FiSearch, FiX, FiRefreshCw } from "react-icons/fi";
import { getRentals } from "../../api/rentalApi";

export default function ReceiveReturnModal({ onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await getRentals();
        // Filter for items not yet returned
        setOrders(response.data.filter(o => !o.is_returned));
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filtered = orders.filter((o) => 
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.order_code.toLowerCase().includes(search.toLowerCase()) ||
    o.item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center h-screen justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl border border-[#00000014] flex flex-col max-h-[80vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00000014]">
          <h2 className="font-semibold">Receive Return</h2>
          <FiX className="cursor-pointer text-gray-500" onClick={onClose} />
        </div>

        {/* CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* SEARCH */}
          <div className="flex items-center border border-[#00000014] rounded-lg px-3 py-2 mb-4">
            <FiSearch className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer name, or item..."
              className="ml-2 w-full outline-none text-sm"
            />
          </div>

          {/* LIST */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center p-8">
                <FiRefreshCw className="animate-spin text-pink-500 text-xl" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-400 text-sm p-4">No active rentals found.</p>
            ) : (
              filtered.map((o, i) => (
                <div
                  key={o.id}
                  onClick={() => onSelect(o)}
                  className="border border-[#00000014] rounded-lg p-4 cursor-pointer hover:bg-[#FFF5F8] transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {o.order_code} • {o.customer_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{o.item_name} ({o.item_code})</p>
  
                      <p className="text-xs text-gray-400 mt-1">Return: {o.return_date}</p>
                    </div>
  
                    <div className="text-right text-sm">
                      <p className="font-medium">₹{o.rental_amount}</p>
                      <p className="text-xs text-gray-400 italic">Due: ₹{o.due_amount}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#00000014]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#00000014] rounded-lg text-sm cursor-pointer"
          >
            Cancel
          </button>

          <button className="px-4 py-2 bg-gray-300 text-white rounded-lg text-sm cursor-not-allowed">
            Process Return & Refund
          </button>
        </div>
      </div>
    </div>
  );
}
