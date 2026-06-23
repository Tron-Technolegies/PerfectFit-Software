import React, { createContext, useState, useContext, useEffect } from "react";
import { getServerUrl } from "../api/backendApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    let attempts = 0;
    const maxAttempts = 30; // Try for up to 30 seconds

    while (attempts < maxAttempts) {
      try {
        const res = await fetch(getServerUrl("/api/settings/"));

        if (!res.ok) throw new Error("Server returned error status");
        
        const data = await res.json();
        setIsPasswordEnabled(data.is_password_enabled);
        
        // If password is not enabled, user is automatically authenticated
        if (!data.is_password_enabled) {
          setIsAuthenticated(true);
        } else {
          // Check if session is already unlocked (simple in-memory for this app)
          const sessionUnlocked = sessionStorage.getItem("app_unlocked") === "true";
          setIsAuthenticated(sessionUnlocked);
        }
        
        setLoading(false);
        return; // Success, exit loop
      } catch (err) {
        console.warn(`Backend not ready, retrying in 1s... (Attempt ${attempts + 1}/${maxAttempts})`);
        attempts++;
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    console.error("Failed to connect to backend after maximum retries.");
    setLoading(false);
  };


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (success) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem("app_unlocked", "true");
    }
  };

  const logout = () => {
    if (isPasswordEnabled) {
      setIsAuthenticated(false);
      sessionStorage.removeItem("app_unlocked");
    }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, isPasswordEnabled, loading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
