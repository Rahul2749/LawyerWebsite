"use client";

import { createContext, useContext, useSyncExternalStore, useCallback, ReactNode } from "react";
import { siteSettings } from "@/data/siteSettings";
import { disableAdminPush } from "@/lib/adminPush";

interface AuthContextType {
  token: string | null;
  adminName: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_CHANGED_EVENT = "admin-auth-changed";

function subscribeAuth(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === "admin_token" || event.key === "admin_name" || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
  };
}

function authSnapshot(): string {
  return JSON.stringify([localStorage.getItem("admin_token"), localStorage.getItem("admin_name") ?? "Administrator"]);
}

function serverSnapshot(): null { return null; }

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeAuth, authSnapshot, serverSnapshot);
  const [token, adminName]: [string | null, string] = snapshot ? JSON.parse(snapshot) : [null, "Administrator"];
  const isLoading = snapshot === null;

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
    }
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }, []);

  const logout = useCallback(async () => {
    const previousToken = localStorage.getItem("admin_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    await disableAdminPush(previousToken).catch(() => {
      console.error("Unable to finish notification cleanup. Check this browser's site permissions.");
    });
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
