import React, { useState } from "react";
import { useXPStore } from "./store/xpStore";
import { jobs } from "./data/jobs";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("swipe");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const { xp, streak, saved, addXP, saveJob, incrementStreak, removeSaved } = useXPStore();
  
  const level = Math.floor(xp / 100);
  const currentJob = jobs[currentJobIndex];

  // Login Component
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl">
            🎮
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            WorkPlay
          </h1>
          <p className="text-slate-400 mb-8">Gamify your job search journey</p>
          
          <div className="space-y-4">
            <button
              onClick={() => setUser("Demo User")}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              🚀 Start Demo
            </button>
            
            <div className="grid grid-cols-3 gap-4 text-center mt-8">
              <div className="text-slate-400">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-xs">Smart Matching</div>
              </div>
              <div className="text-slate-400">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs">Earn XP & Badges</div>
              </div>
              <div className="text-slate-400">
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-xs">Career Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSwipe = (direction) => {
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
      {/* Navbar */}
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
              🎮
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">WorkPlay</span>
              <div className="text-xs text-slate-400">Hi, {user}!</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-800/50 rounded-full p-1">
              {["swipe", "saved", "profile"].map((p) => (
                <button 
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    page === p ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {p === "swipe" ? "🏠" : p === "saved" ? "💾" : "👤"}
                  <span className="hidden sm:inline ml-1">
                    {p === "swipe" ? "Home" : p === "saved" ? "Saved" : "Profile"}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setUser(null)}
              className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="p-4 md:p-8">
        {page === "swipe" && (
          <div className="max-w-md mx-auto">
            {/* XP Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-1">🏆 Level {level}</span>
                <span className="font-bold text-purple-400">{xp} XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full transition-all duration-700"
                  style={{ width: `${(xp % 100)}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-6 text-center">
              <div className="bg-slate-800/50 rounded-xl p-3 flex-1">
                <div className="text-2xl">🔥</div>
                <div className="text-sm text-slate-400">Streak</div>
                <div className="font-bold text-orange-400">{streak}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 flex-1">
                <div className="text-2xl">💾</div>
                <div className="text-sm text-slate-400">Saved</div>
                <div className="font-bold text-green-400">{saved.length}</div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">Discover Jobs</h1>
            
            {currentJob ? (
              <div className="bg-white text-black rounded-3xl p-6 shadow-2xl mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    {currentJob.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{currentJob.title}</h3>
                    <p className="text-gray-600">{currentJob.company}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      📍 {currentJob.location}
                    </p>
                  </div>
                </div>
                
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block mb-4">
                  <span className="font-semibold">{currentJob.salary}</span>
                </div>
                
                <p className="text-gray-700 mb-4">{currentJob.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentJob.tags?.map((tag) => (
                    <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleSwipe("left")}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    ❌ Skip
                  </button>
                  <button 
                    onClick={() => handleSwipe("right")}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-colors"
                  >
                    ❤️ Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2">All caught up!</h3>
                <p className="text-slate-400">Check back later for more opportunities</p>
              </div>
            )}
          </div>
        )}
        
        {page === "saved" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Saved Jobs</h1>
            <p className="text-slate-400 mb-6">Your job matches • {saved.length} jobs</p>
            {saved.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-bold mb-2">No saved jobs yet</h3>
                <p className="text-slate-400">Start swiping to find your perfect match!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {saved.map((job) => (
                  <div key={job.id} className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                            <p className="text-green-400 font-semibold">{job.salary}</p>
                          </div>
                          <button 
                            onClick={() => removeSaved(job.id)}
                            className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded"
                          >
                            ✕
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
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
              👤
            </div>
            <h1 className="text-3xl font-bold mb-2">{user}</h1>
            <p className="text-slate-400 mb-8">Level {level} • {xp} XP</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-yellow-400">{level}</div>
                <div className="text-sm text-slate-400">Level</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-orange-400">{streak}</div>
                <div className="text-sm text-slate-400">Streak</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">💾</div>
                <div className="text-2xl font-bold text-green-400">{saved.length}</div>
                <div className="text-sm text-slate-400">Saved</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-purple-400">{xp}</div>
                <div className="text-sm text-slate-400">Total XP</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}