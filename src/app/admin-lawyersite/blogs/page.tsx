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
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
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
