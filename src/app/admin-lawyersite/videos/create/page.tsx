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
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is too large for localStorage (e.g., > 3MB)
      if (file.size > 3 * 1024 * 1024) {
        alert("File is too large for local storage mode. Please keep it under 3MB or use a YouTube link.");
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, url: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

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

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Video Source</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            {/* Option 1: URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Option 1: URL</label>
              <input 
                type="url"
                value={formData.url && !formData.url.startsWith('data:') ? formData.url : ""}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {/* Option 2: Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Option 2: Direct Upload</label>
              <input 
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1824]/20 focus:border-[#5A1824] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F0EBE1] file:text-[#5A1824] hover:file:bg-[#E6E1D6] cursor-pointer"
              />
              <p className="text-xs text-gray-400">Max size 3MB (LocalStorage limit)</p>
            </div>
          </div>

          {(formData.url || isUploading) && (
            <div className="mt-4 p-4 border border-gray-100 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h4>
              {isUploading ? (
                <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
                  Processing video...
                </div>
              ) : formData.url.startsWith('data:') ? (
                <video src={formData.url} controls className="w-full max-h-[300px] rounded-lg bg-black" />
              ) : (
                <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
                  External video link set: {formData.url.substring(0, 50)}...
                </div>
              )}
            </div>
          )}
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
