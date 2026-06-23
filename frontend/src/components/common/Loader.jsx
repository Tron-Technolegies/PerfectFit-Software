import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
    </div>
  );
}
