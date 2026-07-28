"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ blogs: 0, videos: 0 });

  useEffect(() => {
    // Load counts from localStorage
    const savedBlogs = JSON.parse(localStorage.getItem("admin_blogs") || "[]");
    const savedVideos = JSON.parse(localStorage.getItem("admin_videos") || "[]");
    
    setStats({
      blogs: savedBlogs.length,
      videos: savedVideos.length
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Welcome to your Dashboard</h2>
        <p className="text-gray-500">Manage your website content efficiently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blogs Stat Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#F0EBE1] rounded-lg flex items-center justify-center text-[#5A1824]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Blogs & Articles</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.blogs}</h3>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-50 flex gap-3">
            <Link href="/admin-lawyersite/blogs/create" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              + Add New
            </Link>
            <Link href="/admin-lawyersite/blogs" className="text-sm font-medium text-gray-500 hover:text-gray-700 ml-auto">
              View All →
            </Link>
          </div>
        </div>

        {/* Videos Stat Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#F0EBE1] rounded-lg flex items-center justify-center text-[#5A1824]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Videos</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.videos}</h3>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-50 flex gap-3">
            <Link href="/admin-lawyersite/videos/create" className="text-sm font-medium text-rose-600 hover:text-rose-700">
              + Add New
            </Link>
            <Link href="/admin-lawyersite/videos" className="text-sm font-medium text-gray-500 hover:text-gray-700 ml-auto">
              View All →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-yellow-800 font-medium mb-1">Notice: Frontend-Only Mode</h3>
        <p className="text-sm text-yellow-700">
          This admin panel saves data locally in your browser (LocalStorage). If you clear your browser data or use a different device, you will not see the items you created here. To make these changes appear on the live site permanently, a backend database connection is required.
        </p>
      </div>
    </div>
  );
}
