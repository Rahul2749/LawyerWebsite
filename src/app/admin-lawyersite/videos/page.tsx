"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VideosList() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem("admin_videos") || "[]");
    setVideos(savedVideos);
  }, []);

  const deleteVideo = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const newVideos = videos.filter(v => v.id !== id);
      localStorage.setItem("admin_videos", JSON.stringify(newVideos));
      setVideos(newVideos);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-gray-900">Videos</h2>
          <p className="text-sm text-gray-500">Manage your video content</p>
        </div>
        <Link 
          href="/admin-lawyersite/videos/create" 
          className="bg-[#5A1824] hover:bg-[#4A141E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Video
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {videos.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#F0EBE1] rounded-full flex items-center justify-center text-[#5A1824] mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No videos yet</h3>
            <p className="text-gray-500 text-sm mb-4">Add your first video to get started.</p>
            <Link 
              href="/admin-lawyersite/videos/create" 
              className="text-[#5A1824] hover:underline text-sm font-medium"
            >
              Add a video
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Video URL</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{video.title}</td>
                  <td className="px-6 py-4">
                    <a href={video.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {video.url.substring(0, 40)}{video.url.length > 40 ? '...' : ''}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => deleteVideo(video.id)}
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
