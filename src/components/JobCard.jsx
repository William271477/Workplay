import React from "react";

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm mx-auto border relative overflow-hidden select-none">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-12 translate-x-12" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h3>
          <div className="text-sm text-gray-600 mt-1">{job.company}</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-gray-500">📍 {job.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200">
        <span className="text-sm font-semibold text-green-700">{job.salary}</span>
      </div>

      <p className="mt-4 text-gray-700 leading-relaxed text-sm">{job.desc}</p>

      {job.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <span>←</span>
          <span>Skip</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Save</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}