import React, { useState } from "react";
import { useXPStore } from "./store/xpStore";
import { jobs } from "./data/jobs";
import SwipeDeck from "./components/SwipeDeck";
import JobCard from "./components/JobCard";

export default function App() {
  const [user, setUser] = useState("Demo User");
  const [page, setPage] = useState("swipe");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { xp, streak, saved, appliedJobs, addXP, saveJob, applyToJob, removeSaved, incrementStreak } = useXPStore();
  
  const level = Math.floor(xp / 100);

  const filteredJobs = searchQuery 
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;

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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
            🎮
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">WorkPlay</h1>
          <p className="text-slate-400 mb-8">Gamify your job search</p>
          <button
            onClick={() => setUser("Demo User")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Start Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-lg">
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
                className={`px-3 py-2 rounded-lg text-sm ${
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
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${(xp % 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6 text-center">
              <div className="bg-slate-800 rounded-lg p-3 flex-1">
                <div className="text-xl">🔥</div>
                <div className="text-xs text-slate-400">Streak</div>
                <div className="font-bold text-orange-400">{streak}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 flex-1">
                <div className="text-xl">💾</div>
                <div className="text-xs text-slate-400">Saved</div>
                <div className="font-bold text-green-400">{saved.length}</div>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400"
              />
            </div>
            
            <h1 className="text-xl font-bold text-center mb-6">
              {searchQuery ? `Search: "${searchQuery}"` : "Discover Jobs"}
            </h1>
            
            {currentJobIndex < filteredJobs.length ? (
              <SwipeDeck jobs={filteredJobs.slice(currentJobIndex)} onSwipe={handleSwipe} />
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-bold mb-2">All caught up!</h3>
                <p className="text-slate-400">Check back later for more opportunities</p>
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
                  <div key={job.id} className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-lg">
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              appliedJobs.includes(job.id)
                                ? "bg-green-600 text-white cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {appliedJobs.includes(job.id) ? "✓ Applied" : "Apply Now"}
                          </button>
                          <button 
                            onClick={() => removeSaved(job.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
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
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center text-3xl">
              👤
            </div>
            <h1 className="text-2xl font-bold mb-2">{user}</h1>
            <p className="text-slate-400 mb-8">Level {level} • {xp} XP</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-xl font-bold text-yellow-400">{level}</div>
                <div className="text-xs text-slate-400">Level</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-xl font-bold text-orange-400">{streak}</div>
                <div className="text-xs text-slate-400">Streak</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-2xl mb-2">💾</div>
                <div className="text-xl font-bold text-green-400">{saved.length}</div>
                <div className="text-xs text-slate-400">Saved</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-xl font-bold text-blue-400">{appliedJobs.length}</div>
                <div className="text-xs text-slate-400">Applied</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}