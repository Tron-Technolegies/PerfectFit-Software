import React from "react";

export default function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl border border-[#00000014]">
        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-500 mt-2">{message}</p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-[#00000014] rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
