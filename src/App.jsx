import React, { useState } from "react";
import { useXPStore } from "./store/xpStore";
import { jobs } from "./data/jobs";
import SwipeDeck from "./components/SwipeDeck";
import Login from "./components/Login";
import ChatBot from "./components/ChatBot";
import SmartRecommendations from "./components/SmartRecommendations";
import Analytics from "./components/Analytics";
import NotificationSystem from "./components/NotificationSystem";
import ARJobPreview from "./components/ARJobPreview";
import VoiceControl from "./components/VoiceControl";
import JobRadar from "./components/JobRadar";
import MoodMatcher from "./components/MoodMatcher";
import JobLottery from "./components/JobLottery";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("swipe");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [moodJobs, setMoodJobs] = useState([]);
  const { xp, streak, saved, addXP, saveJob, incrementStreak } = useXPStore();
  
  const currentJob = jobs[currentJobIndex];
  const level = Math.floor(xp / 100);

  if (!user) {
    return <Login onLogin={setUser} />;
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
      {/* Enhanced Navbar */}
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
              {["swipe", "saved", "challenges", "profile"].map((p) => (
                <button 
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    page === p ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {p === "swipe" ? "🏠" : p === "saved" ? "💾" : p === "challenges" ? "🏆" : "👤"}
                  <span className="hidden sm:inline ml-1">
                    {p === "swipe" ? "Home" : p === "saved" ? "Saved" : p === "challenges" ? "Tasks" : "Profile"}
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

      {/* Enhanced Content */}
      <main className="p-4 md:p-8">
        {page === "swipe" && (
          <div className="max-w-md mx-auto">
            {/* XP Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-1">
                  🏆 Level {level}
                </span>
                <span className="font-bold text-purple-400">{xp} XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full transition-all duration-700 relative"
                  style={{ width: `${(xp % 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
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
            
            <div className="mb-20">
              <SwipeDeck jobs={moodJobs.length > 0 ? moodJobs : jobs.slice(currentJobIndex)} />
            </div>
            
            <SmartRecommendations />
            
            {currentJobIndex >= jobs.length && (
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
                  <div key={job.id} className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all">
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
                            onClick={() => {
                              const { removeSaved } = useXPStore.getState();
                              removeSaved(job.id);
                            }}
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
        
        {page === "challenges" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Career Challenges</h1>
            <p className="text-slate-400 mb-6">Complete tasks to boost your job search skills</p>
            
            <div className="space-y-4">
              {[
                { icon: "📄", title: "Update your CV", desc: "Polish your CV with SA standards", xp: 25, time: "15 min" },
                { icon: "🎤", title: "Practice interviews", desc: "Record yourself answering questions", xp: 35, time: "30 min" },
                { icon: "🔍", title: "Research SA companies", desc: "Learn about 5 potential employers", xp: 40, time: "45 min" },
                { icon: "💼", title: "Build LinkedIn profile", desc: "Create professional online presence", xp: 30, time: "20 min" },
                { icon: "🎓", title: "Learn new skill", desc: "Complete online course or tutorial", xp: 50, time: "2 hours" }
              ].map((challenge, i) => (
                <div key={i} className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{challenge.icon}</div>
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
                        onClick={() => addXP(challenge.xp)}
                        className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
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
            
            <div className="text-left">
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              <div className="space-y-3">
                {[
                  { icon: "🎯", name: "First Save", desc: "Saved your first job", unlocked: saved.length >= 1 },
                  { icon: "🔥", name: "On Fire", desc: "3-day streak", unlocked: streak >= 3 },
                  { icon: "⭐", name: "Level Up", desc: "Reach level 1", unlocked: level >= 1 },
                  { icon: "🗺️", name: "Explorer", desc: "Save 5 jobs", unlocked: saved.length >= 5 }
                ].map((achievement, i) => (
                  <div key={i} className={`p-3 rounded-xl border transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50' 
                      : 'bg-slate-800/30 border-slate-700 opacity-60'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-sm">{achievement.name}</h3>
                        <p className="text-xs text-slate-400">{achievement.desc}</p>
                      </div>
                      {achievement.unlocked && <div className="text-green-400">✓</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <JobLottery />
            </div>
            
            <div className="mt-8">
              <Analytics />
            </div>
          </div>
        )}
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-40"
      >
        🤖
      </button>

      {/* ChatBot */}
      <ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} />
      
      {/* Voice Control */}
      <VoiceControl onCommand={(cmd) => {
        if (cmd === 'save') {
          // Trigger save on current job
        } else if (cmd === 'chat') {
          setShowChatBot(true);
        } else if (cmd === 'profile') {
          setPage('profile');
        } else if (cmd === 'saved') {
          setPage('saved');
        }
      }} />
      
      {/* Job Radar */}
      <JobRadar />
      
      {/* Mood Matcher */}
      <MoodMatcher onMoodJobs={setMoodJobs} />
      
      {/* AR Preview */}
      {showAR && (
        <ARJobPreview 
          job={jobs[currentJobIndex] || jobs[0]} 
          onClose={() => setShowAR(false)} 
        />
      )}
      
      {/* AR Button */}
      <button
        onClick={() => setShowAR(true)}
        className="fixed bottom-6 left-20 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-40"
        title="AR Job Preview"
      >
        📱
      </button>
      
      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
}
