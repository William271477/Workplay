import React from "react";
import { motion } from "framer-motion";

export default function JobCard({ job }) {
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-700/70 rounded-2xl p-5 shadow-2xl max-w-md mx-auto border border-slate-700"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center text-xl font-bold text-white">
          {job.logo || (job.company && job.company[0])}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <div className="text-xs text-slate-300">
                {job.company} • {job.location}
              </div>
            </div>
            <div className="text-sm font-semibold text-accent">
              {job.salary}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-300 leading-relaxed">{job.desc}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(job.tags || []).map((t) => (
          <span key={t} className="text-xs bg-slate-700/40 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
