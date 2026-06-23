import React, { useEffect, useState } from "react";
import { FiX, FiSearch, FiCheckCircle, FiAlertCircle, FiInfo, FiTag, FiDownload } from "react-icons/fi";
import InvoiceModal from "../common/InvoiceModal";
import { getInventoryItems } from "../../api/inventoryApi";
import { createRental, getItemUnits, getUnitByBarcode } from "../../api/rentalApi";
import { validateCoupon } from "../../api/couponApi";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  item_id: "",
  unit_id: "",
  rental_date: new Date().toISOString().split("T")[0],
  return_date: "",
  rental_amount: "",
  
  security_deposit: 0,
};

export default function NewRentalModal({ onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [cart, setCart] = useState([]);
  const [payments, setPayments] = useState([{ amount: "", method: "CASH", reference: "" }]);
  const [items, setItems] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const [loadingUnits, setLoadingUnits] = useState(false);


  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleBarcodeScan = async (e) => {
    if (e) e.preventDefault();
    if (!barcodeInput.trim()) return;
    setScanning(true);
    try {
      const res = await getUnitByBarcode(barcodeInput.trim());
      const data = res.data;
      
      if (data.unit.status !== "available") {
        alert("This unit is currently " + data.unit.status);
        setScanning(false);
        return;
      }

      setCart(prevCart => {
        if(prevCart.find(c => c.unit.id === data.unit.id)) {
            alert("Unit already added to booking.");
            return prevCart;
        }
        setForm(prev => ({ 
            ...prev, 
            rental_amount: (Number(prev.rental_amount) || 0) + Number(data.product.rental_price)
        }));
        return [...prevCart, {product: data.product, unit: data.unit}];
      });

      setBarcodeInput("");
    } catch (err) {
      alert(err.response?.data?.error || "Barcode not found");
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {

    const loadItems = async () => {
      try {
        const invRes = await getInventoryItems();
        setItems(invRes.data);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (form.item_id) {
        const loadUnits = async () => {
            setLoadingUnits(true);
            try {
                const response = await getItemUnits(form.item_id);
                // Only show available units
                setAvailableUnits(response.data.filter(u => u.status === 'available'));
            } catch (err) {
                console.error("Failed to load units", err);
            } finally {
                setLoadingUnits(false);
            }
        };
        loadUnits();
    } else {
        setAvailableUnits([]);
    }
  }, [form.item_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === "item_id") {
      const item = items.find((i) => i.id === Number(value));
      setSelectedItem(item);
      if (item) {
        setForm(prev => ({ ...prev, unit_id: "" }));
      }
    }
  };

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await validateCoupon(couponCode, form.rental_amount);
      if (res.data.valid) {
        setCouponData(res.data);
      } else {
        setCouponError(res.data.message);
        setCouponData(null);
      }
    } catch (err) {
      setCouponError("Invalid coupon code");
      setCouponData(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const [successData, setSuccessData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Please add at least one item to the booking.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        items: cart.map(c => ({ product_id: c.product.id, unit_id: c.unit.id })),
        rental_amount: Number(form.rental_amount),
        payments: payments.filter(p => Number(p.amount) > 0),
        coupon_id: couponData?.coupon_id,
      };
      const alterationsPayload = cart
        .filter(c => c.alteration)
        .map(c => ({
          product_id: c.product.id,
          ...c.alteration
        }));
      if (alterationsPayload.length > 0) {
        payload.alterations = alterationsPayload;
      }

      const res = await createRental(payload);
      
      setSuccessData({
        ...payload,
        id: res.data.order_id,
        customer_name: form.name,
        customer_phone: form.phone,
        item_name: cart[0].product.name + (cart.length > 1 ? ` (+${cart.length - 1} more)` : ''),
        item_code: cart[0].unit.unit_id,
        discount: couponData?.discount_amount || 0
      });

      onSave(); // Refresh table
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create order");
    } finally {
      setSaving(false);
    }
  };

  if (successData) {
    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 text-center space-y-6 animate-in zoom-in duration-300">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={40} className="text-green-500" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Rental Created!</h2>
              <p className="text-gray-400 font-medium mt-1">Order #ORD-{successData.id.toString().padStart(4, '0')} has been recorded.</p>
           </div>
           
           <div className="flex flex-col gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setShowInvoice(true)}
                className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                <FiDownload /> Download Invoice
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
              >
                Done
              </button>
           </div>
        </div>
        {showInvoice && (
          <InvoiceModal 
            order={successData} 
            type="rental" 
            onClose={() => setShowInvoice(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/30">
          <div>
            <h2 className="text-xl font-bold text-gray-800">New Rental Order</h2>
            <p className="text-xs text-gray-400 mt-0.5">Create a new booking and track payments</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
            <FiX className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {/* CUSTOMER SECTION */}
          <section>
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">Full Name</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all text-sm"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">Phone Number</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all text-sm"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">Email (Optional for reminders)</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all text-sm"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </section>

          {/* ITEM SECTION */}
          <section className="pt-4 border-t border-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest">Items & Availability</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Scan Barcode here..." 
                  className="border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-pink-300 w-48 font-mono"
                  value={barcodeInput}
                  onChange={e => setBarcodeInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleBarcodeScan();
                    }
                  }}
                  disabled={scanning}
                />
                <button type="button" onClick={() => handleBarcodeScan()} disabled={scanning || !barcodeInput} className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs font-bold disabled:opacity-50">
                  {scanning ? '...' : 'Scan'}
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 ml-1">Select Rental Item</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                    value={form.item_id}
                    onChange={handleChange}
                    name="item_id"
                  >
                    <option value="">Choose an item...</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.code}) - Rs. {item.rental_price}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 ml-1">Assign Physical Unit</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                    value={form.unit_id}
                    onChange={handleChange}
                    name="unit_id"
                    disabled={!form.item_id || loadingUnits}
                  >
                    <option value="">{loadingUnits ? "Loading..." : "Choose a specific unit..."}</option>
                    {availableUnits.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.unit_id} - Size: {unit.size}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => {
                    if (!form.item_id || !form.unit_id) return alert("Please select an item and a unit.");
                    const prod = items.find(i => i.id === Number(form.item_id));
                    const un = availableUnits.find(u => u.id === Number(form.unit_id));
                    if(cart.find(c => c.unit.id === un.id)) return alert("Unit already added.");
                    setCart([...cart, {product: prod, unit: un}]);
                    setForm(prev => ({ 
                      ...prev, 
                      rental_amount: (Number(prev.rental_amount) || 0) + Number(prod.rental_price),
                      item_id: "", 
                      unit_id: "" 
                    }));
                  }}
                  className="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg text-xs font-bold hover:bg-pink-200"
                >
                  + Add to Booking
                </button>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-bold text-gray-700">Selected Items ({cart.length})</h4>
                {cart.map((cItem, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-white space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{cItem.product.name}</p>
                        <p className="text-xs text-gray-500">Unit: {cItem.unit.unit_id} | Size: {cItem.unit.size}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">Rs. {cItem.product.rental_price}</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setCart(cart.filter((_, i) => i !== idx));
                            setForm(prev => ({
                              ...prev,
                              rental_amount: Math.max(0, Number(prev.rental_amount) - Number(cItem.product.rental_price))
                            }));
                          }}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                    
                    {/* Inline Alteration */}
                    {!cItem.alteration ? (
                      <button 
                        type="button"
                        onClick={() => {
                          const newCart = [...cart];
                          newCart[idx].alteration = { alteration_area: '', expected_completion_date: '', notes: '', restore_after_return: false };
                          setCart(newCart);
                        }}
                        className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 bg-pink-50 px-3 py-1.5 rounded-lg w-fit transition-colors"
                      >
                        + Require Alteration
                      </button>
                    ) : (
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-pink-100 space-y-3 relative">
                        <button 
                          type="button"
                          onClick={() => {
                            const newCart = [...cart];
                            delete newCart[idx].alteration;
                            setCart(newCart);
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <FiX size={14} />
                        </button>
                        <h4 className="text-[10px] font-black uppercase text-pink-400 tracking-widest">Alteration Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Alteration Area (e.g. Hip, Sleeve)</label>
                            <input 
                              type="text"
                              value={cItem.alteration.alteration_area}
                              onChange={e => {
                                const newCart = [...cart];
                                newCart[idx].alteration.alteration_area = e.target.value;
                                setCart(newCart);
                              }}
                              placeholder="Describe the area to be altered"
                              className="w-full text-xs p-2 rounded-lg border outline-none mt-1 focus:border-pink-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Expected By</label>
                            <input 
                              type="date"
                              value={cItem.alteration.expected_completion_date}
                              onChange={e => {
                                const newCart = [...cart];
                                newCart[idx].alteration.expected_completion_date = e.target.value;
                                setCart(newCart);
                              }}
                              className="w-full text-xs p-2 rounded-lg border outline-none mt-1 focus:border-pink-300"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Notes</label>
                            <input 
                              type="text"
                              value={cItem.alteration.notes}
                              onChange={e => {
                                const newCart = [...cart];
                                newCart[idx].alteration.notes = e.target.value;
                                setCart(newCart);
                              }}
                              className="w-full text-xs p-2 rounded-lg border outline-none mt-1 focus:border-pink-300"
                            />
                          </div>
                          <div className="col-span-2 flex items-center gap-2 mt-1">
                            <input 
                              type="checkbox"
                              id={`restore-${idx}`}
                              checked={cItem.alteration.restore_after_return}
                              onChange={e => {
                                const newCart = [...cart];
                                newCart[idx].alteration.restore_after_return = e.target.checked;
                                setCart(newCart);
                              }}
                              className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
                            />
                            <label htmlFor={`restore-${idx}`} className="text-xs font-bold text-gray-600 cursor-pointer select-none">
                              Restore after return (Revert alteration)
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">From Date</label>
                <input
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                  name="rental_date"
                  type="date"
                  value={form.rental_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">To Date</label>
                <input
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                  name="return_date"
                  type="date"
                  value={form.return_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

          </section>

          {/* COUPON SECTION */}
          <section className="pt-4 border-t border-gray-50">
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Offers & Coupons</h3>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-mono font-bold"
                  placeholder="ENTER COUPON CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={validatingCoupon || !couponCode}
                className="px-6 py-2 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-black transition disabled:opacity-50"
              >
                {validatingCoupon ? "..." : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{couponError}</p>}
            {couponData && (
              <p className="text-[10px] text-green-600 font-bold mt-1 ml-1 flex items-center gap-1">
                <FiCheckCircle /> Coupon Applied: ₹{couponData.discount_amount} off
              </p>
            )}
          </section>

          {/* PAYMENT SECTION */}
          <section className="pt-4 border-t border-gray-50">
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">Rental Amount (Rs.)</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-semibold text-gray-700"
                  name="rental_amount"
                  type="number"
                  value={form.rental_amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">Security Deposit (Rs.)</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-semibold text-gray-700"
                  name="security_deposit"
                  type="number"
                  value={form.security_deposit}
                  onChange={handleChange}
                  placeholder="Refundable deposit"
                />
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-500 ml-1">Payment Details</label>
                <button 
                  type="button" 
                  onClick={() => setPayments([...payments, { amount: "", method: "CASH", reference: "" }])}
                  className="text-[10px] uppercase font-black text-pink-500 bg-pink-50 px-2 py-1 rounded-lg hover:bg-pink-100"
                >
                  + Add Payment
                </button>
              </div>
              {payments.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={p.amount}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[idx].amount = e.target.value;
                        setPayments(newP);
                      }}
                      placeholder="Amount"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm font-semibold"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={p.method}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[idx].method = e.target.value;
                        setPayments(newP);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm bg-white"
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI / GPay</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="flex-[1.5]">
                    <input
                      type="text"
                      value={p.reference}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[idx].reference = e.target.value;
                        setPayments(newP);
                      }}
                      placeholder="Ref # (Optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 outline-none text-sm"
                    />
                  </div>
                  {payments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPayments(payments.filter((_, i) => i !== idx))}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal:</span>
                <span>Rs. {form.rental_amount || 0}</span>
              </div>
              {couponData && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>- Rs. {couponData.discount_amount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-gray-800 font-bold">Total Payable:</span>
                <span className="text-xl font-black text-pink-600">
                  Rs. {(form.rental_amount || 0) - (couponData?.discount_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Advance Paid:</span>
                <span>Rs. {totalPaid}</span>
              </div>
              <div className="pt-1 flex justify-between items-center font-bold text-gray-800">
                <span className="text-sm">Balance Due (Rental):</span>
                <span>Rs. {(form.rental_amount || 0) - (couponData?.discount_amount || 0) - totalPaid}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-gray-800 font-bold">Total Cash Required Upfront:</span>
                <span className="text-lg font-black text-gray-900">
                  Rs. {totalPaid + Number(form.security_deposit || 0)}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 italic mt-1">* Security deposit of Rs. {form.security_deposit || 0} is refundable on return.</p>
            </div>
          </section>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-2.5 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-sm"
          >
            {saving ? "Creating..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
