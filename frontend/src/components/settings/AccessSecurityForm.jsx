import React, { useState, useEffect } from "react";
import { FiDatabase, FiLock, FiShield, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { getServerUrl } from "../../api/backendApi";

export default function AccessSecurityForm() {
  const { checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    is_password_enabled: false,
    db_location: ""
  });
  
  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch(getServerUrl("/api/settings/"));
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleTogglePassword = async () => {
    const isEnabling = !settings.is_password_enabled;
    setError("");
    setSuccess("");
    
    // Only require a password input if we are enabling and no password has EVER been set
    if (isEnabling && !settings.has_password && !newPassword) {
      setError("Please set a password first");
      return;
    }

    try {
      const res = await fetch(getServerUrl("/api/settings/update/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_password",
          enabled: isEnabling,
          password: isEnabling && !settings.has_password ? newPassword : null
        }),
      });

      if (res.ok) {
        setSuccess(isEnabling ? "Password protection enabled" : "Password protection disabled");
        setNewPassword("");
        fetchSettings();
        checkAuthStatus();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to update settings");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const res = await fetch(getServerUrl("/api/settings/update/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          old_password: oldPassword,
          new_password: newPassword
        }),
      });

      if (res.ok) {
        setSuccess("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        fetchSettings();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to update password");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* DB LOCATION */}
      <div className="bg-white p-6 rounded-2xl border border-[#00000014] shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <FiDatabase size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Database Location</h3>
            <p className="text-xs text-gray-400">Current file path of your system database</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            readOnly
            value={settings.db_location}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono text-gray-500 pr-10"
          />
          <FiDatabase className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
        </div>
      </div>

      {/* APP LOCK */}
      <div className="bg-white p-6 rounded-2xl border border-[#00000014] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
              <FiLock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Application Lock</h3>
              <p className="text-xs text-gray-400">Protect system with a master password</p>
            </div>
          </div>

          <div
            onClick={handleTogglePassword}
            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${
              settings.is_password_enabled ? "bg-pink-500" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                settings.is_password_enabled ? "right-1" : "left-1"
              }`}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-xs flex items-center gap-2">
            <FiAlertTriangle /> {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-xs flex items-center gap-2">
            <FiCheckCircle /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FiShield className="text-pink-500" /> 
              {settings.has_password ? "Change Password" : "Set Initial Password"}
            </h4>
            
            <div className="space-y-3">
              {settings.has_password && (
                <input
                  type="password"
                  placeholder="Current Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 ring-pink-100 outline-none"
                />
              )}
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 ring-pink-100 outline-none"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 ring-pink-100 outline-none"
              />
              
              <button 
                onClick={handleChangePassword}
                className="w-full py-2 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors"
              >
                Save Password
              </button>
            </div>
          </div>


          <div className="bg-gray-50 p-5 rounded-2xl flex flex-col justify-center">
            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Important</h5>
            <p className="text-xs text-gray-500 leading-relaxed">
              If enabled, you will be asked for this password every time you open the app or after manual logout.
              <br /><br />
              <span className="font-bold text-pink-500">Keep this password safe.</span> If forgotten, contact system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
