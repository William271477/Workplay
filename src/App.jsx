import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { fetchJobs } from "./services/jobApi";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import JobFilters from "./components/JobFilters";
import DailyRewards from "./components/DailyRewards";
import ThemeToggle from "./components/ThemeToggle";
import ShareJob from "./components/ShareJob";
import QuickStats from "./components/QuickStats";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [page, setPage] = useState("swipe");
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  
  // Local state for demo users (no Firestore)
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [saved, setSaved] = useState([]);
  const [applied, setApplied] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const level = Math.floor(xp / 100);

  // Check for demo user and Firebase auth
  useEffect(() => {
    // Check for demo user first
    const demoUser = localStorage.getItem('workplay_demo_user');
    if (demoUser) {
      try {
        const parsedUser = JSON.parse(demoUser);
        setUser(parsedUser);
        setAuthLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('workplay_demo_user');
      }
    }

    // Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load jobs when user is authenticated
  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  // Set filtered jobs initially
  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const loadJobs = async (query = "developer", location = "South Africa") => {
    setJobsLoading(true);
    try {
      const jobData = await fetchJobs(query, location);
      setJobs(jobData);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      loadJobs(search, "South Africa");
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...jobs];

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Salary filter
    if (filters.salary !== 'all') {
      const [min, max] = filters.salary.split('-').map(s => parseInt(s) || 999);
      filtered = filtered.filter(job => {
        const salary = job.salary.match(/\d+/g);
        if (!salary) return true;
        const jobSalary = parseInt(salary[0]);
        return max ? (jobSalary >= min && jobSalary <= max) : jobSalary >= min;
      });
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(job => 
        job.tags?.some(tag => tag.toLowerCase().includes(filters.type.toLowerCase())) ||
        job.title.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
    setCurrentIndex(0);
  };

  const handleSignOut = async () => {
    try {
      // Clear demo user
      localStorage.removeItem('workplay_demo_user');
      
      // Sign out from Firebase if not demo user
      if (!user?.isAnonymous) {
        await signOut(auth);
      }
      
      // Reset state
      setUser(null);
      setPage("swipe");
      setCurrentIndex(0);
      setXp(0);
      setStreak(0);
      setSaved([]);
      setApplied([]);
      setCompletedChallenges([]);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSwipe = (direction) => {
    const currentJob = filteredJobs[currentIndex];
    if (currentJob && direction === "right") {
      setSaved(prev => [currentJob, ...prev]);
      setXp(prev => prev + 20);
      setStreak(prev => prev + 1);
    } else if (direction === "left") {
      setXp(prev => prev + 5);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleApply = (jobId) => {
    if (!applied.includes(jobId)) {
      setApplied(prev => [...prev, jobId]);
      setXp(prev => prev + 30);
    }
  };

  const handleRemoveJob = (jobId) => {
    setSaved(prev => prev.filter(job => job.id !== jobId));
  };

  const handleCompleteChallenge = (challengeIndex, xpAmount) => {
    if (!completedChallenges.includes(challengeIndex)) {
      setCompletedChallenges(prev => [...prev, challengeIndex]);
      setXp(prev => prev + xpAmount);
    }
  };

  const handleDailyReward = (rewardXP) => {
    setXp(prev => prev + rewardXP);
  };

  const handleShare = (message) => {
    setShareMessage(message);
    setTimeout(() => setShareMessage(""), 3000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user && !showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!user && showAuth) {
    return <Auth onBack={() => setShowAuth(false)} />;
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
              <div className="text-xs text-slate-400">
                Hi, {user?.displayName || user?.email?.split('@')[0] || 'Demo User'}!
                {user?.isAnonymous && <span className="ml-1 text-yellow-400">(Demo)</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
            <button
              onClick={handleSignOut}
              className="ml-2 px-3 py-2 text-slate-400 hover:text-white text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Share Message Toast */}
      {shareMessage && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {shareMessage}
        </div>
      )}

      <main className="p-4 md:p-8">
        {page === "swipe" && (
          <div className="max-w-md mx-auto">
            <DailyRewards onClaimReward={handleDailyReward} />
            
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

            <QuickStats xp={xp} saved={saved} applied={applied} streak={streak} />

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

            <JobFilters onFilter={handleFilter} jobCount={filteredJobs.length} />
            
            <h1 className="text-xl font-bold text-center mb-6">
              {search ? `Search: "${search}"` : "Discover Jobs"}
              {jobsLoading && <span className="text-sm text-slate-400 block">Loading...</span>}
            </h1>
            
            {jobsLoading ? (
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

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200">
                    <span className="text-sm font-semibold text-green-700">{filteredJobs[currentIndex].salary}</span>
                  </div>
                  <ShareJob job={filteredJobs[currentIndex]} onShare={handleShare} />
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
                    onClick={() => handleSwipe("left")}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={() => handleSwipe("right")}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
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
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                            <p className="text-green-400 font-semibold text-sm">{job.salary}</p>
                          </div>
                          <ShareJob job={job} onShare={handleShare} />
                        </div>
                        <p className="text-slate-300 text-sm mt-2">{job.desc}</p>
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => {
                              if (job.apply_url && job.apply_url !== "#") {
                                window.open(job.apply_url, '_blank');
                              }
                              handleApply(job.id);
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
                            onClick={() => handleRemoveJob(job.id)}
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
              ].map((challenge, i) => {
                const isCompleted = completedChallenges.includes(i);
                return (
                  <div key={i} className={`rounded-lg p-6 border transition-all ${
                    isCompleted 
                      ? 'bg-green-800/20 border-green-500/50' 
                      : 'bg-slate-800/30 border-slate-700/50'
                  }`}>
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
                          onClick={() => handleCompleteChallenge(i, challenge.xp)}
                          disabled={isCompleted}
                          className={`w-full mt-3 py-2 rounded-lg font-medium transition-colors ${
                            isCompleted
                              ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          }`}
                        >
                          {isCompleted ? '✓ Completed' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {page === "profile" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                "👤"
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {user?.displayName || user?.email?.split('@')[0] || 'Demo User'}
            </h1>
            <p className="text-slate-400 mb-8">
              Level {level} • {xp} XP
              {user?.isAnonymous && <span className="block text-yellow-400 text-sm">Demo Account</span>}
            </p>
            
            <QuickStats xp={xp} saved={saved} applied={applied} streak={streak} />
            
            <div className="text-left">
              <h2 className="text-lg font-bold mb-4">Achievements</h2>
              <div className="space-y-3">
                {[
                  { icon: "🎯", name: "First Save", desc: "Saved your first job", unlocked: saved.length >= 1 },
                  { icon: "🔥", name: "On Fire", desc: "3-day streak", unlocked: streak >= 3 },
                  { icon: "⭐", name: "Level Up", desc: "Reach level 1", unlocked: level >= 1 },
                  { icon: "📄", name: "Job Hunter", desc: "Applied to first job", unlocked: applied.length >= 1 },
                  { icon: "🏆", name: "Task Master", desc: "Complete 3 challenges", unlocked: completedChallenges.length >= 3 }
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