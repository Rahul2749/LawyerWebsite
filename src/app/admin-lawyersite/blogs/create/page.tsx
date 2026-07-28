"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateBlog() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    imageUrl: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlog = {
      ...formData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const existingBlogs = JSON.parse(localStorage.getItem("admin_blogs") || "[]");
    localStorage.setItem("admin_blogs", JSON.stringify([newBlog, ...existingBlogs]));
    
    router.push("/admin-lawyersite/blogs");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin-lawyersite/blogs" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </Link>
        <h2 className="text-2xl font-serif text-gray-900">Write New Article</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Article Title</label>
          <input 
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
            placeholder="e.g., Understanding Corporate Liability"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input 
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
              placeholder="e.g., Corporate Law"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
            <input 
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Short Excerpt</label>
          <textarea 
            required
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
            placeholder="A brief summary for the preview card..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Full Content</label>
          <textarea 
            required
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all font-mono text-sm"
            placeholder="Write your article content here (Markdown or plain text)..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Link href="/admin-lawyersite/blogs" className="px-5 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            className="bg-[#5A1824] hover:bg-[#4A141E] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Publish Article
          </button>
        </div>

      </form>
    </div>
  );
}
