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
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-2xl">
              📝
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
            <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 text-2xl">
              🎥
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
