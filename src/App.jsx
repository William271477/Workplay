import React, { useState, useMemo } from "react";
import { useXPStore } from "./store/xpStore";
import { jobs } from "./data/jobs";
import SwipeDeck from "./components/SwipeDeck";
import Login from "./components/Login";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("swipe");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const { xp, streak, saved, searchQuery, appliedJobs, addXP, saveJob, applyToJob, removeSaved, incrementStreak } = useXPStore();
  
  const level = Math.floor(xp / 100);

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const handleSwipe = (direction) => {
    const currentJob = filteredJobs[currentJobIndex];
    if (direction === "right" && currentJob) {
      addXP(20);
      saveJob(currentJob);
      incrementStreak();
    } else if (direction === "left") {
      addXP(5);
    }
    setCurrentJobIndex(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
              🎮
            </div>
            <div>
              <span className="text-lg font-bold">WorkPlay</span>
              <div className="text-xs text-slate-400">Hi, {user}!</div>
            </div>
          </div>
          <div className="flex gap-2">
            {["swipe", "saved", "profile"].map((p) => (
              <button 
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  page === p ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {p === "swipe" ? "🏠 Home" : p === "saved" ? "💾 Saved" : "👤 Profile"}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="p-4 md:p-8">
        {page === "swipe" && (
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Level {level}</span>
                <span className="font-bold text-purple-400">{xp} XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                  style={{ width: `${(xp % 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6 text-center">
              <div className="bg-slate-800/50 rounded-lg p-3 flex-1">
                <div className="text-xl">🔥</div>
                <div className="text-xs text-slate-400">Streak</div>
                <div className="font-bold text-orange-400">{streak}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 flex-1">
                <div className="text-xl">💾</div>
                <div className="text-xs text-slate-400">Saved</div>
                <div className="font-bold text-green-400">{saved.length}</div>
              </div>
            </div>

            <SearchBar />
            
            <h1 className="text-xl font-bold text-center mb-6">
              {searchQuery ? `Search: "${searchQuery}"` : "Discover Jobs"}
            </h1>
            
            <SwipeDeck jobs={filteredJobs.slice(currentJobIndex)} onSwipe={handleSwipe} />
            
            {currentJobIndex >= filteredJobs.length && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-bold mb-2">All caught up!</h3>
                <p className="text-slate-400">
                  {searchQuery ? "Try a different search" : "Check back later for more opportunities"}
                </p>
              </div>
            )}
          </div>
        )}
        
        {page === "saved" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Saved Jobs</h1>
            <p className="text-slate-400 mb-6">{saved.length} jobs saved</p>
            {saved.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-lg font-bold mb-2">No saved jobs yet</h3>
                <p className="text-slate-400">Start swiping to find your perfect match!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {saved.map((job) => (
                  <div key={job.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                        <p className="text-green-400 font-semibold text-sm">{job.salary}</p>
                        <p className="text-slate-300 text-sm mt-2">{job.desc}</p>
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => {
                              applyToJob(job.id);
                              addXP(30);
                            }}
                            disabled={appliedJobs.includes(job.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              appliedJobs.includes(job.id)
                                ? "bg-green-600/20 text-green-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {appliedJobs.includes(job.id) ? "✓ Applied" : "Apply Now"}
                          </button>
                          <button 
                            onClick={() => removeSaved(job.id)}
                            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {page === "profile" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
              👤
            </div>
            <h1 className="text-2xl font-bold mb-2">{user}</h1>
            <p className="text-slate-400 mb-8">Level {level} • {xp} XP</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-xl font-bold text-yellow-400">{level}</div>
                <div className="text-xs text-slate-400">Level</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-xl font-bold text-orange-400">{streak}</div>
                <div className="text-xs text-slate-400">Streak</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl mb-2">💾</div>
                <div className="text-xl font-bold text-green-400">{saved.length}</div>
                <div className="text-xs text-slate-400">Saved</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-xl font-bold text-blue-400">{appliedJobs.length}</div>
                <div className="text-xs text-slate-400">Applied</div>
              </div>
            </div>
            
            <div className="text-left">
              <h2 className="text-lg font-bold mb-4">Achievements</h2>
              <div className="space-y-3">
                {[
                  { icon: "🎯", name: "First Save", desc: "Saved your first job", unlocked: saved.length >= 1 },
                  { icon: "🔥", name: "On Fire", desc: "3-day streak", unlocked: streak >= 3 },
                  { icon: "⭐", name: "Level Up", desc: "Reach level 1", unlocked: level >= 1 },
                  { icon: "📄", name: "Job Hunter", desc: "Applied to first job", unlocked: appliedJobs.length >= 1 }
                ].map((achievement, i) => (
                  <div key={i} className={`p-3 rounded-lg border transition-all ${
                    achievement.unlocked 
                      ? 'bg-purple-500/20 border-purple-500/50' 
                      : 'bg-slate-800/30 border-slate-700 opacity-60'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{achievement.name}</h3>
                        <p className="text-xs text-slate-400">{achievement.desc}</p>
                      </div>
                      {achievement.unlocked && <div className="text-green-400">✓</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}