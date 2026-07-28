"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateVideo() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo = {
      ...formData,
      id: Date.now().toString(),
    };

    const existingVideos = JSON.parse(localStorage.getItem("admin_videos") || "[]");
    localStorage.setItem("admin_videos", JSON.stringify([newVideo, ...existingVideos]));
    
    router.push("/admin-lawyersite/videos");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin-lawyersite/videos" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </Link>
        <h2 className="text-2xl font-serif text-gray-900">Add New Video</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Video Title</label>
          <input 
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
            placeholder="e.g., Client Testimonial - John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">YouTube or Vimeo URL</label>
          <input 
            type="url"
            required
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
            placeholder="A brief description of this video..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Link href="/admin-lawyersite/videos" className="px-5 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            className="bg-[#5A1824] hover:bg-[#4A141E] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Save Video
          </button>
        </div>

      </form>
    </div>
  );
}
