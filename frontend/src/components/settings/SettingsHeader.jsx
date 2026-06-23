import React from "react";

export default function SettingsHeader() {
  return (
    <div className="flex justify-between items-center mb-6 pt-4">
      <div>
        <h1 className="text-lg font-semibold">Simple settings for daily operations</h1>
        <p className="text-sm text-gray-400">
          Keep only the most important sections so staff can review store details easily.
        </p>
      </div>

      <div className="flex gap-3">
        <button className="text-gray-500 text-sm">Discard Changes</button>
        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm">
          Save Settings
        </button>
      </div>
    </div>
  );
}
