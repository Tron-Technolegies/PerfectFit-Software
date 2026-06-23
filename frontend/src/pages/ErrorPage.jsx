import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FFFDFC] text-center px-4">
      <h1 className="text-6xl font-bold text-pink-500">404</h1>

      <h2 className="text-xl font-semibold mt-2">Page Not Found</h2>

      <p className="text-gray-500 mt-2">The page you are looking for doesn’t exist.</p>

      <Link
        to="/dashboard"
        className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
