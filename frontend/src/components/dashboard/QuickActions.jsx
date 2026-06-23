import React, { useState } from "react";
import { FiRotateCcw, FiScissors, FiShoppingBag, FiBell, FiRefreshCw } from "react-icons/fi";
import { sendReminders } from "../../api/rentalApi";
import Toast from "../common/Toast";
import NewRentalModal from "../rental/NewRentalModal";
import NewStitchingOrderModal from "../stitching/NewStitchingOrderModal";
import ReceiveReturnModal from "./ReceiveReturnModal";
import ReturnDetailsModal from "./ReturnDetailsModal";

export default function QuickActions() {
  const [rentalOpen, setRentalOpen] = useState(false);
  const [stitchingOpen, setStitchingOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reminding, setReminding] = useState(false);
  const [toast, setToast] = useState(null);

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

  return (
    <>
      <div className="bg-white p-5 rounded-xl border border-[#00000014]">
        <h3 className="text-sm text-gray-400 mb-3 font-semibold">QUICK ACTIONS</h3>

        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setRentalOpen(true)}
            className="border border-[#00000014] rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-[#FFF5F8] cursor-pointer"
          >
            <FiShoppingBag className="text-pink-500" />
            <p className="text-sm">New Rental</p>
          </div>

          <div
            onClick={() => setReturnOpen(true)}
            className="border border-[#00000014] rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-[#FFF5F8] cursor-pointer"
          >
            <FiRotateCcw className="text-pink-500" />
            <p className="text-sm">Receive Return</p>
          </div>
          <div
            onClick={() => setStitchingOpen(true)}
            className="border border-[#00000014] rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-[#FFF5F8] cursor-pointer"
          >
            <FiScissors className="text-pink-500" />
            <p className="text-sm">Custom Order</p>
          </div>

          {/* <div
            onClick={handleSendReminders}
            className={`border border-[#00000014] rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-[#FFF5F8] cursor-pointer ${reminding ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {reminding ? <FiRefreshCw className="text-pink-500 animate-spin" /> : <FiBell className="text-pink-500" />}
            <p className="text-sm">Reminders</p>
          </div> */}
        </div>
      </div>

      {/* MODALS */}
      {rentalOpen && <NewRentalModal onClose={() => setRentalOpen(false)} onSave={() => { setRentalOpen(false); window.location.reload(); }} />}
      {stitchingOpen && (
        <NewStitchingOrderModal 
          onClose={() => setStitchingOpen(false)} 
          onSave={() => { setStitchingOpen(false); window.location.reload(); }} 
        />
      )}

      {returnOpen && !selected && (
        <ReceiveReturnModal
          onClose={() => setReturnOpen(false)}
          onSelect={(data) => setSelected(data)}
        />
      )}

      {selected && (
        <ReturnDetailsModal
          data={selected}
          onClose={() => {
            setSelected(null);
            setReturnOpen(false);
          }}
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}
