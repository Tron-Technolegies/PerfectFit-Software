import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const styles = {
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-500",
    info: "bg-blue-100 text-blue-500",
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`px-4 py-3 rounded-lg shadow border border-[#00000014] ${styles[type]}`}>
        {message}
      </div>
    </div>
  );
}
