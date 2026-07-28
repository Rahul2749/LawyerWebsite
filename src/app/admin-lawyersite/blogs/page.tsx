"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogsList() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem("admin_blogs") || "[]");
    setBlogs(savedBlogs);
  }, []);

  const deleteBlog = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      const newBlogs = blogs.filter(b => b.id !== id);
      localStorage.setItem("admin_blogs", JSON.stringify(newBlogs));
      setBlogs(newBlogs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-gray-900">Blogs & Articles</h2>
          <p className="text-sm text-gray-500">Manage your written content</p>
        </div>
        <Link 
          href="/admin-lawyersite/blogs/create" 
          className="bg-[#5A1824] hover:bg-[#4A141E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Create New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#F0EBE1] rounded-full flex items-center justify-center text-[#5A1824] mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No blogs yet</h3>
            <p className="text-gray-500 text-sm mb-4">Create your first article to get started.</p>
            <Link 
              href="/admin-lawyersite/blogs/create" 
              className="text-[#5A1824] hover:underline text-sm font-medium"
            >
              Write an article
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(blog.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => deleteBlog(blog.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
