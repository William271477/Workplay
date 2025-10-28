import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { fetchJobs } from "./services/jobApi";
import { useFirestore } from "./hooks/useFirestore";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [page, setPage] = useState("swipe");
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Firestore integration
  const { userData, loading: firestoreLoading, saveJob, removeJob, applyToJobAction, addXP, swipeJob } = useFirestore(user);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load jobs when user is authenticated
  useEffect(() => {
    if (user && !firestoreLoading) {
      loadJobs();
    }
  }, [user, firestoreLoading]);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setPage("swipe");
      setCurrentIndex(0);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSwipe = async (direction) => {
    const currentJob = jobs[currentIndex];
    if (currentJob) {
      await swipeJob(currentJob, direction);
    }
    setCurrentIndex(prev => prev + 1);
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

  if (firestoreLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Setting up your profile...</div>
      </div>
    );
  }

  // Use Firestore data with fallbacks
  const xp = userData?.xp || 0;
  const level = userData?.level || 0;
  const streak = userData?.streak || 0;
  const saved = userData?.savedJobs || [];
  const applied = userData?.appliedJobs || [];

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
                Hi, {userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Demo User'}!
                {user?.isAnonymous && <span className="ml-1 text-yellow-400">(Demo)</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
              {jobsLoading && <span className="text-sm text-slate-400 block">Loading...</span>}
            </h1>
            
            {jobsLoading ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-slate-400">Loading fresh jobs...</p>
              </div>
            ) : currentIndex < jobs.length ? (
              <div className="bg-white rounded-2xl p-6 shadow-xl text-black max-w-sm mx-auto relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-12 translate-x-12" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">
                    {jobs[currentIndex].logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{jobs[currentIndex].title}</h3>
                    <div className="text-sm text-gray-600 mt-1">{jobs[currentIndex].company}</div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">📍 {jobs[currentIndex].location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200">
                  <span className="text-sm font-semibold text-green-700">{jobs[currentIndex].salary}</span>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed text-sm">{jobs[currentIndex].desc}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {jobs[currentIndex].tags?.map((tag) => (
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
                              applyToJobAction(job.id);
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
                            onClick={() => removeJob(job.id)}
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
                        onClick={() => addXP(challenge.xp, 'challenge_completed')}
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
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                "👤"
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Demo User'}
            </h1>
            <p className="text-slate-400 mb-8">
              Level {level} • {xp} XP
              {user?.isAnonymous && <span className="block text-yellow-400 text-sm">Demo Account</span>}
            </p>
            
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