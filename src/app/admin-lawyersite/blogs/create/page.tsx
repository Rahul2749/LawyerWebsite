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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="space-y-4 sm:space-y-6 max-w-3xl">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Link href="/admin-lawyersite/blogs" className="flex min-h-11 shrink-0 items-center text-gray-500 hover:text-gray-700 transition-colors">
          ← Back
        </Link>
        <h2 className="text-lg sm:text-2xl font-serif text-gray-900">Write New Article</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 space-y-5 sm:space-y-6">

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Article Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="min-w-0 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
            placeholder="e.g., Understanding Corporate Liability"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="min-w-0 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
              placeholder="e.g., Corporate Law"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="min-w-0 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all text-xs file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F0EBE1] file:text-[#5A1824] hover:file:bg-[#E6E1D6] cursor-pointer"
            />
            {formData.imageUrl && (
              <div className="mt-2 h-20 w-32 relative rounded-md overflow-hidden border border-gray-200">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Short Excerpt</label>
          <textarea
            required
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            className="min-w-0 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
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
            className="min-w-0 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all font-mono text-sm"
            placeholder="Write your article content here (Markdown or plain text)..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Link href="/admin-lawyersite/blogs" className="flex min-h-11 items-center justify-center px-5 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-[#5A1824] hover:bg-[#4A141E] min-h-11 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Publish Article
          </button>
        </div>

      </form>
    </div>
  );
}
