"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { 
      name: "Dashboard", 
      href: "/admin-lawyersite", 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> 
    },
    { 
      name: "Blogs & Articles", 
      href: "/admin-lawyersite/blogs", 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> 
    },
    { 
      name: "Videos", 
      href: "/admin-lawyersite/videos", 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F9F8F6] border-r border-[#E6E1D6] flex flex-col fixed inset-y-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-8 border-b border-[#E6E1D6]">
          <span className="text-xl font-serif font-medium tracking-wide text-[#5A1824]">
            Lawyer<span className="text-[#B39352] ml-1">Admin</span>
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin-lawyersite" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-[#5A1824] text-white shadow-md shadow-[#5A1824]/20"
                    : "text-gray-600 hover:bg-[#F0EBE1] hover:text-[#5A1824]"
                }`}
              >
                <span className={`flex items-center justify-center ${isActive ? "text-[#B39352]" : "text-gray-500"}`}>{item.icon}</span>
                <span className={isActive ? "font-medium" : "font-normal"}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-[#E6E1D6]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 text-sm font-medium text-[#B39352] border border-[#B39352] hover:bg-[#B39352] hover:text-white py-2.5 rounded transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Live Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-[#FAF9F7] min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#E6E1D6] flex items-center px-10 justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-serif text-[#1A1A1A]">
            {navItems.find((item) => pathname === item.href || (item.href !== "/admin-lawyersite" && pathname.startsWith(item.href)))?.name || "Admin"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-gray-900">Raja Agrawal</p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#5A1824] flex items-center justify-center text-sm font-bold text-[#B39352] border-2 border-[#B39352]/30">
              RA
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
