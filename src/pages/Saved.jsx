import React, { useState } from 'react'
import { useXPStore } from '../store/xpStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Saved(){
  const saved = useXPStore((s) => s.saved)
  const removeSaved = useXPStore((s) => s.removeSaved)
  const [filter, setFilter] = useState('all')

  const filteredJobs = saved.filter(job => {
    if (filter === 'all') return true
    return job.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  })

  const categories = ['all', 'tech', 'finance', 'marketing', 'sales']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container py-8 px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Saved Jobs
          </h1>
          <p className="text-slate-400">Your job matches are saved here • {saved.length} jobs</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <AnimatePresence>
          {filteredJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {saved.length === 0 ? 'No saved jobs yet' : 'No jobs match your filter'}
              </h3>
              <p className="text-slate-400">
                {saved.length === 0 ? 'Start swiping to find your perfect match!' : 'Try a different filter or save more jobs'}
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
                      {job.logo}
                    </div>
                    
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                          <p className="text-slate-300 text-sm mb-2">{job.company} • {job.location}</p>
                          <p className="text-slate-400 text-sm leading-relaxed mb-3">{job.desc}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.tags?.map((tag) => (
                              <span 
                                key={tag}
                                className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Salary */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-green-400 mb-2">{job.salary}</div>
                          <button
                            onClick={() => removeSaved(job.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors border border-red-500/30"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
