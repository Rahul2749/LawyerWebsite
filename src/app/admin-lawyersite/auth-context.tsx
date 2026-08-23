"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { siteSettings } from "@/data/siteSettings";

interface AuthContextType {
  token: string | null;
  adminName: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Raja Agrawal");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    const savedName = localStorage.getItem("admin_name");
    if (saved) {
      setToken(saved);
      if (savedName) setAdminName(savedName);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${siteSettings.BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Login failed");
    const { token: newToken, user } = data.data;
    localStorage.setItem("admin_token", newToken);
    if (user?.name) {
      localStorage.setItem("admin_name", user.name);
      setAdminName(user.name);
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, adminName, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
