import React, { useState, useEffect } from "react";
import RentalStats from "../components/rental/RentalStats";
import RentalTable from "../components/rental/RentalTable";
import RentalTodayWork from "../components/rental/RentalTodayWork";
import NewRentalModal from "../components/rental/NewRentalModal";
import AlterationModal from "../components/rental/AlterationModal";
import RentalDetailModal from "../components/rental/RentalDetailModal";
import { getRentals, sendReminders, getOrderByBarcode } from "../api/rentalApi";
import Toast from "../components/common/Toast";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";

export default function RentalManagement() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminding, setReminding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alterationModalOrder, setAlterationModalOrder] = useState(null);
  const [detailModalOrder, setDetailModalOrder] = useState(null);
  const [toast, setToast] = useState(null);


  const [returnBarcode, setReturnBarcode] = useState("");
  const [scanningReturn, setScanningReturn] = useState(false);

  const handleReturnScan = async (e) => {
    e.preventDefault();
    if (!returnBarcode.trim()) return;
    setScanningReturn(true);
    try {
      const res = await getOrderByBarcode(returnBarcode.trim());
      setDetailModalOrder(res.data);
      setReturnBarcode("");
    } catch (err) {
      setToast({
        message: err.response?.data?.error || "No active rental found for this barcode",
        type: "error"
      });
    } finally {
      setScanningReturn(false);
    }
  };

  const loadRentals = async () => {

    setLoading(true);
    try {
      const response = await getRentals();
      setRentals(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = async () => {
    setReminding(true);
    try {
      const response = await sendReminders();
      setToast({
        message: `Success! Sent ${response.data.total_reminders_sent} email reminders.`,
        type: "success"
      });
    } catch (err) {
      setToast({
        message: err.response?.data?.error || "Failed to send reminders.",
        type: "error"
      });
    } finally {
      setReminding(false);
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  const handleNewRentalSaved = () => {
    loadRentals();
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#00000014]">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Rental Dashboard</h1>
          <p className="text-sm text-gray-400">Track bookings and manage returns</p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleReturnScan} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Scan Barcode to Return..." 
              className="border border-[#00000014] rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300 w-56 font-mono"
              value={returnBarcode}
              onChange={e => setReturnBarcode(e.target.value)}
              disabled={scanningReturn}
            />
            <button type="submit" disabled={scanningReturn || !returnBarcode} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
              {scanningReturn ? '...' : 'Find'}
            </button>
          </form>

          <button 
            onClick={handleSendReminders}
            disabled={reminding}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition disabled:opacity-50"
          >
            {reminding ? <FiRefreshCw className="animate-spin" /> : null}
            Send Due Reminders
          </button>
        </div>

      </div>

      <RentalStats rentals={rentals} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RentalTable 
            rentals={rentals} 
            loading={loading} 
            onRefresh={loadRentals}
            onNewRentalClick={() => setIsModalOpen(true)} 
            setToast={setToast}
            onDetailClick={(order) => setDetailModalOrder(order)}
            onAlterationClick={(order) => setAlterationModalOrder(order)}
          />
        </div>
        <RentalTodayWork onAlterationClick={(order) => setAlterationModalOrder(order)} />
      </div>


      {isModalOpen && (
        <NewRentalModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleNewRentalSaved} 
        />
      )}

            {detailModalOrder && (
        <RentalDetailModal
          order={detailModalOrder}
          onClose={() => setDetailModalOrder(null)}
          onRefresh={loadRentals}
          onAlterationClick={(order) => setAlterationModalOrder(order)}
        />
      )}

      {alterationModalOrder && (
        <AlterationModal
          order={alterationModalOrder}
          onClose={() => { setAlterationModalOrder(null); loadRentals(); }}
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
