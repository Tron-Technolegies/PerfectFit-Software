import React, { useState } from "react";
import { FiX, FiUser, FiCalendar, FiDollarSign, FiShoppingBag, FiTruck, FiCheckCircle, FiScissors } from "react-icons/fi";
import { pickupRental, returnRental } from "../../api/rentalApi";
import ReturnRentalModal from "./ReturnRentalModal";
import RecordPaymentModal from "../billing/RecordPaymentModal";

export default function RentalDetailModal({ order, onClose, onRefresh, onAlterationClick }) {
  const [loading, setLoading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!order) return null;

  const handlePickup = async () => {
    if (!window.confirm("Mark this pre-booking as collected? This will activate the rental and update inventory status.")) return;
    setLoading(true);
    try {
      await pickupRental(order.id);
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to mark order as collected.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PRE_BOOKED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RETURNED': return 'bg-green-100 text-green-800 border-green-200';
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusColor = getStatusColor(order.status);
  const balance = Number(order.rental_amount) - Number(order.advance_paid);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white w-full max-w-2xl rounded-2xl h-[90%] shadow-2xl overflow-hidden overflow-y-auto  border border-gray-100 my-8">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                Order {order.order_code || `ORD-${order.id.toString().padStart(4, '0')}`}
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${statusColor}`}>
                  {order.status.replace("_", " ")}
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">{order.booking_type.replace("_", " ")}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-100">
              <FiX className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <button 
                onClick={() => onAlterationClick(order)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-bold hover:bg-purple-100 border border-purple-200 transition-colors shadow-sm"
              >
                <FiScissors className="inline mr-1" /> Alterations
                {order.alterations_count > 0 && <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{order.alterations_count}</span>}
              </button>

              <div className="flex-1"></div>

              {order.status === 'PRE_BOOKED' && (
                <button 
                  onClick={handlePickup}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                >
                  <FiTruck /> Mark as Collected
                </button>
              )}

              {((order.status === 'ACTIVE' || order.status === 'OVERDUE') && !order.is_returned) && (
                <button 
                  onClick={() => setShowReturnModal(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-md"
                >
                  <FiCheckCircle /> Process Return
                </button>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiUser /> Customer
                </h3>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="font-bold text-gray-800 text-lg">Name: {order.customer_name}</p>
                  <p className="text-sm text-gray-600 mt-1">Phone: {order.customer_phone}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiCalendar /> Rental Period
                </h3>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Date</p>
                    <p className="font-bold text-gray-800 text-sm mt-1">{order.rental_date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Return Date</p>
                    <p className="font-bold text-red-500 text-sm mt-1">{order.return_date}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiShoppingBag /> Items Rented
                </h3>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="p-4 border-b border-gray-50 last:border-0 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                      <div>
                        <p className="font-bold text-gray-800">{item.product_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium tracking-tight">Code: {item.product_code} | Unit: {item.unit_id}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        item.unit_status === 'available' ? 'bg-green-100 text-green-600' :
                        item.unit_status === 'rented' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {item.unit_status || 'unknown'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline & Notes */}
              <div className="space-y-3 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiCheckCircle /> Timeline & Notes
                </h3>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-0.5 h-6 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booked On</p>
                      <p className="text-sm font-bold text-gray-800">{new Date(order.booking_date || order.created_at || order.rental_date).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${order.collected_at ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <div className="w-0.5 h-6 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {order.collected_at ? 'Collected On (Actual)' : 'Pickup Date (Planned)'}
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {order.collected_at ? new Date(order.collected_at).toLocaleString() : order.rental_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${order.returned_at || order.is_returned ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {order.returned_at || order.is_returned ? 'Returned On (Actual)' : 'Return Date (Planned)'}
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {order.returned_at ? new Date(order.returned_at).toLocaleString() : order.return_date}
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Notes</p>
                      <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-lg border border-gray-100">"{order.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financials */}
              <div className="space-y-3 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiDollarSign /> Payment Details
                </h3>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-wrap gap-6 justify-between items-center w-full">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</p>
                      <p className="font-black text-gray-800 text-xl mt-1">₹{order.rental_amount}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Advance Paid</p>
                      <p className="font-black text-green-600 text-xl mt-1">₹{order.advance_paid}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
                    <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                      <p className="text-[10px] font-bold text-red-400 uppercase">Balance Due</p>
                      <p className="font-black text-red-600 text-xl mt-1">₹{balance > 0 ? balance : 0}</p>
                    </div>
                  </div>

                  {/* Security Deposit & Refund/Deductions */}
                  {(Number(order.security_deposit) > 0 || order.is_returned) && (
                    <div className="w-full mt-2 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Security Deposit</p>
                        <p className="font-bold text-gray-800 mt-1">₹{order.security_deposit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Deposit Status</p>
                        <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${
                          order.deposit_status === 'held' ? 'bg-yellow-100 text-yellow-700' :
                          order.deposit_status === 'refunded' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.deposit_status}
                        </span>
                      </div>
                      {Number(order.refunded_amount) > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Refunded</p>
                          <p className="font-bold text-green-600 mt-1">₹{order.refunded_amount}</p>
                        </div>
                      )}
                      {Number(order.deducted_amount) > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Deducted</p>
                          <p className="font-bold text-red-600 mt-1">₹{order.deducted_amount}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {order.damage_notes && (
                    <div className="w-full mt-2 text-left bg-red-50/50 p-2.5 rounded-lg border border-red-100 text-xs text-red-700">
                      <strong className="uppercase text-[9px] tracking-wider block mb-1">Damage Notes:</strong>
                      {order.damage_notes}
                    </div>
                  )}

                  {order.coupon_code && (
                    <div className="w-full mt-2 text-left text-xs text-gray-600">
                      <span className="bg-pink-50 text-pink-600 font-bold px-2 py-1 rounded border border-pink-100">
                        Coupon Applied: {order.coupon_code} (Saved ₹{order.discount_amount})
                      </span>
                    </div>
                  )}
                </div>
              </div>


              {/* Payment History */}
              <div className="space-y-3 md:col-span-2 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FiDollarSign /> Payment History
                  </h3>
                  {balance > 0 && order.status !== 'RETURNED' && (
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      + Record Payment
                    </button>
                  )}
                </div>
                {order.payments && order.payments.length > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-black tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Method</th>
                          <th className="px-4 py-3">Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {order.payments.map((p, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-600">{new Date(p.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 font-bold text-gray-800">₹{p.amount}</td>
                            <td className="px-4 py-3">
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{p.method}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-[10px]">{p.reference || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center text-xs text-gray-500 font-medium">
                    No payments recorded yet.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      
      {showPaymentModal && (
        <RecordPaymentModal
          module="RENTAL"
          moduleId={order.id}
          dueAmount={balance}
          onClose={() => setShowPaymentModal(false)}
          onSave={() => {
            setShowPaymentModal(false);
            onRefresh();
            onClose();
          }}
        />
      )}

      {showReturnModal && (
        <ReturnRentalModal 
          rental={order} 
          onClose={() => setShowReturnModal(false)} 
          onConfirm={async (returnParams) => {
            try {
              await returnRental(order.id, returnParams);
              setShowReturnModal(false);
              onRefresh();
              onClose();
            } catch (err) {
              console.error(err);
              alert("Failed to process return.");
            }
          }} 
        />
      )}
    </>
  );
}
