import React, { useState } from "react";
import { useXPStore } from "../store/xpStore";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const challenges = [
  { 
    id: "c1", 
    title: "Update your CV", 
    desc: "Polish your CV with South African standards",
    xp: 25, 
    badge: "CV Master", 
    icon: "📄",
    difficulty: "Easy",
    time: "15 min"
  },
  { 
    id: "c2", 
    title: "Practice interview skills", 
    desc: "Record yourself answering common questions",
    xp: 35, 
    badge: "Interview Pro", 
    icon: "🎤",
    difficulty: "Medium",
    time: "30 min"
  },
  { 
    id: "c3", 
    title: "Research 5 SA companies", 
    desc: "Learn about potential employers in your field",
    xp: 40, 
    badge: "Market Researcher", 
    icon: "🔍",
    difficulty: "Medium",
    time: "45 min"
  },
  { 
    id: "c4", 
    title: "Build your LinkedIn", 
    desc: "Create or update your professional profile",
    xp: 30, 
    badge: "Networker", 
    icon: "💼",
    difficulty: "Easy",
    time: "20 min"
  },
  { 
    id: "c5", 
    title: "Learn a new skill", 
    desc: "Complete an online course or tutorial",
    xp: 50, 
    badge: "Skill Builder", 
    icon: "🎓",
    difficulty: "Hard",
    time: "2 hours"
  },
  { 
    id: "c6", 
    title: "Apply to 3 jobs", 
    desc: "Submit applications to real job postings",
    xp: 60, 
    badge: "Go-Getter", 
    icon: "🚀",
    difficulty: "Hard",
    time: "1 hour"
  }
];

export default function Challenges() {
  const { addXP, addBadge, badges } = useXPStore((s) => ({
    addXP: s.addXP,
    addBadge: s.addBadge,
    badges: s.badges
  }));
  const [completedChallenges, setCompletedChallenges] = useState(new Set());

  function complete(challenge) {
    if (completedChallenges.has(challenge.id)) return;
    
    addXP(challenge.xp);
    addBadge(challenge.badge);
    setCompletedChallenges(prev => new Set([...prev, challenge.id]));
    
    // Celebration effect
    confetti({ 
      particleCount: 80, 
      spread: 60, 
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#EC4899', '#F59E0B']
    });
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Hard': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

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
            Career Challenges
          </h1>
          <p className="text-slate-400">
            Complete tasks to boost your job search skills and earn XP
          </p>
        </motion.div>

        {/* Progress Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-xl font-bold text-yellow-400">{completedChallenges.size}</div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-xl font-bold text-blue-400">{challenges.length - completedChallenges.size}</div>
            <div className="text-sm text-slate-400">Remaining</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center col-span-2 md:col-span-1">
            <div className="text-2xl mb-2">🏅</div>
            <div className="text-xl font-bold text-purple-400">{badges.length}</div>
            <div className="text-sm text-slate-400">Badges Earned</div>
          </div>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {challenges.map((challenge, index) => {
            const isCompleted = completedChallenges.has(challenge.id);
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{challenge.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{challenge.title}</h3>
                        <p className="text-slate-400 text-sm">{challenge.desc}</p>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-purple-400">+{challenge.xp} XP</div>
                      </div>
                    </div>
                    
                    {/* Challenge Meta */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        ⏱️ {challenge.time}
                      </span>
                    </div>
                    
                    {/* Action Button */}
                    <button
                      onClick={() => complete(challenge)}
                      disabled={isCompleted}
                      className={`w-full py-3 rounded-xl font-medium transition-all ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="flex items-center justify-center gap-2">
                          ✅ Completed • Badge: {challenge.badge}
                        </span>
                      ) : (
                        'Mark as Complete'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
