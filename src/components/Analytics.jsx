import React, { useState, useEffect } from "react";
import { useXPStore } from "../store/xpStore";

export default function Analytics() {
  const { saved, xp, streak } = useXPStore();
  const [stats, setStats] = useState({
    swipeRate: 0,
    matchRate: 0,
    topCompanies: [],
    skillTrends: [],
    weeklyProgress: []
  });

  useEffect(() => {
    // Simulate real-time analytics
    const calculateStats = () => {
      const companies = saved.reduce((acc, job) => {
        acc[job.company] = (acc[job.company] || 0) + 1;
        return acc;
      }, {});

      const skills = saved.flatMap(job => job.tags || []).reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {});

      const topCompanies = Object.entries(companies)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([company, count]) => ({ company, count }));

      const skillTrends = Object.entries(skills)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([skill, count]) => ({ skill, count }));

      setStats({
        swipeRate: Math.min(100, (saved.length * 20) + Math.random() * 20),
        matchRate: saved.length > 0 ? Math.min(95, 60 + saved.length * 5) : 0,
        topCompanies,
        skillTrends,
        weeklyProgress: Array.from({length: 7}, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          xp: Math.floor(Math.random() * 50) + (i === 6 ? xp % 50 : 0)
        }))
      });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 5000);
    return () => clearInterval(interval);
  }, [saved, xp]);

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Engagement Rate</span>
            <span className="text-xs text-green-400">↗ Live</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.swipeRate.toFixed(1)}%</div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${stats.swipeRate}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Match Quality</span>
            <span className="text-xs text-purple-400">AI Powered</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{stats.matchRate.toFixed(1)}%</div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${stats.matchRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          📊 Weekly XP Progress
        </h3>
        <div className="flex items-end justify-between h-24 gap-2">
          {stats.weeklyProgress.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-1000"
                style={{ height: `${(day.xp / 50) * 100}%`, minHeight: '4px' }}
              />
              <span className="text-xs text-slate-400 mt-2">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Skills Trending */}
      {stats.skillTrends.length > 0 && (
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            🔥 Your Skill Interests
          </h3>
          <div className="space-y-2">
            {stats.skillTrends.map((skill, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{skill.skill}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${(skill.count / Math.max(...stats.skillTrends.map(s => s.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{skill.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}