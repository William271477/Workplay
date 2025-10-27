import React, { useState, useEffect } from "react";
import { fetchJobs } from "./services/jobApi";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("swipe");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [saved, setSaved] = useState([]);
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const level = Math.floor(xp / 100);

  // Load jobs on mount and when search changes
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async (query = "developer", location = "South Africa") => {
    setLoading(true);
    try {
      const jobData = await fetchJobs(query, location);
      setJobs(jobData);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      loadJobs(search, "South Africa");
    }
  };

  const filteredJobs = jobs;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl">
              🎮
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              WorkPlay
            </h1>
            <p className="text-slate-400 mt-2">Gamify your job search journey</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
              
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
              
              <button
                onClick={() => setUser("Demo User")}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                Continue Playing
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setUser("Demo User")}
                className="text-slate-400 hover:text-white text-sm underline"
              >
                Continue as Demo User
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
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
    );
  }

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
            {["swipe", "saved", "challenges", "profile"].map((p) => (
              <button 
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  page === p ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {p === "swipe" ? "🏠 Home" : p === "saved" ? "💾 Saved" : p === "challenges" ? "🏆 Tasks" : "👤 Profile"}
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

            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                placeholder="Search jobs (e.g. React Developer, Data Scientist)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button type="submit" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                🔍
              </button>
              <button 
                type="button"
                onClick={() => loadJobs()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
              >
                Refresh
              </button>
            </form>
            
            <h1 className="text-xl font-bold text-center mb-6">
              {search ? `Search: "${search}"` : "Discover Jobs"}
              {loading && <span className="text-sm text-slate-400 block">Loading...</span>}
            </h1>
            
            {loading ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-slate-400">Loading fresh jobs...</p>
              </div>
            ) : currentIndex < filteredJobs.length ? (
              <div className="bg-white rounded-2xl p-6 shadow-xl text-black max-w-sm mx-auto relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-12 translate-x-12" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">
                    {filteredJobs[currentIndex].logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{filteredJobs[currentIndex].title}</h3>
                    <div className="text-sm text-gray-600 mt-1">{filteredJobs[currentIndex].company}</div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">📍 {filteredJobs[currentIndex].location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200">
                  <span className="text-sm font-semibold text-green-700">{filteredJobs[currentIndex].salary}</span>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed text-sm">{filteredJobs[currentIndex].desc}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredJobs[currentIndex].tags?.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => {
                      setCurrentIndex(prev => prev + 1);
                      setXp(prev => prev + 5);
                    }}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={() => {
                      setSaved(prev => [...prev, filteredJobs[currentIndex]]);
                      setCurrentIndex(prev => prev + 1);
                      setXp(prev => prev + 20);
                      setStreak(prev => prev + 1);
                    }}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-bold mb-2">All caught up!</h3>
                <p className="text-slate-400 mb-4">
                  {search ? "Try a different search" : "Check back later for more opportunities"}
                </p>
                <button 
                  onClick={() => loadJobs()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Load More Jobs
                </button>
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
                              if (job.apply_url && job.apply_url !== "#") {
                                window.open(job.apply_url, '_blank');
                              }
                              setApplied(prev => [...prev, job.id]);
                              setXp(prev => prev + 30);
                            }}
                            disabled={applied.includes(job.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              applied.includes(job.id)
                                ? "bg-green-600/20 text-green-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {applied.includes(job.id) ? "✓ Applied" : "Apply Now"}
                          </button>
                          <button 
                            onClick={() => setSaved(prev => prev.filter(j => j.id !== job.id))}
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

        {page === "challenges" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Career Challenges</h1>
            <p className="text-slate-400 mb-6">Complete tasks to boost your job search skills</p>
            
            <div className="space-y-4">
              {[
                { icon: "📄", title: "Update your CV", desc: "Polish your CV with SA standards", xp: 25, time: "15 min" },
                { icon: "🎤", title: "Practice interviews", desc: "Record yourself answering questions", xp: 35, time: "30 min" },
                { icon: "🔍", title: "Research SA companies", desc: "Learn about 5 potential employers", xp: 40, time: "45 min" },
                { icon: "💼", title: "Build LinkedIn profile", desc: "Create professional online presence", xp: 30, time: "20 min" },
                { icon: "🎓", title: "Learn new skill", desc: "Complete online course or tutorial", xp: 50, time: "2 hours" }
              ].map((challenge, i) => (
                <div key={i} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{challenge.title}</h3>
                          <p className="text-slate-400 text-sm">{challenge.desc}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-400">+{challenge.xp} XP</div>
                          <div className="text-xs text-slate-500">{challenge.time}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setXp(prev => prev + challenge.xp)}
                        className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                <div className="text-xl font-bold text-blue-400">{applied.length}</div>
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
                  { icon: "📄", name: "Job Hunter", desc: "Applied to first job", unlocked: applied.length >= 1 }
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