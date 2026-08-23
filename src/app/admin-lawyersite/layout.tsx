"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "./auth-context";
import { LoginGate } from "./login-gate";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin-lawyersite",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    name: "Appointments",
    href: "/admin-lawyersite/appointments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    name: "Blogs & Articles",
    href: "/admin-lawyersite/blogs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    name: "Videos",
    href: "/admin-lawyersite/videos",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminName, logout } = useAuth();

  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const currentPage =
    navItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin-lawyersite" && pathname.startsWith(item.href))
    )?.name ?? "Admin";

  return (
    <div className="min-h-screen bg-[#F4F2EF] flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-[#E6E1D6] flex flex-col fixed inset-y-0 z-20 shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#E6E1D6]">
          <span className="text-lg font-serif font-medium text-[#5A1824]">
            Lawyer<span className="text-[#B39352] ml-1">Admin</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin-lawyersite" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[#5A1824] text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#F0EBE1] hover:text-[#5A1824]"
                }`}
              >
                <span className={isActive ? "text-[#B39352]" : "text-gray-400"}>{item.icon}</span>
                <span className={isActive ? "font-medium" : ""}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6E1D6] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 text-xs font-medium text-[#B39352] border border-[#B39352]/30 hover:bg-[#B39352]/10 py-2 rounded-lg transition"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Live Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 py-2 rounded-lg transition"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E6E1D6] flex items-center px-8 justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-base font-semibold text-[#1A1A1A]">{currentPage}</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-gray-900 leading-tight">{adminName}</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#5A1824] flex items-center justify-center text-xs font-bold text-[#B39352] border-2 border-[#B39352]/30">
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoginGate>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </LoginGate>
    </AuthProvider>
  );
}
