import React, { useState } from "react";
import { FiLock, FiUnlock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { getServerUrl } from "../../api/backendApi";

export default function LockScreen() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    setLoading(true);

    setError("");

    try {
      const res = await fetch(getServerUrl("/api/settings/verify-password/"), {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        login(true);
      } else {
        setError(data.error || "Incorrect password");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FDF2F5] flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-pink-100 text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 shadow-inner">
          {password.length > 0 ? <FiUnlock size={32} /> : <FiLock size={32} />}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black">Perfect Fit</h1>
          <p className="text-gray-400 font-medium">Application Protected</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <input
              type="password"
              placeholder="Enter Access Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-500 focus:bg-white outline-none transition-all text-center text-lg font-bold tracking-widest placeholder:tracking-normal placeholder:font-normal"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-bold animate-bounce">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? "Verifying..." : (
              <>
                Unlock System <FiArrowRight />
              </>
            )}
          </button>
        </form>

      
      </div>
    </div>
  );
}
