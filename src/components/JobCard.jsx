import React from "react";
import { motion } from "framer-motion";

export default function JobCard({ job }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl max-w-sm mx-auto border border-gray-200 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      {/* Header */}
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h3>
          <div className="text-sm text-gray-600 mt-1">
            {job.company}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              📍 {job.location}
            </span>
          </div>
        </div>
      </div>

      {/* Salary Badge */}
      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
        <span className="text-sm font-semibold text-green-800">{job.salary}</span>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-700 leading-relaxed text-sm">{job.desc}</p>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(job.tags || []).map((tag) => (
          <span 
            key={tag} 
            className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Swipe Hints */}
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
    </motion.div>
  );
}
