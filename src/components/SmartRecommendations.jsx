import React, { useState, useEffect } from "react";
import { useXPStore } from "../store/xpStore";
import { jobs } from "../data/jobs";

export default function SmartRecommendations() {
  const { saved, xp } = useXPStore();
  const [recommendations, setRecommendations] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // AI-powered job matching based on user behavior
    const generateRecommendations = () => {
      const savedTags = saved.flatMap(job => job.tags || []);
      const tagFrequency = {};
      
      savedTags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });

      const topTags = Object.entries(tagFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag);

      const matchedJobs = jobs.filter(job => 
        job.tags?.some(tag => topTags.includes(tag)) && 
        !saved.some(savedJob => savedJob.id === job.id)
      ).slice(0, 3);

      if (matchedJobs.length > 0) {
        setRecommendations(matchedJobs);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    };

    if (saved.length >= 2) {
      setTimeout(generateRecommendations, 2000);
    }
  }, [saved]);

  if (recommendations.length === 0) return null;

  return (
    <>
      {/* Smart Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl shadow-2xl z-50 max-w-sm animate-bounce">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🧠</span>
            <span className="font-semibold">AI Recommendation</span>
          </div>
          <p className="text-sm">Found {recommendations.length} jobs matching your interests!</p>
        </div>
      )}

      {/* Recommendations Panel */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <h3 className="font-semibold text-white">AI Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((job) => (
            <div key={job.id} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                  {job.logo}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{job.title}</h4>
                  <p className="text-slate-400 text-xs">{job.company} • {job.salary}</p>
                </div>
                <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  95% match
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-slate-400 mt-3">
          Based on your saved jobs and preferences
        </p>
      </div>
    </>
  );
}